# CoreKnight secure contact form deployment

## 1. Preserve existing email routing
Confirm `hello@coreknight.com` forwards to `ccsonyewuotu@gmail.com`. Do not replace Cloudflare Email Routing MX records.

## 2. Resend
Create an account at https://resend.com. Add a **sending subdomain** `mail.coreknight.com` and copy its DNS verification records into Cloudflare. A subdomain is recommended to avoid conflicting with the MX records used by Cloudflare Email Routing at the root. DNS entries must be copied exactly from Resend; any Resend MX records must be scoped to the sending subdomain, not `@`. Verify the sending domain, then create an API key with sending permission.
In `cloudflare-worker/index.js` set the `from` address to `CoreKnight Website <contact@mail.coreknight.com>` (already configured). The recipient remains `hello@coreknight.com` and `reply_to` is the visitor.

## 3. Turnstile
Cloudflare Dashboard > Turnstile > Add widget. Add allowed hostnames `coreknight.com` and `www.coreknight.com`. Copy public site key and private secret key.

## 4. Worker
Cloudflare Dashboard > Workers & Pages > Create > Worker. Name it `coreknight-contact`. Deploy and edit its code to match `cloudflare-worker/index.js` in this package. In Worker > Settings > Variables and Secrets, add **encrypted secrets** `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY`. Never place these values in GitHub or public frontend files. Redeploy. Copy the exact public Worker URL.
Alternative CLI deployment: in `cloudflare-worker` run `npx wrangler login`, `npx wrangler deploy`, `npx wrangler secret put TURNSTILE_SECRET_KEY`, `npx wrangler secret put RESEND_API_KEY`.

## 5. Frontend
Edit the website root `config.js` to set `apiUrl` to your exact Worker URL and `turnstileSiteKey` to your public site key. Upload the website root files to GitHub Pages repository `ocspeedwell/coreknight`. Preserve the supplied `styles.css` to retain the mobile intro fix. Do not upload private secrets. The Worker folder can be kept separately.

## 6. Test
Open https://coreknight.com, complete all fields and Turnstile, then submit. Check that the notification reaches `ccsonyewuotu@gmail.com` through `hello@coreknight.com`. Test missing fields and spam trap. Configure Cloudflare rate limiting or a Worker rate limiter for production; Turnstile alone is not a rate limit.

IMPORTANT: The form is not operational until the Worker, Turnstile, Resend verification, and public config are configured. Cloudflare Email Routing handles incoming mail only; the Resend API sends website notifications.
