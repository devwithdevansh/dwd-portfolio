import React, { createContext, useState, useContext } from 'react';

// A lightweight dictionary for our primary wow-factor phrases.
// In a production environment, this would be an external JSON file or i18n library.
const DICTIONARY = {
  'EN': {
    'DOMINATE': 'DOMINATE',
    'WE HATE TEMPLATES.': 'WE HATE TEMPLATES.',
    'WE BUILD CUSTOM ASSETS.': 'WE BUILD CUSTOM ASSETS.',
    'WHAT WE DO': 'WHAT WE DO',
    'OUR WORK': 'OUR WORK',
    'THE BRAINS': 'THE BRAINS',
    "LET'S TALK": "LET'S TALK",
    'Web Development': 'Web Development',
    'Mobile Apps': 'Mobile Apps',
    'Automations': 'Automations',
    'Branding': 'Branding',
    'HOME': 'HOME',
    'SERVICES': 'SERVICES',
    'WORK': 'WORK',
    'ABOUT': 'ABOUT',
    'CONTACT': 'CONTACT'
  },
  'HI': { // Hindi (हिंदी)
    'DOMINATE': 'हावी हों',
    'WE HATE TEMPLATES.': 'हम टेम्प्लेट से नफरत करते हैं।',
    'WE BUILD CUSTOM ASSETS.': 'हम कस्टम एसेट बनाते हैं।',
    'WHAT WE DO': 'हम क्या करते हैं',
    'OUR WORK': 'हमारा काम',
    'THE BRAINS': 'दिमाग',
    "LET'S TALK": 'आइए बात करें',
    'Web Development': 'वेब विकास',
    'Mobile Apps': 'मोबाइल ऐप्स',
    'Automations': 'स्वचालन',
    'Branding': 'ब्रांडिंग',
    'HOME': 'होम',
    'SERVICES': 'सेवाएं',
    'WORK': 'कार्य',
    'ABOUT': 'हमारे बारे में',
    'CONTACT': 'संपर्क करें'
  },
  'GU': { // Gujarati (ગુજરાતી)
    'DOMINATE': 'પ્રભુત્વ મેળવો',
    'WE HATE TEMPLATES.': 'અમને ટેમ્પ્લેટ્સ નફરત છે.',
    'WE BUILD CUSTOM ASSETS.': 'અમે કસ્ટમ અસેટ્સ બનાવીએ છીએ.',
    'WHAT WE DO': 'અમે શું કરીએ છીએ',
    'OUR WORK': 'અમારું કામ',
    'THE BRAINS': 'મગજ',
    "LET'S TALK": 'ચાલો વાત કરીએ',
    'Web Development': 'વેબ ડેવલપમેન્ટ',
    'Mobile Apps': 'મોબાઇલ એપ્લિકેશન્સ',
    'Automations': 'ઓટોમેશન',
    'Branding': 'બ્રાન્ડિંગ',
    'HOME': 'હોમ',
    'SERVICES': 'સેવાઓ',
    'WORK': 'કામ',
    'ABOUT': 'અમારા વિશે',
    'CONTACT': 'સંપર્ક કરો'
  },
  'MR': { // Marathi (मराठी)
    'DOMINATE': 'वर्चस्व गाजवा',
    'WE HATE TEMPLATES.': 'आम्हाला टेम्पलेट्सचा तिरस्कार आहे.',
    'WE BUILD CUSTOM ASSETS.': 'आम्ही सानुकूल मालमत्ता तयार करतो.',
    'WHAT WE DO': 'आम्ही काय करतो',
    'OUR WORK': 'आमचे काम',
    'THE BRAINS': 'मेंदू',
    "LET'S TALK": 'चला बोलूया',
    'HOME': 'होम',
    'SERVICES': 'सेवा',
    'WORK': 'काम',
    'ABOUT': 'आमच्याबद्दल',
    'CONTACT': 'संपर्क'
  },
  'BN': { // Bengali (বাংলা)
    'DOMINATE': 'আধিপত্য বিস্তার করুন',
    'WE HATE TEMPLATES.': 'আমরা টেমপ্লেট ঘৃণা করি।',
    'WE BUILD CUSTOM ASSETS.': 'আমরা কাস্টম সম্পদ তৈরি করি।',
    'WHAT WE DO': 'আমরা যা করি',
    'OUR WORK': 'আমাদের কাজ',
    'THE BRAINS': 'মস্তিষ্ক',
    "LET'S TALK": 'আসুন কথা বলি',
    'HOME': 'হোম',
    'SERVICES': 'পরিষেবা',
    'WORK': 'কাজ',
    'ABOUT': 'আমাদের সম্পর্কে',
    'CONTACT': 'যোগাযোগ'
  },
  'TA': { // Tamil (தமிழ்)
    'DOMINATE': 'ஆதிக்கம் செலுத்துங்கள்',
    'WE HATE TEMPLATES.': 'நாங்கள் வார்ப்புருக்களை வெறுக்கிறோம்.',
    'WE BUILD CUSTOM ASSETS.': 'நாங்கள் தனிப்பயன் சொத்துக்களை உருவாக்குகிறோம்.',
    'WHAT WE DO': 'நாங்கள் என்ன செய்கிறோம்',
    'OUR WORK': 'எங்கள் வேலை',
    'THE BRAINS': 'மூளை',
    "LET'S TALK": 'பேசுவோம்',
    'HOME': 'முகப்பு',
    'SERVICES': 'சேவைகள்',
    'WORK': 'வேலை',
    'ABOUT': 'எங்களை பற்றி',
    'CONTACT': 'தொடர்பு'
  },
  'TE': { // Telugu (తెలుగు)
    'DOMINATE': 'ఆధిపత్యం చెలాయించండి',
    'WE HATE TEMPLATES.': 'మేము టెంప్లేట్‌లను ద్వేషిస్తాము.',
    'WE BUILD CUSTOM ASSETS.': 'మేము కస్టమ్ ఆస్తులను నిర్మిస్తాము.',
    'WHAT WE DO': 'మేము ఏమి చేస్తాము',
    'OUR WORK': 'మా పని',
    'THE BRAINS': 'మెదడు',
    "LET'S TALK": 'మాట్లాడుకుందాం',
    'HOME': 'హోమ్',
    'SERVICES': 'సేవలు',
    'WORK': 'పని',
    'ABOUT': 'మా గురించి',
    'CONTACT': 'సంప్రదించండి'
  },
  'KN': { // Kannada (ಕನ್ನಡ)
    'DOMINATE': 'ಪ್ರಾಬಲ್ಯ ಸಾಧಿಸಿ',
    'WE HATE TEMPLATES.': 'ನಾವು ಟೆಂಪ್ಲೆಟ್ಗಳನ್ನು ದ್ವೇಷಿಸುತ್ತೇವೆ.',
    'WE BUILD CUSTOM ASSETS.': 'ನಾವು ಕಸ್ಟಮ್ ಆಸ್ತಿಗಳನ್ನು ನಿರ್ಮಿಸುತ್ತೇವೆ.',
    'WHAT WE DO': 'ನಾವು ಏನು ಮಾಡುತ್ತೇವೆ',
    'OUR WORK': 'ನಮ್ಮ ಕೆಲಸ',
    'THE BRAINS': 'ಮೆದುಳು',
    "LET'S TALK": 'ಮಾತನಾಡೋಣ',
    'HOME': 'ಮುಖಪುಟ',
    'SERVICES': 'ಸೇವೆಗಳು',
    'WORK': 'ಕೆಲಸ',
    'ABOUT': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'CONTACT': 'ಸಂಪರ್ಕಿಸಿ'
  }
};

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState('EN');

  const translate = (key) => {
    if (!DICTIONARY[language]) return key;
    return DICTIONARY[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate, languages: Object.keys(DICTIONARY) }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
