import {validPracticeAttempt, validatedPracticeScores} from './practice-data.js';

export const practicePreferencesKey = 'tb-practice-preferences';
export const defaultPracticePreferences = {prioritizeUnseen: true, repeatLowerScores: true};
export function normalizePracticePreferences(value) {
  return Object.fromEntries(Object.entries(defaultPracticePreferences).map(([key, fallback]) =>
    [key, typeof value?.[key] === 'boolean' ? value[key] : fallback]));
}

// Derive history from existing attempts, including revisions; no records are rewritten.
export function sentencePerformance(attempts) {
  const history = new Map();
  for (const attempt of attempts) {
    if (attempt?.mode === 'assessment' || typeof attempt?.zh !== 'string') continue;
    const previous = history.get(attempt.zh) || {practiced: true};
    if (validPracticeAttempt(attempt)) {
      const timestamp = Date.parse(attempt.date) || 0;
      if (!previous.scores || timestamp >= previous.timestamp) {
        const scores = validatedPracticeScores(attempt.scores);
        history.set(attempt.zh, {practiced: true, scores, timestamp,
          lowerScoring: scores.overall < 4 || ['meaning','grammar','naturalness'].some(key => scores[key] < 4)});
        continue;
      }
    }
    history.set(attempt.zh, previous);
  }
  return history;
}

export function selectPracticeSentence(exercises, attempts, preferences, recent = [], random = Math.random) {
  if (!exercises.length) return null;
  const settings = normalizePracticePreferences(preferences);
  const history = sentencePerformance(attempts);
  const indexes = exercises.map((_, index) => index);
  // Exclude the last five shown sentences. Small banks relax the cooldown, never
  // repeating the current sentence unless there is only one sentence available.
  let candidates = indexes.filter(index => !recent.slice(-5).includes(index));
  if (!candidates.length) candidates = indexes.filter(index => index !== recent.at(-1));
  if (!candidates.length) candidates = indexes;
  const unseen = candidates.filter(index => !history.has(exercises[index].zh));
  const lower = candidates.filter(index => history.get(exercises[index].zh)?.lowerScoring);
  const pick = pool => pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
  // One in four selections may revisit a weaker sentence; new sentences remain
  // the normal choice when prioritized. All settings off means uniform selection.
  if (settings.repeatLowerScores && lower.length && random() < 0.25) return pick(lower);
  if (settings.prioritizeUnseen && unseen.length) return pick(unseen);
  return pick(candidates);
}
