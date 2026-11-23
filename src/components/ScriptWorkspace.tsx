import React, { useEffect, useState } from 'react';
import {
  Plus,
  User,
  Image as ImageIcon,
  Music,
  Copy,
  Check,
  FileText,
  Bookmark,
  Download,
  Printer,
  Volume2,
  Square,
  Loader2,
  Pencil,
  Wand2,
} from 'lucide-react';
import { UiCopy } from '../data/i18n';
import {
  DialogueLine,
  ProductionScript,
  ScriptScene,
} from '../types/script';
import { SceneCard } from './SceneCard';

export interface FullPlaybackState {
  currentSceneIndex: number;
  totalScenes: number;
  sceneNumber: number;
  sectionLabel: string;
  isLoading: boolean;
}

export interface CtaUpdatePayload {
  openingEnabled: boolean;
  openingText: string;
  closingEnabled: boolean;
  closingText: string;
}

interface ScriptWorkspaceProps {
  copy: UiCopy;
  script: ProductionScript;
  isGenerating: boolean;
  isAudioPlayingId: string | null;
  isAudioLoadingId: string | null;
  fullPlayback: FullPlaybackState | null;
  copiedMode: 'full' | 'dialogue' | null;
  savedFeedback: boolean;
  defaultOpeningCta: string;
  defaultClosingCta: string;
  ctaPrefs: CtaUpdatePayload;
  onApplyCtaToScript: (payload: CtaUpdatePayload) => void;
  onRefineWholeScript: (instruction: string) => Promise<void>;
  onPlayAudio: (audioKey: string, lines: DialogueLine[]) => void;
  onPlayFullScript: () => void;
  onStopAudio: () => void;
  onUpdateScript: (updated: ProductionScript) => void;
  onRefineScene: (scene: ScriptScene, instruction: string) => Promise<void>;
  onCopyFullScript: () => void;
  onCopyDialogueOnly: () => void;
  onOpenPlainTextModal: () => void;
  onSaveScript: () => void;
  onDownloadTxt: () => void;
}

export const ScriptWorkspace: React.FC<ScriptWorkspaceProps> = ({
  copy,
  script,
  isGenerating,
  isAudioPlayingId,
  isAudioLoadingId,
  fullPlayback,
  copiedMode,
  savedFeedback,
  defaultOpeningCta,
  defaultClosingCta,
  ctaPrefs,
  onApplyCtaToScript,
  onRefineWholeScript,
  onPlayAudio,
  onPlayFullScript,
  onStopAudio,
  onUpdateScript,
  onRefineScene,
  onCopyFullScript,
  onCopyDialogueOnly,
  onOpenPlainTextModal,
  onSaveScript,
  onDownloadTxt,
}) => {
  const isHindiUi = copy.brand === 'पटकथा स्टूडियो';
  const [ctaEditorOpen, setCtaEditorOpen] = useState(false);
  const [instructOpen, setInstructOpen] = useState(false);
  const [wholeInstruction, setWholeInstruction] = useState('');
  const [isRefiningWhole, setIsRefiningWhole] = useState(false);
  const [draftOpeningEnabled, setDraftOpeningEnabled] = useState(
    ctaPrefs.openingEnabled
  );
  const [draftOpeningText, setDraftOpeningText] = useState(
    ctaPrefs.openingText
  );
  const [draftClosingEnabled, setDraftClosingEnabled] = useState(
    ctaPrefs.closingEnabled
  );
  const [draftClosingText, setDraftClosingText] = useState(
    ctaPrefs.closingText
  );
  const [ctaAppliedNotice, setCtaAppliedNotice] = useState(false);

  useEffect(() => {
    const firstScene = script.scenes[0];
    const lastScene = script.scenes[script.scenes.length - 1];
    const firstLine = firstScene?.lines[0];
    const lastLine = lastScene?.lines[lastScene.lines.length - 1];

    const isFirstCta =
      Boolean(firstLine?.voiceCue?.toLowerCase().includes('cta')) ||
      Boolean(firstLine?.voiceCue?.includes('शुरुआती')) ||
      Boolean(firstLine?.dialogue?.toLowerCase().includes('crazy dot'));
    const isLastCta =
      Boolean(lastLine?.voiceCue?.toLowerCase().includes('cta')) ||
      Boolean(lastLine?.voiceCue?.includes('आखिरी')) ||
      Boolean(lastLine?.dialogue?.toLowerCase().includes('crazy dot'));

    setDraftOpeningEnabled(ctaPrefs.openingEnabled);
    setDraftOpeningText(
      isFirstCta && firstLine?.dialogue
        ? firstLine.dialogue
        : ctaPrefs.openingText
    );
    setDraftClosingEnabled(ctaPrefs.closingEnabled);
    setDraftClosingText(
      isLastCta && lastLine?.dialogue ? lastLine.dialogue : ctaPrefs.closingText
    );
  }, [script.id, ctaPrefs]);
  const handleSceneUpdate = (updatedScene: ScriptScene) => {
    const nextScenes = script.scenes.map((s) =>
      s.id === updatedScene.id ? updatedScene : s
    );
    onUpdateScript({ ...script, scenes: nextScenes });
  };

  const handleDeleteScene = (sceneId: string) => {
    if (script.scenes.length <= 1) return;
    const nextScenes = script.scenes
      .filter((s) => s.id !== sceneId)
      .map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));
    onUpdateScript({ ...script, scenes: nextScenes });
  };

  const handleAddScene = () => {
    const lastScene = script.scenes[script.scenes.length - 1];
    const nextNum = script.scenes.length + 1;
    const startSec = script.scenes.reduce(
      (sum, s) => sum + (s.durationSeconds || 5),
      0
    );
    const fmtTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const newScene: ScriptScene = {
      id: `sc-${Date.now()}`,
      sceneNumber: nextNum,
      sectionLabel: `Scene ${nextNum}`,
      timestampStart: fmtTime(startSec),
      timestampEnd: fmtTime(startSec + 10),
      durationSeconds: 10,
      cameraFraming:
        script.screenFormat === 'short_9_16'
          ? 'Medium Close-Up · 9:16 Center Safe-Zone'
          : 'Medium Shot · 16:9 Rule of Thirds',
      shotType: 'Medium Shot',
      visualDirection:
        lastScene?.visualDirection ||
        'होस्ट कैमरे के सामने मुख्य पॉइंट समझाता है।',
      bRollCue: 'सहायक बी-रोल या स्क्रीन ग्राफिक कट।',
      screenOverlayText: 'मुख्य पॉइंट यहां लिखें',
      overlayPosition:
        script.screenFormat === 'short_9_16' ? 'center' : 'bottom-third',
      sfxAndMusicCue: 'हल्का ट्रांजिशन हुक',
      lines: [
        {
          id: `ln-${Date.now()}`,
          speakerGender: script.voicePlan === 'female_only' ? 'female' : 'male',
          speakerName:
            script.voicePlan === 'female_only'
              ? copy.femaleVoiceTag
              : copy.maleVoiceTag,
          voiceCue: 'सीन के अनुसार स्पष्ट डिलीवरी।',
          deliveryTone: 'स्पष्ट और ऊर्जावान',
          dialogue: '',
        },
      ],
    };

    onUpdateScript({
      ...script,
      scenes: [...script.scenes, newScene],
    });
  };

  if (isGenerating) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-3 animate-pulse">
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-7 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded" />
        </div>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 h-56 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Production Master Overview Card */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 space-y-5 transition-colors">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
            <span className="font-semibold text-[#E11D48]">
              {script.aspectRatioLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span>{script.resolutionSpec}</span>
            <span aria-hidden="true">·</span>
            <span>
              {script.scenes.length} Scenes (
              {script.estimatedDurationSec >= 60
                ? `${Math.floor(script.estimatedDurationSec / 60)}m ${script.estimatedDurationSec % 60}s`
                : `${script.estimatedDurationSec}s`}
              )
            </span>
          </div>

          <input
            type="text"
            value={script.title}
            onChange={(e) =>
              onUpdateScript({ ...script, title: e.target.value })
            }
            className="w-full text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight bg-transparent border-b border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 focus:border-[#E11D48] focus:outline-none py-0.5"
          />

          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {script.hookSummary}
          </p>

          {/* Single Unified Action Bar (Listen Full Script, Copy, Save, TXT, Print) */}
          <div className="pt-2 flex flex-wrap items-center gap-2 no-print">
            <button
              type="button"
              onClick={fullPlayback ? onStopAudio : onPlayFullScript}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                fullPlayback
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200'
                  : 'bg-[#E11D48] hover:bg-[#BE123C] text-white'
              }`}
            >
              {fullPlayback?.isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : fullPlayback ? (
                <Square className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span>
                {fullPlayback
                  ? fullPlayback.isLoading
                    ? `${copy.loadingFullScriptBtn} (${fullPlayback.currentSceneIndex + 1}/${fullPlayback.totalScenes})`
                    : `${copy.stopFullScriptBtn} (${fullPlayback.currentSceneIndex + 1}/${fullPlayback.totalScenes})`
                  : copy.listenFullScriptBtn}
              </span>
            </button>

            <button
              type="button"
              onClick={onCopyFullScript}
              className="px-3.5 py-2 rounded-lg bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedMode === 'full' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>
                {copiedMode === 'full' ? copy.copiedToast : copy.copyScriptBtn}
              </span>
            </button>

            <button
              type="button"
              onClick={onCopyDialogueOnly}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedMode === 'dialogue' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>
                {copiedMode === 'dialogue'
                  ? copy.copiedToast
                  : copy.copyDialogueBtn}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenPlainTextModal}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{copy.viewPlainTextBtn}</span>
            </button>

            <button
              type="button"
              onClick={onSaveScript}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              {savedFeedback ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
              <span>{savedFeedback ? copy.savedToast : copy.saveScriptBtn}</span>
            </button>

            <button
              type="button"
              onClick={onDownloadTxt}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{copy.exportTxtBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCtaEditorOpen((prev) => !prev);
                setInstructOpen(false);
              }}
              className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                ctaEditorOpen
                  ? 'border-[#E11D48] bg-rose-50 dark:bg-rose-950/40 text-[#E11D48]'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{copy.editCtaBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setInstructOpen((prev) => !prev);
                setCtaEditorOpen(false);
              }}
              className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                instructOpen
                  ? 'border-[#E11D48] bg-rose-50 dark:bg-rose-950/40 text-[#E11D48]'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{copy.instructScriptBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-200 text-xs font-medium hidden sm:flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{copy.printPdfBtn}</span>
            </button>
          </div>

          {/* Inline Whole-Script AI Instruction Box */}
          {instructOpen && (
            <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/90 dark:bg-zinc-950/80 p-4 space-y-3 no-print">
              <div>
                <h4 className="text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                  {isHindiUi
                    ? 'पूरी स्क्रिप्ट को बदलने के लिए अपना निर्देश लिखें'
                    : 'Give Custom Instructions to Rewrite This Script'}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {isHindiUi
                    ? 'बताएं कि आपको इस स्क्रिप्ट में क्या बदलाव चाहिए — AI पूरी स्क्रिप्ट आपके हिसाब से बदल देगा।'
                    : 'Describe how you want to modify this script — AI will rewrite it while preserving your CTAs.'}
                </p>
              </div>
              <textarea
                rows={3}
                value={wholeInstruction}
                onChange={(e) => setWholeInstruction(e.target.value)}
                placeholder={copy.customInstructionsPlaceholder}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#E11D48] focus:outline-none"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'डायलॉग छोटे और तेज़ करो',
                    'भाषा और आसान देसी रखो',
                    'कॉमेडी अंदाज़ बढ़ाओ',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setWholeInstruction(chip)}
                      className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#E11D48] text-[11px] text-zinc-700 dark:text-zinc-300 cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={isRefiningWhole || !wholeInstruction.trim()}
                  onClick={async () => {
                    if (!wholeInstruction.trim()) return;
                    setIsRefiningWhole(true);
                    try {
                      await onRefineWholeScript(wholeInstruction.trim());
                      setWholeInstruction('');
                      setInstructOpen(false);
                    } finally {
                      setIsRefiningWhole(false);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {isRefiningWhole ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  <span>{copy.applyInstructionBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* Inline Opening & Closing CTA Editor */}
          {ctaEditorOpen && (
            <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/90 dark:bg-zinc-950/80 p-4 space-y-3 no-print">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                    {isHindiUi
                      ? 'स्क्रिप्ट का शुरुआती (आगे) और आखिरी (पीछे) CTA बदलें'
                      : 'Customize Opening (Front) & Closing (Back) CTA'}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {isHindiUi
                      ? 'बदला हुआ CTA अभी की स्क्रिप्ट में भी अपडेट होगा और अगली सभी स्क्रिप्ट्स के लिए सेव भी रहेगा।'
                      : 'Updates this active script immediately and saves your preference for future scripts.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraftOpeningEnabled(true);
                    setDraftOpeningText(defaultOpeningCta);
                    setDraftClosingEnabled(true);
                    setDraftClosingText(defaultClosingCta);
                  }}
                  className="text-[11px] font-medium text-[#E11D48] hover:underline cursor-pointer"
                >
                  {copy.resetDefaultCtaBtn}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="inline-opening-cta"
                      className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                    >
                      {copy.openingIntroLabel}
                    </label>
                    <input
                      id="inline-opening-cta"
                      type="checkbox"
                      checked={draftOpeningEnabled}
                      onChange={(e) => setDraftOpeningEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[#E11D48] rounded cursor-pointer"
                    />
                  </div>
                  <textarea
                    rows={3}
                    disabled={!draftOpeningEnabled}
                    value={draftOpeningText}
                    onChange={(e) => setDraftOpeningText(e.target.value)}
                    placeholder={
                      isHindiUi
                        ? 'शुरुआत में क्या बोलना है लिखें...'
                        : 'Enter opening CTA spoken at 00:00...'
                    }
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 disabled:opacity-50 focus:border-[#E11D48] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="inline-closing-cta"
                      className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                    >
                      {copy.closingOutroLabel}
                    </label>
                    <input
                      id="inline-closing-cta"
                      type="checkbox"
                      checked={draftClosingEnabled}
                      onChange={(e) => setDraftClosingEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[#E11D48] rounded cursor-pointer"
                    />
                  </div>
                  <textarea
                    rows={3}
                    disabled={!draftClosingEnabled}
                    value={draftClosingText}
                    onChange={(e) => setDraftClosingText(e.target.value)}
                    placeholder={
                      isHindiUi
                        ? 'अंत में क्या बोलना है लिखें...'
                        : 'Enter closing CTA spoken at the end...'
                    }
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 disabled:opacity-50 focus:border-[#E11D48] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                {ctaAppliedNotice && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {isHindiUi ? 'CTA अपडेट हो गया!' : 'CTA updated!'}
                    </span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onApplyCtaToScript({
                      openingEnabled: draftOpeningEnabled,
                      openingText: draftOpeningText,
                      closingEnabled: draftClosingEnabled,
                      closingText: draftClosingText,
                    });
                    setCtaAppliedNotice(true);
                    setTimeout(() => setCtaAppliedNotice(false), 2000);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{copy.applyCtaBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* Live Full Script Playback Banner */}
          {fullPlayback && (
            <div className="mt-2 rounded-lg border border-[#E11D48]/30 bg-rose-50/70 dark:bg-rose-950/30 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2.5 min-w-0">
                {fullPlayback.isLoading ? (
                  <Loader2 className="w-4 h-4 text-[#E11D48] animate-spin shrink-0" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#E11D48] animate-pulse shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                    {isHindiUi
                      ? `पूरी स्क्रिप्ट चल रही है: सीन ${fullPlayback.sceneNumber} / ${fullPlayback.totalScenes}`
                      : `Playing Full Script: Scene ${fullPlayback.sceneNumber} of ${fullPlayback.totalScenes}`}
                    {fullPlayback.sectionLabel
                      ? ` · ${fullPlayback.sectionLabel}`
                      : ''}
                  </p>
                  <div className="mt-1 h-1.5 w-44 sm:w-64 rounded-full bg-rose-200/70 dark:bg-rose-900/50 overflow-hidden">
                    <div
                      className="h-full bg-[#E11D48] transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          ((fullPlayback.currentSceneIndex + 1) /
                            Math.max(1, fullPlayback.totalScenes)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onStopAudio}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 hover:border-[#E11D48] flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Square className="w-3 h-3 fill-current text-[#E11D48]" />
                <span>{copy.stopAudioBtn}</span>
              </button>
            </div>
          )}
        </div>

        {/* Male & Female Voice Allocation Map */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <h3 className="text-xs font-semibold text-zinc-950 dark:text-zinc-50">
            {copy.voiceSummaryTitle}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {script.voiceAllocationSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-lg border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                <User className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
                <span>{copy.maleVoiceTag}</span>
              </div>
              <p className="text-xs text-indigo-900/90 dark:text-indigo-200/80 leading-relaxed">
                {script.maleVoiceRole}
              </p>
            </div>

            <div className="rounded-lg border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-950 dark:text-rose-200">
                <User className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
                <span>{copy.femaleVoiceTag}</span>
              </div>
              <p className="text-xs text-rose-900/90 dark:text-rose-200/80 leading-relaxed">
                {script.femaleVoiceRole}
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail & BGM Strip */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <ImageIcon className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                {copy.thumbnailTitle}
              </span>
              <p className="text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {script.thumbnailConcept}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Music className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                {copy.bgmTitle}
              </span>
              <p className="text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {script.bgmStyle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scene Cards List */}
      <div className="space-y-4">
        {script.scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            copy={copy}
            scene={scene}
            screenFormat={script.screenFormat}
            isAudioPlayingId={isAudioPlayingId}
            isAudioLoadingId={isAudioLoadingId}
            onPlayAudio={onPlayAudio}
            onStopAudio={onStopAudio}
            onUpdateScene={handleSceneUpdate}
            onDeleteScene={handleDeleteScene}
            onRefineScene={onRefineScene}
            canDelete={script.scenes.length > 1}
          />
        ))}
      </div>

      {/* Bottom Actions: Add Scene + Listen Full Script + Copy Full Script */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 no-print">
        <button
          type="button"
          onClick={handleAddScene}
          className="px-4 py-2 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#E11D48] text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#E11D48] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{copy.addSceneBtn}</span>
        </button>

        <button
          type="button"
          onClick={fullPlayback ? onStopAudio : onPlayFullScript}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            fullPlayback
              ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950'
              : 'bg-[#E11D48] hover:bg-[#BE123C] text-white'
          }`}
        >
          {fullPlayback?.isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : fullPlayback ? (
            <Square className="w-4 h-4 fill-current" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <span>
            {fullPlayback
              ? `${copy.stopFullScriptBtn} (${fullPlayback.currentSceneIndex + 1}/${fullPlayback.totalScenes})`
              : copy.listenFullScriptBtn}
          </span>
        </button>

        <button
          type="button"
          onClick={onCopyFullScript}
          className="px-4 py-2 rounded-lg bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copiedMode === 'full' ? (
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>
            {copiedMode === 'full' ? copy.copiedToast : copy.copyScriptBtn}
          </span>
        </button>
      </div>
    </div>
  );
};
