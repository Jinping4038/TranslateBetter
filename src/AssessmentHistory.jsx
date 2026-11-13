import React from 'react';
import {assessmentSkills, assessmentStrengths} from './assessment-data.js';

export default function AssessmentHistory({assessments}) {
  const history = [...assessments].sort((a,b) => new Date(a.date)-new Date(b.date));
  const baseline = history[0];
  const latest = history.at(-1);
  const hasComparison = history.length > 1;
  const change = hasComparison ? Number((latest.overall - baseline.overall).toFixed(1)) : null;
  return <section className="progress-panel assessment-progress-section">
    <h2>Assessment History</h2>
    <p className="muted">Track your independent translation performance over time.</p>
    {!latest ? <p>Take your first assessment to establish a baseline.</p> : <>
      <div className="progress-stats assessment-stats">
        <div><span>Baseline Assessment</span><strong>{baseline.overall.toFixed(1)} / 5</strong></div>
        <div><span>Latest Assessment</span><strong>{latest.overall.toFixed(1)} / 5</strong></div>
        <div><span>Difference from Baseline</span><strong>{change === null ? '—' : (change > 0 ? '+' : change < 0 ? '−' : '') + Math.abs(change).toFixed(1)}</strong></div>
      </div>
      <div className="assessment-table-scroll"><table className="revision-scores">
        <thead><tr><th scope="col">Date</th><th scope="col">Overall Score</th>{assessmentSkills.map(([key,label])=><th scope="col" key={key}>{label}</th>)}<th scope="col"><span className="assessment-action-label">Details</span></th></tr></thead>
        <tbody>{[...history].reverse().map((result,index)=>{
          const previous = history[history.length - index - 2];
          return <tr key={result.id}>
          <th scope="row">{new Date(result.date).toLocaleString()}{result.id===baseline.id?' · Baseline':''}</th>
          <td>{result.overall.toFixed(1)} / 5</td>
          {assessmentSkills.map(([key])=><td key={key}>{result.skills[key].toFixed(1)} / 5</td>)}
          <td><details className="assessment-record-details">
            <summary>View Details</summary>
            <div className="assessment-record-content">
              <h3>Assessment Summary</h3>
              <p>{assessmentStrengths(result.skills)}</p>
              {previous && <>
                <h4>Compared with your previous assessment</h4>
                {assessmentSkills.map(([key,label])=>{
                  const difference = Number((result.skills[key] - previous.skills[key]).toFixed(1));
                  return <p key={key}>{label}: {difference === 0 ? 'no difference' : Math.abs(difference).toFixed(1) + (difference > 0 ? ' higher' : ' lower') + ' than your previous assessment'}</p>;
                })}
              </>}
            </div>
          </details></td>
        </tr>;})}</tbody>
      </table></div>
    </>}
  </section>;
}
