/**
 * SAKİ APP - Extra Questions Screen
 * Düşük güven durumunda ek sorular
 */

import gsap from 'gsap';
import { createLiquidButton, animateButtonGroup } from '../components/LiquidButton.js';
import { unsureBubbleEffect } from '../components/Bubbles.js';
import { t, getLanguage } from '../i18n/translations.js';

const extraQuestions = [
  {
    id: 'experience',
    questionKey: 'extraQuestions.experience.question',
    options: [
      { id: 'beginner', textKey: 'extraQuestions.experience.beginner', icon: '🌱' },
      { id: 'casual', textKey: 'extraQuestions.experience.casual', icon: '🍸' },
      { id: 'enthusiast', textKey: 'extraQuestions.experience.enthusiast', icon: '🏆' }
    ]
  },
  {
    id: 'strength',
    questionKey: 'extraQuestions.strength.question',
    options: [
      { id: 'light', textKey: 'extraQuestions.strength.light', icon: '💧' },
      { id: 'medium', textKey: 'extraQuestions.strength.medium', icon: '⚡' },
      { id: 'strong', textKey: 'extraQuestions.strength.strong', icon: '🔥' }
    ]
  }
];

let currentQuestionIndex = 0;
let collectedAnswers = {};

export function renderExtraQuestions(onComplete, onSkip) {
  currentQuestionIndex = 0;
  collectedAnswers = {};
  
  showQuestion(onComplete, onSkip);
}

function showQuestion(onComplete, onSkip) {
  const container = document.getElementById('screen-container');
  if (!container) return;
  
  if (currentQuestionIndex >= extraQuestions.length) {
    onComplete(collectedAnswers);
    return;
  }
  
  const question = extraQuestions[currentQuestionIndex];
  
  container.innerHTML = '';
  
  const screen = document.createElement('div');
  screen.className = 'screen';
  
  const header = document.createElement('header');
  header.className = 'screen__header';
  header.innerHTML = `
    <span class="screen__step">${t('steps.extra')} ${currentQuestionIndex + 1}/${extraQuestions.length}</span>
    <h1 class="screen__title">${t(question.questionKey)}</h1>
    <p class="screen__subtitle">${t('screens.extra.subtitle')}</p>
  `;
  screen.appendChild(header);
  
  const optionsGrid = document.createElement('div');
  optionsGrid.className = 'options-grid options-grid--compact';
  
  const buttons = [];
  
  question.options.forEach(option => {
    const button = createLiquidButton({
      label: t(option.textKey),
      icon: option.icon,
      onClick: () => {
        collectedAnswers[question.id] = option.id;
        currentQuestionIndex++;
        
        gsap.to(screen, {
          opacity: 0,
          x: -30,
          duration: 0.3,
          onComplete: () => showQuestion(onComplete, onSkip)
        });
      }
    });
    
    optionsGrid.appendChild(button);
    buttons.push(button);
  });
  
  screen.appendChild(optionsGrid);
  
  const skipButton = createLiquidButton({
    label: t('buttons.skip'),
    icon: '⏭️',
    variant: 'unsure',
    size: 'sm',
    onClick: (e) => {
      unsureBubbleEffect(e.currentTarget);
      setTimeout(() => onSkip(collectedAnswers), 500);
    }
  });
  
  const skipWrapper = document.createElement('div');
  skipWrapper.style.marginTop = 'var(--space-6)';
  skipWrapper.appendChild(skipButton);
  screen.appendChild(skipWrapper);
  buttons.push(skipButton);
  
  container.appendChild(screen);
  
  gsap.fromTo(screen.querySelector('.screen__header'),
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
  );
  
  animateButtonGroup(buttons, { delay: 0.15, stagger: 0.06 });
}

export default renderExtraQuestions;
