import React, {useEffect, useRef, useState} from 'react';
import exercises from './exercises.js';
import {assessmentSkills, validAssessmentScores, summarizeAssessment, assessmentStrengths} from './assessment-data.js';

const draftKey = 'tb-assessment-draft';
function loadDraft() {
  try {
    const value = JSON.parse(localStorage.getItem(draftKey));
    if (value?.id && value.items?.length === 5 && value.items.every(item =>
      typeof item.zh === 'string' && typeof item.en === 'string' && typeof item.answer === 'string'
    )) return value;
  } catch {}
  return null;
}
function createDraft(round) {
  return {
    id: crypto.randomUUID(),
    index: 0,
    submitted: false,
    items: Array.from({length: 5}, (_, index) => {
      const exercise = exercises[(round * 5 + index) % exercises.length];
      return {zh: exercise.zh, en: exercise.en, answer: '', scores: null};
    }),
  };
}

export default function Assessment({assessments, onComplete, onPractice, onProgress}) {
  const [draft, setDraft] = useState(loadDraft);
  const [result, setResult] = useState(() => {
    const previousDraft = loadDraft();
    return assessments.find(item => item.id === previousDraft?.id) || null;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [graded, setGraded] = useState(0);
  const controllerRef = useRef(null);
  useEffect(() => () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  function persist(value) {
    localStorage.setItem(draftKey, JSON.stringify(value));
    setDraft(value);
  }
  function start() {
    try {
      persist(createDraft(assessments.length));
      setResult(null);
      setError('');
    } catch { setError('Your browser could not save this assessment. Please check available storage.'); }
  }
  function edit(answer) {
    try {
      persist({...draft, items: draft.items.map((item, index) =>
        index === draft.index ? {...item, answer, scores: null} : item)});
    } catch { setError('Your answer could not be saved. Please check browser storage.'); }
  }
  async function submit(event) {
    event.preventDefault();
    if (busy || draft.items.some(item => !item.answer.trim())) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    setBusy(true);
    setError('');
    let current = {...draft, submitted: true};
    try {
      persist(current);
      setGraded(current.items.filter(item => item.scores).length);
      for (let index = 0; index < current.items.length; index++) {
        if (current.items[index].scores) continue;
        const item = current.items[index];
        const timer = setTimeout(() => controller.abort(), 35000);
        let response;
        try {
          response = await fetch('https://translatebetter-api.jinping4038.workers.dev/feedback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            signal: controller.signal,
            body: JSON.stringify({source: item.zh, reference: item.en, translation: item.answer.trim()}),
          });
        } finally { clearTimeout(timer); }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Scoring is currently unavailable.');
        if (!validAssessmentScores(data.feedback?.scores)) throw new Error('Scoring returned incomplete scores. Please retry.');
        current = {...current, items: current.items.map((answer, position) =>
          position === index ? {...answer, scores: data.feedback.scores} : answer)};
        persist(current);
        setGraded(current.items.filter(answer => answer.scores).length);
      }
      const answers = current.items.map(({zh, answer, scores}) => ({zh, text: answer.trim(), scores}));
      const completed = {
        id: current.id, date: new Date().toISOString(), answers, ...summarizeAssessment(answers),
      };
      onComplete(completed);
      setResult(completed);
    } catch (issue) {
      if (controllerRef.current === controller) {
        setError(issue.name === 'AbortError' ? 'Scoring timed out. Retry to continue from the answers already scored.' : issue.message);
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setBusy(false);
      }
    }
  }

  if (result) return <main className="utility assessment-page">
    <h1>Your Translation Level</h1>
    <p className="muted">Independent assessment · {new Date(result.date).toLocaleString()}</p>
    <section className="progress-panel assessment-overall"><span>Overall Score</span><strong>{result.overall.toFixed(1)} / 5</strong></section>
    <h2>Skill Breakdown</h2>
    <div className="progress-stats">{assessmentSkills.map(([key,label]) => <section className="progress-panel" key={key}>
      <h3>{label}</h3><strong>{result.skills[key].toFixed(1)} / 5</strong>
    </section>)}</div>
    <p className="assessment-summary">{assessmentStrengths(result.skills)}</p>
    <p className="muted">{assessments[0]?.id === result.id ? 'This assessment establishes your baseline. Take another after more practice to compare results.' : 'View Progress to compare this assessment with your previous results.'}</p>
    <div className="revision-actions">
      <button className="primary" onClick={onPractice}>Start Practicing</button>
      <button className="secondary" onClick={onProgress}>View Progress</button>
      <button className="secondary" onClick={start}>Take Another Assessment</button>
    </div>
    {error && <p className="feedback-error" role="alert">{error}</p>}
  </main>;

  if (!draft) return <main className="utility assessment-page">
    <h1>Assessment</h1>
    <p>Translate five sentences independently to measure your current performance.</p>
    <section className="progress-panel">
      <p>Write each answer on your own. Scores appear after you submit all five sentences.</p>
      <p>Your first result establishes a baseline. Later assessments use rotated sentences so you can compare your performance over time.</p>
      <button className="primary" onClick={start}>Start Assessment</button>
    </section>
    {error && <p className="feedback-error" role="alert">{error}</p>}
  </main>;

  if (draft.submitted) return <main className="utility assessment-page">
    <h1>Assessment Submitted</h1>
    <p>Your answers are locked while the assessment is scored.</p>
    <p role="status">{graded || draft.items.filter(item => item.scores).length} of 5 answers scored.</p>
    {error && <p className="feedback-error" role="alert">{error}</p>}
    <button className="primary" onClick={submit} disabled={busy}>{busy ? 'Scoring assessment…' : 'Continue Scoring'}</button>
  </main>;

  const item = draft.items[draft.index];
  const allAnswered = draft.items.every(answer => answer.answer.trim());
  return <main className="practice-main assessment-page">
    <h1>Assessment</h1>
    <p className="muted">Translate independently. Your scores will appear after submission.</p>
    <div className="practice-top">Sentence {draft.index + 1} of 5</div>
    <progress className="assessment-progress" value={draft.index + 1} max="5" aria-label="Assessment progress"/>
    <div className="sentence">{item.zh}</div>
    <form onSubmit={submit}>
      <div className="label-row"><label htmlFor="assessment-answer">Your translation</label></div>
      <div className="textarea-wrap">
        <textarea id="assessment-answer" value={item.answer} onChange={event => edit(event.target.value)} maxLength={500} required placeholder="Write your English translation…"/>
        <span className="counter">{item.answer.length}/500</span>
      </div>
      <div className="revision-actions">
        <button type="button" className="secondary" disabled={draft.index === 0} onClick={() => persist({...draft,index:draft.index-1})}>Previous</button>
        {draft.index < 4
          ? <button type="button" className="primary" onClick={() => persist({...draft,index:draft.index+1})}>Next</button>
          : <button type="submit" className="primary" disabled={!allAnswered}>Submit Assessment</button>}
      </div>
      {!allAnswered && draft.index === 4 && <p className="muted">Answer all five sentences before submitting. You can go back to finish any blank answers.</p>}
    </form>
    {error && <p className="feedback-error" role="alert">{error}</p>}
  </main>;
}
