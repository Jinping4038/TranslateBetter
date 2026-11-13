import {practiceProgress} from './progress-data.js';
import React, {useState, useRef, useEffect} from 'react';
import {BookOpen, ChartNoAxesColumnIncreasing, Pencil, Sparkles, Target} from 'lucide-react';

const skills = [
  ['meaning', 'Meaning Accuracy', '#38b982'],
  ['grammar', 'Grammar', '#f5c344'],
  ['naturalness', 'Naturalness', '#f87279'],
];
const scoreText = value => value === null ? '—' : value.toFixed(1);

export default function Progress({completed: activity}) {
  const [category, setCategory] = useState('overall');
  const progress = practiceProgress(activity,category);
  const {average,days} = progress;
  const trendRef = useRef(null);
  useEffect(()=>{
    if(trendRef.current)trendRef.current.scrollLeft=trendRef.current.scrollWidth;
  },[days.length,days.at(-1)?.key]);
  const breakdown = skills.map(([key, label, color]) => ({
    label, color, value: progress.breakdown[key],
  }));
  const total = breakdown.reduce((sum, skill) => sum + (skill.value ?? 0), 0);
  let offset = 0;
  const segments = total > 0 ? breakdown.map(skill => {
    const start = offset;
    offset += (skill.value ?? 0) / total * 100;
    return `${skill.color} ${start}% ${offset}%`;
  }) : [];
  const focus = breakdown.filter(skill => skill.value !== null).sort((a, b) => a.value - b.value)[0];
  const chartWidth = Math.max(525,52+Math.max(0,days.length-1)*90+33);
  const points = days.map((day,index)=>({...day,
    x:days.length===1?52:52+index*(chartWidth-85)/(days.length-1),y:184-day.value*32,
  }));
  const change = points.length > 1 ? points.at(-1).value - points[0].value : null;
  const stats = [
    ['Practice Sessions', progress.practiceSessions, BookOpen, 'blue'],
    ['Average Practice Score', average === null ? '—' : scoreText(average) + ' / 5', ChartNoAxesColumnIncreasing, 'pink'],
    ['Revisions Completed', progress.revisionsCompleted, Pencil, 'purple'],
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
        {points.length ? <div className="progress-trend-scroll" ref={trendRef}><svg className="progress-trend" style={{minWidth:chartWidth}} viewBox={`0 0 ${chartWidth} 220`} role="img" aria-label={points.map(point=>point.label+' '+scoreText(point.value)+' out of 5').join(', ')}>
          {[0,1,2,3,4,5].map(value=><g key={value}><text x="12" y={189-value*32}>{value}</text><line x1="40" x2={chartWidth-23} y1={184-value*32} y2={184-value*32}/></g>)}
          {points.length>1&&<polygon points={`${points[0].x},184 ${points.map(({x,y})=>x+','+y).join(' ')} ${points.at(-1).x},184`}/>}
          <polyline points={points.map(({x,y})=>x+','+y).join(' ')}/>
          {points.map(({x,y,label,value,key})=><circle key={key} cx={x} cy={y} r="5"><title>{label+': '+scoreText(value)+' / 5'}</title></circle>)}
          {points.map(({label,x,key})=><text key={key} x={x} y="210" textAnchor="middle">{label}</text>)}
        </svg></div>:<p className="progress-empty">Get AI feedback to start tracking your daily practice scores.</p>}
      </section>
      <section className="progress-panel">
        <h2>Practice Skill Breakdown</h2>
        <div className="skill-breakdown">
          <div className="skill-ring" style={segments.length ? {backgroundImage: `linear-gradient(white,white),conic-gradient(${segments.join(",")})`, borderColor: "transparent"} : undefined}><strong>{scoreText(average)}</strong><span>Average</span></div>
          <ul>{breakdown.map(({label,color,value})=><li key={label}><span className="skill-dot" style={{background:color}}/>{label}<strong>{value===null?'—':scoreText(value)+' / 5'}</strong></li>)}</ul>
        </div>
      </section>
    </div>
    <section className="progress-insights">
      <h2><Sparkles size={21}/> Insights</h2>
      <div className="progress-insight-grid">
        <article><ChartNoAxesColumnIncreasing size={23}/><div><strong>Daily trend</strong><p>{change===null?'Practice on another day to compare scores.':`Your ${category==='overall'?'overall':'selected skill'} average ${change===0?'held steady':`${change>0?'rose':'fell'} by ${Math.abs(change).toFixed(1)} points`} between ${points[0].label} and ${points.at(-1).label}.`}</p></div></article>
        <article><Target size={23}/><div><strong>Focus Area</strong><p>{focus?`${focus.label} has your lowest average score (${scoreText(focus.value)} / 5). Review your feedback in this area as you practice.`:'Complete a scored translation to see which skill to focus on.'}</p></div></article>
      </div>
    </section>
  </main>;
}
