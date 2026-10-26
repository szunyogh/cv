import { createDodger } from './dodge.js';

const SOUND_DELAY = 380;

let pointerX = -1;
let pointerY = -1;

function trackPointer(e) {
  pointerX = e.clientX;
  pointerY = e.clientY;
}

window.addEventListener('pointermove', trackPointer, { passive: true });
window.addEventListener('pointerdown', trackPointer, { passive: true, capture: true });

function isUnderPointer(el) {
  const hit = document.elementFromPoint(pointerX, pointerY);
  return !!hit && (hit === el || el.contains(hit));
}

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

export function createDialog({ steps, sfx, onAccept, onGiveUp }) {
  const overlay = byId('dlgOverlay');
  const titleEl = byId('dlgTitle');
  const textEl = byId('dlgText');
  const stepEl = byId('dlgStep');
  const actionsEl = byId('dlgActions');
  const dodger = createDodger(overlay.querySelector('.dlg'));

  let index = 0;

  function close() {
    const gaveUp = overlay.classList.contains('open') && !!steps[index].close;

    overlay.classList.remove('open');
    document.body.classList.remove('dlg-open');
    dodger.reset(0);

    if (gaveUp && onGiveUp) onGiveUp();
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
    const yesBtn = makeButton(step.yes, 'yes', onAccept);
    actionsEl.appendChild(noBtn);
    actionsEl.appendChild(yesBtn);

    if (step.dodge) {
      let armed = isUnderPointer(noBtn);

      noBtn.addEventListener('pointerenter', (e) => {
        if (armed) return;
        dodger.tryDodge(e, noBtn);
      });

      noBtn.addEventListener('pointerleave', () => {
        armed = false;
      });

      noBtn.addEventListener('pointerdown', (e) => {
        if (!armed) return;
        dodger.tryDodge(e, noBtn);
        armed = false;
      });
    }
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