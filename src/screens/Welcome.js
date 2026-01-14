/**
 * SAKİ APP - Welcome Screen
 * Animasyonlu anasayfa
 */

import gsap from 'gsap';
import { createLiquidButton } from '../components/LiquidButton.js';
import { t, getLanguage } from '../i18n/translations.js';
import { createLanguageSwitcher } from '../components/LanguageSwitcher.js';

/**
 * Anasayfa ekranını render eder
 * @param {Function} onStart - Başla butonuna tıklanınca
 */
export function renderWelcome(onStart) {
  const container = document.getElementById('screen-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const screen = document.createElement('div');
  screen.className = 'screen welcome-screen';
  
  // Dil değiştirici
  const langSwitcher = createLanguageSwitcher();
  
  // Logo container
  const logoContainer = document.createElement('div');
  logoContainer.className = 'welcome__logo-container';
  
  const logo = document.createElement('img');
  logo.src = '/logo.png';
  logo.alt = 'SAKİ';
  logo.className = 'welcome__logo';
  logoContainer.appendChild(logo);
  
  // Başlık
  const title = document.createElement('h1');
  title.className = 'welcome__title';
  title.textContent = t('welcome.title');
  
  // Alt başlık
  const subtitle = document.createElement('p');
  subtitle.className = 'welcome__subtitle';
  subtitle.textContent = t('welcome.subtitle');
  
  // Nasıl Çalışır tooltip
  const howItWorks = document.createElement('div');
  howItWorks.className = 'welcome__how-it-works';
  howItWorks.innerHTML = `
    <button class="welcome__info-btn" aria-label="${t('welcome.howItWorks')}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
      <span>${t('welcome.howItWorks')}</span>
    </button>
    <div class="welcome__tooltip">
      <p>${t('welcome.howItWorksText')}</p>
    </div>
  `;
  
  // Ana buton
  const startButton = createLiquidButton({
    label: t('welcome.button'),
    icon: '🍷',
    variant: 'primary',
    size: 'lg',
    onClick: () => {
      animateOut(screen, onStart);
    }
  });
  startButton.classList.add('welcome__start-btn');
  
  // Elemanları ekle
  screen.appendChild(logoContainer);
  screen.appendChild(title);
  screen.appendChild(subtitle);
  screen.appendChild(howItWorks);
  screen.appendChild(startButton);
  
  container.appendChild(screen);
  document.getElementById('app')?.appendChild(langSwitcher);
  
  // Stilleri ekle
  addWelcomeStyles();
  
  // Giriş animasyonu
  animateIn(screen, logo, title, subtitle, howItWorks, startButton, langSwitcher);
}

/**
 * Giriş animasyonu
 */
function animateIn(screen, logo, title, subtitle, howItWorks, button, langSwitcher) {
  const tl = gsap.timeline();
  
  // Logo fade in + scale
  tl.fromTo(logo,
    { opacity: 0, scale: 0.5, y: -30 },
    { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }
  );
  
  // Logo sürekli animasyonu (breathing effect)
  gsap.to(logo, {
    scale: 1.02,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
  
  // Başlık
  tl.fromTo(title,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    '-=0.5'
  );
  
  // Alt başlık
  tl.fromTo(subtitle,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
    '-=0.3'
  );
  
  // How it works
  tl.fromTo(howItWorks,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    '-=0.2'
  );
  
  // Buton
  tl.fromTo(button,
    { opacity: 0, y: 30, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
    '-=0.2'
  );
  
  // Dil değiştirici
  tl.fromTo(langSwitcher,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' },
    '-=0.4'
  );
}

/**
 * Çıkış animasyonu
 */
function animateOut(screen, callback) {
  const langSwitcher = document.querySelector('.language-switcher');
  
  gsap.to(screen, {
    opacity: 0,
    y: -40,
    scale: 0.95,
    duration: 0.5,
    ease: 'power3.in',
    onComplete: () => {
      if (langSwitcher) langSwitcher.remove();
      callback();
    }
  });
}

/**
 * Stiller
 */
function addWelcomeStyles() {
  if (document.getElementById('welcome-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'welcome-styles';
  style.textContent = `
    .welcome-screen {
      max-width: 400px;
      text-align: center;
      padding-top: var(--space-12);
    }
    
    .welcome__logo-container {
      margin-bottom: var(--space-6);
    }
    
    .welcome__logo {
      width: 120px;
      height: 120px;
      object-fit: contain;
      filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.4));
    }
    
    .welcome__title {
      font-size: var(--text-5xl);
      font-weight: var(--font-bold);
      letter-spacing: var(--tracking-wider);
      background: linear-gradient(135deg, var(--gold-300), var(--gold-500), var(--gold-300));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: var(--space-3);
    }
    
    .welcome__subtitle {
      font-size: var(--text-lg);
      color: var(--neutral-300);
      margin-bottom: var(--space-8);
      line-height: var(--leading-relaxed);
    }
    
    .welcome__how-it-works {
      position: relative;
      margin-bottom: var(--space-8);
    }
    
    .welcome__info-btn {
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
    
    .welcome__info-btn:hover {
      color: var(--neutral-200);
      border-color: var(--glass-border-hover);
      background: var(--glass-bg);
    }
    
    .welcome__tooltip {
      position: absolute;
      top: calc(100% + var(--space-3));
      left: 50%;
      transform: translateX(-50%);
      width: 280px;
      padding: var(--space-4);
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      opacity: 0;
      visibility: hidden;
      transition: all var(--duration-normal) var(--ease-out);
      z-index: var(--z-tooltip);
    }
    
    .welcome__tooltip p {
      font-size: var(--text-sm);
      color: var(--neutral-300);
      line-height: var(--leading-relaxed);
      margin: 0;
    }
    
    .welcome__info-btn:hover + .welcome__tooltip,
    .welcome__info-btn:focus + .welcome__tooltip {
      opacity: 1;
      visibility: visible;
    }
    
    .welcome__start-btn {
      width: 100%;
      max-width: 300px;
    }
  `;
  document.head.appendChild(style);
}

export default renderWelcome;
