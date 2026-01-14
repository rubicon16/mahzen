/**
 * SAKİ APP - Language Switcher Component
 * TR/EN bayrak değiştirici
 */

import gsap from 'gsap';
import { getLanguage, setLanguage, onLanguageChange } from '../i18n/translations.js';

/**
 * Dil değiştirici oluşturur
 * @returns {HTMLElement}
 */
export function createLanguageSwitcher() {
  const currentLang = getLanguage();
  
  const container = document.createElement('div');
  container.className = 'language-switcher';
  container.setAttribute('role', 'button');
  container.setAttribute('aria-label', 'Change language / Dil değiştir');
  container.setAttribute('tabindex', '0');
  
  // SVG bayraklar
  container.innerHTML = `
    <svg viewBox="0 0 40 40" class="language-switcher__icon">
      <defs>
        <clipPath id="left-half">
          <rect x="0" y="0" width="20" height="40"/>
        </clipPath>
        <clipPath id="right-half">
          <rect x="20" y="0" width="20" height="40"/>
        </clipPath>
        <clipPath id="circle-clip">
          <circle cx="20" cy="20" r="18"/>
        </clipPath>
      </defs>
      
      <!-- Arka plan circle -->
      <circle cx="20" cy="20" r="19" fill="none" stroke="var(--glass-border)" stroke-width="1"/>
      
      <!-- Sol taraf (aktif dil) -->
      <g clip-path="url(#circle-clip)">
        <g class="flag-left" clip-path="url(#left-half)">
          ${currentLang === 'tr' ? getTurkishFlag() : getBritishFlag()}
        </g>
        
        <!-- Sağ taraf (diğer dil) -->
        <g class="flag-right" clip-path="url(#right-half)">
          ${currentLang === 'tr' ? getBritishFlag() : getTurkishFlag()}
        </g>
      </g>
      
      <!-- Diagonal line -->
      <line x1="38" y1="2" x2="2" y2="38" stroke="var(--neutral-800)" stroke-width="2"/>
      <line x1="38" y1="2" x2="2" y2="38" stroke="var(--glass-border)" stroke-width="1"/>
    </svg>
  `;
  
  // Tıklama
  container.addEventListener('click', () => {
    const newLang = getLanguage() === 'tr' ? 'en' : 'tr';
    animateSwitch(container, newLang);
  });
  
  // Klavye erişimi
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      container.click();
    }
  });
  
  // Stil ekle
  addSwitcherStyles();
  
  return container;
}

/**
 * Türk bayrağı SVG
 */
function getTurkishFlag() {
  return `
    <rect x="0" y="0" width="40" height="40" fill="#E30A17"/>
    <circle cx="16" cy="20" r="8" fill="white"/>
    <circle cx="18" cy="20" r="6.5" fill="#E30A17"/>
    <polygon points="22,20 26,22 24,20 26,18" fill="white" transform="rotate(20, 24, 20)"/>
  `;
}

/**
 * İngiliz bayrağı SVG (basitleştirilmiş)
 */
function getBritishFlag() {
  return `
    <rect x="0" y="0" width="40" height="40" fill="#012169"/>
    <path d="M0,0 L40,40 M40,0 L0,40" stroke="white" stroke-width="6"/>
    <path d="M0,0 L40,40 M40,0 L0,40" stroke="#C8102E" stroke-width="4"/>
    <path d="M20,0 V40 M0,20 H40" stroke="white" stroke-width="8"/>
    <path d="M20,0 V40 M0,20 H40" stroke="#C8102E" stroke-width="5"/>
  `;
}

/**
 * Değiştirme animasyonu
 */
function animateSwitch(container, newLang) {
  gsap.to(container, {
    scale: 0.8,
    rotation: 180,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      setLanguage(newLang);
      
      // Bayrakları güncelle
      const leftFlag = container.querySelector('.flag-left');
      const rightFlag = container.querySelector('.flag-right');
      
      if (leftFlag && rightFlag) {
        leftFlag.innerHTML = newLang === 'tr' ? getTurkishFlag() : getBritishFlag();
        rightFlag.innerHTML = newLang === 'tr' ? getBritishFlag() : getTurkishFlag();
      }
      
      gsap.to(container, {
        scale: 1,
        rotation: 360,
        duration: 0.3,
        ease: 'back.out(1.7)',
        onComplete: () => {
          // Reset rotation
          gsap.set(container, { rotation: 0 });
          
          // Sayfayı yeniden yükle (dil değişikliğini uygula)
          window.location.reload();
        }
      });
    }
  });
}

/**
 * Stiller
 */
function addSwitcherStyles() {
  if (document.getElementById('lang-switcher-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'lang-switcher-styles';
  style.textContent = `
    .language-switcher {
      position: fixed;
      top: var(--space-6);
      right: var(--space-6);
      width: 44px;
      height: 44px;
      cursor: pointer;
      z-index: var(--z-sticky);
      transition: transform var(--duration-normal) var(--ease-out);
    }
    
    .language-switcher:hover {
      transform: scale(1.1);
    }
    
    .language-switcher:active {
      transform: scale(0.95);
    }
    
    .language-switcher__icon {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    }
    
    @media (max-width: 640px) {
      .language-switcher {
        top: var(--space-4);
        right: var(--space-4);
        width: 40px;
        height: 40px;
      }
    }
  `;
  document.head.appendChild(style);
}

export default createLanguageSwitcher;
