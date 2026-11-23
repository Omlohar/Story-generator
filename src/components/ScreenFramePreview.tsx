import React from 'react';
import { ScreenFormat, SpeakerGender } from '../types/script';

interface ScreenFramePreviewProps {
  screenFormat: ScreenFormat;
  shotType: string;
  cameraFraming: string;
  overlayText: string;
  overlayPosition: 'top' | 'center' | 'bottom-third';
  activeSpeakers: SpeakerGender[];
  sceneNumber: number;
  compact?: boolean;
}

export const ScreenFramePreview: React.FC<ScreenFramePreviewProps> = ({
  screenFormat,
  shotType,
  cameraFraming,
  overlayText,
  overlayPosition,
  activeSpeakers,
  sceneNumber,
  compact = false,
}) => {
  const isShort = screenFormat === 'short_9_16';
  const hasMale = activeSpeakers.includes('male');
  const hasFemale = activeSpeakers.includes('female');

  const positionClass =
    overlayPosition === 'top'
      ? 'top-5 left-3 right-3'
      : overlayPosition === 'center'
        ? 'top-1/2 -translate-y-1/2 left-3 right-3'
        : 'bottom-4 left-3 right-3';

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative bg-zinc-950 text-white rounded-lg border border-zinc-800 overflow-hidden select-none ${
          isShort
            ? compact
              ? 'w-[135px] aspect-[9/16]'
              : 'w-[180px] aspect-[9/16]'
            : compact
              ? 'w-full aspect-video'
              : 'w-full aspect-video'
        }`}
      >
        {/* Subtle safe-zone framing guide lines */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none border border-dashed border-white/15 ${
            isShort ? 'm-3 mb-10' : 'm-4'
          }`}
        />

        {/* Top camera frame metadata */}
        <div className="absolute top-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span className="tabular-nums">SC {String(sceneNumber).padStart(2, '0')}</span>
          <span>{isShort ? '9:16' : '16:9'}</span>
        </div>

        {/* Visual subject silhouette / framing guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {shotType.toLowerCase().includes('split') ? (
            <div
              className={`w-full h-full flex ${
                isShort ? 'flex-col' : 'flex-row'
              } opacity-35`}
            >
              <div className="flex-1 border-b border-r border-white/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-white/40" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-white/40" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 opacity-30">
              {hasMale && (
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border border-indigo-300" />
                  <div className="w-10 h-6 mt-1 rounded-t-lg border-t border-x border-indigo-300" />
                </div>
              )}
              {hasFemale && (
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border border-rose-300" />
                  <div className="w-10 h-6 mt-1 rounded-t-lg border-t border-x border-rose-300" />
                </div>
              )}
              {!hasMale && !hasFemale && (
                <div className="w-12 h-8 border border-white/40 rounded" />
              )}
            </div>
          )}
        </div>

        {/* Simulated YouTube Shorts right-side UI safe zone */}
        {isShort && (
          <div
            aria-hidden="true"
            className="absolute right-1.5 bottom-4 flex flex-col gap-1.5 opacity-25"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
        )}

        {/* On-Screen Text Overlay Preview */}
        {overlayText && (
          <div className={`absolute ${positionClass} z-10`}>
            <div className="bg-black/75 backdrop-blur-[2px] border border-white/15 rounded px-2 py-1 text-center">
              <p className="text-[11px] leading-snug font-semibold text-white line-clamp-2">
                {overlayText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Unboxed framing caption below screen preview */}
      <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400 text-center leading-snug max-w-[220px]">
        {shotType} · {cameraFraming}
      </p>
    </div>
  );
};
