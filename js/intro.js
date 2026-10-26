import { ATS_CV_URL } from './config.js';

export function createIntroDialog({ onClose } = {}) {
  const overlay = document.getElementById('introOverlay');
  const atsBtn = document.getElementById('introAts');
  const closeBtn = document.getElementById('introClose');
  let closed = false;

  atsBtn.href = ATS_CV_URL;

  function close() {
    if (closed) return;
    closed = true;
    overlay.classList.remove('open');
    document.body.classList.remove('dlg-open');
    if (onClose) onClose();
  }

  atsBtn.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  atsBtn.focus({ preventScroll: true });

  return { close };
}