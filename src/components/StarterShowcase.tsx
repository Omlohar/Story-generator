import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { UiCopy } from '../data/i18n';
import { SAMPLE_SCRIPTS } from '../data/sampleScripts';
import { ProductionScript } from '../types/script';

interface StarterShowcaseProps {
  copy: UiCopy;
  activeScriptId: string;
  onSelectSample: (script: ProductionScript) => void;
}

const SAMPLE_IMAGES: Record<string, string> = {
  'sample-short-two-person':
    '/src/assets/images/format_two_person_dialogue_1795333775809.jpg',
  'sample-long-explainer':
    '/src/assets/images/format_visual_explainer_1795333777265.jpg',
  'sample-short-solo':
    '/src/assets/images/format_solo_monologue_1795333776282.jpg',
  'sample-short-song-video':
    '/src/assets/images/format_song_video_1795335197777.jpg',
};

export const StarterShowcase: React.FC<StarterShowcaseProps> = ({
  copy,
  activeScriptId,
  onSelectSample,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section aria-labelledby="starter-examples-heading" className="space-y-2 no-print">
      <h2
        id="starter-examples-heading"
        className="text-xs font-semibold text-zinc-500 dark:text-zinc-400"
      >
        {copy.starterTitle}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
        {SAMPLE_SCRIPTS.map((sample) => {
          const isSelected = activeScriptId === sample.id;
          const imgSrc = SAMPLE_IMAGES[sample.id];
          const hasFailed = failedImages[sample.id];

          const modeLabel =
            sample.conversationMode === 'two_person'
              ? copy.twoPersonLabel
              : sample.conversationMode === 'solo'
                ? copy.soloLabel
                : sample.conversationMode === 'song_video'
                  ? copy.songVideoLabel
                  : copy.explainerLabel;

          const formatLabel =
            sample.screenFormat === 'short_9_16' ? '9:16' : '16:9';

          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              className={`text-left rounded-lg border bg-white dark:bg-zinc-900 p-2 flex items-center gap-2.5 transition-colors cursor-pointer ${
                isSelected
                  ? 'border-[#E11D48] ring-1 ring-[#E11D48]'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="w-12 h-9 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                {!hasFailed && imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={sample.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [sample.id]: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <Film className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 tabular-nums">
                  <span className="font-semibold text-[#E11D48]">
                    {formatLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{modeLabel}</span>
                </div>
                <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-100 truncate mt-0.5">
                  {sample.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
