/**
 * SAKİ APP - Liquid Glass Button Component
 * Glassmorphism efektli buton komponenti
 */

import gsap from 'gsap';
import { updateReflection } from './ReflectionStroke.js';

/**
 * Liquid button oluşturur
 * @param {Object} options - Buton ayarları
 * @returns {HTMLElement}
 */
export function createLiquidButton(options) {
  const {
    label,
    subtitle = null,
    icon = null,
    alcohol = null,
    variant = 'default', // default, unsure, primary, secondary
    size = 'md', // sm, md, lg
    onClick = () => {}
  } = options;
  
  const button = document.createElement('button');
  button.className = `liquid-button`;
  
  // Varyant sınıfları
  if (variant !== 'default') {
    button.classList.add(`liquid-button--${variant}`);
  }
  
  // Boyut sınıfı
  if (size !== 'md') {
    button.classList.add(`liquid-button--${size}`);
  }
  
  // Alkol tipi (renk için)
  if (alcohol) {
    button.setAttribute('data-alcohol', alcohol);
  }
  
  // İçerik
  const content = document.createElement('span');
  content.className = 'liquid-button__content';
  
  if (icon) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'liquid-button__icon';
    iconSpan.textContent = icon;
    content.appendChild(iconSpan);
  }
  
  const textContainer = document.createElement('span');
  textContainer.className = 'liquid-button__text';
  
  const labelSpan = document.createElement('span');
  labelSpan.className = 'liquid-button__label';
  labelSpan.textContent = label;
  textContainer.appendChild(labelSpan);
  
  if (subtitle) {
    const subtitleSpan = document.createElement('span');
    subtitleSpan.className = 'liquid-button__subtitle';
    subtitleSpan.textContent = subtitle;
    textContainer.appendChild(subtitleSpan);
  }
  
  content.appendChild(textContainer);
  button.appendChild(content);
  
  // Event listeners
  button.addEventListener('click', (e) => {
    createRipple(button, e);
    onClick(e);
  });
  
  // Hover animasyonu
  button.addEventListener('mouseenter', () => {
    animateLiquidFill(button, true);
  });
  
  button.addEventListener('mouseleave', () => {
    animateLiquidFill(button, false);
  });
  
  // Touch desteği
  button.addEventListener('touchstart', () => {
    animateLiquidFill(button, true);
  }, { passive: true });
  
  button.addEventListener('touchend', () => {
    animateLiquidFill(button, false);
  }, { passive: true });
  
  return button;
}

/**
 * Ripple efekti oluşturur
 */
function createRipple(button, event) {
  const ripple = document.createElement('span');
  ripple.className = 'liquid-button__ripple';
  
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  
  let x, y;
  if (event.touches) {
    x = event.touches[0].clientX - rect.left - size / 2;
    y = event.touches[0].clientY - rect.top - size / 2;
  } else {
    x = event.clientX - rect.left - size / 2;
    y = event.clientY - rect.top - size / 2;
  }
  
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  button.appendChild(ripple);
  
  // Animasyon bitince kaldır
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
}

/**
 * GSAP ile sıvı dolum animasyonu
 */
function animateLiquidFill(button, fill) {
  const pseudoBefore = button;
  
  if (fill) {
    gsap.to(pseudoBefore, {
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => {
        button.style.setProperty('--liquid-height', '0%');
      },
      onUpdate: function() {
        const progress = this.progress();
        button.style.setProperty('--liquid-height', `${progress * 100}%`);
      }
    });
  } else {
    gsap.to(pseudoBefore, {
      duration: 0.3,
      ease: 'power2.in',
      onUpdate: function() {
        const progress = 1 - this.progress();
        button.style.setProperty('--liquid-height', `${progress * 100}%`);
      }
    });
  }
}

/**
 * Fizik tabanlı sıvı animasyonu (hover'da dalga efekti)
 */
export function animateLiquidWave(button) {
  const tl = gsap.timeline({ repeat: -1, yoyo: true });
  
  tl.to(button, {
    duration: 2,
    ease: 'sine.inOut',
    onUpdate: function() {
      const wave = Math.sin(this.progress() * Math.PI * 2) * 5;
      button.style.setProperty('--wave-offset', `${wave}px`);
    }
  });
  
  return tl;
}

/**
 * Buton grubuna stagger animasyonu uygular
 */
export function animateButtonGroup(buttons, options = {}) {
  const { delay = 0, stagger = 0.1 } = options;
  
  gsap.fromTo(buttons, 
    {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger,
      delay,
      ease: 'back.out(1.7)'
    }
  );
}

export default createLiquidButton;
