export const assessmentSkills = [
  ['meaning', 'Meaning Accuracy'],
  ['grammar', 'Grammar'],
  ['naturalness', 'Naturalness'],
];

export function validAssessmentScores(scores) {
  return assessmentSkills.every(([key]) => Number.isInteger(scores?.[key]) && scores[key] >= 0 && scores[key] <= 5);
}

export function summarizeAssessment(answers) {
  if (!answers.length || !answers.every(answer => validAssessmentScores(answer.scores))) {
    throw new Error('Every answer needs valid scores before this assessment can be saved.');
  }
  const skills = Object.fromEntries(assessmentSkills.map(([key]) => [
    key, answers.reduce((sum, answer) => sum + answer.scores[key], 0) / answers.length,
  ]));
  return {skills, overall: Object.values(skills).reduce((sum, value) => sum + value, 0) / 3};
}

export function assessmentStrengths(skills) {
  const ordered = assessmentSkills.map(([key, label]) => ({key, label, score: skills[key]}))
    .sort((a, b) => a.score - b.score);
  if (ordered[0].score === ordered[2].score) return 'Your three skill scores are currently equal. Keep practicing across all three areas.';
  const strongest = ordered.filter(skill => skill.score === ordered[2].score).map(skill => skill.label).join(' and ');
  const focus = ordered.filter(skill => skill.score === ordered[0].score).map(skill => skill.label).join(' and ');
  return strongest + ' is your strongest area. Focus your next practice on ' + focus + '.';
}
