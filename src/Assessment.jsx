import AssessmentHistory from './AssessmentHistory.jsx';
import React, {useEffect, useRef, useState} from 'react';
import {assessmentBankVersion, assessmentForms, selectAssessmentForm} from './assessment-exercises.js';
import {validAssessmentScores, summarizeAssessment} from './assessment-data.js';

const draftKey = 'tb-assessment-draft';
function loadDraft() {
  try {
    const value = JSON.parse(localStorage.getItem(draftKey));
    if (value?.bankVersion === assessmentBankVersion && value?.id && value.items?.length === 5 && value.items.every(item =>
      assessmentForms.flat().some(sentence => sentence.zh === item.zh) && typeof item.en === 'string' && typeof item.answer === 'string'
    )) return value;
  } catch {}
  return null;
}
function createDraft(results) {
  return {
    id: crypto.randomUUID(),
    bankVersion: assessmentBankVersion,
    index: 0,
    submitted: false,
    items: selectAssessmentForm(results).map(exercise => ({
      ...exercise, answer: '', scores: null,
    })),
  };
}

export default function Assessment({assessments, onComplete, onPractice, onProgress, showHistory = false}) {
  const [draft, setDraft] = useState(loadDraft);
  const [result, setResult] = useState(() => {
    const previousDraft = loadDraft();
    const latest = [...assessments].sort((a,b)=>new Date(a.date)-new Date(b.date)).at(-1);
    if(showHistory || !previousDraft)return latest || null;
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
      persist(createDraft(assessments));
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
        id: current.id, mode: 'assessment', date: new Date().toISOString(), answers, ...summarizeAssessment(answers),
      };
      await onComplete(completed);
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

  if (result || !draft) return <main className="utility assessment-page">
    <section className="assessment-banner">
      <div className="assessment-banner-copy">
        <h1>Check Your Translation Level</h1>
        <p>Take a short assessment to see your current strengths in meaning, grammar, and naturalness. It’s independent, with no hints or AI feedback.</p>
        <button className="primary" onClick={()=>{
          if(draft&&!assessments.some(item=>item.id===draft.id)){setResult(null);setError('');}
          else start();
        }}>{draft&&!assessments.some(item=>item.id===draft.id)?'Resume Assessment':assessments.length?'Take Another Assessment':'Start Assessment'} <span aria-hidden="true">→</span></button>
      </div>
      <svg className="assessment-banner-art" viewBox="0 0 180 180" fill="none" aria-hidden="true">
        <rect x="37" y="30" width="112" height="137" rx="16" fill="#e4dcff"/>
        <rect x="29" y="22" width="112" height="137" rx="16" fill="white" stroke="#a58ae9" strokeWidth="5"/>
        <rect x="62" y="12" width="49" height="23" rx="8" fill="#a58ae9"/>
        <path d="m48 59 6 6 11-14m-17 39 6 6 11-14m-17 39 6 6 11-14" stroke="#9977e3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M80 59h41M80 90h41M80 121h29" stroke="#e4dcff" strokeWidth="7" strokeLinecap="round"/>
      </svg>
    </section>
    <AssessmentHistory assessments={assessments}/>
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
