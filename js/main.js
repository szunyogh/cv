import { MAIL_DELAY } from './config.js';
import { DIALOG_STEPS } from './data/dialogSteps.js';
import { initAudio, sfx } from './audio.js';
import { createConfetti } from './confetti.js';
import { createDialog } from './dialog.js';
import { createIntroDialog } from './intro.js';
import { initDrawer } from './drawer.js';
import { openMailClient } from './mail.js';
import { onceAtBottom } from './scroll.js';

const confetti = createConfetti(document.getElementById('confetti'));
let accepting = false;

function handleAccept() {
  if (accepting) return;
  accepting = true;

  dialog.close();
  sfx.yes();
  confetti.fire();

  setTimeout(() => {
    openMailClient();
    accepting = false;
  }, MAIL_DELAY);
}

const dialog = createDialog({
  steps: DIALOG_STEPS,
  sfx,
  onAccept: handleAccept
});

initAudio(document.getElementById('dlgMute'));
initDrawer();
createIntroDialog({
  onClose: () => onceAtBottom(dialog.open)
});