/**
 * SAKİ APP - Decision Engine
 * Kullanıcı tercihlerine göre içki önerisi yapan algoritma
 */

import beveragesData from '../data/beverages.json';
import { calculateConfidence } from './confidence.js';

/**
 * Kullanıcı cevaplarını saklar
 */
let userAnswers = {
  category: null,
  mood: null,
  flavorProfile: null,
  unsureCount: 0,
  extraAnswers: {}
};

/**
 * Cevapları sıfırlar
 */
export function resetAnswers() {
  userAnswers = {
    category: null,
    mood: null,
    flavorProfile: null,
    unsureCount: 0,
    extraAnswers: {}
  };
}

/**
 * Cevap kaydeder
 * @param {string} question - Soru tipi (category, mood, flavorProfile)
 * @param {string|null} answer - Cevap (null = emin değilim)
 */
export function setAnswer(question, answer) {
  if (answer === null) {
    userAnswers.unsureCount++;
    // Emin değilim durumunda varsayılan değer ata
    if (question === 'flavorProfile') {
      userAnswers[question] = 'balanced';
    }
  } else {
    userAnswers[question] = answer;
  }
}

/**
 * Kategori bilgisini döndürür
 */
export function getCategories() {
  return beveragesData.categories;
}

/**
 * Mood bilgisini döndürür
 */
export function getMoods() {
  return beveragesData.moods;
}

/**
 * Tat profili bilgisini döndürür
 */
export function getFlavorProfiles() {
  return beveragesData.flavorProfiles;
}

/**
 * Mevcut cevapları döndürür
 */
export function getAnswers() {
  return { ...userAnswers };
}

/**
 * İçkileri filtreler ve skorlar
 * @returns {Array} Sıralanmış içki listesi
 */
export function getRecommendations() {
  const { category, mood, flavorProfile, extraAnswers } = userAnswers;
  
  let candidates = [...beveragesData.beverages];
  
  // Kategori filtresi (seçildiyse)
  if (category) {
    candidates = candidates.filter(b => b.category === category);
  }
  
  // Her aday için skor hesapla
  const scored = candidates.map(beverage => {
    let score = 0;
    let maxScore = 0;
    
    // Mood uyumu (0-40 puan)
    if (mood) {
      maxScore += 40;
      if (beverage.moods.includes(mood)) {
        // Mood listesindeki sıraya göre ekstra puan
        const moodIndex = beverage.moods.indexOf(mood);
        score += 40 - (moodIndex * 5);
      }
    }
    
    // Tat profili uyumu (0-40 puan)
    if (flavorProfile) {
      maxScore += 40;
      if (beverage.flavorProfile === flavorProfile) {
        score += 40;
      } else if (
        (flavorProfile === 'balanced') ||
        (beverage.flavorProfile === 'balanced')
      ) {
        // Dengeli profil kısmen uyumlu
        score += 20;
      }
    }
    
    // Tag uyumu (0-20 puan)
    const profileData = beveragesData.flavorProfiles.find(f => f.id === flavorProfile);
    if (profileData) {
      maxScore += 20;
      const matchingTags = beverage.tags.filter(t => profileData.tags.includes(t));
      score += (matchingTags.length / profileData.tags.length) * 20;
    }
    
    // Ekstra cevap uyumu
    if (extraAnswers.priceRange) {
      // Fiyat fonksiyonelliği eklenebilir
    }
    
    return {
      ...beverage,
      score,
      maxScore,
      matchPercentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 50
    };
  });
  
  // Skora göre sırala (yüksekten düşüğe)
  scored.sort((a, b) => b.score - a.score);
  
  return scored;
}

/**
 * Sonuç sayısını mood'a göre belirler
 */
export function getResultCount() {
  const mood = userAnswers.mood;
  const moodData = beveragesData.moods.find(m => m.id === mood);
  
  return moodData?.resultCount || 2;
}

/**
 * Final sonuçları döndürür
 * @returns {Object} Öneriler ve güven skoru
 */
export function getFinalResults() {
  const recommendations = getRecommendations();
  const resultCount = getResultCount();
  const confidence = calculateConfidence(userAnswers);
  
  return {
    recommendations: recommendations.slice(0, resultCount),
    allRecommendations: recommendations,
    confidence,
    needsExtraQuestions: confidence < 80,
    answers: { ...userAnswers }
  };
}

/**
 * Belirli bir kategoriye ait içkileri döndürür
 */
export function getBeveragesByCategory(categoryId) {
  return beveragesData.beverages.filter(b => b.category === categoryId);
}

/**
 * Tek bir içki bilgisi döndürür
 */
export function getBeverageById(id) {
  return beveragesData.beverages.find(b => b.id === id);
}
