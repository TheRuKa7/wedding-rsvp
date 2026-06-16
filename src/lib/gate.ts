/*
  Tiny coordinator so the hero animation waits for the invitation to be opened
  (otherwise the name reveal plays behind the closed gate and the guest misses it).
*/
export const GATE_OPEN_EVENT = "invitation:open";

let opened = false;

export function isGateOpen() {
  return opened;
}

export function markGateOpen() {
  if (opened) return;
  opened = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(GATE_OPEN_EVENT));
  }
}

/** Run `cb` once the gate is open (immediately if it already is). Returns a cleanup. */
export function onGateOpen(cb: () => void): () => void {
  if (opened) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(GATE_OPEN_EVENT, handler, { once: true });
  return () => window.removeEventListener(GATE_OPEN_EVENT, handler);
}
