/* Original synthesized CoreKnight sound identity. No external audio assets. */
(() => {
  let ctx;
  const audio = () => {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    if (!ctx) ctx = new C();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  };
  function tone(freq, start, duration, volume, type = 'sine') {
    const c = audio(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + start);
    g.gain.setValueAtTime(0.0001, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), c.currentTime + start + 0.045);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + duration);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + start); o.stop(c.currentTime + start + duration + 0.02);
  }
  window.CoreKnightSound = {
    intro() {
      tone(82.41, 0, 1.1, .07, 'triangle');
      tone(164.81, .65, 1.5, .035, 'sine');
      tone(329.63, 1.25, 1.25, .04, 'triangle');
      tone(493.88, 2.15, 1.2, .04, 'sine');
      tone(659.25, 2.8, 1.45, .05, 'sine');
      tone(987.77, 3.55, 1.1, .022, 'sine');
    },
    chime() { tone(659.25, 0, .22, .035); tone(987.77, .15, .42, .026); }
  };
})();
