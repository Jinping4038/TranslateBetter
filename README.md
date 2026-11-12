# TranslateBetter

A responsive React recreation of the three supplied screens: landing, translation practice, and feedback.

Run `npm install`, then `npm run dev`. Build with `npm run build`.

Includes 100 Chinese-to-English exercises, hints, Chinese speech playback (browser dependent), revision, copying reference answers, saved sentences, and local progress storage. AI feedback uses a Cloudflare Worker with Groq. Deploy worker/worker.js to translatebetter-api.jinping4038.workers.dev and configure GROQ_API_KEY as a Cloudflare secret. The frontend sends translation data to /feedback. The origin check supports the GitHub Pages website; it is not user authentication. Groq free-tier quotas are shared by visitors. The level setting changes the session label; exercises are currently intermediate.

## Academic prototype data storage

This is a single-user academic prototype. Completed practice attempts, saved translation history, and assessment results are stored in localStorage for the current browser profile and website origin. People sharing that profile share its records. Different browsers, devices, and the local preview have separate records. Clearing browser site data removes these records.

The active practice/revision/comparison draft is stored in sessionStorage for its browser tab and survives a refresh. Closing the tab may discard that active draft. Saved translation history and completed results remain in localStorage.

Record updates read the latest stored data and use the Web Locks API when supported to serialize writes across tabs. Browsers without Web Locks use a fresh-read fallback and may still have simultaneous-write races.

Run the targeted regression checks with `node --test tests/milestone3.test.mjs`. They use mocked AI responses and isolated storage. Live AI availability and browser rendering require a separate manual check.
