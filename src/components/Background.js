/**
 * SAKİ APP - Dynamic Background Manager
 * Alkol türüne göre arka plan değiştirme
 */

import gsap from 'gsap';

const backgroundContainer = document.getElementById('background-container');
let currentBackground = null;

// Alkol renk haritası
const alcoholColors = {
  wine: {
    gradient: 'radial-gradient(ellipse at 50% 100%, #4A0E0E 0%, #1A0505 60%, #0a0101 100%)',
    ambient: '#4A0E0E'
  },
  whiskey: {
    gradient: 'radial-gradient(ellipse at 50% 100%, #8B4513 0%, #78350f 60%, #1a0f05 100%)',
    ambient: '#D4A574'
  },
  raki: {
    gradient: 'radial-gradient(ellipse at 50% 100%, #E8E8E8 0%, #9CA3AF 40%, #404040 100%)',
    ambient: '#E8E8E8'
  },
  beer: {
    gradient: 'radial-gradient(ellipse at 50% 100%, #F59E0B 0%, #B45309 50%, #78350F 100%)',
    ambient: '#FCD34D'
  },
  vodka: {
    gradient: 'radial-gradient(ellipse at 50% 0%, #E0F2FE 0%, #7DD3FC 30%, #0C4A6E 100%)',
    ambient: '#7DD3FC'
  },
  gin: {
    gradient: 'radial-gradient(ellipse at 50% 100%, #D1FAE5 0%, #059669 50%, #064E3B 100%)',
    ambient: '#6EE7B7'
  },
  tequila: {
    gradient: 'radial-gradient(ellipse at 50% 100%, #BEF264 0%, #84CC16 40%, #365314 100%)',
    ambient: '#84CC16'
  }
};

// Varsayılan arka plan
const defaultBackground = 'radial-gradient(ellipse at 50% 0%, #064E3B 0%, #022c22 50%, #011614 100%)';

/**
 * Arka planı değiştirir (smooth geçiş ile)
 * @param {string|null} alcoholType - Alkol tipi veya null (varsayılan için)
 */
export function setBackground(alcoholType) {
  const container = backgroundContainer || document.getElementById('background-container');
  if (!container) return;
  
  const colorConfig = alcoholType ? alcoholColors[alcoholType] : null;
  const gradient = colorConfig?.gradient || defaultBackground;
  
  // Mevcut arka planı kaydet
  const currentGradient = container.style.background || defaultBackground;
  
  // GSAP ile smooth geçiş
  gsap.to(container, {
    duration: 0.8,
    ease: 'power2.inOut',
    onStart: () => {
      container.style.background = gradient;
      container.style.opacity = 0;
    },
    opacity: 1
  });
  
  // Ambient light efekti
  if (colorConfig?.ambient) {
    createAmbientLight(colorConfig.ambient);
  } else {
    removeAmbientLight();
  }
  
  currentBackground = alcoholType;
}

/**
 * Hover durumunda geçici arka plan değişimi
 */
export function previewBackground(alcoholType) {
  const container = backgroundContainer || document.getElementById('background-container');
  if (!container) return;
  
  const colorConfig = alcoholType ? alcoholColors[alcoholType] : null;
  const gradient = colorConfig?.gradient || defaultBackground;
  
  gsap.to(container, {
    duration: 0.3,
    ease: 'power2.out',
    onUpdate: function() {
      container.style.background = gradient;
    }
  });
}

/**
 * Hover'dan çıkınca eski arka plana dön
 */
export function resetBackground() {
  if (currentBackground) {
    setBackground(currentBackground);
  } else {
    const container = backgroundContainer || document.getElementById('background-container');
    if (container) {
      gsap.to(container, {
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          container.style.background = defaultBackground;
        }
      });
    }
  }
}

/**
 * Ambient light efekti oluşturur
 */
function createAmbientLight(color) {
  let ambient = document.querySelector('.ambient-light');
  
  if (!ambient) {
    ambient = document.createElement('div');
    ambient.className = 'ambient-light';
    ambient.style.cssText = `
      position: fixed;
      bottom: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 150%;
      height: 100%;
      border-radius: 50%;
      filter: blur(100px);
      pointer-events: none;
      opacity: 0;
      z-index: -1;
    `;
    document.getElementById('app')?.appendChild(ambient);
  }
  
  gsap.to(ambient, {
    duration: 0.8,
    ease: 'power2.out',
    backgroundColor: color,
    opacity: 0.2
  });
}

/**
 * Ambient light'ı kaldırır
 */
function removeAmbientLight() {
  const ambient = document.querySelector('.ambient-light');
  if (ambient) {
    gsap.to(ambient, {
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        ambient.remove();
      }
    });
  }
}

/**
 * Arka plan rengini döndürür (sonuç ekranı için)
 */
export function getCurrentBackgroundColor() {
  if (currentBackground && alcoholColors[currentBackground]) {
    return alcoholColors[currentBackground].ambient;
  }
  return '#064E3B';
}

export default {
  setBackground,
  previewBackground,
  resetBackground,
  getCurrentBackgroundColor
};
