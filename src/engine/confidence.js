/**
 * SAKİ APP - Confidence Calculator
 * Güven skoru hesaplama sistemi
 */

/**
 * Güven skoru hesaplar
 * @param {Object} answers - Kullanıcı cevapları
 * @returns {number} 0-100 arası güven skoru
 */
export function calculateConfidence(answers) {
  let confidence = 100;
  const { category, mood, flavorProfile, unsureCount, extraAnswers } = answers;
  
  // "Emin değilim" sayısına göre düşür
  // Her "emin değilim" için 15 puan düş
  confidence -= unsureCount * 15;
  
  // Cevap eksikliğine göre düşür
  if (!category) {
    confidence -= 20;
  }
  
  if (!mood) {
    confidence -= 15;
  }
  
  if (!flavorProfile) {
    confidence -= 15;
  }
  
  // Ekstra cevaplar güveni artırır
  const extraAnswerCount = Object.keys(extraAnswers).length;
  confidence += extraAnswerCount * 5;
  
  // Min 20, max 100
  confidence = Math.max(20, Math.min(100, confidence));
  
  return confidence;
}

/**
 * Güven seviyesini metin olarak döndürür
 * @param {number} confidence - Güven skoru
 * @returns {Object} Seviye bilgisi
 */
export function getConfidenceLevel(confidence) {
  if (confidence >= 90) {
    return {
      level: 'high',
      text: 'Mükemmel Eşleşme',
      emoji: '🎯',
      description: 'Bu öneri tam sana göre!'
    };
  } else if (confidence >= 75) {
    return {
      level: 'good',
      text: 'Güçlü Eşleşme',
      emoji: '✨',
      description: 'Yüksek ihtimalle beğeneceksin.'
    };
  } else if (confidence >= 60) {
    return {
      level: 'moderate',
      text: 'İyi Eşleşme',
      emoji: '👍',
      description: 'Denemeye değer bir seçim.'
    };
  } else if (confidence >= 40) {
    return {
      level: 'uncertain',
      text: 'Belirsiz',
      emoji: '🤔',
      description: 'Daha fazla bilgi ile daha iyi öneri yapabiliriz.'
    };
  } else {
    return {
      level: 'low',
      text: 'Keşif Modu',
      emoji: '🔍',
      description: 'Yeni tatlar keşfetmeye hazır mısın?'
    };
  }
}

/**
 * Ek soru gerekip gerekmediğini belirler
 * @param {number} confidence - Güven skoru
 * @returns {boolean}
 */
export function needsExtraQuestions(confidence) {
  return confidence < 80;
}

/**
 * Hangi ek soruların sorulması gerektiğini belirler
 * @param {Object} answers - Mevcut cevaplar
 * @returns {Array} Sorulacak ek sorular
 */
export function getRequiredExtraQuestions(answers) {
  const questions = [];
  const { category, unsureCount } = answers;
  
  // Fiyat tercihi (her zaman yardımcı olur)
  questions.push({
    id: 'priceRange',
    question: 'Bütçe tercihin?',
    options: [
      { id: 'budget', text: 'Uygun fiyatlı', icon: '💰' },
      { id: 'mid', text: 'Orta segment', icon: '💵' },
      { id: 'premium', text: 'Premium', icon: '💎' }
    ]
  });
  
  // Deneyim seviyesi
  if (unsureCount > 0) {
    questions.push({
      id: 'experience',
      question: 'Bu kategoride deneyimin?',
      options: [
        { id: 'beginner', text: 'Yeni başlıyorum', icon: '🌱' },
        { id: 'casual', text: 'Ara sıra içerim', icon: '😊' },
        { id: 'enthusiast', text: 'Meraklıyım', icon: '🧐' }
      ]
    });
  }
  
  // Kategori spesifik sorular
  if (category === 'wine') {
    questions.push({
      id: 'wineColor',
      question: 'Şarap rengi tercihin?',
      options: [
        { id: 'red', text: 'Kırmızı', icon: '🍷' },
        { id: 'white', text: 'Beyaz', icon: '🥂' },
        { id: 'rose', text: 'Rosé', icon: '🌸' },
        { id: 'sparkling', text: 'Köpüklü', icon: '🍾' }
      ]
    });
  }
  
  if (category === 'whiskey') {
    questions.push({
      id: 'smoky',
      question: 'Dumanlı notalar sever misin?',
      options: [
        { id: 'yes', text: 'Evet, severim', icon: '🔥' },
        { id: 'no', text: 'Hayır, tercih etmem', icon: '❌' },
        { id: 'maybe', text: 'Biraz olabilir', icon: '🤷' }
      ]
    });
  }
  
  return questions;
}
