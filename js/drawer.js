// Mobil nézet: a profil sidebar kihúzható panelként (drawer) működik.

import { MOBILE_BREAKPOINT } from './config.js';

const SWIPE_CLOSE_DISTANCE = 60; // px balra húzás, ami bezárja a panelt

export function initDrawer() {
  const toggle = document.getElementById('drawerToggle');
  const closeBtn = document.getElementById('drawerClose');
  const scrim = document.getElementById('drawerScrim');
  const drawer = document.getElementById('drawer');

  function setOpen(open) {
    document.body.classList.toggle('drawer-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', () => setOpen(true));
  closeBtn.addEventListener('click', () => setOpen(false));
  scrim.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) setOpen(false);
  });

  // Balra swipe-pal bezárható
  let startX = null;
  drawer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  drawer.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (dx < -SWIPE_CLOSE_DISTANCE) setOpen(false);
  }, { passive: true });
}
