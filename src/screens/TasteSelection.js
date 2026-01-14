/**
 * SAKİ APP - Taste Selection Screen
 * Adım 3: Tat profili seçimi
 */

import gsap from 'gsap';
import { createLiquidButton, animateButtonGroup } from '../components/LiquidButton.js';
import { unsureBubbleEffect } from '../components/Bubbles.js';
import { getFlavorProfiles, setAnswer } from '../engine/decisionEngine.js';
import { t, getFlavorName } from '../i18n/translations.js';

export function renderTasteSelection(onNext, onBack) {
  const container = document.getElementById('screen-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const screen = document.createElement('div');
  screen.className = 'screen';
  
  const backButton = createBackButton(onBack);
  
  const header = document.createElement('header');
  header.className = 'screen__header';
  header.innerHTML = `
    <span class="screen__step">${t('steps.step3')}</span>
    <h1 class="screen__title">${t('screens.taste.title')}</h1>
    <p class="screen__subtitle">${t('screens.taste.subtitle')}</p>
  `;
  screen.appendChild(header);
  
  const optionsGrid = document.createElement('div');
  optionsGrid.className = 'options-grid';
  
  const flavors = getFlavorProfiles();
  const buttons = [];
  
  flavors.forEach(flavor => {
    const button = createLiquidButton({
      label: getFlavorName(flavor.id),
      subtitle: t(`flavorDescriptions.${flavor.id}`),
      icon: flavor.icon,
      onClick: () => {
        setAnswer('flavorProfile', flavor.id);
        animateOut(screen, () => onNext());
      }
    });
    
    optionsGrid.appendChild(button);
    buttons.push(button);
  });
  
  screen.appendChild(optionsGrid);
  
  const unsureButton = createLiquidButton({
    label: t('buttons.unsure'),
    icon: '🎯',
    variant: 'unsure',
    onClick: (e) => {
      unsureBubbleEffect(e.currentTarget);
      setAnswer('flavorProfile', 'balanced');
      
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
  document.getElementById('app')?.appendChild(backButton);
  
  animateIn(screen, buttons, backButton);
}

function createBackButton(onClick) {
  const button = document.createElement('button');
  button.className = 'back-button';
  button.setAttribute('aria-label', t('buttons.back'));
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  `;
  
  button.addEventListener('click', () => {
    gsap.to(button, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        button.remove();
        onClick();
      }
    });
  });
  
  return button;
}

function animateIn(screen, buttons, backButton) {
  gsap.fromTo(screen.querySelector('.screen__header'),
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
  );
  
  gsap.fromTo(backButton,
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
  );
  
  animateButtonGroup(buttons, { delay: 0.2, stagger: 0.08 });
}

function animateOut(screen, callback) {
  const backButton = document.querySelector('.back-button');
  if (backButton) {
    gsap.to(backButton, { opacity: 0, scale: 0.5, duration: 0.3 });
  }
  
  gsap.to(screen, {
    opacity: 0,
    y: -30,
    duration: 0.4,
    ease: 'power3.in',
    onComplete: () => {
      if (backButton) backButton.remove();
      callback();
    }
  });
}

export default renderTasteSelection;
