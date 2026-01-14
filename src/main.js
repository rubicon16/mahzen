/**
 * SAKİ APP - Main Application Entry
 * 3 adımlı alkol seçim motoru
 */

import gsap from 'gsap';
import { initReflectionTracking } from './components/ReflectionStroke.js';
import { setBackground } from './components/Background.js';
import { clearAllBubbles, startContinuousBubbles } from './components/Bubbles.js';
import { resetAnswers, getFinalResults, getAnswers } from './engine/decisionEngine.js';
import { needsExtraQuestions } from './engine/confidence.js';
import { t, getLanguage, getCategoryName, getMoodName, getFlavorName } from './i18n/translations.js';

import { renderWelcome } from './screens/Welcome.js';
import { renderTypeSelection } from './screens/TypeSelection.js';
import { renderMoodSelection } from './screens/MoodSelection.js';
import { renderTasteSelection } from './screens/TasteSelection.js';
import { renderExtraQuestions } from './screens/ExtraQuestions.js';
import { renderResult } from './screens/Result.js';

// Uygulama durumu
let currentStep = 'welcome'; // welcome, type, mood, taste, extra, result
let progressBar = null;

/**
 * Uygulama başlatma
 */
function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
}

/**
 * Uygulamayı başlat
 */
function startApp() {
  initReflectionTracking();
  goToStep('welcome');
}

/**
 * Progress bar oluşturur
 */
function createProgressBar() {
  if (progressBar) return;
  
  progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.innerHTML = '<div class="progress-bar__fill" style="width: 0%"></div>';
  document.body.prepend(progressBar);
}

/**
 * Progress bar'ı kaldırır
 */
function removeProgressBar() {
  if (progressBar) {
    progressBar.remove();
    progressBar = null;
  }
}

/**
 * Progress bar günceller
 */
function updateProgress(step) {
  const progressMap = {
    'welcome': -1, // Progress bar yok
    'type': 0,
    'mood': 33,
    'taste': 66,
    'extra': 85,
    'result': 100
  };
  
  if (progressMap[step] === -1) {
    removeProgressBar();
    return;
  }
  
  createProgressBar();
  
  const fill = document.querySelector('.progress-bar__fill');
  if (fill) {
    gsap.to(fill, {
      width: `${progressMap[step] || 0}%`,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
}

/**
 * Adıma git
 */
function goToStep(step, extraData) {
  currentStep = step;
  updateProgress(step);
  
  switch (step) {
    case 'welcome':
      resetAnswers();
      setBackground(null);
      clearAllBubbles();
      removeProgressBar();
      renderWelcome(() => goToStep('type'));
      break;
      
    case 'type':
      createProgressBar();
      renderTypeSelection(() => goToStep('mood'));
      break;
      
    case 'mood':
      renderMoodSelection(
        () => goToStep('taste'),
        () => goToStep('type')
      );
      break;
      
    case 'taste':
      renderTasteSelection(
        () => {
          const results = getFinalResults();
          if (needsExtraQuestions(results.confidence)) {
            goToStep('extra');
          } else {
            goToStep('result');
          }
        },
        () => goToStep('mood')
      );
      break;
      
    case 'extra':
      renderExtraQuestions(
        (extraAnswers) => goToStep('result', extraAnswers),
        (extraAnswers) => goToStep('result', extraAnswers)
      );
      break;
      
    case 'result':
      const extraAnswers = extraData || {};
      renderResult(
        extraAnswers,
        () => goToStep('welcome'),
        (allRecs) => showAllAlternatives(allRecs)
      );
      
      const answers = getAnswers();
      if (answers.category === 'beer') {
        startContinuousBubbles('beer');
      } else if (answers.category === 'raki') {
        startContinuousBubbles('raki');
      }
      break;
  }
}

/**
 * Tüm alternatifleri gösterir
 */
function showAllAlternatives(recommendations) {
  const container = document.getElementById('screen-container');
  if (!container) return;
  
  gsap.to(container.children, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    stagger: 0.05,
    onComplete: () => {
      renderAlternativesList(recommendations);
    }
  });
}

/**
 * Alternatifler listesini render eder
 */
function renderAlternativesList(recommendations) {
  const container = document.getElementById('screen-container');
  container.innerHTML = '';
  
  const answers = getAnswers();
  
  const screen = document.createElement('div');
  screen.className = 'screen alternatives-screen';
  
  // Başlık
  const header = document.createElement('header');
  header.className = 'screen__header';
  header.innerHTML = `
    <h2 class="screen__title">${t('screens.result.alternatives')}</h2>
    <p class="screen__subtitle">${recommendations.length} ${getLanguage() === 'tr' ? 'sonuç bulundu' : 'results found'}</p>
    <p class="alternatives__hint">${t('screens.result.tapForDetails')}</p>
  `;
  screen.appendChild(header);
  
  // Liste
  const list = document.createElement('div');
  list.className = 'alternatives-list';
  
  recommendations.forEach((rec, index) => {
    const item = document.createElement('div');
    item.className = 'alternative-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    
    item.innerHTML = `
      <div class="alternative-item__rank">${index + 1}</div>
      <div class="alternative-item__info">
        <div class="alternative-item__brand">${rec.brand}</div>
        <div class="alternative-item__name">${rec.name}</div>
        <div class="alternative-item__details" style="display: none;">
          <p class="alternative-item__notes">"${rec.tastingNotes}"</p>
          <p class="alternative-item__reason">${generateMatchReason(rec, answers)}</p>
        </div>
      </div>
      <div class="alternative-item__right">
        <div class="alternative-item__match">${rec.matchPercentage}%</div>
        <svg class="alternative-item__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </div>
    `;
    
    // Tıklama ile detay göster
    item.addEventListener('click', () => {
      toggleItemDetails(item);
    });
    
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItemDetails(item);
      }
    });
    
    list.appendChild(item);
  });
  
  screen.appendChild(list);
  
  // Geri butonu
  const backButton = document.createElement('button');
  backButton.className = 'liquid-button liquid-button--secondary';
  backButton.innerHTML = `<span class="liquid-button__content">← ${t('screens.result.restart').includes('Başla') ? 'Sonuçlara Dön' : 'Back to Results'}</span>`;
  backButton.style.marginTop = 'var(--space-6)';
  backButton.addEventListener('click', () => goToStep('result'));
  screen.appendChild(backButton);
  
  container.appendChild(screen);
  
  addAlternativesStyles();
  
  gsap.fromTo(header, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4 });
  gsap.fromTo(list.children, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.2 });
  gsap.fromTo(backButton, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.4 });
}

/**
 * Item detaylarını aç/kapa
 */
function toggleItemDetails(item) {
  const details = item.querySelector('.alternative-item__details');
  const chevron = item.querySelector('.alternative-item__chevron');
  const isOpen = details.style.display !== 'none';
  
  if (isOpen) {
    gsap.to(details, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => { details.style.display = 'none'; }
    });
    gsap.to(chevron, { rotation: 0, duration: 0.3 });
    item.classList.remove('alternative-item--open');
  } else {
    details.style.display = 'block';
    gsap.fromTo(details, 
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.3 }
    );
    gsap.to(chevron, { rotation: 180, duration: 0.3 });
    item.classList.add('alternative-item--open');
  }
}

/**
 * Eşleşme nedenini oluşturur
 */
function generateMatchReason(beverage, answers) {
  const lang = getLanguage();
  const reasons = [];
  
  // Kategori uyumu
  if (beverage.category === answers.category) {
    reasons.push(lang === 'tr' 
      ? `✓ ${getCategoryName(answers.category)} kategorisi` 
      : `✓ ${getCategoryName(answers.category)} category`);
  }
  
  // Mood uyumu
  if (beverage.moods && beverage.moods.includes(answers.mood)) {
    reasons.push(lang === 'tr' 
      ? `✓ ${getMoodName(answers.mood)} ortamına uygun` 
      : `✓ Suitable for ${getMoodName(answers.mood).toLowerCase()}`);
  }
  
  // Tat profili uyumu
  if (beverage.flavorProfile === answers.flavorProfile) {
    reasons.push(lang === 'tr' 
      ? `✓ ${getFlavorName(answers.flavorProfile)} tat profili` 
      : `✓ ${getFlavorName(answers.flavorProfile)} flavor profile`);
  }
  
  return reasons.join(' • ');
}

/**
 * Alternatifler stilleri
 */
function addAlternativesStyles() {
  if (document.getElementById('alternatives-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'alternatives-styles';
  style.textContent = `
    .alternatives-screen {
      max-width: 520px;
    }
    
    .alternatives__hint {
      font-size: var(--text-xs);
      color: var(--gold-500);
      margin-top: var(--space-2);
    }
    
    .alternatives-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      max-height: 50vh;
      overflow-y: auto;
      padding: var(--space-2);
    }
    
    .alternative-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-4);
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-out);
    }
    
    .alternative-item:hover {
      background: var(--glass-bg-hover);
      border-color: var(--glass-border-hover);
    }
    
    .alternative-item--open {
      border-color: var(--gold-600);
    }
    
    .alternative-item__rank {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--glass-bg-hover);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      color: var(--gold-400);
      flex-shrink: 0;
    }
    
    .alternative-item__info {
      flex: 1;
    }
    
    .alternative-item__brand {
      font-size: var(--text-xs);
      color: var(--neutral-400);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
    }
    
    .alternative-item__name {
      font-size: var(--text-lg);
      font-weight: var(--font-medium);
      color: var(--neutral-100);
    }
    
    .alternative-item__details {
      margin-top: var(--space-3);
      padding-top: var(--space-3);
      border-top: 1px solid var(--glass-border);
      overflow: hidden;
    }
    
    .alternative-item__notes {
      font-size: var(--text-sm);
      font-style: italic;
      color: var(--neutral-300);
      margin-bottom: var(--space-2);
    }
    
    .alternative-item__reason {
      font-size: var(--text-xs);
      color: var(--gold-400);
    }
    
    .alternative-item__right {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
    }
    
    .alternative-item__match {
      font-size: var(--text-lg);
      font-weight: var(--font-bold);
      color: var(--gold-400);
    }
    
    .alternative-item__chevron {
      color: var(--neutral-500);
      transition: transform var(--duration-normal) var(--ease-out);
    }
  `;
  document.head.appendChild(style);
}

// Uygulamayı başlat
init();
