(() => {
  const intro = document.getElementById('cinematic-intro');
  if (!intro) return;
  const skip = document.getElementById('skip-intro');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let done = false;
  let timer;
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    intro.classList.add('intro-exit');
    document.body.classList.remove('intro-active');
    intro.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => intro.remove(), 950);
  };
  const button = document.createElement('button');
  button.id = 'intro-sound-toggle';
  button.type = 'button';
  button.textContent = '♫ ENTER COREKNIGHT WITH SOUND';
  button.setAttribute('aria-label', 'Enable cinematic soundtrack');
  intro.appendChild(button);
  const sound = () => window.CoreKnightSound?.intro?.() ?? Promise.resolve(false);
  const markPlaying = () => {
    button.textContent = '♫ SOUND ON';
    button.disabled = true;
    try { localStorage.setItem('coreknight-intro-sound', 'on'); } catch (_) {}
  };
  // Attempt autoplay, browsers may reject this without a user gesture.
  if (!reduce) {
    sound().then(ok => { if (ok && !done) markPlaying(); }).catch(() => {});
  }
  button.addEventListener('click', async () => {
    if (done) return;
    // This call begins directly inside the user gesture for mobile browser audio unlocking.
    const result = sound();
    button.textContent = '♫ ACTIVATING SOUND';
    if (await result) {
      markPlaying();
      // Restart visual timing so the visitor hears the entire soundtrack.
      intro.classList.remove('intro-replay');
      void intro.offsetWidth;
      intro.classList.add('intro-replay');
      clearTimeout(timer);
      timer = window.setTimeout(finish, 5500);
    } else {
      button.textContent = '♫ TAP TO ENABLE SOUND';
    }
  });
  skip?.addEventListener('click', finish);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !done) finish(); });
  timer = window.setTimeout(finish, reduce ? 450 : 5500);
})();
