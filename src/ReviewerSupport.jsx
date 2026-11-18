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
      <p>If you do not read Chinese, you can use “Show English Meaning” to preview the full learning experience.</p>
    </div>
    <button className="primary" onClick={dismiss} autoFocus>Got it</button>
  </dialog>;
}

export function ReviewerMeaning({source}) {
  const [visible,setVisible]=useState(false);
  const meaning=reviewerMeanings[source];
  if(!meaning)return null;
  return <div className="reviewer-support">
    <button type="button" className="reviewer-meaning-toggle" aria-expanded={visible} onClick={()=>setVisible(!visible)}>
      Reviewer Support: {visible?'Hide English Meaning':'Show English Meaning'}
    </button>
    {visible&&<p className="reviewer-meaning"><strong>English meaning · Reviewer Support</strong>{meaning}</p>}
  </div>;
}
