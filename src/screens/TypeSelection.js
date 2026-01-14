/**
 * SAKİ APP - Type Selection Screen
 * Adım 1: İçki türü seçimi
 */

import gsap from 'gsap';
import { createLiquidButton, animateButtonGroup } from '../components/LiquidButton.js';
import { previewBackground, resetBackground } from '../components/Background.js';
import { unsureBubbleEffect } from '../components/Bubbles.js';
import { getCategories, setAnswer } from '../engine/decisionEngine.js';
import { t, getCategoryName } from '../i18n/translations.js';

/**
 * İçki türü seçim ekranını render eder
 */
export function renderTypeSelection(onNext) {
  const container = document.getElementById('screen-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const screen = document.createElement('div');
  screen.className = 'screen';
  
  // Başlık
  const header = document.createElement('header');
  header.className = 'screen__header';
  header.innerHTML = `
    <span class="screen__step">${t('steps.step1')}</span>
    <h1 class="screen__title">${t('screens.type.title')}</h1>
    <p class="screen__subtitle">${t('screens.type.subtitle')}</p>
  `;
  screen.appendChild(header);
  
  // Seçenekler
  const optionsGrid = document.createElement('div');
  optionsGrid.className = 'options-grid';
  
  const categories = getCategories();
  const buttons = [];
  
  categories.forEach(category => {
    const button = createLiquidButton({
      label: getCategoryName(category.id),
      icon: category.icon,
      alcohol: category.id,
      onClick: () => {
        setAnswer('category', category.id);
        animateOut(screen, () => onNext());
      }
    });
    
    button.addEventListener('mouseenter', () => {
      previewBackground(category.id);
    });
    
    button.addEventListener('mouseleave', () => {
      resetBackground();
    });
    
    button.addEventListener('touchstart', () => {
      previewBackground(category.id);
    }, { passive: true });
    
    optionsGrid.appendChild(button);
    buttons.push(button);
  });
  
  screen.appendChild(optionsGrid);
  
  // "Emin değilim" butonu
  const unsureButton = createLiquidButton({
    label: t('buttons.unsure'),
    icon: '🎲',
    variant: 'unsure',
    onClick: (e) => {
      unsureBubbleEffect(e.currentTarget);
      
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setAnswer('category', randomCategory.id);
      
      setTimeout(() => {
        animateOut(screen, () => onNext());
      }, 500);
    }
  });
  
  const unsureWrapper = document.createElement('div');
  unsureWrapper.style.marginTop = 'var(--space-4)';
  unsureWrapper.appendChild(unsureButton);
  screen.appendChild(unsureWrapper);
  buttons.push(unsureButton);
  
  container.appendChild(screen);
  
  animateIn(screen, buttons);
}

function animateIn(screen, buttons) {
  gsap.fromTo(screen.querySelector('.screen__header'),
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
  );
  
  animateButtonGroup(buttons, { delay: 0.2, stagger: 0.08 });
}

function animateOut(screen, callback) {
  gsap.to(screen, {
    opacity: 0,
    y: -30,
    duration: 0.4,
    ease: 'power3.in',
    onComplete: callback
  });
}

export default renderTypeSelection;
