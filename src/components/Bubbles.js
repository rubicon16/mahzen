/**
 * SAKİ APP - Bubble Animation System
 * Kabarcık animasyonları
 */

import gsap from 'gsap';

const bubblesContainer = document.getElementById('bubbles-container');
let bubbleAnimations = [];
let continuousBubbleInterval = null;

/**
 * Tek bir kabarcık oluşturur
 * @param {Object} options - Kabarcık ayarları
 */
function createBubble(options = {}) {
  const {
    x = Math.random() * 100,
    size = 'medium',
    type = 'default', // default, beer, raki
    speed = 1
  } = options;
  
  const container = bubblesContainer || document.getElementById('bubbles-container');
  if (!container) return;
  
  const bubble = document.createElement('div');
  bubble.className = `bubble bubble--${size}`;
  
  if (type !== 'default') {
    bubble.classList.add(`bubble--${type}`);
  }
  
  // Boyut hesaplama
  const sizeMap = {
    small: { width: 6 + Math.random() * 4, opacity: 0.3 },
    medium: { width: 12 + Math.random() * 8, opacity: 0.4 },
    large: { width: 20 + Math.random() * 10, opacity: 0.5 }
  };
  
  const { width, opacity } = sizeMap[size] || sizeMap.medium;
  
  bubble.style.cssText = `
    width: ${width}px;
    height: ${width}px;
    left: ${x}%;
    bottom: -${width}px;
    opacity: ${opacity};
  `;
  
  container.appendChild(bubble);
  
  // Yükselme animasyonu
  const duration = (3 + Math.random() * 4) / speed;
  const xWobble = (Math.random() - 0.5) * 50;
  
  const anim = gsap.to(bubble, {
    y: -window.innerHeight - 50,
    x: xWobble,
    opacity: 0,
    duration,
    ease: 'none',
    onComplete: () => {
      bubble.remove();
    }
  });
  
  // Salınım efekti
  gsap.to(bubble, {
    x: `+=${Math.sin(Math.random() * Math.PI) * 20}`,
    duration: duration / 3,
    ease: 'sine.inOut',
    repeat: 3,
    yoyo: true
  });
  
  return anim;
}

/**
 * Patlama efekti (buton tıklandığında)
 * @param {HTMLElement} element - Kaynak element
 * @param {number} count - Kabarcık sayısı
 */
export function burstBubbles(element, count = 15, type = 'default') {
  const rect = element.getBoundingClientRect();
  const centerX = (rect.left + rect.width / 2) / window.innerWidth * 100;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const bubble = createBubbleAtPosition({
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY,
        size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)],
        type,
        speed: 1.5 + Math.random()
      });
    }, i * 30);
  }
}

/**
 * Belirli pozisyonda kabarcık oluşturur
 */
function createBubbleAtPosition(options) {
  const { x, y, size, type, speed } = options;
  
  const container = bubblesContainer || document.getElementById('bubbles-container');
  if (!container) return;
  
  const bubble = document.createElement('div');
  bubble.className = `bubble bubble--${size}`;
  
  if (type !== 'default') {
    bubble.classList.add(`bubble--${type}`);
  }
  
  const sizeMap = {
    small: 6 + Math.random() * 4,
    medium: 12 + Math.random() * 8,
    large: 20 + Math.random() * 10
  };
  
  const width = sizeMap[size] || sizeMap.medium;
  
  bubble.style.cssText = `
    width: ${width}px;
    height: ${width}px;
    left: ${x}%;
    top: ${y}px;
    opacity: 0.5;
  `;
  
  container.appendChild(bubble);
  
  // Yukarı + dağılma animasyonu
  const angle = (Math.random() - 0.5) * Math.PI;
  const distance = 100 + Math.random() * 200;
  
  gsap.to(bubble, {
    x: Math.sin(angle) * distance,
    y: -distance,
    opacity: 0,
    scale: 0.5,
    duration: 1 + Math.random(),
    ease: 'power2.out',
    onComplete: () => bubble.remove()
  });
}

/**
 * Sürekli kabarcık akışı başlatır (bira arka planı için)
 * @param {string} type - Kabarcık tipi
 */
export function startContinuousBubbles(type = 'beer') {
  stopContinuousBubbles();
  
  const spawnBubble = () => {
    const sizes = ['small', 'small', 'medium', 'medium', 'large'];
    createBubble({
      x: 10 + Math.random() * 80,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      type,
      speed: 0.8 + Math.random() * 0.4
    });
  };
  
  // Başlangıçta birkaç tane oluştur
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnBubble, i * 100);
  }
  
  // Düzenli aralıklarla yenilerini ekle
  continuousBubbleInterval = setInterval(spawnBubble, 300);
}

/**
 * Sürekli kabarcıkları durdurur
 */
export function stopContinuousBubbles() {
  if (continuousBubbleInterval) {
    clearInterval(continuousBubbleInterval);
    continuousBubbleInterval = null;
  }
  
  // Mevcut kabarcıkları temizle
  const container = bubblesContainer || document.getElementById('bubbles-container');
  if (container) {
    gsap.to(container.querySelectorAll('.bubble'), {
      opacity: 0,
      duration: 0.5,
      stagger: 0.02,
      onComplete: function() {
        this.targets().forEach(el => el.remove());
      }
    });
  }
}

/**
 * "Emin değilim" butonu için özel efekt
 * @param {HTMLElement} button - Buton elementi
 */
export function unsureBubbleEffect(button) {
  burstBubbles(button, 20, 'default');
  
  // Ekstra: düşünce baloncukları
  const rect = button.getBoundingClientRect();
  const startX = (rect.left + rect.width / 2) / window.innerWidth * 100;
  
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      createBubble({
        x: startX + (i - 1) * 5,
        size: ['small', 'medium', 'large'][i],
        type: 'default',
        speed: 0.5
      });
    }, i * 200);
  }
}

/**
 * Tüm kabarcıkları temizler
 */
export function clearAllBubbles() {
  stopContinuousBubbles();
  const container = bubblesContainer || document.getElementById('bubbles-container');
  if (container) {
    container.innerHTML = '';
  }
}

export default {
  burstBubbles,
  startContinuousBubbles,
  stopContinuousBubbles,
  unsureBubbleEffect,
  clearAllBubbles
};
