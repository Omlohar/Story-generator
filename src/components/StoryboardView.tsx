import React from 'react';
import { User, Volume2, Square, Loader2 } from 'lucide-react';
import { UiCopy } from '../data/i18n';
import { DialogueLine, ProductionScript } from '../types/script';
import { ScreenFramePreview } from './ScreenFramePreview';
import type { FullPlaybackState } from './ScriptWorkspace';

interface StoryboardViewProps {
  copy: UiCopy;
  script: ProductionScript;
  isAudioPlayingId: string | null;
  isAudioLoadingId: string | null;
  fullPlayback: FullPlaybackState | null;
  onPlayAudio: (audioKey: string, lines: DialogueLine[]) => void;
  onPlayFullScript: () => void;
  onStopAudio: () => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  copy,
  script,
  isAudioPlayingId,
  isAudioLoadingId,
  fullPlayback,
  onPlayAudio,
  onPlayFullScript,
  onStopAudio,
}) => {
  const totalSec = Math.max(
    1,
    script.scenes.reduce((acc, s) => acc + (s.durationSeconds || 5), 0)
  );
  const totalLabel =
    totalSec >= 60
      ? `${Math.floor(totalSec / 60)}m ${totalSec % 60}s`
      : `${totalSec}s`;

  return (
    <section className="space-y-6">
      {/* Header & Voice Timeline Track */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5 transition-colors">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1 tabular-nums">
              <span className="font-semibold text-[#E11D48]">
                {script.aspectRatioLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span>{script.resolutionSpec}</span>
              <span aria-hidden="true">·</span>
              <span>{totalLabel} Total</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
              {script.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={fullPlayback ? onStopAudio : onPlayFullScript}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                fullPlayback
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950'
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
                  ? `${copy.stopFullScriptBtn} (${fullPlayback.currentSceneIndex + 1}/${fullPlayback.totalScenes})`
                  : copy.listenFullScriptBtn}
              </span>
            </button>

            <span className="flex items-center gap-1.5 font-medium text-indigo-900 dark:text-indigo-300">
              <span className="inline-block w-3 h-3 rounded-xs bg-indigo-600" />
              {copy.maleVoiceTag}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-rose-900 dark:text-rose-300">
              <span className="inline-block w-3 h-3 rounded-xs bg-rose-600" />
              {copy.femaleVoiceTag}
            </span>
          </div>
        </div>

        {/* Visual Timeline Track showing duration + Male/Female dominance per scene */}
        <div className="space-y-2">
          <div className="flex w-full h-9 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            {script.scenes.map((scene) => {
              const dur = Math.max(scene.durationSeconds || 5, 1);
              const maleLines = scene.lines.filter(
                (l) => l.speakerGender === 'male'
              ).length;
              const femaleLines = scene.lines.filter(
                (l) => l.speakerGender === 'female'
              ).length;
              const bgClass =
                maleLines > 0 && femaleLines > 0
                  ? 'bg-gradient-to-r from-indigo-100 via-zinc-100 to-rose-100 dark:from-indigo-950/70 dark:via-zinc-900 dark:to-rose-950/70 text-zinc-900 dark:text-zinc-100'
                  : femaleLines > 0
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200'
                    : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200';

              return (
                <div
                  key={scene.id}
                  style={{ flex: `${dur} 1 0%` }}
                  className={`min-w-0 border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 px-2 flex items-center justify-between text-[11px] font-medium truncate ${bgClass}`}
                  title={`${scene.sectionLabel} (${scene.timestampStart}–${scene.timestampEnd})`}
                >
                  <span className="truncate">{scene.sectionLabel}</span>
                  <span className="font-mono tabular-nums text-[10px] opacity-75 ml-1 shrink-0">
                    {scene.durationSeconds}s
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {script.voiceAllocationSummary}
          </p>
        </div>
      </div>

      {/* Storyboard Frame Grid */}
      <div
        className={`grid gap-5 ${
          script.screenFormat === 'short_9_16'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {script.scenes.map((scene) => {
          const activeSpeakers = Array.from(
            new Set(scene.lines.map((l) => l.speakerGender))
          );
          const audioKey = `sb-${scene.id}`;
          const isPlaying = isAudioPlayingId === audioKey;
          const isLoading = isAudioLoadingId === audioKey;

          return (
            <article
              key={scene.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-4 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                    {scene.timestampStart} – {scene.timestampEnd}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 truncate">
                    {scene.sectionLabel}
                  </span>
                </div>

                <div className="flex justify-center py-2 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-800 px-2">
                  <ScreenFramePreview
                    screenFormat={script.screenFormat}
                    shotType={scene.shotType}
                    cameraFraming={scene.cameraFraming}
                    overlayText={scene.screenOverlayText}
                    overlayPosition={scene.overlayPosition}
                    activeSpeakers={activeSpeakers}
                    sceneNumber={scene.sceneNumber}
                    compact
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    <span className="font-semibold text-zinc-950 dark:text-white">
                      Visual:{' '}
                    </span>
                    {scene.visualDirection}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      B-Roll:{' '}
                    </span>
                    {scene.bRollCue}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                {scene.lines.map((line) => (
                  <div
                    key={line.id}
                    className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200"
                  >
                    <span
                      className={`inline-flex items-center gap-1 font-semibold mr-1.5 ${
                        line.speakerGender === 'male'
                          ? 'text-indigo-800 dark:text-indigo-400'
                          : 'text-rose-800 dark:text-rose-400'
                      }`}
                    >
                      <User className="w-3 h-3" />
                      {line.speakerName}:
                    </span>
                    <span>“{line.dialogue}”</span>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    isPlaying
                      ? onStopAudio()
                      : onPlayAudio(audioKey, scene.lines)
                  }
                  disabled={isLoading}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 text-xs font-medium text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isPlaying ? (
                    <Square className="w-3.5 h-3.5 fill-current text-[#E11D48]" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isPlaying ? copy.stopAudioBtn : copy.previewAudioBtn}
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
