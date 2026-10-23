function isAtBottom() {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop;
  return window.innerHeight + scrolled >= document.documentElement.scrollHeight - 4;
}

export function onceAtBottom(callback) {
  const sentinel = document.getElementById('pageEnd');
  if (!sentinel) return;

  const MARGIN = 40;
  const vv = window.visualViewport;
  let fired = false;
  let observer;
  let poll;

  function check() {
    if (fired || window.scrollY <= 0) return;
    const vh = vv ? vv.height : window.innerHeight;
    if (sentinel.getBoundingClientRect().top <= vh + MARGIN) fire();
  }

  function fire() {
    if (fired) return;
    fired = true;
    cleanup();
    callback();
  }

  function cleanup() {
    observer.disconnect();
    clearInterval(poll);
    window.removeEventListener('scroll', check);
    window.removeEventListener('scrollend', check);
    window.removeEventListener('resize', check);
    window.removeEventListener('touchend', check);
    if (vv) {
      vv.removeEventListener('resize', check);
      vv.removeEventListener('scroll', check);
    }
  }

  observer = new IntersectionObserver(check, {
    rootMargin: `0px 0px ${MARGIN}px 0px`,
    threshold: 0
  });
  observer.observe(sentinel);

  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('scrollend', check, { passive: true });
  window.addEventListener('resize', check);
  window.addEventListener('touchend', check, { passive: true });
  if (vv) {
    vv.addEventListener('resize', check);
    vv.addEventListener('scroll', check);
  }

  poll = setInterval(check, 300);
}
