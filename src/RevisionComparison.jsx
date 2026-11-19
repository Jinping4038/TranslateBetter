import React from 'react';
import {validScore} from './practice-data.js';
import {translationChanges} from './translation-changes.js';
const scoreCategories=[['meaning','Meaning accuracy'],['grammar','Grammar'],['naturalness','Naturalness']];
const formatScore=score=>validScore(score)?`${score}/5`:'—';
function ScoreComparison({original,revised}){
  return <table className="revision-scores">
    <thead><tr><th scope="col">Category</th><th scope="col">Original</th><th scope="col">Revised</th><th scope="col">Change</th></tr></thead>
    <tbody>{scoreCategories.map(([key,label])=>{
      const before=original.scores?.[key],after=revised.scores?.[key];
      const change=validScore(before)&&validScore(after)?after-before:null;
      return <tr key={key}><th scope="row">{label}</th><td>{formatScore(before)}</td><td>{formatScore(after)}</td>
        <td className={change>0?'score-gain':change<0?'score-loss':''}>{change===null?'—':change>0?`+${change}`:change}</td></tr>;
    })}</tbody>
  </table>;
}

export default function RevisionComparison({versions,selectedRevision,onSelect,expanded,onToggle}) {
  const original=versions[0];
  const revised=versions[selectedRevision??versions.length-1]||versions.at(-1);
  const changes=expanded?translationChanges(original.text,revised.text):null;
  return <section className="revision-comparison" aria-label="Revision comparison">
    <h2>Compare with your original</h2>
    <div className="revision-picker">
      <label htmlFor="revision-choice">Review revision</label>
      <select id="revision-choice" value={versions.indexOf(revised)} onChange={event=>onSelect(Number(event.target.value))}>
        {versions.slice(1).map((version,index)=><option key={version.id||index} value={index+1}>Revision {index+1}{index===versions.length-2?' (latest)':''}{version.date?' · '+new Date(version.date).toLocaleString():''}</option>)}
      </select>
    </div>
    <ScoreComparison original={original} revised={revised}/>
    <div className="feedback-actions"><button type="button" className="secondary" aria-expanded={expanded} aria-controls="revision-text-changes" onClick={onToggle}>{expanded?'Hide Changes':'Show Changes'}</button></div>
    {changes&&<div id="revision-text-changes" className="comparison-versions revision-text-changes">
      <section><h2>Original Translation</h2><p>{changes.original.map((word,index)=><React.Fragment key={index}>{word.changed?<del>{word.text}</del>:word.text}{' '}</React.Fragment>)}</p></section>
      <section><h2>Selected Revision</h2><p>{changes.revised.map((word,index)=><React.Fragment key={index}>{word.changed?<ins>{word.text}</ins>:word.text}{' '}</React.Fragment>)}</p></section>
    </div>}
  </section>;
}
