# TranslateBetter

A responsive React recreation of the three supplied screens: landing, translation practice, and feedback.

Run `npm install`, then `npm run dev`. Build with `npm run build`.

Includes 100 Chinese-to-English exercises, hints, Chinese speech playback (browser dependent), revision, copying reference answers, saved sentences, and local progress storage. AI feedback uses a Cloudflare Worker with Groq. Deploy worker/worker.js to translatebetter-api.jinping4038.workers.dev and configure GROQ_API_KEY as a Cloudflare secret. The frontend sends translation data to /feedback. The origin check supports the GitHub Pages website; it is not user authentication. Groq free-tier quotas are shared by visitors. The level setting changes the session label; exercises are currently intermediate.

## Academic prototype data storage

This is a single-user academic prototype. Completed practice attempts, saved translation history, and assessment results are stored in localStorage for the current browser profile and website origin. People sharing that profile share its records. Different browsers, devices, and the local preview have separate records. Clearing browser site data removes these records.

The active practice/revision/comparison draft is stored in sessionStorage for its browser tab and survives a refresh. Closing the tab may discard that active draft. Saved translation history and completed results remain in localStorage.

Record updates read the latest stored data and use the Web Locks API when supported to serialize writes across tabs. Browsers without Web Locks use a fresh-read fallback and may still have simultaneous-write races.

Run the targeted regression checks with `node --test tests/milestone3.test.mjs`. They use mocked AI responses and isolated storage. Live AI availability and browser rendering require a separate manual check.

## Practice sentence preferences

Settings → Practice Preferences controls only normal Practice. Both preferences default on and are saved in localStorage. Existing practice attempts (including revisions) establish whether a sentence has been practiced; its most recent valid scores determine review priority. An overall average below 4 or any category below 4 qualifies for lower-score review. Legacy records without valid scores still count as previously practiced but do not receive score-based priority.

With both preferences on, automatic selection normally chooses an unpracticed sentence, with a 25% chance to revisit an eligible lower-scoring one. Once new sentences run out, completed sentences remain available. Turning off new-sentence priority allows the full bank; turning off lower-score review removes that extra weighting. The last five displayed sentences are excluded, with a smaller-bank fallback. Previous/Next retraces the current tab's viewing sequence before selecting another sentence. The sequence survives refresh in sessionStorage. My Sentences → Practice Again directly opens the selected saved sentence. Assessment uses its own unchanged bank and selection rules.

Selection checks: `node --test tests/practice-selection.test.mjs tests/milestone3.test.mjs`.

## Progress score trend

Practice Sessions counts valid, dated initial translations submitted for AI feedback across all dates, including a new blank-input submission after My Sentences → Practice Again. Revisions do not add sessions and remain counted in Revisions Completed. Today’s goal remains a separate daily unique-sentence metric. Progress derives its average, skill breakdown, insights, and daily chart from the same valid, dated, original Practice attempts. Each local calendar day with completed practice gets one point, averaging all original attempts on that day; no empty dates or weekly buckets are generated. Overall is the average of the three skill scores. Revisions remain saved and counted separately in Revisions Completed; they do not inflate the original-attempt metrics. Assessment records are excluded. Undated or invalid legacy records are preserved in storage, but cannot contribute to these dated metrics.

Progress checks: `node --test tests/*.test.mjs`.
