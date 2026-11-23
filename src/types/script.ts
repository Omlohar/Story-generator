export type ScreenFormat = 'short_9_16' | 'long_16_9';
export type ConversationMode = 'two_person' | 'solo' | 'explainer' | 'song_video';
export type VoicePlan = 'dual_male_female' | 'male_only' | 'female_only';
export type ScriptLanguage = 'hindi' | 'hinglish' | 'english';
export type UiLanguage = 'hi' | 'en';
export type SpeakerGender = 'male' | 'female';

export interface ReferencePhoto {
  id: string;
  name: string;
  mimeType: string;
  dataBase64: string;
  previewUrl: string;
}

export interface DialogueLine {
  id: string;
  speakerGender: SpeakerGender;
  speakerName: string;
  voiceCue: string;
  deliveryTone: string;
  dialogue: string;
}

export interface ScriptScene {
  id: string;
  sceneNumber: number;
  sectionLabel: string;
  timestampStart: string;
  timestampEnd: string;
  durationSeconds: number;
  cameraFraming: string;
  shotType: string;
  visualDirection: string;
  bRollCue: string;
  screenOverlayText: string;
  overlayPosition: 'top' | 'center' | 'bottom-third';
  sfxAndMusicCue: string;
  lines: DialogueLine[];
}

export interface ProductionScript {
  id: string;
  createdAt: string;
  topic: string;
  title: string;
  hookSummary: string;
  screenFormat: ScreenFormat;
  aspectRatioLabel: string;
  resolutionSpec: string;
  conversationMode: ConversationMode;
  voicePlan: VoicePlan;
  scriptLanguage: ScriptLanguage;
  estimatedDurationSec: number;
  voiceAllocationSummary: string;
  maleVoiceRole: string;
  femaleVoiceRole: string;
  thumbnailConcept: string;
  bgmStyle: string;
  scenes: ScriptScene[];
}

export interface GenerateScriptInput {
  topic: string;
  customInstructions: string;
  screenFormat: ScreenFormat;
  durationTarget: string;
  conversationMode: ConversationMode;
  voicePlan: VoicePlan;
  scriptLanguage: ScriptLanguage;
  tone: string;
  maleName: string;
  femaleName: string;
  referencePhotos: ReferencePhoto[];
  openingIntroEnabled: boolean;
  openingIntroText: string;
  closingOutroEnabled: boolean;
  closingOutroText: string;
}
