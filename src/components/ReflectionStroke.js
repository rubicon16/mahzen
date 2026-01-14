/**
 * SAKİ APP - Reflection Stroke Effect
 * Scroll/mouse bazlı yansıma efekti
 */

import gsap from 'gsap';

let reflectionAngle = 135;
let isTracking = false;
let rafId = null;

/**
 * Yansıma takibini başlatır
 */
export function initReflectionTracking() {
  if (isTracking) return;
  isTracking = true;
  
  // Mouse takibi (masaüstü)
  if (!isTouchDevice()) {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
  } else {
    // Touch takibi (mobil)
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Device orientation (gyroscope)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
  }
}

/**
 * Yansıma takibini durdurur
 */
export function stopReflectionTracking() {
  isTracking = false;
  
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('scroll', handleScroll);
  document.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('deviceorientation', handleOrientation);
  
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

/**
 * Mouse pozisyonuna göre açı hesapla
 */
function handleMouseMove(e) {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  // Açıyı hesapla (0-360 derece)
  const centerX = 0.5;
  const centerY = 0.5;
  const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  
  reflectionAngle = (angle + 180) % 360;
  
  requestReflectionUpdate();
}

/**
 * Scroll pozisyonuna göre açı hesapla
 */
function handleScroll() {
  const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const scrollAngle = scrollProgress * 90; // 0-90 derece arası
  
  reflectionAngle = 135 + scrollAngle;
  
  requestReflectionUpdate();
}

/**
 * Touch pozisyonuna göre açı hesapla
 */
function handleTouchMove(e) {
  if (!e.touches[0]) return;
  
  const x = e.touches[0].clientX / window.innerWidth;
  const y = e.touches[0].clientY / window.innerHeight;
  
  const centerX = 0.5;
  const centerY = 0.5;
  const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  
  reflectionAngle = (angle + 180) % 360;
  
  requestReflectionUpdate();
}

/**
 * Device orientation (gyroscope) ile açı hesapla
 */
function handleOrientation(e) {
  const gamma = e.gamma || 0; // Sol-sağ eğim (-90 to 90)
  const beta = e.beta || 0;   // Ön-arka eğim (-180 to 180)
  
  // Normalize et
  const normalizedGamma = (gamma + 90) / 180; // 0-1
  const normalizedBeta = (beta + 180) / 360;  // 0-1
  
  reflectionAngle = normalizedGamma * 180 + normalizedBeta * 90;
  
  requestReflectionUpdate();
}

/**
 * Yansıma güncellemesi için RAF kullan
 */
function requestReflectionUpdate() {
  if (rafId) return;
  
  rafId = requestAnimationFrame(() => {
    updateAllReflections();
    rafId = null;
  });
}

/**
 * Tüm butonların yansımasını günceller
 */
function updateAllReflections() {
  const buttons = document.querySelectorAll('.liquid-button');
  
  buttons.forEach(button => {
    updateReflection(button, reflectionAngle);
  });
}

/**
 * Tek bir butonun yansımasını günceller
 * @param {HTMLElement} button - Buton elementi
 * @param {number} angle - Yansıma açısı (derece)
 */
export function updateReflection(button, angle = reflectionAngle) {
  if (!button) return;
  
  // CSS custom property olarak ayarla
  button.style.setProperty('--reflection-angle', `${angle}deg`);
}

/**
 * Animasyonlu yansıma geçişi
 * @param {HTMLElement} button - Buton elementi
 * @param {number} targetAngle - Hedef açı
 */
export function animateReflection(button, targetAngle) {
  const currentAngle = parseFloat(
    getComputedStyle(button).getPropertyValue('--reflection-angle') || '135'
  );
  
  gsap.to({ angle: currentAngle }, {
    angle: targetAngle,
    duration: 0.5,
    ease: 'power2.out',
    onUpdate: function() {
      button.style.setProperty('--reflection-angle', `${this.targets()[0].angle}deg`);
    }
  });
}

/**
 * Touch cihazı kontrolü
 */
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Mevcut yansıma açısını döndürür
 */
export function getReflectionAngle() {
  return reflectionAngle;
}

/**
 * Yansıma açısını manuel ayarlar
 */
export function setReflectionAngle(angle) {
  reflectionAngle = angle;
  requestReflectionUpdate();
}

export default {
  initReflectionTracking,
  stopReflectionTracking,
  updateReflection,
  animateReflection,
  getReflectionAngle,
  setReflectionAngle
};
