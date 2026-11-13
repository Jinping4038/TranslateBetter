import React from 'react';
import {assessmentSkills, assessmentStrengths} from './assessment-data.js';

export default function AssessmentHistory({assessments}) {
  const history = [...assessments].sort((a,b) => new Date(a.date)-new Date(b.date));
  const baseline = history[0];
  const latest = history.at(-1);
  const hasComparison = history.length > 1;
  const change = hasComparison ? latest.overall - baseline.overall : null;
  return <section className="progress-panel assessment-progress-section">
    <h2>Assessment History</h2>
    <p className="muted">Independent translation, scored only after all five answers are submitted.</p>
    {!latest ? <p>Take your first assessment to establish a baseline.</p> : <>
      <div className="progress-stats assessment-stats">
        <div><span>Baseline Assessment</span><strong>{baseline.overall.toFixed(1)} / 5</strong></div>
        <div><span>Latest Assessment</span><strong>{hasComparison ? latest.overall.toFixed(1) + ' / 5' : '—'}</strong></div>
        <div><span>Change from Baseline</span><strong>{change === null ? 'Baseline' : (change > 0 ? '+' : '') + change.toFixed(1)}</strong></div>
      </div>
      <div className="assessment-table-scroll"><table className="revision-scores">
        <thead><tr><th scope="col">Date</th><th scope="col">Overall Score</th>{assessmentSkills.map(([key,label])=><th scope="col" key={key}>{label}</th>)}</tr></thead>
        <tbody>{[...history].reverse().map(result=><tr key={result.id}>
          <th scope="row">{new Date(result.date).toLocaleString()}{result.id===baseline.id?' · Baseline':''}</th>
          <td>{result.overall.toFixed(1)} / 5</td>
          {assessmentSkills.map(([key])=><td key={key}>{result.skills[key].toFixed(1)} / 5</td>)}
        </tr>)}</tbody>
      </table></div>
      <p>{assessmentStrengths(latest.skills)}</p>
      {hasComparison && <ul className="assessment-changes">{assessmentSkills.map(([key,label])=>{
        const difference=latest.skills[key]-baseline.skills[key];
        return <li key={key}>{label} {Math.abs(difference)<0.05?'held steady':(difference>0?'increased':'decreased')+' by '+Math.abs(difference).toFixed(1)} from your baseline assessment.</li>;
      })}</ul>}
    </>}
  </section>;
}
