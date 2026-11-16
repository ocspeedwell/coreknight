/* CoreKnight original synthesised sound identity. Audio playback follows browser policies. */
(() => {
  let ctx;
  const Context = window.AudioContext || window.webkitAudioContext;
  function context() {
    if (!Context) return null;
    if (!ctx) ctx = new Context();
    return ctx;
  }
  function tone(c, frequency, offset, duration, peak, type = 'sine') {
    const start = c.currentTime + offset;
    const oscillator = c.createOscillator();
    const envelope = c.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(peak, start + Math.min(.09, duration / 4));
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(c.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .03);
  }
  async function ready() {
    const c = context();
    if (!c) return null;
    if (c.state !== 'running') {
      try { await c.resume(); } catch (_) { return null; }
    }
    return c.state === 'running' ? c : null;
  }
  window.CoreKnightSound = {
    async intro() {
      const c = await ready();
      if (!c) return false;
      // Layered cinematic bass, metallic ascent, and final luminous resolve.
      tone(c, 65.41, 0, 1.45, .19, 'triangle');
      tone(c, 130.81, .12, 1.05, .065, 'sine');
      tone(c, 164.81, .7, 1.4, .09, 'triangle');
      tone(c, 329.63, 1.25, 1.35, .105, 'triangle');
      tone(c, 493.88, 2.05, 1.3, .09, 'sine');
      tone(c, 659.25, 2.75, 1.45, .12, 'sine');
      tone(c, 82.41, 3.35, 1.4, .16, 'triangle');
      tone(c, 987.77, 3.55, 1.1, .075, 'sine');
      return true;
    },
    async chime() {
      const c = await ready();
      if (!c) return false;
      tone(c, 659.25, 0, .24, .09);
      tone(c, 987.77, .16, .44, .075);
      return true;
    }
  };
})();
