# CoreKnight V11: Sonic identity and Geraldine mobile experience

Upload the full contents of this folder to the **root** of your GitHub `ocspeedwell/coreknight` repository, preserving directories. This is based on the uploaded `coreknight-main.zip`.

Changes: `index.html`, `intro.js`, `styles.css`, `sound.js` (new), `knightconcierge.js`, `knightconcierge.css`.

The cinematic sound is intentionally **user initiated**. Browser autoplay restrictions prevent reliable automatic sound on page load. Visitors can select "PLAY INTRO WITH SOUND" during the 5.5-second intro. Geraldine's two-tone chime plays when a visitor opens her chat and when a successful reply arrives, with a sound toggle in her header. Sounds are original Web Audio synthesis, not third-party recordings.

The mobile chat uses the full dynamic viewport, respects notches and safe areas, has 16px input text to avoid iOS zoom, and scrolls messages independently. No Cloudflare Worker, contact-form backend, or credentials were changed.

Test: desktop and mobile intro, tap the sound button promptly on intro, skip intro, open/close Geraldine, sound toggle, WhatsApp, Turnstile, and chat (requires API credits). On GitHub Pages, allow deployment to finish and refresh without cache.
