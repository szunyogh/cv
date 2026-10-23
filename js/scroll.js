// Görgetéssel kapcsolatos segédfüggvények.

function isAtBottom() {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop;
  return window.innerHeight + scrolled >= document.documentElement.scrollHeight - 4;
}

// Egyszer meghívja a callback-et, amikor az olvasó az oldal aljára ér.
export function onceAtBottom(callback) {
  let fired = false;

  window.addEventListener('scroll', () => {
    if (!fired && isAtBottom()) {
      fired = true;
      callback();
    }
  }, { passive: true });
}
