import React, {useState} from 'react';
import {assessmentSkills, assessmentStrengths} from './assessment-data.js';
import {BookOpen, ChartNoAxesColumnIncreasing, Pencil, Sparkles, Target} from 'lucide-react';

const skills = [
  ['meaning', 'Meaning Accuracy', '#38b982'],
  ['grammar', 'Grammar', '#f5c344'],
  ['naturalness', 'Naturalness', '#f87279'],
];
const valid = value => Number.isInteger(value) && value >= 0 && value <= 5;
const mean = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const scoreText = value => value === null ? '—' : value.toFixed(1);
const overall = scores => mean(skills.map(([key]) => scores?.[key]).filter(valid));

function weekStart(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  return start;
}

export default function Progress({completed: activity, assessments = []}) {
  const completed = activity.filter(attempt => attempt.mode !== 'assessment');
  const [category, setCategory] = useState('overall');
  const average = mean(completed.map(attempt => overall(attempt.scores)).filter(value => value !== null));
  const breakdown = skills.map(([key, label, color]) => ({
    label, color, value: mean(completed.map(attempt => attempt.scores?.[key]).filter(valid)),
  }));
  const total = breakdown.reduce((sum, skill) => sum + (skill.value ?? 0), 0);
  let offset = 0;
  const segments = total > 0 ? breakdown.map(skill => {
    const start = offset;
    offset += (skill.value ?? 0) / total * 100;
    return `${skill.color} ${start}% ${offset}%`;
  }) : [];
  const focus = breakdown.filter(skill => skill.value !== null).sort((a, b) => a.value - b.value)[0];
  const weeks = Array.from({length: 5}, (_, index) => {
    const start = weekStart(new Date());
    start.setDate(start.getDate() - (4 - index) * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const values = completed.filter(attempt => {
      const date = new Date(attempt.date);
      return date >= start && date < end;
    }).map(attempt => category === 'overall' ? overall(attempt.scores) : attempt.scores?.[category]);
    return {label: start.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), value: mean(values.filter(value => category === 'overall' ? value !== null : valid(value)))};
  });
  const points = weeks.flatMap(({value, label}, index) => value === null ? [] : [{x: 52 + index * 110, y: 184 - value * 32, value, label}]);
  const change = points.length > 1 ? points.at(-1).value - points[0].value : null;
  const stats = [
    ['Sentences Practiced', new Set(completed.map(attempt => attempt.zh)).size, BookOpen, 'blue'],
    ['Average Practice Score', average === null ? '—' : scoreText(average) + ' / 5', ChartNoAxesColumnIncreasing, 'pink'],
    ['Revisions Completed', completed.filter(attempt => attempt.revision).length, Pencil, 'purple'],
  ];
  return <main className="utility progress-page">
    <h1>Your Progress</h1>
    <p className="muted">Practice scores reflect learning with hints and AI feedback. Assessment scores measure independent translation before feedback.</p>
    <div className="progress-stats">{stats.map(([label, value, Icon, color]) => <section className="progress-panel progress-stat" key={label}>
      <div>{label}<strong>{value}</strong></div><span className={color}><Icon size={24}/></span>
    </section>)}</div>
    <div className="progress-charts">
      <section className="progress-panel">
        <div className="progress-panel-heading"><h2>Practice Score Trend</h2><select aria-label="Score category" value={category} onChange={event=>setCategory(event.target.value)}>
          <option value="overall">Overall</option>{skills.map(([key,label])=><option key={key} value={key}>{label}</option>)}
        </select></div>
        {points.length ? <svg className="progress-trend" viewBox="0 0 525 220" role="img" aria-label={points.map(point=>point.label+' '+scoreText(point.value)+' out of 5').join(', ')}>
          {[0,1,2,3,4,5].map(value=><g key={value}><text x="12" y={189-value*32}>{value}</text><line x1="40" x2="502" y1={184-value*32} y2={184-value*32}/></g>)}
          {points.length>1&&<polygon points={`${points[0].x},184 ${points.map(({x,y})=>x+','+y).join(' ')} ${points.at(-1).x},184`}/>}
          <polyline points={points.map(({x,y})=>x+','+y).join(' ')}/>
          {points.map(({x,y,label,value})=><circle key={label} cx={x} cy={y} r="5"><title>{label}: {scoreText(value)} / 5</title></circle>)}
          {weeks.map(({label},index)=><text key={label} x={52+index*110} y="210" textAnchor="middle">{label}</text>)}
        </svg>:<p className="progress-empty">Get AI feedback to start tracking your weekly scores.</p>}
      </section>
      <section className="progress-panel">
        <h2>Practice Skill Breakdown</h2>
        <div className="skill-breakdown">
          <div className="skill-ring" style={segments.length ? {backgroundImage: `linear-gradient(white,white),conic-gradient(${segments.join(",")})`, borderColor: "transparent"} : undefined}><strong>{scoreText(average)}</strong><span>Average</span></div>
          <ul>{breakdown.map(({label,color,value})=><li key={label}><span className="skill-dot" style={{background:color}}/>{label}<strong>{value===null?'—':scoreText(value)+' / 5'}</strong></li>)}</ul>
        </div>
      </section>
    </div>
    <AssessmentProgress assessments={assessments}/>
    <section className="progress-insights">
      <h2><Sparkles size={21}/> Insights</h2>
      <div className="progress-insight-grid">
        <article><ChartNoAxesColumnIncreasing size={23}/><div><strong>Weekly trend</strong><p>{change===null?'Practice in another week to compare scores.':`Your ${category==='overall'?'overall':'selected skill'} average ${change===0?'held steady':`${change>0?'rose':'fell'} by ${Math.abs(change).toFixed(1)} points`} between ${points[0].label} and ${points.at(-1).label}.`}</p></div></article>
        <article><Target size={23}/><div><strong>Focus Area</strong><p>{focus?`${focus.label} has your lowest average score (${scoreText(focus.value)} / 5). Review your feedback in this area as you practice.`:'Complete a scored translation to see which skill to focus on.'}</p></div></article>
      </div>
    </section>
  </main>;
}

function AssessmentProgress({assessments}) {
  const history = [...assessments].sort((a,b) => new Date(a.date)-new Date(b.date));
  const baseline = history[0];
  const latest = history.at(-1);
  const hasComparison = history.length > 1;
  const change = hasComparison ? latest.overall - baseline.overall : null;
  return <section className="progress-panel assessment-progress-section">
    <h2>Assessment Progress</h2>
    <p className="muted">Independent translation, scored only after all five answers are submitted.</p>
    {!latest ? <p>Take your first assessment to establish a baseline.</p> : <>
      <div className="progress-stats assessment-stats">
        <div><span>Baseline Assessment</span><strong>{baseline.overall.toFixed(1)} / 5</strong></div>
        <div><span>Latest Assessment</span><strong>{hasComparison ? latest.overall.toFixed(1) + ' / 5' : '—'}</strong></div>
        <div><span>Change from Baseline</span><strong>{change === null ? 'Baseline' : (change > 0 ? '+' : '') + change.toFixed(1)}</strong></div>
      </div>
      <h3>Assessment History</h3>
      <div className="assessment-table-scroll"><table className="revision-scores">
        <thead><tr><th scope="col">Date</th><th scope="col">Overall</th>{assessmentSkills.map(([key,label])=><th scope="col" key={key}>{label}</th>)}</tr></thead>
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
