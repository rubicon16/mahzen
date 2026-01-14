/**
 * SAKİ APP - Result Screen
 * Öneri sonuçları ekranı - Eşleşme açıklamalı
 */

import gsap from 'gsap';
import { createLiquidButton } from '../components/LiquidButton.js';
import { setBackground } from '../components/Background.js';
import { burstBubbles } from '../components/Bubbles.js';
import { getFinalResults, resetAnswers, getAnswers } from '../engine/decisionEngine.js';
import { getConfidenceLevel } from '../engine/confidence.js';
import { t, getLanguage, getCategoryName, getMoodName, getFlavorName } from '../i18n/translations.js';

/**
 * Sonuç ekranını render eder
 */
export function renderResult(extraAnswers = {}, onRestart, onShowAlternatives) {
  const container = document.getElementById('screen-container');
  if (!container) return;
  
  const answers = getAnswers();
  answers.extraAnswers = extraAnswers;
  
  const results = getFinalResults();
  const { recommendations, confidence } = results;
  const confidenceInfo = getConfidenceLevel(confidence);
  
  if (answers.category) {
    setBackground(answers.category);
  }
  
  container.innerHTML = '';
  
  const screen = document.createElement('div');
  screen.className = 'screen result-screen';
  
  // Confidence badge
  const badge = document.createElement('div');
  badge.className = 'result__badge';
  badge.innerHTML = `
    <span class="result__badge-emoji">${confidenceInfo.emoji}</span>
    <span class="result__badge-text">${t(`confidence.${confidenceInfo.level}`) || confidenceInfo.text}</span>
  `;
  screen.appendChild(badge);
  
  // Ana öneri
  if (recommendations.length > 0) {
    const mainRec = recommendations[0];
    
    const mainCard = document.createElement('div');
    mainCard.className = 'result__main-card';
    
    // Eşleşme açıklaması oluştur
    const matchExplanation = generateMatchExplanation(mainRec, answers, confidence);
    
    mainCard.innerHTML = `
      <div class="result__brand">${mainRec.brand}</div>
      <h1 class="result__name">${mainRec.name}</h1>
      <p class="result__notes">"${mainRec.tastingNotes}"</p>
      <div class="result__match">
        <span class="result__match-label">${t('screens.result.match')}</span>
        <span class="result__match-value">${mainRec.matchPercentage}%</span>
      </div>
      <button class="result__why-btn" aria-expanded="false">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        ${t('screens.result.whyThis')}
      </button>
      <div class="result__explanation" style="display: none;">
        ${matchExplanation}
      </div>
    `;
    
    // Açıklama toggle
    const whyBtn = mainCard.querySelector('.result__why-btn');
    const explanation = mainCard.querySelector('.result__explanation');
    
    whyBtn.addEventListener('click', () => {
      const isOpen = whyBtn.getAttribute('aria-expanded') === 'true';
      
      if (isOpen) {
        gsap.to(explanation, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          onComplete: () => { explanation.style.display = 'none'; }
        });
        whyBtn.setAttribute('aria-expanded', 'false');
        whyBtn.classList.remove('result__why-btn--open');
      } else {
        explanation.style.display = 'block';
        gsap.fromTo(explanation,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3 }
        );
        whyBtn.setAttribute('aria-expanded', 'true');
        whyBtn.classList.add('result__why-btn--open');
      }
    });
    
    screen.appendChild(mainCard);
    
    setTimeout(() => {
      burstBubbles(mainCard, 25, answers.category || 'default');
    }, 600);
  }
  
  // Diğer öneriler
  if (recommendations.length > 1) {
    const othersTitle = document.createElement('h3');
    othersTitle.className = 'result__others-title';
    othersTitle.textContent = t('screens.result.alternatives');
    screen.appendChild(othersTitle);
    
    const othersGrid = document.createElement('div');
    othersGrid.className = 'result__others-grid';
    
    recommendations.slice(1).forEach(rec => {
      const card = document.createElement('div');
      card.className = 'result__other-card';
      card.innerHTML = `
        <div class="result__other-brand">${rec.brand}</div>
        <div class="result__other-name">${rec.name}</div>
        <div class="result__other-match">${rec.matchPercentage}%</div>
      `;
      othersGrid.appendChild(card);
    });
    
    screen.appendChild(othersGrid);
  }
  
  // Butonlar
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'result__buttons';
  
  const restartButton = createLiquidButton({
    label: t('screens.result.restart'),
    icon: '🔄',
    variant: 'secondary',
    onClick: () => {
      resetAnswers();
      setBackground(null);
      animateOut(screen, onRestart);
    }
  });
  
  const alternativesButton = createLiquidButton({
    label: t('screens.result.moreOptions'),
    icon: '📋',
    variant: 'unsure',
    size: 'sm',
    onClick: () => {
      onShowAlternatives(results.allRecommendations);
    }
  });
  
  buttonsContainer.appendChild(restartButton);
  buttonsContainer.appendChild(alternativesButton);
  screen.appendChild(buttonsContainer);
  
  container.appendChild(screen);
  
  addResultStyles();
  animateIn(screen);
}

/**
 * Eşleşme açıklaması oluşturur
 */
function generateMatchExplanation(beverage, answers, confidence) {
  const lang = getLanguage();
  const isTr = lang === 'tr';
  
  let html = '<div class="explanation-items">';
  
  // Kategori
  const categoryMatch = beverage.category === answers.category;
  html += `
    <div class="explanation-item ${categoryMatch ? 'explanation-item--match' : ''}">
      <span class="explanation-item__icon">${categoryMatch ? '✓' : '○'}</span>
      <span class="explanation-item__label">${t('matchExplanation.category')}</span>
      <span class="explanation-item__value">${getCategoryName(answers.category)}</span>
    </div>
  `;
  
  // Mood
  const moodMatch = beverage.moods && beverage.moods.includes(answers.mood);
  html += `
    <div class="explanation-item ${moodMatch ? 'explanation-item--match' : ''}">
      <span class="explanation-item__icon">${moodMatch ? '✓' : '○'}</span>
      <span class="explanation-item__label">${t('matchExplanation.mood')}</span>
      <span class="explanation-item__value">${getMoodName(answers.mood)}</span>
    </div>
  `;
  
  // Tat profili
  const flavorMatch = beverage.flavorProfile === answers.flavorProfile;
  html += `
    <div class="explanation-item ${flavorMatch ? 'explanation-item--match' : ''}">
      <span class="explanation-item__icon">${flavorMatch ? '✓' : '○'}</span>
      <span class="explanation-item__label">${t('matchExplanation.flavor')}</span>
      <span class="explanation-item__value">${getFlavorName(answers.flavorProfile)}</span>
    </div>
  `;
  
  html += '</div>';
  
  // Sonuç mesajı
  let message = t('matchExplanation.tryIt');
  if (confidence >= 80) {
    message = t('matchExplanation.perfect');
  } else if (confidence >= 60) {
    message = t('matchExplanation.good');
  }
  
  html += `<p class="explanation-message">${message}</p>`;
  
  return html;
}

function animateIn(screen) {
  const badge = screen.querySelector('.result__badge');
  const mainCard = screen.querySelector('.result__main-card');
  const othersTitle = screen.querySelector('.result__others-title');
  const othersGrid = screen.querySelector('.result__others-grid');
  const buttons = screen.querySelector('.result__buttons');
  
  const tl = gsap.timeline();
  
  tl.fromTo(badge,
    { opacity: 0, scale: 0.5, y: -20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
  );
  
  if (mainCard) {
    tl.fromTo(mainCard,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.2'
    );
  }
  
  if (othersTitle && othersGrid) {
    tl.fromTo([othersTitle, othersGrid],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
      '-=0.2'
    );
  }
  
  if (buttons) {
    tl.fromTo(buttons.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
      '-=0.1'
    );
  }
}

function animateOut(screen, callback) {
  gsap.to(screen, {
    opacity: 0,
    scale: 0.95,
    duration: 0.4,
    ease: 'power3.in',
    onComplete: callback
  });
}

function addResultStyles() {
  if (document.getElementById('result-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'result-styles';
  style.textContent = `
    .result-screen {
      max-width: 520px;
    }
    
    .result__badge {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-full);
      margin-bottom: var(--space-6);
    }
    
    .result__badge-emoji {
      font-size: var(--text-xl);
    }
    
    .result__badge-text {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--gold-400);
      letter-spacing: var(--tracking-wide);
    }
    
    .result__main-card {
      width: 100%;
      padding: var(--space-8);
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-3xl);
      text-align: center;
      margin-bottom: var(--space-8);
    }
    
    .result__brand {
      font-size: var(--text-sm);
      color: var(--gold-500);
      text-transform: uppercase;
      letter-spacing: var(--tracking-widest);
      margin-bottom: var(--space-2);
    }
    
    .result__name {
      font-size: var(--text-4xl);
      font-weight: var(--font-semibold);
      color: var(--neutral-50);
      margin-bottom: var(--space-4);
      line-height: var(--leading-tight);
    }
    
    .result__notes {
      font-size: var(--text-lg);
      font-style: italic;
      color: var(--neutral-300);
      line-height: var(--leading-relaxed);
      margin-bottom: var(--space-6);
    }
    
    .result__match {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
      margin-bottom: var(--space-4);
    }
    
    .result__match-label {
      font-size: var(--text-xs);
      color: var(--neutral-500);
      text-transform: uppercase;
      letter-spacing: var(--tracking-widest);
    }
    
    .result__match-value {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .result__why-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: transparent;
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-full);
      color: var(--neutral-400);
      font-size: var(--text-sm);
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-out);
    }
    
    .result__why-btn:hover,
    .result__why-btn--open {
      color: var(--gold-400);
      border-color: var(--gold-600);
      background: rgba(212, 175, 55, 0.1);
    }
    
    .result__explanation {
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid var(--glass-border);
      text-align: left;
      overflow: hidden;
    }
    
    .explanation-items {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    
    .explanation-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2);
      background: rgba(255, 255, 255, 0.03);
      border-radius: var(--radius-lg);
    }
    
    .explanation-item--match {
      background: rgba(52, 211, 153, 0.1);
    }
    
    .explanation-item__icon {
      font-size: var(--text-sm);
      color: var(--emerald-400);
    }
    
    .explanation-item__label {
      font-size: var(--text-xs);
      color: var(--neutral-500);
      flex: 1;
    }
    
    .explanation-item__value {
      font-size: var(--text-sm);
      color: var(--neutral-200);
      font-weight: var(--font-medium);
    }
    
    .explanation-message {
      margin-top: var(--space-3);
      font-size: var(--text-sm);
      color: var(--gold-400);
      text-align: center;
    }
    
    .result__others-title {
      font-size: var(--text-sm);
      color: var(--neutral-400);
      text-transform: uppercase;
      letter-spacing: var(--tracking-widest);
      margin-bottom: var(--space-4);
      text-align: center;
    }
    
    .result__others-grid {
      display: flex;
      gap: var(--space-3);
      margin-bottom: var(--space-8);
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .result__other-card {
      padding: var(--space-4);
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      text-align: center;
      min-width: 120px;
      flex: 1;
    }
    
    .result__other-brand {
      font-size: var(--text-xs);
      color: var(--gold-600);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
    }
    
    .result__other-name {
      font-size: var(--text-lg);
      color: var(--neutral-100);
      margin: var(--space-1) 0;
    }
    
    .result__other-match {
      font-size: var(--text-sm);
      color: var(--gold-400);
      font-weight: var(--font-medium);
    }
    
    .result__buttons {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      width: 100%;
    }
  `;
  document.head.appendChild(style);
}

export default renderResult;
