/**
 * SAKİ APP - Internationalization Module
 * TR/EN çeviri sistemi
 */

// Aktif dil
let currentLanguage = localStorage.getItem('saki-language') || 'tr';

// Dil değiştirme event'i
const languageChangeCallbacks = [];

/**
 * Mevcut dili döndürür
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * Dil değiştirir
 */
export function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('saki-language', lang);
  languageChangeCallbacks.forEach(cb => cb(lang));
}

/**
 * Dil değişikliğini dinler
 */
export function onLanguageChange(callback) {
  languageChangeCallbacks.push(callback);
}

/**
 * Çeviri döndürür
 */
export function t(key) {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return key; // Fallback to key
    }
  }
  
  return value;
}

/**
 * Kategori adını çevirir
 */
export function getCategoryName(id) {
  return t(`categories.${id}`) || id;
}

/**
 * Mood adını çevirir
 */
export function getMoodName(id) {
  return t(`moods.${id}`) || id;
}

/**
 * Tat profili adını çevirir
 */
export function getFlavorName(id) {
  return t(`flavors.${id}`) || id;
}

// Ana çeviri objesi
const translations = {
  tr: {
    // Genel
    app: {
      name: 'SAKİ APP',
      tagline: 'Mükemmel içkini bul'
    },
    
    // Anasayfa
    welcome: {
      title: 'SAKİ',
      subtitle: 'Damak tadına göre kişiselleştirilmiş öneriler',
      button: 'Bugün Ne İçelim?',
      howItWorks: 'Nasıl Çalışır?',
      howItWorksText: '3 basit soruya cevap ver, sana en uygun içkiyi bulalım. Ne kadar çok soru cevaplanırsa, öneri o kadar isabetli olur.'
    },
    
    // Adımlar
    steps: {
      step1: 'Adım 1/3',
      step2: 'Adım 2/3',
      step3: 'Adım 3/3',
      extra: 'Ek Soru'
    },
    
    // Ekran başlıkları
    screens: {
      type: {
        title: 'Ne İçmek İstersin?',
        subtitle: 'Ruhuna uygun olanı seç'
      },
      mood: {
        title: 'Nasıl Bir Ortam?',
        subtitle: 'Anının ruhunu yakala'
      },
      taste: {
        title: 'Damak Zevkin?',
        subtitle: 'Karakterini yansıtan tarzı seç'
      },
      extra: {
        title: 'Biraz Daha Bilgi',
        subtitle: 'Daha iyi öneri için yardımcı olur'
      },
      result: {
        title: 'Senin İçin Öneri',
        match: 'Eşleşme',
        whyThis: 'Neden bu öneri?',
        alternatives: 'Alternatifler',
        moreOptions: 'Daha Fazla Öneri',
        restart: 'Yeniden Başla',
        tapForDetails: 'Detay için dokun'
      }
    },
    
    // Butonlar
    buttons: {
      unsure: 'Emin Değilim',
      skip: 'Atla',
      back: 'Geri',
      next: 'Devam'
    },
    
    // Kategoriler
    categories: {
      raki: 'Rakı',
      whiskey: 'Viski',
      beer: 'Bira',
      vodka: 'Votka',
      gin: 'Cin',
      tequila: 'Tekila',
      wine: 'Şarap',
      other: 'Diğer'
    },
    
    // Mood'lar
    moods: {
      solo: 'Tek Başına',
      friends: 'Arkadaşlarla',
      romantic: 'Romantik',
      celebration: 'Kutlama',
      business: 'İş Yemeği'
    },
    
    moodDescriptions: {
      solo: 'Sakin bir akşam, kendi halinde',
      friends: 'Eğlenceli bir buluşma',
      romantic: 'Özel biri ile baş başa',
      celebration: 'Özel bir anı taçlandırmak için',
      business: 'Profesyonel ve sofistike'
    },
    
    // Tat profilleri
    flavors: {
      light: 'Hafif & Ferah',
      balanced: 'Dengeli',
      bold: 'Güçlü & Karakterli'
    },
    
    flavorDescriptions: {
      light: 'Taze, canlı, rahatlatıcı',
      balanced: 'Uyumlu, zarif, çok yönlü',
      bold: 'Yoğun, kompleks, akılda kalıcı'
    },
    
    // Ek sorular
    extraQuestions: {
      experience: {
        question: 'Bu kategoride deneyimin?',
        beginner: 'Yeni başlıyorum',
        casual: 'Ara sıra içerim',
        enthusiast: 'Meraklıyım'
      },
      strength: {
        question: 'Alkol gücü tercihin?',
        light: 'Hafif',
        medium: 'Orta',
        strong: 'Güçlü'
      }
    },
    
    // Eşleşme açıklamaları
    matchExplanation: {
      category: 'Seçtiğin kategori',
      mood: 'Ortam uyumu',
      flavor: 'Tat profili uyumu',
      perfect: 'Mükemmel eşleşme!',
      good: 'İyi bir seçim',
      tryIt: 'Denemeni öneririz'
    },
    
    // Güven seviyeleri
    confidence: {
      high: 'Mükemmel Eşleşme',
      good: 'Güçlü Eşleşme',
      moderate: 'İyi Eşleşme',
      uncertain: 'Belirsiz',
      low: 'Keşif Modu'
    }
  },
  
  en: {
    // General
    app: {
      name: 'SAKİ APP',
      tagline: 'Find your perfect drink'
    },
    
    // Welcome
    welcome: {
      title: 'SAKİ',
      subtitle: 'Personalized recommendations based on your taste',
      button: "What's Your Drink Today?",
      howItWorks: 'How It Works',
      howItWorksText: 'Answer 3 simple questions, and we\'ll find the perfect drink for you. The more questions you answer, the better our recommendation.'
    },
    
    // Steps
    steps: {
      step1: 'Step 1/3',
      step2: 'Step 2/3',
      step3: 'Step 3/3',
      extra: 'Extra Question'
    },
    
    // Screen titles
    screens: {
      type: {
        title: 'What Would You Like?',
        subtitle: 'Choose what speaks to your soul'
      },
      mood: {
        title: 'What\'s The Occasion?',
        subtitle: 'Set the mood'
      },
      taste: {
        title: 'Your Taste Profile?',
        subtitle: 'Choose your style'
      },
      extra: {
        title: 'A Bit More Info',
        subtitle: 'Helps us recommend better'
      },
      result: {
        title: 'Our Pick For You',
        match: 'Match',
        whyThis: 'Why this recommendation?',
        alternatives: 'Alternatives',
        moreOptions: 'More Options',
        restart: 'Start Over',
        tapForDetails: 'Tap for details'
      }
    },
    
    // Buttons
    buttons: {
      unsure: 'Not Sure',
      skip: 'Skip',
      back: 'Back',
      next: 'Continue'
    },
    
    // Categories
    categories: {
      raki: 'Rakı',
      whiskey: 'Whiskey',
      beer: 'Beer',
      vodka: 'Vodka',
      gin: 'Gin',
      tequila: 'Tequila',
      wine: 'Wine',
      other: 'Other'
    },
    
    // Moods
    moods: {
      solo: 'Solo',
      friends: 'With Friends',
      romantic: 'Romantic',
      celebration: 'Celebration',
      business: 'Business Dinner'
    },
    
    moodDescriptions: {
      solo: 'A quiet evening, just yourself',
      friends: 'Fun gathering with friends',
      romantic: 'Special time with someone',
      celebration: 'Marking a special occasion',
      business: 'Professional and sophisticated'
    },
    
    // Flavor profiles
    flavors: {
      light: 'Light & Fresh',
      balanced: 'Balanced',
      bold: 'Bold & Complex'
    },
    
    flavorDescriptions: {
      light: 'Fresh, vibrant, refreshing',
      balanced: 'Harmonious, elegant, versatile',
      bold: 'Intense, complex, memorable'
    },
    
    // Extra questions
    extraQuestions: {
      experience: {
        question: 'Your experience with this category?',
        beginner: 'Just starting out',
        casual: 'Occasional drinker',
        enthusiast: 'Enthusiast'
      },
      strength: {
        question: 'Alcohol strength preference?',
        light: 'Light',
        medium: 'Medium',
        strong: 'Strong'
      }
    },
    
    // Match explanations
    matchExplanation: {
      category: 'Your category choice',
      mood: 'Occasion match',
      flavor: 'Flavor profile match',
      perfect: 'Perfect match!',
      good: 'Great choice',
      tryIt: 'We recommend trying this'
    },
    
    // Confidence levels
    confidence: {
      high: 'Perfect Match',
      good: 'Strong Match',
      moderate: 'Good Match',
      uncertain: 'Uncertain',
      low: 'Discovery Mode'
    }
  }
};

export default translations;
