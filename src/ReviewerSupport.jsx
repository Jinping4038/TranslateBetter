import React, {useEffect, useRef, useState} from 'react';
import {reviewerMeanings} from './reviewer-meanings.js';

export const reviewerNoticeKey = 'tb-reviewer-notice-dismissed';

export function ReviewerNotice() {
  const [dismissed, setDismissed] = useState(()=>{
    try { return localStorage.getItem(reviewerNoticeKey) === 'true'; }
    catch { return false; }
  });
  const dialogRef = useRef(null);
  useEffect(()=>{
    if(dismissed)return;
    const dialog=dialogRef.current;
    dialog?.showModal();
    return ()=>dialog?.close();
  },[dismissed]);
  function dismiss() {
    try { localStorage.setItem(reviewerNoticeKey,'true'); } catch { /* Still dismiss for this visit if storage is unavailable. */ }
    setDismissed(true);
  }
  if(dismissed)return null;
  return <dialog className="reviewer-notice" ref={dialogRef} aria-labelledby="reviewer-note-title" aria-describedby="reviewer-note-description" onCancel={event=>event.preventDefault()}>
    <h2 id="reviewer-note-title">Reviewer Note</h2>
    <div id="reviewer-note-description">
      <p>TranslateBetter is designed for Chinese-speaking English learners.</p>
      <p>If you do not read Chinese, you can use “English Meaning” to preview the full learning experience.</p>
    </div>
    <button className="primary" onClick={dismiss} autoFocus>Got it</button>
  </dialog>;
}

export function ReviewerMeaning({source, audio}) {
  const [visible,setVisible]=useState(false);
  const meaning=reviewerMeanings[source];
  return <div className="sentence sentence-card">
    <div className="sentence-row">
      <span>{source}</span>
      <div className="sentence-card-actions">
        {meaning&&<button type="button" className="secondary reviewer-meaning-button" title="Reviewer Support" aria-expanded={visible} onClick={()=>setVisible(!visible)}>English Meaning</button>}
        {audio}
      </div>
    </div>
    {visible&&meaning&&<p className="reviewer-meaning"><strong>English Meaning:</strong> {meaning}</p>}
  </div>;
}
