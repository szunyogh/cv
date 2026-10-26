import { sfx } from './audio.js';

const EMOJI = '😭';
const SVG_URL = new URL('./heart.svg', import.meta.url);
const POP_MS = 260;
const QUAKE_MS = 1100;
const FALL_MS = 1300;
const LIFE_FRAMES = 300;
const FADE_FRAMES = 60;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function quakeFrames(steps = 40) {
  const frames = [];
  for (let i = 0; i < steps; i++) {
    const p = i / (steps - 1);
    const amp = 2 + p * 12;
    const rot = 1 + p * 5;
    const last = i === steps - 1;
    const x = last ? 0 : (Math.random() * 2 - 1) * amp;
    const y = last ? 0 : (Math.random() * 2 - 1) * amp * 0.6;
    const r = last ? 0 : (Math.random() * 2 - 1) * rot;
    frames.push({ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` });
  }
  return frames;
}

function fallFrames(dir) {
  return [
    { transform: 'translate(0, 0) rotate(0deg)', opacity: 1, easing: 'ease-out' },
    {
      transform: `translate(${dir * 7}px, -5px) rotate(${dir * 7}deg)`,
      opacity: 1,
      offset: 0.18,
      easing: 'cubic-bezier(.5, 0, 1, .7)'
    },
    {
      transform: `translate(${dir * 22}px, 40px) rotate(${dir * 22}deg)`,
      opacity: 1,
      offset: 0.7
    },
    {
      transform: `translate(${dir * 40}px, 150px) rotate(${dir * 40}deg)`,
      opacity: 0
    }
  ];
}

export function createHeartbreak() {
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const svgMarkup = fetch(SVG_URL)
    .then((res) => (res.ok ? res.text() : null))
    .catch(() => null);

  let canvas = null;
  let ctx = null;
  let particles = [];
  let raf = null;
  let playing = false;

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.className = 'sob-canvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    window.addEventListener('resize', () => {
      if (raf) resize();
    });
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnEmojis() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const small = w < 600;
    const k = Math.min(1.3, Math.max(0.7, h / 800));
    const count = small ? 16 : 28;

    for (let i = 0; i < count; i++) {
      const size = (small ? 30 : 36) + Math.random() * (small ? 30 : 44);
      particles.push({
        x: size + Math.random() * (w - size * 2),
        y: h - size / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: -(14 + Math.random() * 12) * k,
        size,
        rot: 0,
        vr: (Math.random() - 0.5) * 0.25,
        wait: (Math.random() * 30) | 0,
        age: 0
      });
    }
  }

  function frame() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const alive = [];
    for (const p of particles) {
      if (p.wait > 0) {
        p.wait--;
        alive.push(p);
        continue;
      }

      p.age++;
      p.vy += 0.55;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      const floor = h - p.size / 2;
      if (p.y > floor) {
        p.y = floor;
        if (Math.abs(p.vy) > 2.5) {
          p.vy *= -0.62;
          p.vx *= 0.92;
          p.vr *= 0.8;
        } else {
          p.vy = 0;
          p.vx *= 0.9;
          p.vr *= 0.9;
        }
      }
      if (p.x < p.size / 2) {
        p.x = p.size / 2;
        p.vx = Math.abs(p.vx);
      } else if (p.x > w - p.size / 2) {
        p.x = w - p.size / 2;
        p.vx = -Math.abs(p.vx);
      }

      const fade = p.age > LIFE_FRAMES ? 1 - (p.age - LIFE_FRAMES) / FADE_FRAMES : 1;
      if (fade <= 0) continue;
      alive.push(p);

      const pop = Math.min(1, p.age / 8);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(pop, pop);
      ctx.font = `${p.size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
      ctx.fillText(EMOJI, 0, 0);
      ctx.restore();
    }

    particles = alive;
    if (particles.length) {
      raf = requestAnimationFrame(frame);
    } else {
      raf = null;
      ctx.clearRect(0, 0, w, h);
    }
  }

  function burstEmojis() {
    ensureCanvas();
    resize();
    spawnEmojis();
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function buildHeart(markup) {
    const root = document.createElement('div');
    root.className = 'heartbreak';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = markup;
    document.body.appendChild(root);
    return {
      root,
      svg: root.querySelector('svg'),
      left: root.querySelector('.hb-left'),
      right: root.querySelector('.hb-right'),
      crack: root.querySelector('.hb-crack')
    };
  }

  async function play() {
    if (playing) return;
    playing = true;

    const markup = await svgMarkup;

    if (reduceMotion || !markup) {
      sfx.quake();
      await sleep(QUAKE_MS);
      sfx.crack();
      if (!reduceMotion) burstEmojis();
      setTimeout(sfx.cry, 350);
      playing = false;
      return;
    }

    const { root, svg, left, right, crack } = buildHeart(markup);

    svg.animate(
      [
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'scale(1.15)', opacity: 1, offset: 0.7 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      { duration: POP_MS, easing: 'ease-out' }
    );
    sfx.pop();
    await sleep(POP_MS);

    sfx.quake();
    crack.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { duration: QUAKE_MS * 0.9, fill: 'forwards', easing: 'ease-in' }
    );
    await svg.animate(quakeFrames(), { duration: QUAKE_MS, easing: 'linear' }).finished;

    crack.remove();
    sfx.crack();
    burstEmojis();
    setTimeout(sfx.cry, 350);

    const opts = { duration: FALL_MS, fill: 'forwards' };
    await Promise.all([
      left.animate(fallFrames(-1), opts).finished,
      right.animate(fallFrames(1), opts).finished
    ]);

    root.remove();
    playing = false;
  }

  return { play };
}