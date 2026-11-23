import React, { useState } from 'react';
import {
  Volume2,
  Square,
  Loader2,
  Wand2,
  Plus,
  Trash2,
  User,
  Pencil,
  Check,
} from 'lucide-react';
import { UiCopy } from '../data/i18n';
import {
  DialogueLine,
  ScreenFormat,
  ScriptScene,
  SpeakerGender,
} from '../types/script';
import { ScreenFramePreview } from './ScreenFramePreview';

interface SceneCardProps {
  copy: UiCopy;
  scene: ScriptScene;
  screenFormat: ScreenFormat;
  isAudioPlayingId: string | null;
  isAudioLoadingId: string | null;
  onPlayAudio: (audioKey: string, lines: DialogueLine[]) => void;
  onStopAudio: () => void;
  onUpdateScene: (updated: ScriptScene) => void;
  onDeleteScene: (sceneId: string) => void;
  onRefineScene: (scene: ScriptScene, instruction: string) => Promise<void>;
  canDelete: boolean;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  copy,
  scene,
  screenFormat,
  isAudioPlayingId,
  isAudioLoadingId,
  onPlayAudio,
  onStopAudio,
  onUpdateScene,
  onDeleteScene,
  onRefineScene,
  canDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [refineOpen, setRefineOpen] = useState(false);
  const [refineText, setRefineText] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const sceneAudioKey = `scene-${scene.id}`;
  const isScenePlaying = isAudioPlayingId === sceneAudioKey;
  const isSceneLoading = isAudioLoadingId === sceneAudioKey;
  const isHindiUi = copy.brand === 'पटकथा स्टूडियो';

  const activeSpeakers = Array.from(
    new Set(scene.lines.map((l) => l.speakerGender))
  );

  const handleFieldChange = <K extends keyof ScriptScene>(
    field: K,
    value: ScriptScene[K]
  ) => {
    onUpdateScene({ ...scene, [field]: value });
  };

  const handleLineChange = (
    lineId: string,
    patch: Partial<DialogueLine>
  ) => {
    const nextLines = scene.lines.map((line) =>
      line.id === lineId ? { ...line, ...patch } : line
    );
    onUpdateScene({ ...scene, lines: nextLines });
  };

  const handleToggleSpeaker = (line: DialogueLine) => {
    const nextGender: SpeakerGender =
      line.speakerGender === 'male' ? 'female' : 'male';
    const nextName =
      nextGender === 'male' ? copy.maleVoiceTag : copy.femaleVoiceTag;
    handleLineChange(line.id, {
      speakerGender: nextGender,
      speakerName: nextName,
    });
  };

  const handleAddLine = () => {
    const lastGender = scene.lines[scene.lines.length - 1]?.speakerGender;
    const nextGender: SpeakerGender = lastGender === 'male' ? 'female' : 'male';
    const newLine: DialogueLine = {
      id: `ln-${Date.now()}`,
      speakerGender: nextGender,
      speakerName: nextGender === 'male' ? copy.maleVoiceTag : copy.femaleVoiceTag,
      voiceCue:
        nextGender === 'male'
          ? 'आदमी की आवाज़ — नया संवाद / सवाल'
          : 'औरत की आवाज़ — नया संवाद / जवाब',
      deliveryTone: 'स्पष्ट और सहज',
      dialogue: '',
    };
    onUpdateScene({ ...scene, lines: [...scene.lines, newLine] });
  };

  const handleRemoveLine = (lineId: string) => {
    if (scene.lines.length <= 1) return;
    onUpdateScene({
      ...scene,
      lines: scene.lines.filter((l) => l.id !== lineId),
    });
  };

  const submitRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim()) return;
    setIsRefining(true);
    try {
      await onRefineScene(scene, refineText.trim());
      setRefineText('');
      setRefineOpen(false);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <article className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 print-break-inside-avoid transition-colors">
      {/* Scene Top Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-950 dark:text-zinc-50 text-sm tabular-nums">
            Scene {String(scene.sceneNumber).padStart(2, '0')}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
            {scene.timestampStart} – {scene.timestampEnd} ({scene.durationSeconds}s)
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-[#E11D48]">{scene.sectionLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{scene.shotType}</span>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={() =>
              isScenePlaying
                ? onStopAudio()
                : onPlayAudio(sceneAudioKey, scene.lines)
            }
            disabled={isSceneLoading}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isScenePlaying
                ? 'border-[#E11D48] bg-[#E11D48] text-white'
                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            {isSceneLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{copy.loadingAudioBtn}</span>
              </>
            ) : isScenePlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{copy.stopAudioBtn}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>{copy.previewAudioBtn}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setRefineOpen((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{copy.refineSceneBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isEditing
                ? 'border-zinc-950 dark:border-white bg-zinc-950 dark:bg-white text-white dark:text-zinc-950'
                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isHindiUi ? 'हो गया' : 'Done'}</span>
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" />
                <span>{isHindiUi ? 'एडिट करें' : 'Edit'}</span>
              </>
            )}
          </button>

          {isEditing && canDelete && (
            <button
              type="button"
              onClick={() => onDeleteScene(scene.id)}
              title="Delete scene"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Inline AI Scene Refinement Bar */}
      {refineOpen && (
        <form
          onSubmit={submitRefine}
          className="mt-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-2 no-print"
        >
          <input
            type="text"
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder={
              isHindiUi
                ? 'जैसे: हुक को और तेज़ बनाएं, या इस सीन में औरत की आवाज़ जोड़ें...'
                : 'e.g. Make the hook sharper, or add a female voice reaction...'
            }
            className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#E11D48] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isRefining || !refineText.trim()}
            className="px-4 py-1.5 rounded-md bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isRefining ? '...' : isHindiUi ? 'बदलाव लागू करें' : 'Apply AI Edit'}
          </button>
        </form>
      )}

      {/* Two-Column Production Breakdown: Left = Visuals & Framing, Right = Voices & Dialogue */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Screen Frame Preview + Visual Directions */}
        <div className="lg:col-span-5 space-y-4 lg:pr-5 lg:border-r lg:border-zinc-100 dark:lg:border-zinc-800">
          <div className="flex justify-center py-2 bg-zinc-50/70 dark:bg-zinc-950/70 rounded-lg border border-zinc-100 dark:border-zinc-800 px-3">
            <ScreenFramePreview
              screenFormat={screenFormat}
              shotType={scene.shotType}
              cameraFraming={scene.cameraFraming}
              overlayText={scene.screenOverlayText}
              overlayPosition={scene.overlayPosition}
              activeSpeakers={activeSpeakers}
              sceneNumber={scene.sceneNumber}
            />
          </div>

          {isEditing ? (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  {copy.visualDirectionTitle}
                </label>
                <textarea
                  rows={3}
                  value={scene.visualDirection}
                  onChange={(e) =>
                    handleFieldChange('visualDirection', e.target.value)
                  }
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 px-3 py-2 text-xs leading-relaxed text-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  {copy.bRollTitle}
                </label>
                <input
                  type="text"
                  value={scene.bRollCue}
                  onChange={(e) => handleFieldChange('bRollCue', e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    {copy.screenTextTitle}
                  </label>
                  <input
                    type="text"
                    value={scene.screenOverlayText}
                    onChange={(e) =>
                      handleFieldChange('screenOverlayText', e.target.value)
                    }
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    {copy.sfxMusicTitle}
                  </label>
                  <input
                    type="text"
                    value={scene.sfxAndMusicCue}
                    onChange={(e) =>
                      handleFieldChange('sfxAndMusicCue', e.target.value)
                    }
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <span className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                  {copy.visualDirectionTitle}
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {scene.visualDirection}
                </p>
              </div>

              <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
                <span className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                  {copy.bRollTitle}
                </span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {scene.bRollCue}
                </p>
              </div>

              <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                    {copy.screenTextTitle}
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {scene.screenOverlayText}
                  </p>
                </div>

                <div>
                  <span className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                    {copy.sfxMusicTitle}
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {scene.sfxAndMusicCue}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Male / Female Voice Allocation & Dialogue Lines */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {copy.voicePlacementTitle}
            </h4>
            {isEditing && (
              <button
                type="button"
                onClick={handleAddLine}
                className="text-xs font-medium text-[#E11D48] hover:text-[#BE123C] flex items-center gap-1 cursor-pointer no-print"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isHindiUi ? 'लाइन जोड़ें' : 'Add Line'}</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {scene.lines.map((line) => {
              const isMale = line.speakerGender === 'male';
              const lineAudioKey = `line-${line.id}`;
              const isLinePlaying = isAudioPlayingId === lineAudioKey;
              const isLineLoading = isAudioLoadingId === lineAudioKey;

              if (!isEditing) {
                return (
                  <div key={line.id} className="py-3.5 first:pt-1 last:pb-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`font-semibold inline-flex items-center gap-1 ${
                            isMale
                              ? 'text-indigo-700 dark:text-indigo-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          <User className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isMale ? copy.maleVoiceTag : copy.femaleVoiceTag}
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
                          ·
                        </span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {line.speakerName}
                        </span>
                        {line.deliveryTone && (
                          <>
                            <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
                              ·
                            </span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              {line.deliveryTone}
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          isLinePlaying
                            ? onStopAudio()
                            : onPlayAudio(lineAudioKey, [line])
                        }
                        disabled={isLineLoading || !line.dialogue.trim()}
                        className="px-2 py-1 rounded text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 flex items-center gap-1 shrink-0 cursor-pointer no-print"
                      >
                        {isLineLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : isLinePlaying ? (
                          <Square className="w-3 h-3 fill-current text-[#E11D48]" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                        <span>{isLinePlaying ? copy.stopAudioBtn : 'Play'}</span>
                      </button>
                    </div>

                    {line.voiceCue && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {line.voiceCue}
                      </p>
                    )}

                    <p className="text-[15px] leading-relaxed text-zinc-950 dark:text-zinc-50 font-medium">
                      {line.dialogue}
                    </p>
                  </div>
                );
              }

              return (
                <div key={line.id} className="py-4 first:pt-1 last:pb-1 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSpeaker(line)}
                        title="Click to switch Male / Female voice"
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isMale
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-950'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950'
                        }`}
                      >
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isMale ? copy.maleVoiceTag : copy.femaleVoiceTag}
                        </span>
                      </button>

                      <input
                        type="text"
                        value={line.speakerName}
                        onChange={(e) =>
                          handleLineChange(line.id, {
                            speakerName: e.target.value,
                          })
                        }
                        className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 focus:border-zinc-400 focus:bg-white dark:focus:bg-zinc-950 focus:outline-none max-w-[160px]"
                      />

                      <input
                        type="text"
                        value={line.deliveryTone}
                        onChange={(e) =>
                          handleLineChange(line.id, {
                            deliveryTone: e.target.value,
                          })
                        }
                        className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 focus:border-zinc-400 focus:bg-white dark:focus:bg-zinc-950 focus:outline-none max-w-[180px]"
                      />
                    </div>

                    {scene.lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(line.id)}
                        className="p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer no-print"
                        title="Remove line"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={line.voiceCue}
                    onChange={(e) =>
                      handleLineChange(line.id, { voiceCue: e.target.value })
                    }
                    className="w-full text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 rounded-md px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 focus:bg-white dark:focus:bg-zinc-950 focus:outline-none"
                  />

                  <textarea
                    rows={2}
                    value={line.dialogue}
                    onChange={(e) =>
                      handleLineChange(line.id, { dialogue: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-[15px] leading-relaxed text-zinc-950 dark:text-zinc-50 font-medium focus:border-[#E11D48] focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
};
