const categories = ['meaning', 'grammar', 'naturalness'];
export const validScore = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 5;

export function validatedPracticeScores(scores) {
  if (!categories.every(key => validScore(scores?.[key]))) {
    throw new Error('Scoring returned missing or invalid scores. Please request feedback again. Your practice total has not increased.');
  }
  const overall = categories.reduce((sum, key) => sum + scores[key], 0) / categories.length;
  if (scores.overall !== undefined && (!validScore(scores.overall) || Math.abs(scores.overall - overall) > 0.051)) {
    throw new Error('Scoring returned an invalid or inconsistent overall score. Please request feedback again.');
  }
  return {...Object.fromEntries(categories.map(key => [key, scores[key]])), overall};
}

export function validPracticeAttempt(attempt) {
  if (attempt?.mode === 'assessment' || typeof attempt?.zh !== 'string') return false;
  try {
    const scores = validatedPracticeScores(attempt.scores);
    return attempt.overall === undefined ||
      (validScore(attempt.overall) && Math.abs(attempt.overall - scores.overall) <= 0.051);
  } catch { return false; }
}

export function readPracticeSession() {
  try {
    const state = JSON.parse(sessionStorage.getItem('tb-active-practice'));
    if (!state || !Number.isInteger(state.index) || state.index < 0 || !Array.isArray(state.versions)) return null;
    if (state.versions.some(version => {
      try { validatedPracticeScores(version.scores); return typeof version.text !== 'string'; }
      catch { return true; }
    })) return null;
    if (['revision', 'comparison'].includes(state.page) && !state.versions.length) return null;
    if (state.page === 'comparison' && state.versions.length < 2) return null;
    return state;
  } catch { return null; }
}
