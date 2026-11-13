# KnightConcierge V8 deployment

1. Keep the existing site intact. The package adds `knightconcierge.css`, `knightconcierge.js`, and `ai-config.js` plus an independent `ai-worker/` directory.
2. In Cloudflare Workers & Pages, create a Worker named `coreknight-ai-concierge`. Deploy `ai-worker/index.js` (dashboard editor) or deploy with Wrangler from the `ai-worker` directory.
3. Under Worker Settings > Variables and Secrets, create **secret** `OPENAI_API_KEY` with your own OpenAI API key. Never place the key in GitHub, `ai-config.js`, or the browser. Set plaintext `ALLOWED_ORIGIN` to `https://coreknight.com`. Optionally set `OPENAI_MODEL` to a supported model.
4. In `ai-config.js`, replace the placeholder URL with the deployed HTTPS Worker URL. Upload the updated website files to GitHub Pages, preserving the existing contact form and V6 mobile styling.
5. Test from `https://coreknight.com`, asking about a website project, NARDTOPUS and a custom quote. Confirm the assistant does not invent pricing or accept payments.
6. **Production hardening before public launch:** configure Cloudflare WAF rate limiting on the Worker, enforce bot protection (Turnstile token validation or equivalent) and usage/budget alerts. Origin checks alone are NOT authentication and can be spoofed. Avoid public deployment until abuse controls are active. Use a separate Cloudflare Worker route or gateway to enforce rate limits and cost caps.
7. This is Phase 1 only. The assistant qualifies leads conversationally but does not yet store leads, generate approved quotations, take payments or autonomously close deals. Those require authenticated CRM, order states and payment verification.
8. KnightScout is not yet implemented. Plan it as a separate consent-aware, rate-limited discovery pipeline with human-reviewed outreach.

## Security
The Worker holds the secret server-side. The UI uses `textContent` rather than HTML for AI output to reduce injection risk. No visitor conversation is persisted in this MVP. Avoid sharing confidential information in chat. Review privacy notices before going live.
