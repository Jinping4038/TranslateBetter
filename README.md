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

Settings is temporarily hidden from navigation. Previously saved Practice Preferences still control only normal Practice; their stored values are preserved. Both preferences default on and are saved in localStorage. Existing practice attempts (including revisions) establish whether a sentence has been practiced; its most recent valid scores determine review priority. An overall average below 4 or any category below 4 qualifies for lower-score review. Legacy records without valid scores still count as previously practiced but do not receive score-based priority.

With both preferences on, automatic selection normally chooses an unpracticed sentence, with a 25% chance to revisit an eligible lower-scoring one. Once new sentences run out, completed sentences remain available. Turning off new-sentence priority allows the full bank; turning off lower-score review removes that extra weighting. The last five displayed sentences are excluded, with a smaller-bank fallback. Previous/Next retraces the current tab's viewing sequence before selecting another sentence. The sequence survives refresh in sessionStorage. My Sentences → Practice Again directly opens the selected saved sentence. Assessment uses its own unchanged bank and selection rules.

Selection checks: `node --test tests/practice-selection.test.mjs tests/milestone3.test.mjs`.

## Progress score trend

Practice Sessions counts valid, dated initial translations submitted for AI feedback across all dates, including a new blank-input submission after My Sentences → Practice Again. Revisions do not add sessions and remain counted in Revisions Completed. Today’s goal remains a separate daily unique-sentence metric. Progress derives its average, skill breakdown, insights, and daily chart from the same valid, dated, original Practice attempts. Each local calendar day with completed practice gets one point, averaging all original attempts on that day; no empty dates or weekly buckets are generated. Overall is the average of the three skill scores. Revisions remain saved and counted separately in Revisions Completed; they do not inflate the original-attempt metrics. Assessment records are excluded. Undated or invalid legacy records are preserved in storage, but cannot contribute to these dated metrics.

Progress checks: `node --test tests/*.test.mjs`.

## Learner and Reviewer versions

First-time visitors choose Learner Version or Reviewer Version in a welcome dialog. The choice is stored as `tb-app-mode` in localStorage and can be changed with the switcher in the top-right of the app header. Existing users without a selected mode see the new chooser once; the old reviewer-notice dismissal setting is left untouched. If storage is unavailable, mode selection lasts for the current visit.

Learner Version hides English-meaning controls in Practice and Assessment. Reviewer Version offers a collapsed-by-default English Meaning button within each sentence card. Separate glosses cover all 100 Practice and 20 Assessment sentences. Switching to Learner hides any open meaning; returning to Reviewer leaves it collapsed. Source sentences, audio controls, drafts, progress, revisions, assessment history, and scoring are unchanged. App mode is presentation-only and is not sent to AI or included in score calculations.

Assessment opens on its banner and history overview, even with no previous results or with an unfinished draft. Starting or continuing is explicit; the banner uses Start Assessment for first-time visitors and Take Another Assessment when results or a draft exist. An unfinished draft is retained when continuing. Back to Assessment returns to the overview without discarding answers, and completing the assessment also returns to the overview.

## Fixed assessment forms

Assessment uses four fixed internal forms of five sentences (20 unique sentences, separate from Practice). A new learner completes forms A → B → C → D → A, with no immediate form repetition. Internal form names are never rendered. The next form follows the latest completed form, inferred from its source sentences for older records; new drafts/results also store a numeric `formIndex`. If an older sentence bank cannot be identified, completed-record count provides the fallback position. Existing history and the first completed baseline are not rewritten. Unfinished drafts keep their original sentences and answers until completed; entering/leaving or retrying scoring does not advance the form.

The existing content is retained: familiar everyday situations, generally one or two linked ideas, and intermediate English structures (conditions, time relationships, passive voice, negation/comparison, relative clauses, or reported instructions). The sets average approximately 16–20 Chinese characters per sentence and 13–15 words in their reference translations. This is approximate content balancing, not a claim of statistically validated test equivalence.

## Inline revision review

Submitting a revision stays on the revision page, showing the newly submitted version's AI feedback immediately. Below the editor/feedback, the original-vs-selected-revision score table remains visible. The revision selector updates both feedback and comparison; Show Changes expands a word-level original/revised view with removed and added text highlighted. New submitted versions retain their own feedback alongside existing version data. Older versions without stored detailed feedback still show scores, with a message instead of incorrectly showing another version's feedback. All versions remain in My Sentences history; revision submissions still count only toward Revisions Completed. The selected revision and Show Changes state survive tab refresh. Old comparison-page drafts reopen in the inline revision view.
