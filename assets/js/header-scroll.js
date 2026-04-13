/**
 * EGLab Header Scroll Enhancement
 * Adds .scrolled class to .main-header when user scrolls down
 * for the elevated glass morphism effect
 */
(function () {
  'use strict';

  var header = document.querySelector('.main-header');
  if (!header) return;

  var scrollThreshold = 40;
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (window.scrollY > scrollThreshold) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();
