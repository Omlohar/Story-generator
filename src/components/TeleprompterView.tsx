import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, FlipHorizontal2, User } from 'lucide-react';
import { UiCopy } from '../data/i18n';
import { ProductionScript } from '../types/script';

interface TeleprompterViewProps {
  copy: UiCopy;
  script: ProductionScript;
}

export const TeleprompterView: React.FC<TeleprompterViewProps> = ({
  copy,
  script,
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg');
  const [mirrored, setMirrored] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollFloatRef = useRef<number>(0);

  useEffect(() => {
    if (!isScrolling) return;
    let frameId: number;
    let lastTime = performance.now();
    if (scrollContainerRef.current) {
      scrollFloatRef.current = scrollContainerRef.current.scrollTop;
    }

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const el = scrollContainerRef.current;
      if (el) {
        scrollFloatRef.current += speed * 28 * dt;
        el.scrollTop = scrollFloatRef.current;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
          setIsScrolling(false);
          return;
        }
      }
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isScrolling, speed]);

  const handleReset = () => {
    setIsScrolling(false);
    scrollFloatRef.current = 0;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const textSizeClass =
    fontSize === 'md'
      ? 'text-xl sm:text-2xl'
      : fontSize === 'lg'
        ? 'text-2xl sm:text-3xl'
        : 'text-3xl sm:text-4xl';

  const durationDisplay =
    script.estimatedDurationSec >= 60
      ? `${Math.floor(script.estimatedDurationSec / 60)}m ${script.estimatedDurationSec % 60}s`
      : `${script.estimatedDurationSec}s`;

  return (
    <section className="space-y-4">
      {/* Teleprompter Control Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsScrolling((prev) => !prev)}
            className="px-4 py-2 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {isScrolling ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{copy.teleprompterPause}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{copy.teleprompterStart}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
            title="Reset to top"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-700 dark:text-zinc-300">
          <label className="flex items-center gap-2.5">
            <span className="font-medium">{copy.teleprompterSpeed}</span>
            <input
              type="range"
              min={1}
              max={6}
              step={0.5}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="accent-[#E11D48] w-24"
            />
            <span className="font-mono tabular-nums w-6">{speed}×</span>
          </label>

          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            {(['md', 'lg', 'xl'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setFontSize(sz)}
                className={`px-2.5 py-1 rounded text-xs font-medium uppercase cursor-pointer ${
                  fontSize === sz
                    ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMirrored((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
              mirrored
                ? 'border-zinc-950 dark:border-white bg-zinc-950 dark:bg-white text-white dark:text-zinc-950'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            <FlipHorizontal2 className="w-3.5 h-3.5" />
            <span>Mirror</span>
          </button>
        </div>
      </div>

      {/* High-Contrast Teleprompter Stage */}
      <div
        ref={scrollContainerRef}
        onScroll={(e) => {
          if (!isScrolling) {
            scrollFloatRef.current = e.currentTarget.scrollTop;
          }
        }}
        className="bg-zinc-950 text-zinc-100 rounded-xl border border-zinc-800 h-[65vh] overflow-y-auto px-6 sm:px-14 py-12"
      >
        <div
          style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
          className="max-w-3xl mx-auto space-y-10 pb-[40vh]"
        >
          <div className="border-b border-zinc-800 pb-6">
            <p className="text-xs font-mono text-zinc-400 tabular-nums">
              {script.aspectRatioLabel} · {durationDisplay}
            </p>
            <h2 className="text-2xl font-bold text-white mt-1">{script.title}</h2>
          </div>

          {script.scenes.map((scene) => (
            <div key={scene.id} className="space-y-5">
              <div className="text-xs font-mono text-zinc-400 border-b border-zinc-800/80 pb-2 flex flex-wrap items-center justify-between gap-2">
                <span>
                  SCENE {String(scene.sceneNumber).padStart(2, '0')} ·{' '}
                  {scene.sectionLabel} ({scene.timestampStart}–{scene.timestampEnd})
                </span>
                <span className="text-zinc-500">[{scene.cameraFraming}]</span>
              </div>

              <p className="text-sm text-zinc-400 italic">
                Visual Cue: {scene.visualDirection}
              </p>

              <div className="space-y-6">
                {scene.lines.map((line) => {
                  const isMale = line.speakerGender === 'male';
                  return (
                    <div key={line.id} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                        <User className="w-3.5 h-3.5" />
                        <span
                          className={
                            isMale ? 'text-indigo-300' : 'text-rose-300'
                          }
                        >
                          {isMale ? copy.maleVoiceTag : copy.femaleVoiceTag} ·{' '}
                          {line.speakerName}
                        </span>
                        <span className="text-zinc-500 font-normal">
                          ({line.deliveryTone})
                        </span>
                      </div>
                      <p
                        className={`${textSizeClass} leading-relaxed font-semibold text-white`}
                      >
                        {line.dialogue}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
