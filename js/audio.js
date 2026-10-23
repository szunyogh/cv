// Web Audio alapú hangeffektek (külső hangfájl nélkül) és némítás.

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const UNLOCK_EVENTS = ['pointerdown', 'touchstart', 'touchend', 'keydown', 'click'];

let ctx = null;
let muted = false;

function getContext() {
  if (!AudioContextClass) return null;
  if (!ctx) {
    try {
      ctx = new AudioContextClass();
    } catch (e) {
      return null;
    }
  }
  return ctx;
}

// A böngészők csak felhasználói interakció után engedik elindítani a hangot
function unlock() {
  const c = getContext();
  if (c && c.state === 'suspended') c.resume();
}

function tone(freq, start, dur, type, vol, slideTo) {
  const c = getContext();
  if (!c || c.state !== 'running' || muted) return;

  const t = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export const sfx = {
  pop() {
    tone(380, 0, 0.14, 'sine', 0.2, 900);
  },

  nope() {
    tone(300, 0, 0.14, 'square', 0.07, 210);
    tone(210, 0.13, 0.2, 'square', 0.07, 140);
  },

  yes() {
    tone(523, 0, 0.18, 'triangle', 0.2);
    tone(659, 0.1, 0.18, 'triangle', 0.2);
    tone(784, 0.2, 0.18, 'triangle', 0.2);
    tone(1047, 0.3, 0.7, 'triangle', 0.22);
    tone(1319, 0.3, 0.7, 'sine', 0.08);
  },

  sad() {
    tone(392, 0, 0.3, 'sawtooth', 0.07);
    tone(370, 0.32, 0.3, 'sawtooth', 0.07);
    tone(349, 0.64, 0.3, 'sawtooth', 0.07);
    tone(330, 0.96, 1.0, 'sawtooth', 0.07, 262);
  }
};

export function initAudio(muteButton) {
  UNLOCK_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, unlock, { passive: true });
  });

  muteButton.addEventListener('click', () => {
    muted = !muted;
    muteButton.textContent = muted ? '🔇' : '🔊';
  });
}
