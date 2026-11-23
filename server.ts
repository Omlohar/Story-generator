import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getAiClient(apiVersion?: string): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    ...(apiVersion ? { apiVersion } : {}),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseModelJson<T = Record<string, unknown>>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned) as T;
}

function ensureWavBase64(base64Audio: string): string {
  const buf = Buffer.from(base64Audio, 'base64');
  if (buf.length >= 4 && buf.subarray(0, 4).toString('ascii') === 'RIFF') {
    return base64Audio;
  }
  // Wrap raw 24kHz 16-bit mono PCM in a 44-byte RIFF/WAV header
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = buf.length;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, buf]).toString('base64');
}

function normalizeOverlayPosition(val: unknown): 'top' | 'center' | 'bottom-third' {
  const s = String(val ?? '').toLowerCase();
  if (s.includes('top')) return 'top';
  if (s.includes('center') || s.includes('mid')) return 'center';
  return 'bottom-third';
}

function extractErrorDetails(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err ?? 'Unknown error');
  let status = 500;
  let message = raw;

  try {
    const parsed = JSON.parse(raw);
    const inner = parsed?.error ?? parsed;
    if (typeof inner?.code === 'number') status = inner.code;
    if (typeof inner?.message === 'string') message = inner.message;
  } catch {
    if (/\b503\b|UNAVAILABLE/i.test(raw)) status = 503;
    else if (/\b429\b|RESOURCE_EXHAUSTED/i.test(raw)) status = 429;
    else if (/\b403\b|PERMISSION_DENIED/i.test(raw)) status = 403;
    else if (/\b400\b|API_KEY_INVALID/i.test(raw)) status = 400;
    else if (/timed?\s*out|timeout/i.test(raw)) status = 504;
  }

  return { status, message };
}

function isTransientError(err: unknown): boolean {
  const { status, message } = extractErrorDetails(err);
  return (
    status === 503 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 504 ||
    /high demand|unavailable|overloaded|timed?\s*out|timeout|econnreset|fetch failed/i.test(
      message
    )
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function generateTextWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: unknown;
    config: Record<string, unknown>;
  }
) {
  const attempts = [
    { name: 'gemini-4-hydrogen', timeoutMs: 18000, waitMs: 400 },
    { name: 'gemini-3.1-flash-lite', timeoutMs: 35000, waitMs: 700 },
    { name: 'gemini-3.1-flash-lite', timeoutMs: 40000, waitMs: 1200 },
    { name: 'gemini-4-hydrogen', timeoutMs: 25000, waitMs: 0 },
  ];
  let lastError: unknown;

  for (const { name: model, timeoutMs, waitMs } of attempts) {
    const modelConfig =
      model === 'gemini-4-hydrogen'
        ? {
            ...params.config,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          }
        : params.config;

    try {
      return await withTimeout(
        ai.models.generateContent({
          model,
          contents: params.contents as never,
          config: modelConfig as never,
        }),
        timeoutMs,
        model
      );
    } catch (err) {
      lastError = err;
      if (!isTransientError(err)) {
        throw err;
      }
      if (waitMs > 0) {
        await sleep(waitMs);
      }
    }
  }

  throw lastError;
}

async function generateTtsWithRetry(
  params: {
    model: string;
    contents: unknown;
    config: Record<string, unknown>;
  }
) {
  const versions: Array<string | undefined> = ['v1beta', 'v1alpha', undefined];
  let lastError: unknown;

  for (const apiVersion of versions) {
    const ai = getAiClient(apiVersion);
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await withTimeout(
          ai.models.generateContent({
            model: params.model,
            contents: params.contents as never,
            config: params.config as never,
          }),
          25000,
          params.model
        );
      } catch (err) {
        lastError = err;
        const { message } = extractErrorDetails(err);
        if (/Unknown name|Cannot find field/i.test(message)) {
          break; // try next apiVersion immediately
        }
        if (!isTransientError(err)) throw err;
        await sleep(600 * (attempt + 1));
      }
    }
  }
  throw lastError;
}

const scriptSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Catchy, clickable video title in the requested script language.',
    },
    hookSummary: {
      type: Type.STRING,
      description: '1-2 sentence explanation of how the first 3-5 seconds hook the viewer.',
    },
    aspectRatioLabel: {
      type: Type.STRING,
      description: 'e.g. "9:16 Vertical (YouTube Short)" or "16:9 Widescreen (YouTube Long)"',
    },
    resolutionSpec: {
      type: Type.STRING,
      description: 'e.g. "1080 × 1920 px · Safe Zone Center 70%" or "1920 × 1080 px · Lower-Third Safe"',
    },
    estimatedDurationSec: {
      type: Type.INTEGER,
      description: 'Total estimated duration in seconds.',
    },
    voiceAllocationSummary: {
      type: Type.STRING,
      description:
        'Clear director explanation of exactly where Male voice (आदमी की आवाज़) and Female voice (औरत की आवाज़) are placed across the video and why.',
    },
    maleVoiceRole: {
      type: Type.STRING,
      description: 'Role and vocal style assigned to the Male voice.',
    },
    femaleVoiceRole: {
      type: Type.STRING,
      description: 'Role and vocal style assigned to the Female voice.',
    },
    thumbnailConcept: {
      type: Type.STRING,
      description: 'Detailed YouTube thumbnail or Short cover frame design idea.',
    },
    bgmStyle: {
      type: Type.STRING,
      description: 'Background music genre, tempo, and mood shifts.',
    },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sceneNumber: { type: Type.INTEGER },
          sectionLabel: {
            type: Type.STRING,
            description: 'Beat name like "0-4s Hook", "Problem Setup", "Core Explainer", "CTA".',
          },
          timestampStart: { type: Type.STRING, description: 'MM:SS format e.g. 00:00' },
          timestampEnd: { type: Type.STRING, description: 'MM:SS format e.g. 00:08' },
          durationSeconds: { type: Type.INTEGER },
          cameraFraming: {
            type: Type.STRING,
            description: 'Exact framing for 9:16 or 16:9 screen size, e.g. Close-Up Center Safe-Zone or Wide Rule-of-Thirds.',
          },
          shotType: {
            type: Type.STRING,
            description: 'One of: Close-Up, Medium Shot, Wide, Split-Screen, B-Roll / Graphic, POV',
          },
          visualDirection: {
            type: Type.STRING,
            description: 'Complete visual description: setting, lighting, subject action, camera movement.',
          },
          bRollCue: {
            type: Type.STRING,
            description: 'Specific B-roll footage, motion graphic, or chart overlay instruction.',
          },
          screenOverlayText: {
            type: Type.STRING,
            description: 'Exact text/title/caption to display on screen.',
          },
          overlayPosition: {
            type: Type.STRING,
            description: 'One of: top, center, bottom-third',
          },
          sfxAndMusicCue: {
            type: Type.STRING,
            description: 'Sound effects (whoosh, pop, chime) and music dynamics for this scene.',
          },
          lines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                speakerGender: {
                  type: Type.STRING,
                  description: 'Must be strictly "male" or "female".',
                },
                speakerName: {
                  type: Type.STRING,
                  description: 'Character/Narrator label e.g. "आरव (आदमी)" or "मीरा (औरत)".',
                },
                voiceCue: {
                  type: Type.STRING,
                  description: 'Specific reason and placement instruction for why Male or Female voice speaks this line.',
                },
                deliveryTone: {
                  type: Type.STRING,
                  description: 'Vocal pace, energy, and emotion.',
                },
                dialogue: {
                  type: Type.STRING,
                  description: 'Exact spoken words for this line.',
                },
              },
              required: ['speakerGender', 'speakerName', 'voiceCue', 'deliveryTone', 'dialogue'],
            },
          },
        },
        required: [
          'sceneNumber',
          'sectionLabel',
          'timestampStart',
          'timestampEnd',
          'durationSeconds',
          'cameraFraming',
          'shotType',
          'visualDirection',
          'bRollCue',
          'screenOverlayText',
          'overlayPosition',
          'sfxAndMusicCue',
          'lines',
        ],
      },
    },
  },
  required: [
    'title',
    'hookSummary',
    'aspectRatioLabel',
    'resolutionSpec',
    'estimatedDurationSec',
    'voiceAllocationSummary',
    'maleVoiceRole',
    'femaleVoiceRole',
    'thumbnailConcept',
    'bgmStyle',
    'scenes',
  ],
};

const singleSceneSchema = scriptSchema.properties.scenes.items;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.post('/api/scripts/generate', async (req, res) => {
    try {
      const {
        topic = '',
        customInstructions = '',
        screenFormat = 'short_9_16',
        durationTarget = '45s',
        conversationMode = 'two_person',
        voicePlan = 'dual_male_female',
        scriptLanguage = 'hindi',
        tone = 'engaging',
        maleName = 'आरव',
        femaleName = 'मीरा',
        referencePhotos = [],
        openingIntroEnabled = true,
        openingIntroText = "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!",
        closingOutroEnabled = true,
        closingOutroText = "अगर हमारी वीडियो पसंद आई हो तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करना न भूलें!",
      } = req.body ?? {};

      const validPhotos = Array.isArray(referencePhotos)
        ? referencePhotos
            .filter(
              (p: unknown): p is { mimeType: string; dataBase64: string; name?: string } =>
                Boolean(
                  p &&
                    typeof p === 'object' &&
                    typeof (p as { dataBase64?: unknown }).dataBase64 === 'string' &&
                    typeof (p as { mimeType?: unknown }).mimeType === 'string' &&
                    ['image/jpeg', 'image/png', 'image/webp'].includes(
                      (p as { mimeType: string }).mimeType
                    )
                )
            )
            .slice(0, 4)
        : [];

      const trimmedTopic = typeof topic === 'string' ? topic.trim() : '';
      const trimmedInstructions =
        typeof customInstructions === 'string' ? customInstructions.trim() : '';

      if (!trimmedTopic && !trimmedInstructions && validPhotos.length === 0) {
        res.status(400).json({
          error:
            'Please enter a video topic, custom instruction, or upload at least one photo.',
        });
        return;
      }

      const ai = getAiClient();

      const formatDescription =
        screenFormat === 'short_9_16'
          ? '9:16 Vertical Video (1080x1920, YouTube Shorts / Reels / Vertical Long-Form). Vertical center-safe framing, bold legible text overlays in top/center safe-zones, engaging visual pacing tailored to the requested duration.'
          : '16:9 Widescreen Landscape Video (1920x1080, YouTube Long-Form). Structured chapters, wide establishing shots + medium A-roll + B-roll cutaways, lower-third text overlays, clear visual storytelling.';

      const modeDescription =
        conversationMode === 'two_person'
          ? 'Two-Person Conversation (दो जनों की बातचीत): Natural back-and-forth dialogue between two hosts/characters with reaction shots, interruptions, counter-questions, and split-screen or two-shot camera cues.'
          : conversationMode === 'solo'
            ? 'Solo Monologue / Talking Head (अकेले की बातचीत): One host speaking directly to the camera with punch-in zoom cuts, props, and dynamic B-roll cutaways.'
            : conversationMode === 'song_video'
              ? 'Song / Music Video (सॉन्ग / म्यूज़िक वीडियो): Write lyrical verses/chorus (मुखड़ा, अंतरा, कोरस) synced to musical beats, slow-motion / gimbal camera choreography, lip-sync & emotional visual storytelling, and clear Male/Female singing or vocal placement.'
              : 'Visual Explainer / Documentary (एक्सप्लेनर): Structured storytelling and conceptual breakdown using voiceover narration, diagrams, 2D motion graphics, and visual metaphors.';

      const voiceDescription =
        voicePlan === 'dual_male_female'
          ? `Dual Voice Direction (आदमी और औरत दोनों की आवाज़): Explicitly assign BOTH Male ("${maleName}") and Female ("${femaleName}") voices across scenes/lines. Clearly explain in "voiceAllocationSummary" and every line's "voiceCue" WHERE the Male voice enters (e.g. hook, skeptic questions, storytelling) and WHERE the Female voice enters (e.g. expert explanation, key facts, solution, or vice-versa). Use both "male" and "female" in speakerGender.`
          : voicePlan === 'male_only'
            ? `Male Voice Only (सिर्फ आदमी की आवाज़): Every single line must have speakerGender="male" using "${maleName}". Explain vocal tone shifts across scenes.`
            : `Female Voice Only (सिर्फ औरत की आवाज़): Every single line must have speakerGender="female" using "${femaleName}". Explain vocal tone shifts across scenes.`;

      const languageInstruction =
        scriptLanguage === 'hindi'
          ? 'Write all spoken dialogue, titles, visual directions, overlay text, and voice cues in natural, crisp Hindi (Devanagari script, modern spoken YouTube Hindi).'
          : scriptLanguage === 'hinglish'
            ? 'Write spoken dialogue in natural everyday Hinglish (mix of Hindi in Devanagari/Roman or crisp conversational Hindi-English as Indian YouTubers speak) and keep directions clear and easy to follow.'
            : 'Write all spoken dialogue, titles, visual directions, overlay text, and voice cues in clear, punchy English.';

      const durationMinutesMatch = String(durationTarget).match(/^(\d+)m$/);
      const durationMinutes = durationMinutesMatch ? Number(durationMinutesMatch[1]) : 0;

      const sceneCountGuide =
        durationMinutes >= 10
          ? '10 to 14 rich chapter scenes with substantial, multi-line spoken dialogue/lyrics per scene so the full script genuinely fills 10 to 15 minutes (~150 words/min)'
          : durationMinutes >= 5
            ? '7 to 10 structured chapter scenes with detailed spoken dialogue/lyrics per scene'
            : durationMinutes >= 2
              ? '5 to 7 structured scenes with full dialogue'
              : '3 to 5 tight, high-retention scenes';

      const trimmedOpeningIntro =
        openingIntroEnabled && typeof openingIntroText === 'string'
          ? openingIntroText.trim()
          : '';
      const trimmedClosingOutro =
        closingOutroEnabled && typeof closingOutroText === 'string'
          ? closingOutroText.trim()
          : '';

      const systemInstruction = `You are a master YouTube Creative Director, Screenwriter, and Audio-Visual Producer.
Your job is to produce a complete, shoot-ready production script that tells the creator EVERYTHING:
1. Exact screen framing & visual directions suited to the chosen YouTube screen size (${formatDescription}).
2. Exact conversation style (${modeDescription}).
3. Exact Male & Female voice placement (${voiceDescription}).
4. Exact timestamps, B-roll/motion graphics, on-screen text overlays, and SFX/music cues.
5. ${languageInstruction}
${
  trimmedOpeningIntro
    ? `6. MANDATORY OPENING LINE (आगे): At the very start of Scene 1 (00:00), BEFORE any other dialogue or hook, the very first spoken line MUST be: "${trimmedOpeningIntro}".`
    : ''
}
${
  trimmedClosingOutro
    ? `7. MANDATORY CLOSING LINE (पीछे): At the very end of the final scene, the very last spoken line MUST be: "${trimmedClosingOutro}".`
    : ''
}

${
  trimmedInstructions
    ? `8. USER'S CUSTOM CREATIVE INSTRUCTIONS (MUST FOLLOW STRICTLY): ${trimmedInstructions}`
    : ''
}

Generate ${sceneCountGuide} matching target duration "${durationTarget}" and tone "${tone}". Ensure timestamps flow continuously from 00:00 (or MM:SS up to 15:00) and sum cleanly to estimatedDurationSec.${
        validPhotos.length > 0
          ? ' Reference photos are attached: carefully inspect the people, expressions, clothing, setting, objects, colors, and mood in the photos and anchor every scene, visual direction, and dialogue/lyrics directly around these photos.'
          : ''
      }`;

      const imageParts = validPhotos.map((photo) => ({
        inlineData: {
          mimeType: photo.mimeType,
          data: photo.dataBase64,
        },
      }));

      const instructionSuffix = trimmedInstructions
        ? `\n\nCreator's Special Instructions (follow closely):\n"${trimmedInstructions}"`
        : '';

      const promptText = trimmedTopic
        ? `Create a complete production video script based on ${
            validPhotos.length > 0 ? 'the attached photo(s) and ' : ''
          }this topic:\n"${trimmedTopic}"${instructionSuffix}`
        : trimmedInstructions && validPhotos.length === 0
          ? `Create a complete production video script strictly following these creator instructions:\n"${trimmedInstructions}"`
          : `Analyze the attached photo(s) in full detail (subjects, mood, environment, story, product/clothing, lighting) and create a complete shoot-ready production video script directly inspired by these photo(s).${instructionSuffix}`;

      const contents =
        imageParts.length > 0
          ? { parts: [...imageParts, { text: promptText }] }
          : promptText;

      const response = await generateTextWithFallback(ai, {
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: scriptSchema,
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Model returned an empty response.' });
        return;
      }

      const parsed = parseModelJson<Record<string, unknown>>(rawText);
      const now = new Date().toISOString();
      const rawScenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];
      const hydrated = {
        ...parsed,
        id: `script-${Date.now()}`,
        createdAt: now,
        topic: trimmedTopic || `Photo-based Script (${validPhotos.length} photo${validPhotos.length > 1 ? 's' : ''})`,
        screenFormat,
        conversationMode,
        voicePlan,
        scriptLanguage,
        scenes: rawScenes.map((scene: Record<string, unknown>, sIdx: number) => {
          const mappedLines: Array<Record<string, unknown>> = Array.isArray(scene.lines)
            ? scene.lines.map((line: Record<string, unknown>, lIdx: number) => ({
                ...line,
                id: `ln-${Date.now()}-${sIdx}-${lIdx}`,
                speakerGender: line.speakerGender === 'female' ? 'female' : 'male',
              }))
            : [];

          if (sIdx === 0 && trimmedOpeningIntro) {
            const firstDialogue = String(mappedLines[0]?.dialogue ?? '')
              .toLowerCase()
              .replace(/\s+/g, ' ')
              .trim();
            const openingProbe = trimmedOpeningIntro
              .toLowerCase()
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 20);
            if (!openingProbe || !firstDialogue.includes(openingProbe)) {
              const introGender = voicePlan === 'female_only' ? 'female' : 'male';
              const introSpeakerName =
                introGender === 'female'
                  ? `${femaleName} (औरत)`
                  : `${maleName} (आदमी)`;
              mappedLines.unshift({
                id: `ln-${Date.now()}-intro`,
                speakerGender: introGender,
                speakerName: introSpeakerName,
                voiceCue:
                  'शुरुआती चैनल CTA (आगे) — स्क्रिप्ट चालू होते ही सबसे पहले बोलें।',
                deliveryTone: 'गर्मजोशी भरा और तेज़',
                dialogue: trimmedOpeningIntro,
              });
            }
          }

          if (sIdx === rawScenes.length - 1 && trimmedClosingOutro) {
            const lastDialogue = String(
              mappedLines[mappedLines.length - 1]?.dialogue ?? ''
            )
              .toLowerCase()
              .replace(/\s+/g, ' ')
              .trim();
            const closingProbe = trimmedClosingOutro
              .toLowerCase()
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 20);
            if (!closingProbe || !lastDialogue.includes(closingProbe)) {
              const outroGender =
                voicePlan === 'male_only'
                  ? 'male'
                  : 'female';
              const outroSpeakerName =
                outroGender === 'female'
                  ? `${femaleName} (औरत)`
                  : `${maleName} (आदमी)`;
              mappedLines.push({
                id: `ln-${Date.now()}-outro`,
                speakerGender: outroGender,
                speakerName: outroSpeakerName,
                voiceCue:
                  'आखिरी चैनल CTA (पीछे) — स्क्रिप्ट के अंत में बोलने के लिए।',
                deliveryTone: 'गर्मजोशी भरा और आमंत्रण वाला',
                dialogue: trimmedClosingOutro,
              });
            }
          }

          return {
            ...scene,
            id: `sc-${Date.now()}-${sIdx}`,
            sceneNumber: sIdx + 1,
            durationSeconds: Math.max(1, Number(scene.durationSeconds) || 5),
            overlayPosition: normalizeOverlayPosition(scene.overlayPosition),
            lines: mappedLines,
          };
        }),
      };

      res.json(hydrated);
    } catch (err) {
      console.error('Script generation error:', err);
      const { status, message } = extractErrorDetails(err);
      res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
    }
  });

  app.post('/api/scripts/refine-scene', async (req, res) => {
    try {
      const { scriptContext, scene, instruction } = req.body ?? {};
      if (!scene || !instruction || typeof instruction !== 'string') {
        res.status(400).json({ error: 'Scene and refinement instruction are required.' });
        return;
      }

      const ai = getAiClient();
      const response = await generateTextWithFallback(ai, {
        contents: `Video Context: ${JSON.stringify(scriptContext ?? {})}
Current Scene: ${JSON.stringify(scene)}
Director Refinement Request: "${instruction.trim()}"

Rewrite and improve this single scene while preserving its sceneNumber (${scene.sceneNumber}), realistic timestamps, full visual directions, and explicit Male/Female speakerGender tags.`,
        config: {
          systemInstruction:
            'You are a YouTube script doctor. Return an improved single scene matching the exact JSON schema and same language as the current scene.',
          responseMimeType: 'application/json',
          responseSchema: singleSceneSchema,
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Model returned empty scene response.' });
        return;
      }

      const parsed = parseModelJson<Record<string, unknown>>(rawText);
      const refined = {
        ...parsed,
        id: scene.id || `sc-${Date.now()}`,
        sceneNumber: scene.sceneNumber || Number(parsed.sceneNumber) || 1,
        durationSeconds: Math.max(1, Number(parsed.durationSeconds) || scene.durationSeconds || 5),
        overlayPosition: normalizeOverlayPosition(parsed.overlayPosition),
        lines: Array.isArray(parsed.lines)
          ? parsed.lines.map((line: Record<string, unknown>, idx: number) => ({
              ...line,
              id: `ln-${Date.now()}-${idx}`,
              speakerGender: line.speakerGender === 'female' ? 'female' : 'male',
            }))
          : [],
      };

      res.json(refined);
    } catch (err) {
      console.error('Scene refine error:', err);
      const { status, message } = extractErrorDetails(err);
      res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
    }
  });

  app.post('/api/scripts/refine-script', async (req, res) => {
    try {
      const {
        script,
        instruction,
        openingIntroEnabled = true,
        openingIntroText = '',
        closingOutroEnabled = true,
        closingOutroText = '',
      } = req.body ?? {};

      if (!script || !instruction || typeof instruction !== 'string' || !instruction.trim()) {
        res.status(400).json({ error: 'Current script and instruction are required.' });
        return;
      }

      const trimmedOpen =
        openingIntroEnabled && typeof openingIntroText === 'string'
          ? openingIntroText.trim()
          : '';
      const trimmedClose =
        closingOutroEnabled && typeof closingOutroText === 'string'
          ? closingOutroText.trim()
          : '';

      const ai = getAiClient();
      const response = await generateTextWithFallback(ai, {
        contents: `Current Production Script JSON:
${JSON.stringify(script)}

Creator's Modification Instruction (apply across the entire script while keeping structure, camera framing, visual directions, and voice allocation clear):
"${instruction.trim()}"
${trimmedOpen ? `\nKeep this mandatory opening CTA line first in Scene 1: "${trimmedOpen}"` : ''}
${trimmedClose ? `\nKeep this mandatory closing CTA line last in the final scene: "${trimmedClose}"` : ''}`,
        config: {
          systemInstruction:
            'You are a master YouTube Script Editor & Creative Director. Rewrite/update the full production script strictly following the creator modification instruction while preserving valid JSON schema, realistic continuous timestamps, full visual directions, and explicit Male/Female speakerGender assignments.',
          responseMimeType: 'application/json',
          responseSchema: scriptSchema,
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Model returned an empty response.' });
        return;
      }

      const parsed = parseModelJson<Record<string, unknown>>(rawText);
      const rawScenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];
      const updatedScript = {
        ...parsed,
        id: script.id || `script-${Date.now()}`,
        createdAt: script.createdAt || new Date().toISOString(),
        topic: script.topic || parsed.title || 'Custom Script',
        screenFormat: script.screenFormat || 'short_9_16',
        conversationMode: script.conversationMode || 'two_person',
        voicePlan: script.voicePlan || 'dual_male_female',
        scriptLanguage: script.scriptLanguage || 'hindi',
        scenes: rawScenes.map((sc: Record<string, unknown>, sIdx: number) => ({
          ...sc,
          id: `sc-${Date.now()}-${sIdx}`,
          sceneNumber: sIdx + 1,
          durationSeconds: Math.max(1, Number(sc.durationSeconds) || 5),
          overlayPosition: normalizeOverlayPosition(sc.overlayPosition),
          lines: Array.isArray(sc.lines)
            ? sc.lines.map((line: Record<string, unknown>, lIdx: number) => ({
                ...line,
                id: `ln-${Date.now()}-${sIdx}-${lIdx}`,
                speakerGender: line.speakerGender === 'female' ? 'female' : 'male',
              }))
            : [],
        })),
      };

      res.json(updatedScript);
    } catch (err) {
      console.error('Full script refine error:', err);
      const { status, message } = extractErrorDetails(err);
      res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
    }
  });

  app.post('/api/voice/preview', async (req, res) => {
    try {
      const { lines } = req.body ?? {};
      if (!Array.isArray(lines) || lines.length === 0) {
        res.status(400).json({ error: 'At least one dialogue line is required for voice preview.' });
        return;
      }

      const cleanLines = lines
        .map((l) => ({
          speakerGender: l?.speakerGender === 'female' ? 'female' : 'male',
          dialogue: String(l?.dialogue ?? '').trim(),
          deliveryTone: String(l?.deliveryTone ?? '').trim(),
        }))
        .filter((l) => l.dialogue.length > 0);

      if (cleanLines.length === 0) {
        res.status(400).json({ error: 'Dialogue text is empty.' });
        return;
      }

      const hasMale = cleanLines.some((l) => l.speakerGender === 'male');
      const hasFemale = cleanLines.some((l) => l.speakerGender === 'female');

      let rawAudioBase64: string | undefined;

      if (hasMale && hasFemale) {
        try {
          const parts = cleanLines.slice(0, 6).map((l) => {
            const speakerTag = l.speakerGender === 'male' ? 'MaleHost' : 'FemaleHost';
            return {
              text: `${speakerTag}: ${l.dialogue}`,
              speechMetadata: {
                speaker: speakerTag,
                style: l.deliveryTone || 'Clear, expressive video presenter',
              },
            };
          });

          const ttsResponse = await generateTtsWithRetry({
            model: 'gemini-3.8-flash-tts',
            contents: [{ role: 'user', parts }],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                multiSpeakerVoiceConfig: {
                  speakerVoiceConfigs: [
                    {
                      speaker: 'MaleHost',
                      voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Charon' },
                      },
                    },
                    {
                      speaker: 'FemaleHost',
                      voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                      },
                    },
                  ],
                },
              },
            },
          });

          rawAudioBase64 =
            ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        } catch (multiErr) {
          console.warn('Multi-speaker TTS failed, falling back to single-speaker:', multiErr);
        }
      }

      if (!rawAudioBase64) {
        const isFemale = hasFemale && !hasMale;
        const combinedText = cleanLines
          .slice(0, 4)
          .map((l) => l.dialogue)
          .join(' ');
        const styleHint = cleanLines[0]?.deliveryTone || 'Clear, engaging video presenter';

        try {
          const ttsResponse = await generateTtsWithRetry({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: combinedText,
                    speechMetadata: {
                      style: styleHint,
                    },
                  },
                ],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: isFemale ? 'Kore' : 'Charon',
                  },
                },
              },
            },
          });

          rawAudioBase64 =
            ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        } catch (metaErr) {
          const { message } = extractErrorDetails(metaErr);
          if (/Unknown name|Cannot find field/i.test(message)) {
            const ttsResponse = await generateTtsWithRetry({
              model: 'gemini-3.8-flash-lite-tts',
              contents: [{ role: 'user', parts: [{ text: combinedText }] }],
              config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: isFemale ? 'Kore' : 'Charon',
                    },
                  },
                },
              },
            });
            rawAudioBase64 =
              ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          } else {
            throw metaErr;
          }
        }
      }

      if (!rawAudioBase64) {
        res.status(502).json({ error: 'No audio returned by voice synthesizer.' });
        return;
      }

      res.json({ audioBase64: ensureWavBase64(rawAudioBase64), mimeType: 'audio/wav' });
    } catch (err) {
      console.error('Voice preview error:', err);
      const { status, message } = extractErrorDetails(err);
      res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distPath, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Patkatha Studio server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
