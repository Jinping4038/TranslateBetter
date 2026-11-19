import React, {useEffect, useRef, useState} from 'react';
import {reviewerMeanings} from './reviewer-meanings.js';

export const appModeKey = 'tb-app-mode';
export function readAppMode() {
  try {
    const mode=localStorage.getItem(appModeKey);
    return ['learner','reviewer'].includes(mode)?mode:null;
  } catch { return null; }
}

export function AppModeChooser({mode,onSelect}) {
  const dialogRef = useRef(null);
  useEffect(()=>{
    if(mode)return;
    const dialog=dialogRef.current;
    dialog?.showModal();
    return ()=>dialog?.close();
  },[mode]);
  if(mode)return null;
  return <dialog className="reviewer-notice" ref={dialogRef} aria-labelledby="app-mode-title" aria-describedby="app-mode-description" onCancel={event=>event.preventDefault()}>
    <h2 id="app-mode-title">Welcome to TranslateBetter</h2>
    <p id="app-mode-description">TranslateBetter is designed for Chinese-speaking learners practicing English translation.<br/>Choose how you would like to explore the app.</p>
    <div className="app-mode-options">
      <section><h3>Learner Version</h3><p>For Chinese-speaking English learners.<br/>No translation assistance is provided.</p><button className="primary" onClick={()=>onSelect('learner')} autoFocus>Learner Version</button></section>
      <section><h3>Reviewer Version</h3><p>For reviewers who may not read Chinese.<br/>English meaning support is available.</p><button className="secondary" onClick={()=>onSelect('reviewer')}>Reviewer Version</button></section>
    </div>
  </dialog>;
}

export function AppModeSwitcher({mode,onSelect}) {
  return <label className="app-mode-switcher"><span>App mode</span>
    <select aria-label="App version" value={mode||'learner'} onChange={event=>onSelect(event.target.value)}>
      <option value="learner">Learner Version</option><option value="reviewer">Reviewer Version</option>
    </select>
  </label>;
}

export function ReviewerMeaning({source, audio, reviewer=false}) {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{if(!reviewer)setVisible(false);},[reviewer]);
  const meaning=reviewerMeanings[source];
  return <div className="sentence sentence-card">
    <div className="sentence-row">
      <span>{source}</span>
      <div className="sentence-card-actions">
        {reviewer&&meaning&&<button type="button" className="secondary reviewer-meaning-button" title="Reviewer Support" aria-expanded={visible} onClick={()=>setVisible(!visible)}>English Meaning</button>}
        {audio}
      </div>
    </div>
    {reviewer&&visible&&meaning&&<p className="reviewer-meaning"><strong>English Meaning:</strong> {meaning}</p>}
  </div>;
}
