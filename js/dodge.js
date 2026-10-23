// A "Nem" gomb elől elugró dialógus (csak egérrel, desktopon).
// A dialógus elem arrébb csúszik a viewporton belül, amikor az egér a gombra ér.

const VIEWPORT_MARGIN = 12;   // ennyire közelítheti meg a képernyő szélét
const MIN_JUMP = 120;         // legalább ennyit ugorjon
const SAFE_PADDING = 24;      // a gomb körüli "tiltott zóna" az új pozícióban
const COOLDOWN_MS = 330;      // ennyi ideig nem reagál ugrás után (egyezzen a CSS transition-nel)
const MAX_TRIES = 40;

export function createDodger(element) {
  const canHover = window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let dodgesLeft = 0;
  let busy = false;
  let offX = 0;
  let offY = 0;

  function reset(count) {
    dodgesLeft = count || 0;
    busy = false;
    offX = 0;
    offY = 0;
    element.style.transform = '';
    element.style.pointerEvents = '';
  }

  function tryDodge(event, button) {
    if (!canHover || event.pointerType !== 'mouse') return;
    if (dodgesLeft <= 0 || busy) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = element.getBoundingClientRect();
    const btn = button.getBoundingClientRect();

    // Az elem eredeti (eltolás nélküli) pozíciója
    const baseLeft = rect.left - offX;
    const baseTop = rect.top - offY;

    const minX = VIEWPORT_MARGIN - baseLeft;
    const maxX = vw - VIEWPORT_MARGIN - rect.width - baseLeft;
    const minY = VIEWPORT_MARGIN - baseTop;
    const maxY = vh - VIEWPORT_MARGIN - rect.height - baseTop;
    if (maxX < minX || maxY < minY) return;

    let nx = offX;
    let ny = offY;
    for (let i = 0; i < MAX_TRIES; i++) {
      nx = minX + Math.random() * (maxX - minX);
      ny = minY + Math.random() * (maxY - minY);

      const far = Math.hypot(nx - offX, ny - offY) > MIN_JUMP;
      const left = btn.left + (nx - offX) - SAFE_PADDING;
      const top = btn.top + (ny - offY) - SAFE_PADDING;
      const hit =
        event.clientX > left && event.clientX < left + btn.width + SAFE_PADDING * 2 &&
        event.clientY > top && event.clientY < top + btn.height + SAFE_PADDING * 2;

      if (far && !hit) break;
    }

    offX = nx;
    offY = ny;
    dodgesLeft--;
    busy = true;
    element.style.pointerEvents = 'none';
    element.style.transform = `translate(${nx}px, ${ny}px)`;

    setTimeout(() => {
      busy = false;
      element.style.pointerEvents = '';
    }, COOLDOWN_MS);
  }

  return { reset, tryDodge };
}
