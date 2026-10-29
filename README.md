# TranslateBetter

A responsive React recreation of the three supplied screens: landing, translation practice, and feedback.

Run `npm install`, then `npm run dev`. Build with `npm run build`.

Includes 100 Chinese-to-English exercises, hints, Chinese speech playback (browser dependent), revision, copying reference answers, saved sentences, and local progress storage. AI feedback uses a Cloudflare Worker with Groq. Deploy worker/worker.js to translatebetter-api.jinping4038.workers.dev and configure GROQ_API_KEY as a Cloudflare secret. The frontend sends translation data to /feedback. The origin check supports the GitHub Pages website; it is not user authentication. Groq free-tier quotas are shared by visitors. The level setting changes the session label; exercises are currently intermediate.
