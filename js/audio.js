const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const UNLOCK_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'];

let ctx = null;
let muted = false;

function getContext() {
  if (!AudioContextClass) return null;
  if (!ctx) {
    try {
      if (navigator.audioSession) navigator.audioSession.type = 'ambient';
      ctx = new AudioContextClass();
    } catch (e) {
      return null;
    }
  }
  return ctx;
}

function unlock() {
  const c = getContext();
  if (!c || c.state === 'running') return;

  c.resume().catch(() => {});

  try {
    const src = c.createBufferSource();
    src.buffer = c.createBuffer(1, 1, 22050);
    src.connect(c.destination);
    src.start(0);
  } catch (e) {}
}

function tone(freq, start, dur, type, vol, slideTo) {
  const c = getContext();
  if (!c || muted) return;

  const play = () => {
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
  };

  if (c.state === 'running') {
    play();
  } else {
    c.resume().then(() => {
      if (c.state === 'running') play();
    }).catch(() => {});
  }
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
  },
  quake() {
    tone(48, 0, 1.1, 'sawtooth', 0.12, 36);
    noise(0.0, 0.35, 0.18, 'lowpass', 150);
    noise(0.35, 0.4, 0.3, 'lowpass', 180);
    noise(0.75, 0.4, 0.45, 'lowpass', 220);
  },
  crack() {
    noise(0, 0.12, 0.6, 'highpass', 1800);
    noise(0.02, 0.4, 0.35, 'bandpass', 900);
    noise(0.16, 0.08, 0.3, 'highpass', 2500);
    tone(180, 0, 0.4, 'square', 0.12, 40);
  },
  cry() {
    tone(640, 0, 0.5, 'triangle', 0.14, 430);
    tone(640, 0, 0.5, 'sawtooth', 0.03, 430);
    tone(600, 0.55, 0.5, 'triangle', 0.14, 390);
    tone(600, 0.55, 0.5, 'sawtooth', 0.03, 390);
    tone(560, 1.1, 0.7, 'triangle', 0.14, 320);
    tone(560, 1.1, 0.7, 'sawtooth', 0.03, 320);
    tone(320, 1.9, 0.08, 'square', 0.05, 260);
    tone(320, 2.05, 0.08, 'square', 0.05, 260);
    tone(300, 2.25, 0.08, 'square', 0.05, 250);
    tone(280, 2.5, 0.12, 'square', 0.05, 220);
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

function whenRunning(c, fn) {
  if (c.state === 'running') {
    fn();
  } else {
    c.resume().then(() => {
      if (c.state === 'running') fn();
    }).catch(() => {});
  }
}

function noise(start, dur, vol, filterType, freq) {
  const c = getContext();
  if (!c || muted) return;

  whenRunning(c, () => {
    const t = c.currentTime + start;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buffer = c.createBuffer(1, len, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    const src = c.createBufferSource();
    src.buffer = buffer;

    const filter = c.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;

    const gain = c.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    src.start(t);
  });
}