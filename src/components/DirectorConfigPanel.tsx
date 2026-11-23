import React, { useRef, useState } from 'react';
import {
  Loader2,
  Sparkles,
  User,
  Users,
  Film,
  Music,
  ImagePlus,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UiCopy } from '../data/i18n';
import {
  ConversationMode,
  GenerateScriptInput,
  ReferencePhoto,
  ScreenFormat,
  ScriptLanguage,
  VoicePlan,
} from '../types/script';

interface DirectorConfigPanelProps {
  copy: UiCopy;
  form: GenerateScriptInput;
  onChange: (next: GenerateScriptInput) => void;
  onResetDefaultCta: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  errorMessage: string | null;
}

async function processPhotoFile(file: File): Promise<ReferencePhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file.'));
      img.onload = () => {
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1] ?? '';
        resolve({
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          mimeType: 'image/jpeg',
          dataBase64: base64,
          previewUrl: dataUrl,
        });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export const DirectorConfigPanel: React.FC<DirectorConfigPanelProps> = ({
  copy,
  form,
  onChange,
  onResetDefaultCta,
  onSubmit,
  isGenerating,
  errorMessage,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const update = <K extends keyof GenerateScriptInput>(
    key: K,
    value: GenerateScriptInput[K]
  ) => {
    onChange({ ...form, [key]: value });
  };

  const handleScreenFormatSelect = (screenFormat: ScreenFormat) => {
    onChange({
      ...form,
      screenFormat,
    });
  };

  const handleModeSelect = (mode: ConversationMode) => {
    if (mode === 'song_video') {
      onChange({
        ...form,
        conversationMode: mode,
        screenFormat: 'short_9_16',
        durationTarget: '60s',
      });
      return;
    }
    update('conversationMode', mode);
  };

  const handleFilesAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPhotoError(null);
    const remainingSlots = Math.max(0, 4 - form.referencePhotos.length);
    if (remainingSlots === 0) return;

    const picked = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remainingSlots);

    if (picked.length === 0) {
      setPhotoError('Please choose PNG, JPG, or WebP images.');
      return;
    }

    try {
      const processed = await Promise.all(picked.map(processPhotoFile));
      update('referencePhotos', [...form.referencePhotos, ...processed]);
    } catch (err) {
      setPhotoError(
        err instanceof Error ? err.message : 'Unable to process photo.'
      );
    }
  };

  const handleRemovePhoto = (id: string) => {
    update(
      'referencePhotos',
      form.referencePhotos.filter((p) => p.id !== id)
    );
  };

  const durationOptions = [
    { value: '30s', label: '30 sec' },
    { value: '45s', label: '45 sec' },
    { value: '60s', label: '1 min (60s)' },
    { value: '90s', label: '1.5 min' },
    { value: '2m', label: '2 min' },
    { value: '3m', label: '3 min' },
    { value: '5m', label: '5 min' },
    { value: '8m', label: '8 min' },
    { value: '10m', label: '10 min' },
    { value: '12m', label: '12 min' },
    { value: '15m', label: '15 min' },
  ];

  const conversationOptions: {
    id: ConversationMode;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'two_person',
      label: copy.twoPersonLabel,
      icon: <Users className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'solo',
      label: copy.soloLabel,
      icon: <User className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'explainer',
      label: copy.explainerLabel,
      icon: <Film className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'song_video',
      label: copy.songVideoLabel,
      icon: <Music className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  const voiceOptions: { id: VoicePlan; label: string }[] = [
    { id: 'dual_male_female', label: 'आदमी + औरत' },
    { id: 'male_only', label: 'सिर्फ आदमी' },
    { id: 'female_only', label: 'सिर्फ औरत' },
  ];

  const languageOptions: { id: ScriptLanguage; label: string }[] = [
    { id: 'hindi', label: 'हिन्दी' },
    { id: 'hinglish', label: 'Hinglish' },
    { id: 'english', label: 'English' },
  ];

  const hasPhotos = form.referencePhotos.length > 0;

  return (
    <aside className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 h-fit transition-colors">
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Step 1: Topic + Compact Photo Attach */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="topic-input"
              className="text-sm font-semibold text-zinc-950 dark:text-zinc-50"
            >
              1. {copy.topicLabel}
            </label>
            <button
              type="button"
              disabled={form.referencePhotos.length >= 4}
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-[#E11D48] hover:text-[#BE123C] disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              <span>
                {copy.photoUploadBtn} ({form.referencePhotos.length}/4)
              </span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFilesAdded(e.target.files);
              e.target.value = '';
            }}
          />

          <textarea
            id="topic-input"
            rows={2}
            value={form.topic}
            onChange={(e) => update('topic', e.target.value)}
            placeholder={copy.topicPlaceholder}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-[#E11D48] focus:outline-none transition-colors"
          />

          {/* Custom Instructions Box (How the creator wants the script written) */}
          <div className="pt-1 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="custom-instructions-input"
                className="text-xs font-semibold text-zinc-800 dark:text-zinc-200"
              >
                {copy.customInstructionsLabel}
              </label>
              {form.customInstructions.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => update('customInstructions', '')}
                  className="text-[11px] font-medium text-zinc-500 hover:text-[#E11D48] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              id="custom-instructions-input"
              rows={2}
              value={form.customInstructions}
              onChange={(e) => update('customInstructions', e.target.value)}
              placeholder={copy.customInstructionsPlaceholder}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-950 focus:border-[#E11D48] focus:outline-none transition-colors"
            />
            <div className="flex flex-wrap gap-1.5">
              {[
                'देसी आसान भाषा',
                'मज़ेदार कॉमेडी अंदाज़',
                'चौंकाने वाली शुरुआत',
                'इमोशनल ट्विस्ट जोड़ें',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    const current = form.customInstructions.trim();
                    if (current.includes(preset)) return;
                    update(
                      'customInstructions',
                      current ? `${current}, ${preset}` : preset
                    );
                  }}
                  className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-[#E11D48] text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-[#E11D48] transition-colors cursor-pointer"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {photoError && (
            <p className="text-[11px] text-red-700 dark:text-red-400">{photoError}</p>
          )}

          {hasPhotos && (
            <div className="space-y-1.5">
              <div className="grid grid-cols-4 gap-2">
                {form.referencePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
                  >
                    <img
                      src={photo.previewUrl}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      aria-label={`Remove ${photo.name}`}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#E11D48] cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                {copy.photoTopicOptionalHint}
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Screen Size (9:16 vs 16:9) */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50 mb-2">
            2. {copy.screenSizeLabel}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleScreenFormatSelect('short_9_16')}
              className={`px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                form.screenFormat === 'short_9_16'
                  ? 'border-[#E11D48] bg-[#E11D48]/[0.05] dark:bg-[#E11D48]/15 text-zinc-950 dark:text-white'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`inline-block w-2.5 h-4 rounded-[2px] border-2 shrink-0 ${
                    form.screenFormat === 'short_9_16'
                      ? 'border-[#E11D48]'
                      : 'border-zinc-400 dark:border-zinc-500'
                  }`}
                />
                <span className="text-xs font-semibold truncate">
                  9:16 Vertical
                </span>
              </div>
              <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Shorts / Reels
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleScreenFormatSelect('long_16_9')}
              className={`px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                form.screenFormat === 'long_16_9'
                  ? 'border-[#E11D48] bg-[#E11D48]/[0.05] dark:bg-[#E11D48]/15 text-zinc-950 dark:text-white'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`inline-block w-4 h-2.5 rounded-[2px] border-2 shrink-0 ${
                    form.screenFormat === 'long_16_9'
                      ? 'border-[#E11D48]'
                      : 'border-zinc-400 dark:border-zinc-500'
                  }`}
                />
                <span className="text-xs font-semibold truncate">
                  16:9 Landscape
                </span>
              </div>
              <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                YouTube Video
              </span>
            </button>
          </div>
        </div>

        {/* Step 3: Video Style (2x2 compact grid) */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50 mb-2">
            3. {copy.formatLabel}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {conversationOptions.map((opt) => {
              const selected = form.conversationMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleModeSelect(opt.id)}
                  className={`px-2.5 py-2.5 rounded-lg border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                    selected
                      ? 'border-[#E11D48] bg-[#E11D48]/[0.05] dark:bg-[#E11D48]/15 text-zinc-950 dark:text-white'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <span
                    className={
                      selected ? 'text-[#E11D48]' : 'text-zinc-400 dark:text-zinc-500'
                    }
                  >
                    {opt.icon}
                  </span>
                  <span className="text-xs font-semibold leading-tight line-clamp-2">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Voice Allocation + Language + Length */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3.5">
          <div>
            <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50 mb-2">
              4. {copy.voicePlanLabel}
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              {voiceOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update('voicePlan', opt.id)}
                  className={`py-1.5 px-1.5 text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    form.voicePlan === opt.id
                      ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                {copy.scriptLanguageLabel}
              </span>
              <select
                value={form.scriptLanguage}
                onChange={(e) =>
                  update('scriptLanguage', e.target.value as ScriptLanguage)
                }
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:border-[#E11D48] focus:outline-none"
              >
                {languageOptions.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                {copy.durationLabel}
              </span>
              <select
                value={form.durationTarget}
                onChange={(e) => update('durationTarget', e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 tabular-nums focus:border-[#E11D48] focus:outline-none"
              >
                {durationOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Collapsible Extra Settings (Editable Front/Back CTA + Speaker Names + Tone) */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setShowMoreOptions((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 py-1 cursor-pointer"
          >
            <span>
              {copy.editCtaBtn} ({form.openingIntroEnabled || form.closingOutroEnabled ? 'On' : 'Off'}) · नाम व अंदाज़
            </span>
            {showMoreOptions ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showMoreOptions && (
            <div className="mt-3 space-y-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  आगे और पीछे का CTA अपनी पसंद से बदलें (ऑटो-सेव होता है)
                </span>
                <button
                  type="button"
                  onClick={onResetDefaultCta}
                  className="text-[11px] font-medium text-[#E11D48] hover:underline shrink-0 cursor-pointer"
                >
                  {copy.resetDefaultCtaBtn}
                </button>
              </div>

              {/* Opening CTA */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="opening-intro-toggle"
                    className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    {copy.openingIntroLabel}
                  </label>
                  <input
                    id="opening-intro-toggle"
                    type="checkbox"
                    checked={form.openingIntroEnabled}
                    onChange={(e) =>
                      update('openingIntroEnabled', e.target.checked)
                    }
                    className="w-4 h-4 accent-[#E11D48] rounded cursor-pointer"
                  />
                </div>
                {form.openingIntroEnabled && (
                  <textarea
                    rows={2}
                    value={form.openingIntroText}
                    onChange={(e) => update('openingIntroText', e.target.value)}
                    placeholder="शुरुआत में जो बोलना है यहाँ लिखें..."
                    className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-950 focus:border-[#E11D48] focus:outline-none"
                  />
                )}
              </div>

              {/* Closing CTA */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="closing-outro-toggle"
                    className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    {copy.closingOutroLabel}
                  </label>
                  <input
                    id="closing-outro-toggle"
                    type="checkbox"
                    checked={form.closingOutroEnabled}
                    onChange={(e) =>
                      update('closingOutroEnabled', e.target.checked)
                    }
                    className="w-4 h-4 accent-[#E11D48] rounded cursor-pointer"
                  />
                </div>
                {form.closingOutroEnabled && (
                  <textarea
                    rows={2}
                    value={form.closingOutroText}
                    onChange={(e) => update('closingOutroText', e.target.value)}
                    placeholder="अंत में जो बोलना है यहाँ लिखें..."
                    className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-950 focus:border-[#E11D48] focus:outline-none"
                  />
                )}
              </div>

              {/* Speaker Names */}
              <div className="grid grid-cols-2 gap-2">
                {form.voicePlan !== 'female_only' && (
                  <div>
                    <label
                      htmlFor="male-name"
                      className="block text-[11px] font-medium text-indigo-900 dark:text-indigo-300 mb-1"
                    >
                      {copy.maleNameLabel}
                    </label>
                    <input
                      id="male-name"
                      type="text"
                      value={form.maleName}
                      onChange={(e) => update('maleName', e.target.value)}
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                )}
                {form.voicePlan !== 'male_only' && (
                  <div>
                    <label
                      htmlFor="female-name"
                      className="block text-[11px] font-medium text-rose-900 dark:text-rose-300 mb-1"
                    >
                      {copy.femaleNameLabel}
                    </label>
                    <input
                      id="female-name"
                      type="text"
                      value={form.femaleName}
                      onChange={(e) => update('femaleName', e.target.value)}
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Delivery Tone */}
              <div>
                <span className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  {copy.toneLabel}
                </span>
                <select
                  value={form.tone}
                  onChange={(e) => update('tone', e.target.value)}
                  className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#E11D48] focus:outline-none"
                >
                  <option value="engaging">Engaging &amp; Crisp</option>
                  <option value="storytelling">Storytelling</option>
                  <option value="romantic">Romantic / Lyrical</option>
                  <option value="educational">Educational</option>
                  <option value="energetic">High-Energy Hook</option>
                  <option value="calm">Calm &amp; Trustworthy</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 dark:border-red-900/70 bg-red-50 dark:bg-red-950/50 px-3 py-2 text-xs text-red-800 dark:text-red-200"
          >
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3 px-4 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{copy.generatingBtn}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{copy.generateBtn}</span>
            </>
          )}
        </button>
      </form>
    </aside>
  );
};
