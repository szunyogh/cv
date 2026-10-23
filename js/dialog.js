// A "Akarsz nekem munkát adni?" dialógus: megjelenítés és lépésről lépésre haladás.
// A hangot (sfx) és az "Igen" gomb hatását (onAccept) kívülről kapja, így nem függ tőlük.

import { createDodger } from './dodge.js';

const SOUND_DELAY = 380;

function byId(id) {
  return document.getElementById(id);
}

function makeButton(label, variant, handler) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `dlg-btn ${variant}`;
  btn.textContent = label;
  btn.addEventListener('click', handler);
  return btn;
}

export function createDialog({ steps, sfx, onAccept }) {
  const overlay = byId('dlgOverlay');
  const titleEl = byId('dlgTitle');
  const textEl = byId('dlgText');
  const stepEl = byId('dlgStep');
  const actionsEl = byId('dlgActions');
  const dodger = createDodger(document.querySelector('.dlg'));

  let index = 0;

  function close() {
    overlay.classList.remove('open');
    document.body.classList.remove('dlg-open');
    dodger.reset(0);
  }

  function next() {
    sfx.nope();
    index++;
    render();
    const step = steps[index];
    setTimeout(step.close ? sfx.sad : sfx.pop, SOUND_DELAY);
  }

  function render() {
    const step = steps[index];

    dodger.reset(step.dodge);
    titleEl.textContent = step.title;
    textEl.textContent = step.text;
    stepEl.textContent = `// dialog ${index + 1}/${steps.length}`;
    actionsEl.replaceChildren();

    if (step.close) {
      actionsEl.appendChild(makeButton(step.close, 'yes', close));
      return;
    }

    const noBtn = makeButton(step.no, 'no', next);
    noBtn.addEventListener('pointerenter', (e) => dodger.tryDodge(e, noBtn));
    actionsEl.appendChild(noBtn);
    actionsEl.appendChild(makeButton(step.yes, 'yes', onAccept));
  }

  function open() {
    index = 0;
    render();
    overlay.classList.add('open');
    document.body.classList.add('dlg-open');
    sfx.pop();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  return { open, close };
}
