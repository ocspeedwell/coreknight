# CoreKnight Technologies Ltd, Website V4

## Contact form fix
V3 intercepted FormSubmit with cross-origin AJAX, which could fail in browsers. V4 uses a standard HTML POST to `https://formsubmit.co/ccsonyewuotu@gmail.com`, letting FormSubmit handle verification and CAPTCHA on its own page. No client-side JavaScript intercepts submissions.

**Activation is essential:** publish the website, submit a test message, and follow the FormSubmit activation email delivered to `ccsonyewuotu@gmail.com` (check spam). Submit another test after activation and verify the message arrives. This has NOT been live-tested. FormSubmit is a third-party service, not a guaranteed delivery system.

**To change email recipient:** update the `action` URL in `index.html`. Purchasing `coreknight.com` alone does not create an email inbox.

## Custom domain GitHub Pages
1. Upload all extracted files, including `CNAME`, to the repository root.
2. In GitHub repository Settings > Pages > Custom domain, enter `coreknight.com` and save.
3. At your DNS provider set four A records for `@` to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
4. Set `www` CNAME to `ocspeedwell.github.io` (not `coreknight.com`).
5. Remove conflicting A/AAAA/CNAME records for the same hosts, but **do not remove MX, TXT, or other email-related records**.
6. Wait for DNS and GitHub Pages verification, then enable Enforce HTTPS.

GitHub Pages serves static websites, so a robust first-party contact form with message storage and delivery guarantees requires a serverless function or backend service. Never put mail service API keys in public JavaScript.
