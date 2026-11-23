import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Moon, Sun, X } from 'lucide-react';
import { ActiveTab, Header } from './components/Header';
import { BrandLogo } from './components/BrandLogo';
import { DirectorConfigPanel } from './components/DirectorConfigPanel';
import { StarterShowcase } from './components/StarterShowcase';
import {
  CtaUpdatePayload,
  FullPlaybackState,
  ScriptWorkspace,
} from './components/ScriptWorkspace';
import { StoryboardView } from './components/StoryboardView';
import { TeleprompterView } from './components/TeleprompterView';
import { SavedScriptsView } from './components/SavedScriptsView';
import { UI_COPY } from './data/i18n';
import { SAMPLE_SCRIPTS } from './data/sampleScripts';
import {
  DialogueLine,
  GenerateScriptInput,
  ProductionScript,
  ScriptScene,
  UiLanguage,
} from './types/script';

const STORAGE_KEY = 'patkatha_saved_scripts_v1';
const THEME_STORAGE_KEY = 'patkatha_theme_v1';
const CTA_STORAGE_KEY = 'patkatha_cta_prefs_v1';
type ThemeMode = 'light' | 'dark';

const DEFAULT_OPENING_CTA =
  "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!";
const DEFAULT_CLOSING_CTA =
  "अगर हमारी वीडियो पसंद आई हो तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करना न भूलें!";

const DEFAULT_FORM: GenerateScriptInput = {
  topic: '',
  customInstructions: '',
  screenFormat: 'short_9_16',
  durationTarget: '45s',
  conversationMode: 'two_person',
  voicePlan: 'dual_male_female',
  scriptLanguage: 'hindi',
  tone: 'engaging',
  maleName: 'आरव',
  femaleName: 'मीरा',
  referencePhotos: [],
  openingIntroEnabled: true,
  openingIntroText: DEFAULT_OPENING_CTA,
  closingOutroEnabled: true,
  closingOutroText: DEFAULT_CLOSING_CTA,
};

function loadInitialForm(): GenerateScriptInput {
  try {
    const raw = localStorage.getItem(CTA_STORAGE_KEY);
    if (!raw) return DEFAULT_FORM;
    const parsed = JSON.parse(raw) as Partial<CtaUpdatePayload>;
    return {
      ...DEFAULT_FORM,
      openingIntroEnabled:
        typeof parsed.openingEnabled === 'boolean'
          ? parsed.openingEnabled
          : DEFAULT_FORM.openingIntroEnabled,
      openingIntroText:
        typeof parsed.openingText === 'string'
          ? parsed.openingText
          : DEFAULT_FORM.openingIntroText,
      closingOutroEnabled:
        typeof parsed.closingEnabled === 'boolean'
          ? parsed.closingEnabled
          : DEFAULT_FORM.closingOutroEnabled,
      closingOutroText:
        typeof parsed.closingText === 'string'
          ? parsed.closingText
          : DEFAULT_FORM.closingOutroText,
    };
  } catch {
    return DEFAULT_FORM;
  }
}

function formatScriptAsText(script: ProductionScript): string {
  const lines: string[] = [
    `TITLE: ${script.title}`,
    `FORMAT: ${script.aspectRatioLabel} (${script.resolutionSpec})`,
    `DURATION: ${script.estimatedDurationSec}s`,
    `HOOK: ${script.hookSummary}`,
    ``,
    `VOICE PLACEMENT MAP:`,
    script.voiceAllocationSummary,
    `- Male Voice: ${script.maleVoiceRole}`,
    `- Female Voice: ${script.femaleVoiceRole}`,
    ``,
    `THUMBNAIL: ${script.thumbnailConcept}`,
    `BGM: ${script.bgmStyle}`,
    ``,
    `========================================`,
  ];

  for (const scene of script.scenes) {
    lines.push(
      `SCENE ${scene.sceneNumber} [${scene.timestampStart} - ${scene.timestampEnd}] (${scene.sectionLabel})`
    );
    lines.push(`Camera/Framing: ${scene.shotType} — ${scene.cameraFraming}`);
    lines.push(`Visual Direction: ${scene.visualDirection}`);
    lines.push(`B-Roll / Graphics: ${scene.bRollCue}`);
    lines.push(`On-Screen Text (${scene.overlayPosition}): ${scene.screenOverlayText}`);
    lines.push(`SFX / Music: ${scene.sfxAndMusicCue}`);
    lines.push(`Dialogue & Voice Cues:`);
    for (const l of scene.lines) {
      const genderTag = l.speakerGender === 'male' ? 'MALE' : 'FEMALE';
      lines.push(
        `  [${genderTag} | ${l.speakerName} | ${l.deliveryTone}]`
      );
      lines.push(`  Voice Cue: ${l.voiceCue}`);
      lines.push(`  "${l.dialogue}"`);
    }
    lines.push(`----------------------------------------`);
  }

  return lines.join('\n');
}

function formatDialogueOnlyText(script: ProductionScript): string {
  const out: string[] = [script.title, ''];
  for (const scene of script.scenes) {
    out.push(`[${scene.timestampStart} – ${scene.timestampEnd} · ${scene.sectionLabel}]`);
    for (const l of scene.lines) {
      const tag = l.speakerGender === 'male' ? 'आदमी' : 'औरत';
      out.push(`${l.speakerName} (${tag}): ${l.dialogue}`);
    }
    out.push('');
  }
  return out.join('\n');
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand fallback (handles iframe permissions)
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default function App() {
  const [uiLang, setUiLang] = useState<UiLanguage>('hi');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [form, setForm] = useState<GenerateScriptInput>(loadInitialForm);
  const [activeScript, setActiveScript] = useState<ProductionScript>(
    SAMPLE_SCRIPTS[0]
  );
  const [savedScripts, setSavedScripts] = useState<ProductionScript[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [copiedMode, setCopiedMode] = useState<'full' | 'dialogue' | null>(null);
  const [plainTextModalOpen, setPlainTextModalOpen] = useState(false);
  const [plainTextMode, setPlainTextMode] = useState<'full' | 'dialogue'>('full');

  // Audio Preview & Full Script Playback State
  const [isAudioPlayingId, setIsAudioPlayingId] = useState<string | null>(null);
  const [isAudioLoadingId, setIsAudioLoadingId] = useState<string | null>(null);
  const [fullPlayback, setFullPlayback] = useState<FullPlaybackState | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const playbackSessionRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const copy = UI_COPY[uiLang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(
        CTA_STORAGE_KEY,
        JSON.stringify({
          openingEnabled: form.openingIntroEnabled,
          openingText: form.openingIntroText,
          closingEnabled: form.closingOutroEnabled,
          closingText: form.closingOutroText,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [
    form.openingIntroEnabled,
    form.openingIntroText,
    form.closingOutroEnabled,
    form.closingOutroText,
  ]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScripts));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedScripts]);

  useEffect(() => {
    return () => {
      playbackSessionRef.current += 1;
      abortControllerRef.current?.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const stopAudio = () => {
    playbackSessionRef.current += 1;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsAudioPlayingId(null);
    setIsAudioLoadingId(null);
    setFullPlayback(null);
  };

  const fetchAudioBlobUrl = async (
    linesChunk: DialogueLine[],
    signal: AbortSignal
  ): Promise<string> => {
    const res = await fetch('/api/voice/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines: linesChunk }),
      signal,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Voice preview failed.');
    }

    const binStr = atob(data.audioBase64);
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const chunkDialogueLines = (lines: DialogueLine[], maxPerChunk = 4) => {
    const valid = lines.filter((l) => l.dialogue.trim().length > 0);
    const chunks: DialogueLine[][] = [];
    for (let i = 0; i < valid.length; i += maxPerChunk) {
      chunks.push(valid.slice(i, i + maxPerChunk));
    }
    return chunks;
  };

  interface AudioQueueItem {
    audioKey: string;
    sceneIndex: number;
    totalScenes: number;
    sceneNumber: number;
    sectionLabel: string;
    linesChunk: DialogueLine[];
  }

  const runAudioQueue = async (
    items: AudioQueueItem[],
    isFullScriptMode: boolean
  ) => {
    stopAudio();
    if (items.length === 0) return;

    const sessionId = ++playbackSessionRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Create Audio synchronously on user gesture so sequential chunks play smoothly in iFrames/Safari
    const audio = new Audio();
    audioRef.current = audio;
    setErrorMessage(null);

    let prefetchedIndex = -1;
    let prefetchedPromise: Promise<string> | null = null;

    const getChunkUrl = (idx: number) => {
      if (prefetchedIndex === idx && prefetchedPromise) {
        const p = prefetchedPromise;
        prefetchedIndex = -1;
        prefetchedPromise = null;
        return p;
      }
      return fetchAudioBlobUrl(items[idx].linesChunk, controller.signal);
    };

    try {
      for (let i = 0; i < items.length; i++) {
        if (playbackSessionRef.current !== sessionId) break;
        const item = items[i];

        setIsAudioLoadingId(item.audioKey);
        if (isFullScriptMode) {
          setFullPlayback({
            currentSceneIndex: item.sceneIndex,
            totalScenes: item.totalScenes,
            sceneNumber: item.sceneNumber,
            sectionLabel: item.sectionLabel,
            isLoading: true,
          });
        }

        const blobUrl = await getChunkUrl(i);

        if (!blobUrl || playbackSessionRef.current !== sessionId) {
          if (blobUrl) URL.revokeObjectURL(blobUrl);
          break;
        }

        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = blobUrl;

        // Start prefetching next chunk while this chunk plays
        if (i + 1 < items.length) {
          prefetchedIndex = i + 1;
          prefetchedPromise = fetchAudioBlobUrl(
            items[i + 1].linesChunk,
            controller.signal
          )
            .then((url) => {
              if (playbackSessionRef.current !== sessionId) {
                URL.revokeObjectURL(url);
                return '';
              }
              return url;
            })
            .catch((err) => {
              if (playbackSessionRef.current === sessionId) {
                throw err;
              }
              return '';
            });
        }

        setIsAudioLoadingId(null);
        setIsAudioPlayingId(item.audioKey);
        if (isFullScriptMode) {
          setFullPlayback({
            currentSceneIndex: item.sceneIndex,
            totalScenes: item.totalScenes,
            sceneNumber: item.sceneNumber,
            sectionLabel: item.sectionLabel,
            isLoading: false,
          });
        }

        await new Promise<void>((resolve, reject) => {
          audio.onended = () => resolve();
          audio.onerror = () =>
            reject(new Error('Audio playback interrupted.'));
          audio.src = blobUrl;
          audio.play().catch(reject);
        });
      }

      if (playbackSessionRef.current === sessionId) {
        stopAudio();
      }
    } catch (err) {
      if (playbackSessionRef.current !== sessionId) return;
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const msg =
        err instanceof Error ? err.message : 'Unable to play voice preview.';
      setErrorMessage(msg);
      stopAudio();
    }
  };

  const handlePlayAudio = (audioKey: string, lines: DialogueLine[]) => {
    const chunks = chunkDialogueLines(lines, 4);
    if (chunks.length === 0) return;

    const items: AudioQueueItem[] = chunks.map((linesChunk) => ({
      audioKey,
      sceneIndex: 0,
      totalScenes: 1,
      sceneNumber: 1,
      sectionLabel: '',
      linesChunk,
    }));

    void runAudioQueue(items, false);
  };

  const handlePlayFullScript = () => {
    const totalScenes = activeScript.scenes.length;
    const items: AudioQueueItem[] = [];

    activeScript.scenes.forEach((scene, sceneIndex) => {
      const chunks = chunkDialogueLines(scene.lines, 4);
      chunks.forEach((linesChunk) => {
        items.push({
          audioKey: `scene-${scene.id}`,
          sceneIndex,
          totalScenes,
          sceneNumber: scene.sceneNumber,
          sectionLabel: scene.sectionLabel,
          linesChunk,
        });
      });
    });

    if (items.length === 0) {
      setErrorMessage(
        uiLang === 'hi'
          ? 'इस स्क्रिप्ट में सुनने के लिए कोई डायलॉग नहीं मिला।'
          : 'No dialogue lines found in this script to play.'
      );
      return;
    }

    void runAudioQueue(items, true);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.topic.trim() &&
      !form.customInstructions.trim() &&
      form.referencePhotos.length === 0
    ) {
      setErrorMessage(
        uiLang === 'hi'
          ? 'कृपया पहले वीडियो का विषय या अपने निर्देश लिखें, या कम से कम 1 फोटो अपलोड करें।'
          : 'Please enter a video topic, custom instructions, or upload at least 1 reference photo.'
      );
      return;
    }

    stopAudio();
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const payload = {
        ...form,
        referencePhotos: form.referencePhotos.map((p) => ({
          name: p.name,
          mimeType: p.mimeType,
          dataBase64: p.dataBase64,
        })),
      };

      const res = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let data: Record<string, unknown> = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Server error (${res.status}). Please try again.`);
      }
      if (!res.ok) {
        throw new Error(
          typeof data.error === 'string'
            ? data.error
            : 'Failed to generate script.'
        );
      }
      const generated = data as unknown as ProductionScript;
      const ensuredScenes = (generated.scenes ?? []).map((sc, idx, arr) => {
        const nextLines = [...(sc.lines ?? [])];
        if (
          idx === 0 &&
          form.openingIntroEnabled &&
          form.openingIntroText.trim()
        ) {
          const first = String(nextLines[0]?.dialogue ?? '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
          const probe = form.openingIntroText
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .slice(0, 20);
          if (!probe || !first.includes(probe)) {
            const g = form.voicePlan === 'female_only' ? 'female' : 'male';
            nextLines.unshift({
              id: `ln-${Date.now()}-front-cta`,
              speakerGender: g,
              speakerName:
                g === 'female'
                  ? `${form.femaleName} (औरत)`
                  : `${form.maleName} (आदमी)`,
              voiceCue: 'शुरुआती चैनल CTA (आगे)',
              deliveryTone: 'गर्मजोशी भरा और तेज़',
              dialogue: form.openingIntroText.trim(),
            });
          }
        }
        if (
          idx === arr.length - 1 &&
          form.closingOutroEnabled &&
          form.closingOutroText.trim()
        ) {
          const last = String(
            nextLines[nextLines.length - 1]?.dialogue ?? ''
          )
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
          const probe = form.closingOutroText
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .slice(0, 20);
          if (!probe || !last.includes(probe)) {
            const g = form.voicePlan === 'male_only' ? 'male' : 'female';
            nextLines.push({
              id: `ln-${Date.now()}-back-cta`,
              speakerGender: g,
              speakerName:
                g === 'female'
                  ? `${form.femaleName} (औरत)`
                  : `${form.maleName} (आदमी)`,
              voiceCue: 'आखिरी चैनल CTA (पीछे)',
              deliveryTone: 'गर्मजोशी भरा और आमंत्रण वाला',
              dialogue: form.closingOutroText.trim(),
            });
          }
        }
        return { ...sc, lines: nextLines };
      });

      setActiveScript({ ...generated, scenes: ensuredScenes });
      setActiveTab('studio');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error generating script.';
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefineScene = async (
    scene: ScriptScene,
    instruction: string
  ) => {
    setErrorMessage(null);
    try {
      const res = await fetch('/api/scripts/refine-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptContext: {
            title: activeScript.title,
            screenFormat: activeScript.screenFormat,
            conversationMode: activeScript.conversationMode,
            voicePlan: activeScript.voicePlan,
            scriptLanguage: activeScript.scriptLanguage,
          },
          scene,
          instruction,
        }),
      });
      const refined = await res.json();
      if (!res.ok) {
        throw new Error(refined.error || 'Failed to refine scene.');
      }

      setActiveScript((prev) => ({
        ...prev,
        scenes: prev.scenes.map((s) => (s.id === scene.id ? refined : s)),
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Scene refine failed.';
      setErrorMessage(msg);
    }
  };

  const handleSaveScript = () => {
    setSavedScripts((prev) => {
      const exists = prev.some((s) => s.id === activeScript.id);
      if (exists) {
        return prev.map((s) => (s.id === activeScript.id ? activeScript : s));
      }
      return [activeScript, ...prev];
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1800);
  };

  const handleCopyFullScript = async () => {
    const text = formatScriptAsText(activeScript);
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedMode('full');
      setTimeout(() => setCopiedMode(null), 2000);
    } else {
      setPlainTextMode('full');
      setPlainTextModalOpen(true);
    }
  };

  const handleCopyDialogueOnly = async () => {
    const text = formatDialogueOnlyText(activeScript);
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedMode('dialogue');
      setTimeout(() => setCopiedMode(null), 2000);
    } else {
      setPlainTextMode('dialogue');
      setPlainTextModalOpen(true);
    }
  };

  const handleDownloadTxt = () => {
    const text = formatScriptAsText(activeScript);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const safeName =
      activeScript.title
        .slice(0, 40)
        .replace(/[/\\?%*:|"<>]/g, '')
        .trim()
        .replace(/\s+/g, '_') || 'script';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleResetDefaultCta = () => {
    setForm((prev) => ({
      ...prev,
      openingIntroEnabled: true,
      openingIntroText: DEFAULT_OPENING_CTA,
      closingOutroEnabled: true,
      closingOutroText: DEFAULT_CLOSING_CTA,
    }));
  };

  const handleApplyCtaToScript = (payload: CtaUpdatePayload) => {
    stopAudio();
    setForm((prev) => ({
      ...prev,
      openingIntroEnabled: payload.openingEnabled,
      openingIntroText: payload.openingText,
      closingOutroEnabled: payload.closingEnabled,
      closingOutroText: payload.closingText,
    }));

    setActiveScript((prev) => {
      if (prev.scenes.length === 0) return prev;
      const openTrim = payload.openingText.trim();
      const closeTrim = payload.closingText.trim();

      const nextScenes = prev.scenes.map((sc, idx, arr) => {
        const nextLines = [...sc.lines];

        if (idx === 0) {
          const first = nextLines[0];
          const isFirstCta =
            Boolean(first?.voiceCue?.toLowerCase().includes('cta')) ||
            Boolean(first?.voiceCue?.includes('शुरुआती')) ||
            Boolean(first?.dialogue?.toLowerCase().includes('crazy dot'));

          if (payload.openingEnabled && openTrim) {
            if (isFirstCta && first) {
              nextLines[0] = { ...first, dialogue: openTrim };
            } else {
              const g = prev.voicePlan === 'female_only' ? 'female' : 'male';
              nextLines.unshift({
                id: `ln-${Date.now()}-front-cta`,
                speakerGender: g,
                speakerName:
                  g === 'female' ? copy.femaleVoiceTag : copy.maleVoiceTag,
                voiceCue: 'शुरुआती चैनल CTA (आगे)',
                deliveryTone: 'गर्मजोशी भरा और तेज़',
                dialogue: openTrim,
              });
            }
          } else if (!payload.openingEnabled && isFirstCta && nextLines.length > 1) {
            nextLines.shift();
          }
        }

        if (idx === arr.length - 1) {
          const lastIdx = nextLines.length - 1;
          const last = nextLines[lastIdx];
          const isLastCta =
            lastIdx >= 0 &&
            (Boolean(last?.voiceCue?.toLowerCase().includes('cta')) ||
              Boolean(last?.voiceCue?.includes('आखिरी')) ||
              Boolean(last?.dialogue?.toLowerCase().includes('crazy dot')));

          if (payload.closingEnabled && closeTrim) {
            if (isLastCta && last) {
              nextLines[lastIdx] = { ...last, dialogue: closeTrim };
            } else {
              const g = prev.voicePlan === 'male_only' ? 'male' : 'female';
              nextLines.push({
                id: `ln-${Date.now()}-back-cta`,
                speakerGender: g,
                speakerName:
                  g === 'female' ? copy.femaleVoiceTag : copy.maleVoiceTag,
                voiceCue: 'आखिरी चैनल CTA (पीछे)',
                deliveryTone: 'गर्मजोशी भरा और आमंत्रण वाला',
                dialogue: closeTrim,
              });
            }
          } else if (!payload.closingEnabled && isLastCta && nextLines.length > 1) {
            nextLines.pop();
          }
        }

        return { ...sc, lines: nextLines };
      });

      return { ...prev, scenes: nextScenes };
    });
  };

  const handleRefineWholeScript = async (instruction: string) => {
    stopAudio();
    setErrorMessage(null);
    try {
      const res = await fetch('/api/scripts/refine-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: activeScript,
          instruction,
          openingIntroEnabled: form.openingIntroEnabled,
          openingIntroText: form.openingIntroText,
          closingOutroEnabled: form.closingOutroEnabled,
          closingOutroText: form.closingOutroText,
        }),
      });
      const text = await res.text();
      let data: Record<string, unknown> = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Server error (${res.status}). Please try again.`);
      }
      if (!res.ok) {
        throw new Error(
          typeof data.error === 'string'
            ? data.error
            : 'Failed to update script.'
        );
      }

      const refined = data as unknown as ProductionScript;
      const ensuredScenes = (refined.scenes ?? []).map((sc, idx, arr) => {
        const nextLines = [...(sc.lines ?? [])];
        if (
          idx === 0 &&
          form.openingIntroEnabled &&
          form.openingIntroText.trim()
        ) {
          const first = String(nextLines[0]?.dialogue ?? '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
          const probe = form.openingIntroText
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .slice(0, 20);
          if (!probe || !first.includes(probe)) {
            const g = form.voicePlan === 'female_only' ? 'female' : 'male';
            nextLines.unshift({
              id: `ln-${Date.now()}-front-cta`,
              speakerGender: g,
              speakerName:
                g === 'female' ? copy.femaleVoiceTag : copy.maleVoiceTag,
              voiceCue: 'शुरुआती चैनल CTA (आगे)',
              deliveryTone: 'गर्मजोशी भरा और तेज़',
              dialogue: form.openingIntroText.trim(),
            });
          }
        }
        if (
          idx === arr.length - 1 &&
          form.closingOutroEnabled &&
          form.closingOutroText.trim()
        ) {
          const last = String(
            nextLines[nextLines.length - 1]?.dialogue ?? ''
          )
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
          const probe = form.closingOutroText
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .slice(0, 20);
          if (!probe || !last.includes(probe)) {
            const g = form.voicePlan === 'male_only' ? 'male' : 'female';
            nextLines.push({
              id: `ln-${Date.now()}-back-cta`,
              speakerGender: g,
              speakerName:
                g === 'female' ? copy.femaleVoiceTag : copy.maleVoiceTag,
              voiceCue: 'आखिरी चैनल CTA (पीछे)',
              deliveryTone: 'गर्मजोशी भरा और आमंत्रण वाला',
              dialogue: form.closingOutroText.trim(),
            });
          }
        }
        return { ...sc, lines: nextLines };
      });

      setActiveScript({ ...refined, scenes: ensuredScenes });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to apply instruction.';
      setErrorMessage(msg);
      throw err;
    }
  };

  const handleNewScript = () => {
    setActiveTab('studio');
    setErrorMessage(null);
    setForm((prev) => ({
      ...prev,
      topic: '',
      customInstructions: '',
      referencePhotos: [],
    }));
    setTimeout(() => {
      const el = document.getElementById('topic-input');
      if (el) el.focus();
    }, 60);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-950 dark:text-zinc-50 flex flex-col transition-colors">
      <Header
        copy={copy}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNewScript={handleNewScript}
      />

      {/* Minimal Sub-Toolbar (Format Summary + Theme Toggle + Language Switcher) */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-900/80 backdrop-blur-xs no-print transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 flex flex-wrap items-center gap-2 tabular-nums">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {activeScript.screenFormat === 'short_9_16'
                ? '9:16 YouTube Short'
                : '16:9 YouTube Long'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {activeScript.conversationMode === 'two_person'
                ? copy.twoPersonLabel
                : activeScript.conversationMode === 'solo'
                  ? copy.soloLabel
                  : activeScript.conversationMode === 'song_video'
                    ? copy.songVideoLabel
                    : copy.explainerLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span>{activeScript.scenes.length} Scenes</span>
            <span aria-hidden="true">·</span>
            <span>
              {activeScript.estimatedDurationSec >= 60
                ? `${Math.floor(activeScript.estimatedDurationSec / 60)}m ${activeScript.estimatedDurationSec % 60}s`
                : `${activeScript.estimatedDurationSec}s`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Light / Dark Theme Switcher */}
            <button
              type="button"
              onClick={() =>
                setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
              }
              aria-label={
                theme === 'dark'
                  ? uiLang === 'hi'
                    ? 'लाइट थीम चालू करें'
                    : 'Switch to Light Theme'
                  : uiLang === 'hi'
                    ? 'डार्क थीम चालू करें'
                    : 'Switch to Dark Theme'
              }
              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{uiLang === 'hi' ? 'लाइट थीम' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-zinc-700" />
                  <span>{uiLang === 'hi' ? 'डार्क थीम' : 'Dark'}</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60">
              <button
                type="button"
                onClick={() => setUiLang('hi')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  uiLang === 'hi'
                    ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setUiLang('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  uiLang === 'en'
                    ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {activeTab === 'studio' && (
          <div>
            <h1 className="sr-only">{copy.studioHeading}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] xl:grid-cols-[380px_1fr] gap-6 items-start">
              <div className="lg:sticky lg:top-20 no-print">
                <DirectorConfigPanel
                  copy={copy}
                  form={form}
                  onChange={setForm}
                  onResetDefaultCta={handleResetDefaultCta}
                  onSubmit={handleGenerate}
                  isGenerating={isGenerating}
                  errorMessage={errorMessage}
                />
              </div>

              <div className="space-y-5 min-w-0">
                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 dark:border-red-900/70 bg-red-50 dark:bg-red-950/50 px-4 py-3 text-xs sm:text-sm text-red-900 dark:text-red-200 no-print"
                  >
                    {errorMessage}
                  </div>
                )}

                <StarterShowcase
                  copy={copy}
                  activeScriptId={activeScript.id}
                  onSelectSample={(sample) => {
                    stopAudio();
                    setErrorMessage(null);
                    setActiveScript(sample);
                  }}
                />

                <ScriptWorkspace
                  copy={copy}
                  script={activeScript}
                  isGenerating={isGenerating}
                  isAudioPlayingId={isAudioPlayingId}
                  isAudioLoadingId={isAudioLoadingId}
                  fullPlayback={fullPlayback}
                  copiedMode={copiedMode}
                  savedFeedback={savedFeedback}
                  defaultOpeningCta={DEFAULT_OPENING_CTA}
                  defaultClosingCta={DEFAULT_CLOSING_CTA}
                  ctaPrefs={{
                    openingEnabled: form.openingIntroEnabled,
                    openingText: form.openingIntroText,
                    closingEnabled: form.closingOutroEnabled,
                    closingText: form.closingOutroText,
                  }}
                  onApplyCtaToScript={handleApplyCtaToScript}
                  onRefineWholeScript={handleRefineWholeScript}
                  onPlayAudio={handlePlayAudio}
                  onPlayFullScript={handlePlayFullScript}
                  onStopAudio={stopAudio}
                  onUpdateScript={setActiveScript}
                  onRefineScene={handleRefineScene}
                  onCopyFullScript={handleCopyFullScript}
                  onCopyDialogueOnly={handleCopyDialogueOnly}
                  onOpenPlainTextModal={() => {
                    setPlainTextMode('full');
                    setPlainTextModalOpen(true);
                  }}
                  onSaveScript={handleSaveScript}
                  onDownloadTxt={handleDownloadTxt}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storyboard' && (
          <StoryboardView
            copy={copy}
            script={activeScript}
            isAudioPlayingId={isAudioPlayingId}
            isAudioLoadingId={isAudioLoadingId}
            fullPlayback={fullPlayback}
            onPlayAudio={handlePlayAudio}
            onPlayFullScript={handlePlayFullScript}
            onStopAudio={stopAudio}
          />
        )}

        {activeTab === 'teleprompter' && (
          <TeleprompterView copy={copy} script={activeScript} />
        )}

        {activeTab === 'saved' && (
          <SavedScriptsView
            copy={copy}
            savedScripts={savedScripts}
            onLoadScript={(script) => {
              stopAudio();
              setActiveScript(script);
              setActiveTab('studio');
            }}
            onDeleteScript={(id) =>
              setSavedScripts((prev) => prev.filter((s) => s.id !== id))
            }
          />
        )}
      </main>

      {/* Branded Studio Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 no-print transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <BrandLogo
            size="sm"
            title={uiLang === 'hi' ? 'एक्स डिजिटल सॉल्यूशन' : 'X Digital Solution'}
            subtitle={
              uiLang === 'hi'
                ? 'पटकथा स्टूडियो · क्रीटेड बाय पंकज लोहार'
                : 'Patkatha Studio · Created by Pankaj Lohar'
            }
          />
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 text-center sm:text-right">
            {uiLang === 'hi'
              ? 'एक्स डिजिटल सॉल्यूशन · क्रीटेड बाय पंकज लोहार · Crazy Dot’s Studio'
              : 'X Digital Solution · Created by Pankaj Lohar · Crazy Dot’s Studio'}
          </p>
        </div>
      </footer>

      {/* Plain Text Copy Modal */}
      {plainTextModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-2xl w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPlainTextMode('full')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                    plainTextMode === 'full'
                      ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {copy.copyScriptBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setPlainTextMode('dialogue')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                    plainTextMode === 'dialogue'
                      ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {copy.copyDialogueBtn}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPlainTextModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              readOnly
              rows={15}
              onFocus={(e) => e.currentTarget.select()}
              value={
                plainTextMode === 'full'
                  ? formatScriptAsText(activeScript)
                  : formatDialogueOnlyText(activeScript)
              }
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3 text-xs leading-relaxed font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={
                  plainTextMode === 'full'
                    ? handleCopyFullScript
                    : handleCopyDialogueOnly
                }
                className="px-4 py-2 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedMode === plainTextMode ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>
                  {copiedMode === plainTextMode
                    ? copy.copiedToast
                    : copy.copyScriptBtn}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
