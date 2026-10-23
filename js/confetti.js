// Canvas alapú konfetti-effekt. Használat: createConfetti(canvas).fire()

import { CONFETTI_COLORS } from './config.js';

export function createConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let particles = [];
  let raf = null;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', () => {
    if (raf) resize();
  });

  function spawn(x, y, count, minAngle, maxAngle, minSpeed, maxSpeed) {
    for (let i = 0; i < count; i++) {
      const angle = (minAngle + Math.random() * (maxAngle - minAngle)) * Math.PI / 180;
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 5,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.3,
        flip: Math.random() * 6.28,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0]
      });
    }
  }

  function frame() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const alive = [];
    for (const p of particles) {
      p.vy += 0.35;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.flip += 0.18;

      if (p.y < h + 30) {
        alive.push(p);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.flip));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    particles = alive;
    raf = particles.length ? requestAnimationFrame(frame) : null;
  }

  function fire() {
    if (reduceMotion) return;

    resize();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const k = Math.min(1.3, Math.max(0.7, h / 800));
    const small = w < 600;
    const cannonCount = small ? 40 : 70;

    function cannons() {
      spawn(0, h, cannonCount, -80, -45, 15 * k, 25 * k);
      spawn(w, h, cannonCount, -135, -100, 15 * k, 25 * k);
    }

    cannons();
    spawn(w / 2, h / 2, small ? 60 : 90, -180, 180, 4 * k, 13 * k);
    setTimeout(cannons, 250);

    if (!raf) raf = requestAnimationFrame(frame);
  }

  return { fire };
}
