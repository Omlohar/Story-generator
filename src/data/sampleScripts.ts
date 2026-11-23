import { ProductionScript } from '../types/script';

export const SAMPLE_SCRIPTS: ProductionScript[] = [
  {
    id: 'sample-short-two-person',
    createdAt: '2026-11-21T10:00:00Z',
    topic: 'क्या रात को 10 बजे के बाद चाय पीना सही है? (दो जनों की बातचीत - Short 9:16)',
    title: 'रात की चाय: आदत या नींद का दुश्मन?',
    hookSummary:
      'पहले 3 सेकंड में आदमी चाय का कप लेकर चौंकाने वाला सवाल पूछता है, और औरत वैज्ञानिक कारण बताती है।',
    screenFormat: 'short_9_16',
    aspectRatioLabel: '9:16 Vertical (YouTube Short)',
    resolutionSpec: '1080 × 1920 px · Safe Zone Center 70%',
    conversationMode: 'two_person',
    voicePlan: 'dual_male_female',
    scriptLanguage: 'hindi',
    estimatedDurationSec: 42,
    voiceAllocationSummary:
      'शुरुआती हुक (00:00–00:06) और आम दर्शक के सवाल में आदमी की आवाज़ (रोहन) रहेगी ताकि दर्शक जुड़ाव महसूस करे। वैज्ञानिक तथ्य, नींद के डेटा और समाधान में औरत की आवाज़ (अनन्या) रहेगी ताकि बात स्पष्ट और भरोसेमंद लगे।',
    maleVoiceRole: 'रोहन — जिज्ञासु दोस्त, हल्का और तेज़ अंदाज़ (Hook व सवाल)',
    femaleVoiceRole: 'अनन्या — हेल्थ एक्सपर्ट, शांत और सटीक आवाज़ (तथ्य व समाधान)',
    thumbnailConcept:
      '9:16 वर्टिकल फ्रेम के बीच में धुआं निकलता चाय का कप, ऊपर लाल अक्षरों में "रात 10 बजे की चाय?" और नीचे घड़ी का आइकन।',
    bgmStyle: 'तेज़ Lo-Fi बीट (हुक में सस्पेंस टिक-टॉक, जवाब में क्लीन मॉडर्न पल्स)',
    scenes: [
      {
        id: 'sc-1',
        sceneNumber: 1,
        sectionLabel: '0–5s Hook',
        timestampStart: '00:00',
        timestampEnd: '00:05',
        durationSeconds: 5,
        cameraFraming: 'Close-Up (CU) · Vertical 9:16 Center Safe-Zone',
        shotType: 'Close-Up',
        visualDirection:
          'किचन काउंटर पर रात की हल्की वॉर्म लाइट। रोहन हाथ में गरम चाय का कप उठाकर कैमरे के ठीक सामने देखता है, अचानक अनन्या फ्रेम में हाथ बढ़ाकर कप रोकती है।',
        bRollCue: 'तेज़ ज़ूम-इन इफ़ेक्ट (100% से 115%) जब कप चेहरे के पास आता है।',
        screenOverlayText: 'रात 10 बजे चाय पीना खतरनाक है?',
        overlayPosition: 'top',
        sfxAndMusicCue: 'कप रखने की आवाज़ + तेज़ Whoosh + सस्पेंस ड्रम हिट',
        lines: [
          {
            id: 'ln-0',
            speakerGender: 'male',
            speakerName: 'रोहन (आदमी)',
            voiceCue: 'शुरुआती चैनल CTA — वीडियो चालू होते ही सबसे पहले लाइक, शेयर, कमेंट और Crazy Dot\'s फॉलो के लिए बोलें।',
            deliveryTone: 'गर्मजोशी भरा और तेज़',
            dialogue:
              "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!",
          },
          {
            id: 'ln-1',
            speakerGender: 'male',
            speakerName: 'रोहन (आदमी)',
            voiceCue: 'आदमी की आवाज़ — शुरुआत में चौंकाने और दर्शक को रोकने के लिए तेज़, आम बोलचाल का लहज़ा।',
            deliveryTone: 'चौंकाने वाला और तेज़',
            dialogue: 'रात के 10 बजे एक कप चाय पी लेने से भला क्या बिगड़ जाएगा?',
          },
          {
            id: 'ln-2',
            speakerGender: 'female',
            speakerName: 'अनन्या (औरत)',
            voiceCue: 'औरत की आवाज़ — तुरंत एंट्री करके हुक को पलटने के लिए आत्मविश्वास से भरी आवाज़।',
            deliveryTone: 'सटीक और गंभीर',
            dialogue: 'यही एक कप आपकी अगली 6 घंटे की गहरी नींद बर्बाद कर रहा है!',
          },
        ],
      },
      {
        id: 'sc-2',
        sceneNumber: 2,
        sectionLabel: 'साइंस एक्सप्लेनर',
        timestampStart: '00:05',
        timestampEnd: '00:24',
        durationSeconds: 19,
        cameraFraming: 'Vertical Split-Screen (ऊपर अनन्या, नीचे ग्राफिक)',
        shotType: 'Split-Screen',
        visualDirection:
          'फ्रेम दो हिस्सों में बंटता है: ऊपर वाले 50% में अनन्या बात कर रही हैं, नीचे वाले 50% में दिमाग और कैफीन का सिंपल एनिमेशन चलता है।',
        bRollCue: 'मोशन ग्राफिक: चाय के कप से निकलता कैफीन और घड़ी पर 6 घंटे का टाइमर।',
        screenOverlayText: 'कैफीन का असर: 6 से 8 घंटे तक रहता है',
        overlayPosition: 'center',
        sfxAndMusicCue: 'पॉप साउंड (टेक्स्ट आने पर) + हल्की टिक-टॉक बीट',
        lines: [
          {
            id: 'ln-3',
            speakerGender: 'female',
            speakerName: 'अनन्या (औरत)',
            voiceCue: 'औरत की आवाज़ — मुख्य जानकारी स्पष्ट और आसान शब्दों में समझाने के लिए।',
            deliveryTone: 'स्पष्ट और समझाने वाला अंदाज़',
            dialogue:
              'चाय में मौजूद कैफीन की हाफ-लाइफ करीब 5 से 6 घंटे होती है। यानी रात 10 बजे की चाय का आधा असर सुबह 4 बजे तक आपके दिमाग को जगाए रखता है।',
          },
          {
            id: 'ln-4',
            speakerGender: 'male',
            speakerName: 'रोहन (आदमी)',
            voiceCue: 'आदमी की आवाज़ — दर्शक के मन का संदेह पूछने के लिए बीच में छोटा काउंटर सवाल।',
            deliveryTone: 'जिज्ञासु और हल्का हैरान',
            dialogue: 'पर मुझे तो चाय पीकर भी तुरंत नींद आ जाती है!',
          },
        ],
      },
      {
        id: 'sc-3',
        sceneNumber: 3,
        sectionLabel: 'असली सच व उपाय',
        timestampStart: '00:24',
        timestampEnd: '00:42',
        durationSeconds: 18,
        cameraFraming: 'Two-Shot Medium · Vertical 9:16',
        shotType: 'Medium Shot',
        visualDirection:
          'दोनों साथ में फ्रेम में आते हैं। रोहन चाय का कप साइड में रखता है और अनन्या कैमोमाइल या गर्म हल्दी दूध का कप आगे करती हैं।',
        bRollCue: 'नींद के दो ग्राफ: गहरी नींद बनाम टूटी हुई नींद (लाल बनाम हरा रंग)।',
        screenOverlayText: 'शाम 5 बजे के बाद कैफीन बंद करें',
        overlayPosition: 'bottom-third',
        sfxAndMusicCue: 'पॉज़िटिव चिमे साउंड + अपलिफ्टिंग बीट आउट्रो',
        lines: [
          {
            id: 'ln-5',
            speakerGender: 'female',
            speakerName: 'अनन्या (औरत)',
            voiceCue: 'औरत की आवाज़ — निर्णायक सलाह और मुख्य टेकअवे देने के लिए।',
            deliveryTone: 'भरोसेमंद और गर्मजोशी भरा',
            dialogue:
              'आंखें बंद हो जाती हैं, लेकिन दिमाग डीप स्लीप में नहीं जा पाता। इसलिए आखिरी चाय शाम 5 बजे से पहले रखें, और रात में हर्बल टी चुनें।',
          },
          {
            id: 'ln-6',
            speakerGender: 'male',
            speakerName: 'रोहन (आदमी)',
            voiceCue: 'आदमी की आवाज़ — हल्के-फुल्के अंदाज़ में सवाल पूछने के लिए।',
            deliveryTone: 'मुस्कुराते हुए, तेज़ CTA',
            dialogue: 'समझ गया! आप आखिरी चाय कितने बजे पीते हैं? नीचे कमेंट में बताइए!',
          },
          {
            id: 'ln-outro',
            speakerGender: 'female',
            speakerName: 'अनन्या (औरत)',
            voiceCue: 'आखिरी चैनल CTA (पीछे) — वीडियो के अंत में लाइक, शेयर, कमेंट और Crazy Dot\'s फॉलो बोलने के लिए।',
            deliveryTone: 'गर्मजोशी भरा और तेज़',
            dialogue:
              "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!",
          },
        ],
      },
    ],
  },
  {
    id: 'sample-long-explainer',
    createdAt: '2026-11-21T10:15:00Z',
    topic: 'UPI भारत में कैश से आगे कैसे निकला? (Long Video 16:9 Explainer)',
    title: 'UPI की कहानी: भारत का डिजिटल पेमेंट चमत्कार',
    hookSummary:
      'चाय की टपरी से लेकर लंदन तक — 16:9 वाइडस्क्रीन डॉक्यूमेंट्री स्टाइल एक्सप्लेनर जिसमें आदमी और औरत बारी-बारी से कहानी व डेटा समझाते हैं।',
    screenFormat: 'long_16_9',
    aspectRatioLabel: '16:9 Widescreen (YouTube Long)',
    resolutionSpec: '1920 × 1080 px (Full HD) · Lower-Third Safe',
    conversationMode: 'explainer',
    voicePlan: 'dual_male_female',
    scriptLanguage: 'hindi',
    estimatedDurationSec: 210,
    voiceAllocationSummary:
      'यह 16:9 डॉक्यूमेंट्री एक्सप्लेनर है: आदमी की आवाज़ (कबीर) स्टोरीटेलिंग और ऐतिहासिक घटनाएं सुनाती है, जबकि औरत की आवाज़ (काव्या) टेक्निकल आर्किटेक्चर, नंबर और डेटा ग्राफिक्स को तोड़कर समझाती है।',
    maleVoiceRole: 'कबीर — गहरी, सिनेमाई स्टोरीटेलर आवाज़ (इतिहास व सीन नैरेशन)',
    femaleVoiceRole: 'काव्या — क्रिस्प एनालिटिकल आवाज़ (डेटा, ग्राफ व टेक्नोलॉजी)',
    thumbnailConcept:
      '16:9 वाइड थंबनेल: बाईं तरफ पुराने फटे नोट, दाईं तरफ चमकता हुआ QR कोड और "₹0 फीस का सीक्रेट" बड़े पीले अक्षरों में।',
    bgmStyle: 'सिनेमाई डॉक्यूमेंट्री पियानो + मॉडर्न इलेक्ट्रॉनिक टेक पल्स',
    scenes: [
      {
        id: 'ex-1',
        sceneNumber: 1,
        sectionLabel: 'Chapter 1: The Hook',
        timestampStart: '00:00',
        timestampEnd: '00:35',
        durationSeconds: 35,
        cameraFraming: 'Wide Establishing Shot (16:9) -> Slow Dolly-In',
        shotType: 'Wide',
        visualDirection:
          'सुबह की भीड़-भाड़ वाली भारतीय मार्केट का स्लो-मोशन फुटेज। एक सब्ज़ी वाला ग्राहक को 2 सेकंड में QR कोड स्कैन करवाता है। फिर कट होकर स्टाइलिस्ट स्टूडियो मैप आता है।',
        bRollCue: 'दुनिया का नक्शा ज़ूम होता है और भारत पर ग्लोइंग डेटा पल्स दिखती है।',
        screenOverlayText: 'दुनिया के 46% रियल-टाइम डिजिटल पेमेंट भारत में',
        overlayPosition: 'bottom-third',
        sfxAndMusicCue: 'QR बीप साउंड + सिनेमाई बास ड्रॉप',
        lines: [
          {
            id: 'ex-l0',
            speakerGender: 'male',
            speakerName: 'कबीर (आदमी VO)',
            voiceCue: 'शुरुआती चैनल CTA — वीडियो चालू होते ही सबसे पहले लाइक, शेयर, कमेंट और Crazy Dot\'s फॉलो के लिए बोलें।',
            deliveryTone: 'आमंत्रण भरा और स्पष्ट',
            dialogue:
              "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!",
          },
          {
            id: 'ex-l1',
            speakerGender: 'male',
            speakerName: 'कबीर (आदमी VO)',
            voiceCue: 'आदमी की आवाज़ — वीडियो की शुरुआत में गंभीर और सिनेमाई माहौल बनाने के लिए।',
            deliveryTone: 'गहरी, धीमी और प्रभावशाली',
            dialogue:
              '2016 से पहले भारत में ₹10 की चाय के लिए भी छुट्टे पैसों की बहस होती थी। आज वही दुकानदार बिना किसी कार्ड मशीन के सेकंडों में पेमेंट लेता है।',
          },
          {
            id: 'ex-l2',
            speakerGender: 'female',
            speakerName: 'काव्या (औरत VO)',
            voiceCue: 'औरत की आवाज़ — चौंकाने वाले आंकड़े और सवाल सामने रखने के लिए।',
            deliveryTone: 'स्पष्ट, तेज़ और डेटा-फोकस्ड',
            dialogue:
              'हर महीने 14 अरब से ज़्यादा ट्रांज़ैक्शन — आखिर अमेरिका और यूरोप के बैंक भी जो नहीं कर पाए, वह भारत के UPI ने ₹0 फीस में कैसे कर दिखाया?',
          },
        ],
      },
      {
        id: 'ex-2',
        sceneNumber: 2,
        sectionLabel: 'Chapter 2: पुरानी समस्या',
        timestampStart: '00:35',
        timestampEnd: '01:30',
        durationSeconds: 55,
        cameraFraming: '16:9 Motion Graphic Canvas · Rule of Thirds',
        shotType: 'B-Roll / Graphic',
        visualDirection:
          'स्क्रीन के बाईं तरफ पुराने बैंक फॉर्म, IFSC कोड और कार्ड स्वाइप मशीन के विज़ुअल्स। दाईं तरफ एक साफ व्हाइटबोर्ड एनिमेशन दिखता है कि पहले पैसे भेजने में 4 स्टेप्स क्यों लगते थे।',
        bRollCue: '2D एनिमेशन: बैंक A -> क्लियरिंग हाउस -> कार्ड नेटवर्क -> बैंक B।',
        screenOverlayText: '2015: NEFT में घंटे, कार्ड पर 2% MDR चार्ज',
        overlayPosition: 'bottom-third',
        sfxAndMusicCue: 'टाइपराइटर क्लिक + पुरानी घड़ी की टिक-टिक',
        lines: [
          {
            id: 'ex-l3',
            speakerGender: 'male',
            speakerName: 'कबीर (आदमी VO)',
            voiceCue: 'आदमी की आवाज़ — पुरानी परेशानी का अनुभव कहानी की तरह बताने के लिए।',
            deliveryTone: 'कथात्मक और सहज',
            dialogue:
              'तब कार्ड स्वाइप करने पर दुकानदार को 2% तक कमीशन देना पड़ता था। छोटे व्यापारी के लिए यह मुनाफे का बड़ा हिस्सा था।',
          },
        ],
      },
      {
        id: 'ex-3',
        sceneNumber: 3,
        sectionLabel: 'Chapter 3: NPCI का मास्टरस्ट्रोक',
        timestampStart: '01:30',
        timestampEnd: '03:30',
        durationSeconds: 120,
        cameraFraming: '16:9 Clean Diagram + Picture-in-Picture Host',
        shotType: 'Medium Shot',
        visualDirection:
          'स्क्रीन पर तीन लेयर का आर्किटेक्चर खुलता है: आधार, जन-धन और UPI लेयर। नीचे कोने में होस्ट ग्राफिक की ओर इशारा करता है।',
        bRollCue: 'JAM Trinity (Jan Dhan + Aadhaar + Mobile) का क्लीन 16:9 इंफोग्राफिक।',
        screenOverlayText: 'ओपन API: कोई भी ऐप, कोई भी बैंक — एक जैसा सिस्टम',
        overlayPosition: 'bottom-third',
        sfxAndMusicCue: 'मॉडर्न सिंथ पल्स + क्रिस्प ट्रांजिशन हुक',
        lines: [
          {
            id: 'ex-l4',
            speakerGender: 'female',
            speakerName: 'काव्या (औरत VO)',
            voiceCue: 'औरत की आवाज़ — टेक्निकल सिस्टम (API व बैंक लेयर) को सरल भाषा में समझाने के लिए।',
            deliveryTone: 'ऊर्जावान और स्पष्ट',
            dialogue:
              'NPCI ने किसी एक कंपनी का ऐप नहीं बनाया, बल्कि एक ओपन हाईवे बना दिया। फोनपे, गूगल पे या पेटीएम — सब इसी एक सरकारी डिजिटल पाइपलाइन पर चलते हैं।',
          },
          {
            id: 'ex-l5',
            speakerGender: 'male',
            speakerName: 'कबीर (आदमी VO)',
            voiceCue: 'आदमी की आवाज़ — वीडियो के निष्कर्ष और दर्शक से जुड़ने के लिए।',
            deliveryTone: 'गर्मजोशी भरा और प्रेरक',
            dialogue:
              'यही वजह है कि आज सिंगापुर से फ्रांस तक UPI पहुंच रहा है। अगली वीडियो में हम जानेंगे कि बिना इंटरनेट UPI कैसे काम करता है!',
          },
          {
            id: 'ex-outro',
            speakerGender: 'female',
            speakerName: 'काव्या (औरत VO)',
            voiceCue: 'आखिरी चैनल CTA (पीछे) — वीडियो समाप्त करते समय लाइक, शेयर, कमेंट और Crazy Dot\'s फॉलो के लिए।',
            deliveryTone: 'स्पष्ट और आमंत्रण भरा',
            dialogue:
              "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!",
          },
        ],
      },
    ],
  },
  {
    id: 'sample-short-solo',
    createdAt: '2026-11-21T10:30:00Z',
    topic: 'सुबह के पहले 30 मिनट बिना फोन के रहने के 3 फायदे (Solo Short 9:16)',
    title: 'सुबह उठते ही फोन छूना बंद करें',
    hookSummary:
      'अकेले क्रिएटर के लिए तेज़ रफ़्तार 9:16 टॉकिंग-हेड शॉर्ट स्क्रिप्ट, जंप कट्स और क्लोज़-अप विज़ुअल्स के साथ।',
    screenFormat: 'short_9_16',
    aspectRatioLabel: '9:16 Vertical (YouTube Short)',
    resolutionSpec: '1080 × 1920 px · Eye-Level Framing',
    conversationMode: 'solo',
    voicePlan: 'female_only',
    scriptLanguage: 'hinglish',
    estimatedDurationSec: 38,
    voiceAllocationSummary:
      'सोलो होस्ट वीडियो होने के कारण पूरी स्क्रिप्ट में औरत की आवाज़ (रिया) मुख्य कैमरे के सामने बोलती है — शुरुआती 4 सेकंड में धीमा और चौंकाने वाला लहज़ा, बीच के 3 पॉइंट्स में तेज़ एनर्जी।',
    maleVoiceRole: 'उपयोग नहीं (सोलो फीमेल होस्ट)',
    femaleVoiceRole: 'रिया — पूरी स्क्रिप्ट की एकमात्र होस्ट (ऊर्जावान और मित्रवत)',
    thumbnailConcept:
      '9:16 फ्रेम में हाथ में अलार्म घड़ी और धुंधला फोन बैकग्राउंड में, टेक्स्ट: "No Phone 30 Mins"',
    bgmStyle: 'मिनिमल मॉर्निंग अकॉस्टिक + सॉफ्ट स्नैप बीट',
    scenes: [
      {
        id: 'so-1',
        sceneNumber: 1,
        sectionLabel: '0–4s Hook',
        timestampStart: '00:00',
        timestampEnd: '00:04',
        durationSeconds: 4,
        cameraFraming: 'Tight Close-Up · 9:16 Vertical POV',
        shotType: 'POV',
        visualDirection:
          'सुबह की प्राकृतिक धूप खिड़की से आ रही है। कैमरा बेड के पास POV एंगल से शुरू होता है—हाथ फोन की तरफ बढ़ता है और रिया कैमरे में देखकर हाथ रोक देती हैं।',
        bRollCue: 'फोन स्क्रीन पर नोटिफिकेशन की बारिश का 1-सेकंड का B-Roll।',
        screenOverlayText: 'सुबह आंख खुलते ही फोन?',
        overlayPosition: 'top',
        sfxAndMusicCue: 'फोन वाइब्रेशन SFX + अचानक साइलेंस',
        lines: [
          {
            id: 'so-l0',
            speakerGender: 'female',
            speakerName: 'रिया (अकेली होस्ट)',
            voiceCue: 'शुरुआती चैनल CTA — स्क्रिप्ट चालू होते ही सबसे पहले बोलें।',
            deliveryTone: 'मित्रवत और ऊर्जावान',
            dialogue:
              "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!",
          },
          {
            id: 'so-l1',
            speakerGender: 'female',
            speakerName: 'रिया (अकेली होस्ट)',
            voiceCue: 'औरत की आवाज़ — सीधी आंखों में देखकर सवाल पूछने के लिए तेज़, पर्सनल टोन।',
            deliveryTone: 'सीधा और असरदार',
            dialogue:
              'अगर आप आंख खुलते ही सबसे पहले WhatsApp और Reels खोलते हैं, तो आपका पूरा दिन पहले 5 मिनट में ही हाईजैक हो चुका है।',
          },
        ],
      },
      {
        id: 'so-2',
        sceneNumber: 2,
        sectionLabel: '3 मुख्य बदलाव',
        timestampStart: '00:04',
        timestampEnd: '00:38',
        durationSeconds: 34,
        cameraFraming: 'Medium Shot -> Jump Cut Punch-In (9:16)',
        shotType: 'Medium Shot',
        visualDirection:
          'रिया बालकनी या डेस्क के पास खड़ी हैं। हर पॉइंट (1, 2, 3) पर कैमरा हल्का ज़ूम-इन होता है और बैकग्राउंड में पानी पीने व स्ट्रेचिंग का B-roll कट चलता है।',
        bRollCue: '1. ब्रेन वेव ग्राफिक (Alpha State), 2. कॉफी/पानी का गिलास, 3. टू-डू नोटबुक।',
        screenOverlayText: 'Rule: पहले 30 मिनट No-Screen',
        overlayPosition: 'center',
        sfxAndMusicCue: 'पॉइंट 1, 2, 3 पर पॉप साउंड + सॉफ्ट अपबीट लूप',
        lines: [
          {
            id: 'so-l2',
            speakerGender: 'female',
            speakerName: 'रिया (अकेली होस्ट)',
            voiceCue: 'औरत की आवाज़ — तीन नंबर वाले पॉइंट्स को लय में और तेज़ी से बोलने के लिए।',
            deliveryTone: 'ऊर्जावान और प्रेरक',
            dialogue:
              'सिर्फ 7 दिन सुबह के पहले 30 मिनट फोन दूर रखिए: नंबर 1—डोपामिन क्रैश नहीं होगा, नंबर 2—फोकस दोगुना होगा, और नंबर 3—बेवजह की एंग्जाइटी खत्म हो जाएगी।',
          },
          {
            id: 'so-outro',
            speakerGender: 'female',
            speakerName: 'रिया (अकेली होस्ट)',
            voiceCue: 'आखिरी चैनल CTA (पीछे) — वीडियो के अंत में लाइक, शेयर, कमेंट और Crazy Dot\'s फॉलो के लिए।',
            deliveryTone: 'मुस्कुराते हुए, तेज़ CTA',
            dialogue:
              "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!",
          },
        ],
      },
    ],
  },
  {
    id: 'sample-short-song-video',
    createdAt: '2026-11-22T00:05:00Z',
    topic: 'बारिश की शाम में दो दिलों की अनकही मुलाकात (9:16 सॉन्ग / म्यूज़िक वीडियो)',
    title: 'धुन: पहली बारिश और तुम (9:16 Song Reel)',
    hookSummary:
      'पहले 4 सेकंड में धीमी गिटार कॉर्ड के साथ बारिश की बूंदों का क्लोज़-अप, फिर 9:16 वर्टिकल फ्रेम में आदमी और औरत की युगल आवाज़ (Duet)।',
    screenFormat: 'short_9_16',
    aspectRatioLabel: '9:16 Vertical (Song / Music Video)',
    resolutionSpec: '1080 × 1920 px · Lyrical Safe-Zone Bottom-Center',
    conversationMode: 'song_video',
    voicePlan: 'dual_male_female',
    scriptLanguage: 'hindi',
    estimatedDurationSec: 54,
    voiceAllocationSummary:
      'यह 9:16 म्यूज़िक वीडियो स्क्रिप्ट है: मुखड़े (00:00–00:18) में आदमी की मुलायम आवाज़ माहौल बनाती है, पहले अंतरे (00:18–00:36) में औरत की भावनात्मक आवाज़ जवाब देती है, और आखिरी कोरस (00:36–00:54) में दोनों की आवाज़ एक साथ मिलती है।',
    maleVoiceRole: 'आरव (आदमी गायक) — गहरी, सॉफ्ट रोमांटिक आवाज़ (मुखड़ा व सोलो शॉट्स)',
    femaleVoiceRole: 'मीरा (औरत गायिका) — मीठी, भावपूर्ण आवाज़ (अंतरा व युगल कोरस)',
    thumbnailConcept:
      '9:16 फ्रेम में हल्की बारिश और गोल्डन स्ट्रीट लाइट के बीच दोनों का साइड-प्रोफाइल, बीच में बड़े अक्षरों में "धुन — पहली बारिश"।',
    bgmStyle: '92 BPM लो-फाई अकॉस्टिक गिटार + सॉफ्ट बारिश और तबला-किक बीट ड्रॉप',
    scenes: [
      {
        id: 'sg-1',
        sceneNumber: 1,
        sectionLabel: 'Intro & मुखड़ा (Male Vocal)',
        timestampStart: '00:00',
        timestampEnd: '00:18',
        durationSeconds: 18,
        cameraFraming: 'Slow-Motion Close-Up (60fps) · 9:16 Vertical',
        shotType: 'Close-Up',
        visualDirection:
          'कैफे की खिड़की के शीशे पर बारिश की बूंदें गिर रही हैं। आरव बाहर देखते हुए धीरे से गुनगुनाता है, कैमरा शीशे के पार से हल्का पुश-इन करता है।',
        bRollCue: 'गर्म चाय की भाप और स्ट्रीट लाइट की बुके (Bokeh) लाइट्स का 2-सेकंड कट।',
        screenOverlayText: 'भीगी शामों में तेरा ही नाम गुनगुनाते हैं...',
        overlayPosition: 'bottom-third',
        sfxAndMusicCue: 'हल्की बारिश SFX + अकॉस्टिक गिटार इंट्रो + 00:08 पर सॉफ्ट किक बीट',
        lines: [
          {
            id: 'sg-l0',
            speakerGender: 'male',
            speakerName: 'आरव (आदमी आवाज़)',
            voiceCue: 'शुरुआती चैनल CTA — वीडियो शुरू होते ही सबसे पहले यह पंक्ति बोलें।',
            deliveryTone: 'सॉफ्ट और आमंत्रण भरा',
            dialogue:
              "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!",
          },
          {
            id: 'sg-l1',
            speakerGender: 'male',
            speakerName: 'आरव (आदमी आवाज़)',
            voiceCue:
              'आदमी की आवाज़ — गाने के शुरुआती मुखड़े में मुलायम, गहरी और इंतजार भरी लय के लिए।',
            deliveryTone: 'मुलायम, धीमा और रोमांटिक',
            dialogue:
              'भीगी शामों में तेरा ही नाम गुनगुनाते हैं, हर बूंद में तेरी ही तस्वीर सजाते हैं।',
          },
        ],
      },
      {
        id: 'sg-2',
        sceneNumber: 2,
        sectionLabel: 'अंतरा (Female Vocal Entry)',
        timestampStart: '00:18',
        timestampEnd: '00:36',
        durationSeconds: 18,
        cameraFraming: 'Vertical Gimbal Orbit · 9:16 Medium Shot',
        shotType: 'Medium Shot',
        visualDirection:
          'मीरा छाता बंद करके कैफे के दरवाजे से अंदर आती हैं, वार्म गोल्डन लाइट चेहरे पर पड़ती है। कैमरा 180 डिग्री घूमकर मीरा के एक्सप्रेशन पकड़ता है।',
        bRollCue: 'हाथ से गिरती बारिश की बूंदों का स्लो-मोशन शॉट और दोनों की नजरें मिलने का कट।',
        screenOverlayText: 'चुपचाप ये हवा भी तेरा पैगाम लाई है...',
        overlayPosition: 'bottom-third',
        sfxAndMusicCue: 'दरवाज़े की हल्की घंटी + पियानो कॉर्ड्स + औरत के स्वर की एंट्री',
        lines: [
          {
            id: 'sg-l2',
            speakerGender: 'female',
            speakerName: 'मीरा (औरत आवाज़)',
            voiceCue:
              'औरत की आवाज़ — गाने के अंतरे में ताज़गी और भावनात्मक जवाब देने के लिए।',
            deliveryTone: 'मीठा, स्पष्ट और भावुक',
            dialogue:
              'चुपचाप ये हवा भी तेरा पैगाम लाई है, सालों बाद आज फिर वही मुस्कान आई है।',
          },
        ],
      },
      {
        id: 'sg-3',
        sceneNumber: 3,
        sectionLabel: 'Duet Chorus & Outro',
        timestampStart: '00:36',
        timestampEnd: '00:54',
        durationSeconds: 18,
        cameraFraming: 'Vertical Split-Screen -> Two-Shot Wide (9:16)',
        shotType: 'Split-Screen',
        visualDirection:
          'पहली 8 सेकंड स्क्रीन दो हिस्सों में बंटती है (ऊपर मीरा, नीचे आरव), फिर बीट ड्रॉप पर दोनों एक साथ छत या बालकनी की रोशनी में खड़े दिखते हैं और धीरे-धीरे फेड-आउट होता है।',
        bRollCue: 'गाने के बोल (Lyric Karaoke Wipe) स्क्रीन के निचले हिस्से में सिंक होते हैं।',
        screenOverlayText: 'अब जो मिले हैं तो ये धुन अधूरी न रहे...',
        overlayPosition: 'center',
        sfxAndMusicCue: 'फुल बीट ड्रॉप + स्ट्रिंग्स स्वेल + गिटार फेड-आउट',
        lines: [
          {
            id: 'sg-l3',
            speakerGender: 'male',
            speakerName: 'आरव (आदमी आवाज़)',
            voiceCue: 'आदमी की आवाज़ — कोरस की पहली पंक्ति को ऊंचे सुर में उठाने के लिए।',
            deliveryTone: 'ऊर्जावान और गहरा',
            dialogue: 'अब जो मिले हैं तो ये धुन अधूरी न रहे,',
          },
          {
            id: 'sg-l4',
            speakerGender: 'female',
            speakerName: 'मीरा (औरत आवाज़)',
            voiceCue: 'औरत की आवाज़ — तुरंत साथ जुड़कर गाने को यादगार अंत देने के लिए।',
            deliveryTone: 'हार्मनी में, गर्मजोशी भरा',
            dialogue: 'हर मौसम में बस तेरा ही साथ संग रहे।',
          },
          {
            id: 'sg-outro',
            speakerGender: 'female',
            speakerName: 'मीरा (औरत आवाज़)',
            voiceCue: 'आखिरी चैनल CTA (पीछे) — सॉन्ग वीडियो के अंत में लाइक, शेयर, कमेंट और Crazy Dot\'s फॉलो बोलने के लिए।',
            deliveryTone: 'सॉफ्ट और आमंत्रण भरा',
            dialogue:
              "हमारी वीडियो अच्छी लगे तो लाइक करें, वीडियो शेयर करें, कमेंट करें और Crazy Dot's को फॉलो करें!",
          },
        ],
      },
    ],
  },
];
