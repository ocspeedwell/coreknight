(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submit = document.getElementById('contact-submit');
  const cfg = window.COREKNIGHT_CONTACT || {};
  let widgetId = null;
  function mount() {
    if (!window.turnstile || widgetId !== null) return;
    if (!cfg.turnstileSiteKey || cfg.turnstileSiteKey.startsWith('REPLACE')) {
      status.textContent = 'Contact form setup is pending. Please email hello@coreknight.com.'; return;
    }
    widgetId = window.turnstile.render('#ck-turnstile', {sitekey: cfg.turnstileSiteKey, theme: 'auto'});
  }
  const poll = setInterval(() => { mount(); if (widgetId !== null) clearInterval(poll); }, 250);
  setTimeout(() => clearInterval(poll), 15000);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!cfg.apiUrl || cfg.apiUrl.includes('REPLACE') || widgetId === null) {
      status.textContent = 'Form is not activated yet. Please email hello@coreknight.com.'; return;
    }
    const token = window.turnstile.getResponse(widgetId);
    if (!token) { status.textContent = 'Please complete the security verification.'; return; }
    const data = Object.fromEntries(new FormData(form).entries());
    data.turnstileToken = token;
    submit.disabled = true; status.textContent = 'Sending your enquiry…';
    try {
      const res = await fetch(cfg.apiUrl, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error || 'Unable to send.');
      form.reset(); status.textContent = 'Thank you. Your enquiry has been sent successfully.';
    } catch (err) {
      status.textContent = 'We could not send your enquiry. Please email hello@coreknight.com directly.';
    } finally {
      submit.disabled = false; window.turnstile.reset(widgetId);
    }
  });
})();
