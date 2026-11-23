import { UiLanguage } from '../types/script';

export interface UiCopy {
  brand: string;
  navStudio: string;
  navStoryboard: string;
  navTeleprompter: string;
  navSaved: string;
  newScriptBtn: string;
  studioHeading: string;
  studioSubheading: string;
  topicLabel: string;
  topicPlaceholder: string;
  customInstructionsLabel: string;
  customInstructionsPlaceholder: string;
  screenSizeLabel: string;
  shortVideoLabel: string;
  shortVideoSpec: string;
  longVideoLabel: string;
  longVideoSpec: string;
  formatLabel: string;
  twoPersonLabel: string;
  twoPersonDesc: string;
  soloLabel: string;
  soloDesc: string;
  explainerLabel: string;
  explainerDesc: string;
  songVideoLabel: string;
  songVideoDesc: string;
  photoUploadLabel: string;
  photoUploadHint: string;
  photoUploadBtn: string;
  photoTopicOptionalHint: string;
  openingIntroLabel: string;
  openingIntroHint: string;
  closingOutroLabel: string;
  closingOutroHint: string;
  voicePlanLabel: string;
  dualVoiceLabel: string;
  dualVoiceDesc: string;
  maleOnlyLabel: string;
  maleOnlyDesc: string;
  femaleOnlyLabel: string;
  femaleOnlyDesc: string;
  scriptLanguageLabel: string;
  durationLabel: string;
  toneLabel: string;
  speakerNamesLabel: string;
  maleNameLabel: string;
  femaleNameLabel: string;
  generateBtn: string;
  generatingBtn: string;
  starterTitle: string;
  starterSubtitle: string;
  maleVoiceTag: string;
  femaleVoiceTag: string;
  visualDirectionTitle: string;
  cameraFramingTitle: string;
  bRollTitle: string;
  screenTextTitle: string;
  sfxMusicTitle: string;
  voicePlacementTitle: string;
  previewAudioBtn: string;
  loadingAudioBtn: string;
  stopAudioBtn: string;
  listenFullScriptBtn: string;
  loadingFullScriptBtn: string;
  stopFullScriptBtn: string;
  editCtaBtn: string;
  applyCtaBtn: string;
  resetDefaultCtaBtn: string;
  instructScriptBtn: string;
  applyInstructionBtn: string;
  refineSceneBtn: string;
  addSceneBtn: string;
  saveScriptBtn: string;
  savedToast: string;
  copyScriptBtn: string;
  copyDialogueBtn: string;
  viewPlainTextBtn: string;
  copiedToast: string;
  exportTxtBtn: string;
  printPdfBtn: string;
  teleprompterStart: string;
  teleprompterPause: string;
  teleprompterSpeed: string;
  savedEmptyTitle: string;
  savedEmptyDesc: string;
  loadScriptBtn: string;
  deleteScriptBtn: string;
  voiceSummaryTitle: string;
  thumbnailTitle: string;
  bgmTitle: string;
  editModeHint: string;
}

export const UI_COPY: Record<UiLanguage, UiCopy> = {
  hi: {
    brand: 'पटकथा स्टूडियो',
    navStudio: 'स्क्रिप्ट स्टूडियो',
    navStoryboard: 'स्टोरीबोर्ड फ्रेम',
    navTeleprompter: 'टेलीप्रॉम्प्टर',
    navSaved: 'सेव्ड स्क्रिप्ट्स',
    newScriptBtn: 'नई स्क्रिप्ट',
    studioHeading: 'कम्प्लीट वीडियो स्क्रिप्ट व डायरेक्शन स्टूडियो',
    studioSubheading:
      'YouTube Short (9:16) और Long Video (16:9) के लिए विज़ुअल डायरेक्शन, कैमरा फ्रेमिंग, और आदमी-औरत की आवाज़ का सटीक प्लान तैयार करें।',
    topicLabel: 'वीडियो का विषय (Topic / Idea)',
    topicPlaceholder:
      'जैसे: मोबाइल की लत से दिमाग पर क्या असर पड़ता है? या SIP बनाम FD पर पति-पत्नी की बातचीत...',
    customInstructionsLabel: 'आपके खास निर्देश / इंस्ट्रक्शन (कैसी स्क्रिप्ट चाहिए)',
    customInstructionsPlaceholder:
      'जैसे: शुरुआत मज़ेदार सवाल से हो, देसी आसान भाषा रखो, बीच में एक ट्विस्ट डालो, डायलॉग छोटे और तेज़ हों...',
    screenSizeLabel: 'स्क्रीन की साइज (YouTube Format)',
    shortVideoLabel: 'यूट्यूब वर्टिकल (9:16)',
    shortVideoSpec: 'Vertical · 1080×1920 · 30s – 15 मिनट',
    longVideoLabel: 'यूट्यूब लैंडस्केप (16:9)',
    longVideoSpec: 'Landscape · 1920×1080 · 30s – 15 मिनट',
    formatLabel: 'बातचीत का स्टाइल (Format)',
    twoPersonLabel: 'दो जनों की बातचीत',
    twoPersonDesc: 'पॉडकास्ट / डिबेट / संवाद',
    soloLabel: 'अकेले की बातचीत',
    soloDesc: 'सोलो होस्ट / टॉकिंग हेड',
    explainerLabel: 'एक्सप्लेनर',
    explainerDesc: 'विज़ुअल वॉयसओवर / डॉक्यूमेंट्री',
    songVideoLabel: '9:16 सॉन्ग / म्यूज़िक वीडियो',
    songVideoDesc: 'गाने के बोल, लिप-सिंक, मेल-फीमेल अंतरा व विज़ुअल कहानी',
    photoUploadLabel: 'फोटो से स्क्रिप्ट बनाएं (Photo-to-Script)',
    photoUploadHint:
      '1 से 4 फोटो अपलोड करें (सीन, प्रोडक्ट या जोड़ी की फोटो) — बिना कुछ लिखे भी स्क्रिप्ट बन जाएगी',
    photoUploadBtn: 'फोटो चुनें / जोड़ें',
    photoTopicOptionalHint: 'फोटो अपलोड है — विषय लिखना वैकल्पिक है',
    openingIntroLabel: 'स्क्रिप्ट की शुरुआत में CTA (आगे)',
    openingIntroHint: 'स्क्रिप्ट चालू होते ही (Scene 1 · 00:00) सबसे पहले यही बोला जाएगा',
    closingOutroLabel: 'स्क्रिप्ट के अंत में CTA (पीछे)',
    closingOutroHint: 'वीडियो खत्म होते समय (आखिरी सीन) अंत में यही बोला जाएगा',
    voicePlanLabel: 'आवाज़ कहां देनी है (Voice Direction)',
    dualVoiceLabel: 'आदमी + औरत दोनों की आवाज़',
    dualVoiceDesc: 'कहां आदमी और कहां औरत बोलेगी, पूरा प्लान',
    maleOnlyLabel: 'सिर्फ आदमी की आवाज़',
    maleOnlyDesc: 'पूरी स्क्रिप्ट मेल वॉयस / होस्ट में',
    femaleOnlyLabel: 'सिर्फ औरत की आवाज़',
    femaleOnlyDesc: 'पूरी स्क्रिप्ट फीमेल वॉयस / होस्ट में',
    scriptLanguageLabel: 'स्क्रिप्ट की भाषा',
    durationLabel: 'वीडियो की लंबाई',
    toneLabel: 'अंदाज़ (Tone)',
    speakerNamesLabel: 'बोलने वालों के नाम (वैकल्पिक)',
    maleNameLabel: 'आदमी का नाम',
    femaleNameLabel: 'औरत का नाम',
    generateBtn: 'पूरी स्क्रिप्ट तैयार करें',
    generatingBtn: 'स्क्रिप्ट और विज़ुअल्स बन रहे हैं...',
    starterTitle: 'शुरुआत के लिए तैयार उदाहरण (1-क्लिक में देखें)',
    starterSubtitle:
      'नीचे किसी भी फॉर्मेट पर क्लिक करें या बाईं तरफ अपना विषय लिखकर नई स्क्रिप्ट बनाएं।',
    maleVoiceTag: 'आदमी की आवाज़',
    femaleVoiceTag: 'औरत की आवाज़',
    visualDirectionTitle: 'विज़ुअल्स डायरेक्शन (क्या दिखेगा)',
    cameraFramingTitle: 'कैमरा और स्क्रीन फ्रेमिंग',
    bRollTitle: 'बी-रोल / ग्राफिक्स (B-Roll)',
    screenTextTitle: 'स्क्रीन पर लिखा टेक्स्ट (Overlay)',
    sfxMusicTitle: 'साउंड इफेक्ट व म्यूज़िक (SFX)',
    voicePlacementTitle: 'आवाज़ का निर्देश (कहां व कैसे बोलें)',
    previewAudioBtn: 'आवाज़ सुनें',
    loadingAudioBtn: 'ऑडियो बन रहा है...',
    stopAudioBtn: 'रोकें',
    listenFullScriptBtn: 'पूरी स्क्रिप्ट सुनें',
    loadingFullScriptBtn: 'स्क्रिप्ट ऑडियो बन रहा है...',
    stopFullScriptBtn: 'स्क्रिप्ट रोकें',
    editCtaBtn: 'CTA बदलें',
    applyCtaBtn: 'स्क्रिप्ट में लागू करें',
    resetDefaultCtaBtn: 'डिफ़ॉल्ट CTA',
    instructScriptBtn: 'स्क्रिप्ट को निर्देश दें (AI)',
    applyInstructionBtn: 'निर्देश लागू करें',
    refineSceneBtn: 'सीन सुधारें (AI)',
    addSceneBtn: 'नया सीन जोड़ें',
    saveScriptBtn: 'स्क्रिप्ट सेव करें',
    savedToast: 'सेव हो गई',
    copyScriptBtn: 'पूरी स्क्रिप्ट कॉपी करें',
    copyDialogueBtn: 'सिर्फ बोलने के डायलॉग कॉपी करें',
    viewPlainTextBtn: 'टेक्स्ट बॉक्स में देखें',
    copiedToast: 'कॉपी हो गई!',
    exportTxtBtn: 'TXT डाउनलोड',
    printPdfBtn: 'प्रिंट / PDF',
    teleprompterStart: 'स्क्रॉल शुरू करें',
    teleprompterPause: 'रोकें',
    teleprompterSpeed: 'स्पीड',
    savedEmptyTitle: 'अभी कोई स्क्रिप्ट सेव नहीं है',
    savedEmptyDesc:
      'जब आप कोई स्क्रिप्ट बनाएंगे और "स्क्रिप्ट सेव करें" दबाएंगे, तो वह यहां दिखाई देगी।',
    loadScriptBtn: 'एडिटर में खोलें',
    deleteScriptBtn: 'हटाएं',
    voiceSummaryTitle: 'आदमी और औरत की आवाज़ कहां देनी है (Voice Map)',
    thumbnailTitle: 'थंबनेल आइडिया',
    bgmTitle: 'बैकग्राउंड म्यूज़िक (BGM)',
    editModeHint: 'किसी भी डायलॉग, विज़ुअल या स्पीकर (आदमी/औरत) को सीधे क्लिक करके बदल सकते हैं।',
  },
  en: {
    brand: 'Patkatha Studio',
    navStudio: 'Script Studio',
    navStoryboard: 'Storyboard',
    navTeleprompter: 'Teleprompter',
    navSaved: 'Saved Scripts',
    newScriptBtn: 'New Script',
    studioHeading: 'Complete Video Script & Direction Studio',
    studioSubheading:
      'Generate production-ready YouTube Short (9:16) and Long-Form (16:9) scripts with visual direction, camera framing, and Male/Female voice placement.',
    topicLabel: 'Video Topic / Idea',
    topicPlaceholder:
      'e.g., How phone addiction affects focus, or SIP vs FD conversation between two co-hosts...',
    customInstructionsLabel: 'Your Custom Instructions (How you want it)',
    customInstructionsPlaceholder:
      'e.g., Start with a shocking question, use simple everyday Hindi, keep dialogues punchy, add an emotional twist in Scene 3...',
    screenSizeLabel: 'Screen Size (YouTube Format)',
    shortVideoLabel: 'YouTube Vertical (9:16)',
    shortVideoSpec: 'Vertical · 1080×1920 · 30s – 15 min',
    longVideoLabel: 'YouTube Landscape (16:9)',
    longVideoSpec: 'Landscape · 1920×1080 · 30s – 15 min',
    formatLabel: 'Conversation Format',
    twoPersonLabel: 'Two-Person Dialogue',
    twoPersonDesc: 'Podcast / Debate / Co-hosts',
    soloLabel: 'Solo Monologue',
    soloDesc: 'Single Host / Talking Head',
    explainerLabel: 'Visual Explainer',
    explainerDesc: 'Voiceover / Documentary',
    songVideoLabel: '9:16 Song / Music Video',
    songVideoDesc: 'Lyrics, beat cues, male/female duet & visual story',
    photoUploadLabel: 'Generate Script from Photos',
    photoUploadHint:
      'Upload 1–4 reference photos (scene, product, or cast) — works even without a text prompt',
    photoUploadBtn: 'Add Photos',
    photoTopicOptionalHint: 'Photo attached — topic text is optional',
    openingIntroLabel: 'Opening CTA (Start of Script)',
    openingIntroHint: 'Spoken first at 00:00 in Scene 1 before the main hook',
    closingOutroLabel: 'Closing CTA (End of Script)',
    closingOutroHint: 'Spoken last in the final scene to close the video',
    voicePlanLabel: 'Voice Allocation (Male / Female)',
    dualVoiceLabel: 'Male + Female Dual Voice',
    dualVoiceDesc: 'Specifies exactly where Male vs Female speaks',
    maleOnlyLabel: 'Male Voice Only',
    maleOnlyDesc: 'Full script delivered by Male host/narrator',
    femaleOnlyLabel: 'Female Voice Only',
    femaleOnlyDesc: 'Full script delivered by Female host/narrator',
    scriptLanguageLabel: 'Script Language',
    durationLabel: 'Target Length',
    toneLabel: 'Delivery Tone',
    speakerNamesLabel: 'Speaker Names (Optional)',
    maleNameLabel: 'Male Speaker',
    femaleNameLabel: 'Female Speaker',
    generateBtn: 'Generate Full Script',
    generatingBtn: 'Writing script & visual cues...',
    starterTitle: 'Ready-to-Inspect Examples (1-Click)',
    starterSubtitle:
      'Inspect a complete production breakdown below or enter your own topic on the left to generate a new script.',
    maleVoiceTag: 'Male Voice',
    femaleVoiceTag: 'Female Voice',
    visualDirectionTitle: 'Visual Direction (What Appears)',
    cameraFramingTitle: 'Camera & Screen Framing',
    bRollTitle: 'B-Roll / Motion Graphics',
    screenTextTitle: 'On-Screen Text Overlay',
    sfxMusicTitle: 'SFX & Music Cue',
    voicePlacementTitle: 'Voice Placement & Delivery Cue',
    previewAudioBtn: 'Hear Voice',
    loadingAudioBtn: 'Generating audio...',
    stopAudioBtn: 'Stop',
    listenFullScriptBtn: 'Listen Full Script',
    loadingFullScriptBtn: 'Preparing full audio...',
    stopFullScriptBtn: 'Stop Script',
    editCtaBtn: 'Edit CTA',
    applyCtaBtn: 'Apply CTA to Script',
    resetDefaultCtaBtn: 'Reset Default',
    instructScriptBtn: 'Instruct Script (AI)',
    applyInstructionBtn: 'Apply Instruction',
    refineSceneBtn: 'Refine Scene',
    addSceneBtn: 'Add Scene',
    saveScriptBtn: 'Save Script',
    savedToast: 'Saved',
    copyScriptBtn: 'Copy Full Script',
    copyDialogueBtn: 'Copy Dialogue Only',
    viewPlainTextBtn: 'View Plain Text',
    copiedToast: 'Copied!',
    exportTxtBtn: 'Export TXT',
    printPdfBtn: 'Print / PDF',
    teleprompterStart: 'Start Scroll',
    teleprompterPause: 'Pause',
    teleprompterSpeed: 'Speed',
    savedEmptyTitle: 'No saved scripts yet',
    savedEmptyDesc:
      'Generate or customize a script and click "Save Script" to keep it in your local studio library.',
    loadScriptBtn: 'Open in Studio',
    deleteScriptBtn: 'Delete',
    voiceSummaryTitle: 'Male & Female Voice Placement Plan',
    thumbnailTitle: 'Thumbnail Concept',
    bgmTitle: 'Background Music',
    editModeHint: 'Click any dialogue line, visual cue, or Male/Female voice assignment to edit directly.',
  },
};
