import React, {useState, useRef, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BookOpen, Pencil, Bookmark, ChartNoAxesColumnIncreasing, Settings, Lightbulb, ArrowRight, RotateCcw, Send, Volume2, Copy, Check, Sparkles, Target, FileCheck2, MessagesSquare, Heart, X, Home, Trash2} from 'lucide-react';
import './styles.css';
import exercises from './exercises.js';
import Progress from './Progress.jsx';
import PracticePreferences from './PracticePreferences.jsx';
import {practicePreferencesKey, normalizePracticePreferences, selectPracticeSentence} from './practice-selection.js';
import Assessment from './Assessment.jsx';
import {validatedPracticeScores, validPracticeAttempt, validScore, readPracticeSession} from './practice-data.js';
import {appendRecord, updateRecords, readRecords} from './storage.js';
import {appendVersions, sameVersion} from './revision-history.js';
const nav=[['practice','Practice',Pencil],['saved','My Sentences',Bookmark],['assessment','Assessment',FileCheck2],['progress','Progress',ChartNoAxesColumnIncreasing],['settings','Settings',Settings]];
function read(key, fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
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
function savedHistory(entry){
  return entry.history?.length?entry.history:entry.translation?[{text:entry.translation}]:[];
}
function FeedbackCards({feedback}){
  return <>{[[Target,'Meaning Accuracy','meaning'],[FileCheck2,'Grammar','grammar'],[MessagesSquare,'Naturalness','naturalness']].map(([Icon,title,key])=>{const rawScore=feedback.scores?.[key];const score=validScore(rawScore)?rawScore:null;const color=score===null?'unscored':score===5?'green':score>=3?'amber':'coral';return <article className={`feedback-card feedback-category-${key} ${color}`} key={key}><span className="feedback-icon"><Icon size={21}/></span><div className="feedback-content"><div className="score-heading"><h4>{title}</h4>{score!==null&&<strong className="score-badge" aria-label={`${title}: ${score} out of 5`}>{score}/5</strong>}</div><p>{feedback[key]}</p></div></article>})}{!feedback.scores&&<p className="demo-note">Scores will appear after the updated Cloudflare Worker is deployed.</p>}</>;
}
function App(){
const [restored]=useState(readPracticeSession);
const [page,setPage]=useState(restored?.page||'home'),[index,setIndex]=useState(()=>restored?.index<exercises.length?restored.index:selectPracticeSentence(exercises,read('tb-completed',[]),read(practicePreferencesKey,null))),[translation,setTranslation]=useState(restored?.translation||''),[hint,setHint]=useState(restored?.hint||0),[saved,setSaved]=useState(()=>read('tb-saved',[])),[completed,setCompleted]=useState(()=>read('tb-completed',[])),[toast,setToast]=useState(''),[difficulty,setDifficulty]=useState(()=>read('tb-level','Intermediate'));
const [showAnswer,setShowAnswer]=useState(restored?.showAnswer||false),[showFeedback,setShowFeedback]=useState(restored?.showFeedback||false);
const [feedback,setFeedback]=useState(restored?.feedback||null),[feedbackError,setFeedbackError]=useState(''),[loading,setLoading]=useState(false);
const [revision,setRevision]=useState(restored?.revision||'');
const [selectedRevision,setSelectedRevision]=useState(restored?.selectedRevision??null);
const [versions,setVersions]=useState(restored?.versions||[]),[selectedSentence,setSelectedSentence]=useState(null);
const [preferences,setPreferences]=useState(()=>normalizePracticePreferences(read(practicePreferencesKey,null)));
const [practiceTrail,setPracticeTrail]=useState(()=>{
  const trail=restored?.practiceTrail;
  return Array.isArray(trail)&&trail.length&&trail.every(i=>Number.isInteger(i)&&i>=0&&i<exercises.length)&&
    Number.isInteger(restored?.practicePosition)&&trail[restored.practicePosition]===index?trail:[index];
});
const [practicePosition,setPracticePosition]=useState(()=>practiceTrail[restored?.practicePosition]===index?restored.practicePosition:0);
function changePreference(key,value){
  try {
    const next={...normalizePracticePreferences(read(practicePreferencesKey,null)),[key]:value};
    localStorage.setItem(practicePreferencesKey,JSON.stringify(next));
    setPreferences(next);
  } catch {notify('Could not save practice preferences. Please check browser storage.');}
}
const [assessments,setAssessments]=useState(()=>read('tb-assessments',[]));
async function completeAssessment(result){
  setAssessments(await appendRecord('tb-assessments',result));
}
useEffect(()=>{
  try {
    sessionStorage.setItem('tb-active-practice',JSON.stringify({
      page:page==='saved-detail'?'saved':page,index,translation,hint,showAnswer,showFeedback,
      feedback,revision,selectedRevision,versions,practiceTrail,practicePosition,
    }));
  } catch { /* Completed records remain in localStorage if tab-draft storage is unavailable. */ }
},[page,index,translation,hint,showAnswer,showFeedback,feedback,revision,selectedRevision,versions,practiceTrail,practicePosition]);
useEffect(()=>{
  function syncRecords(event){
    try {
      if(event.key===practicePreferencesKey)setPreferences(normalizePracticePreferences(read(practicePreferencesKey,null)));
      if(event.key==='tb-completed')setCompleted(readRecords(event.key));
      if(event.key==='tb-assessments')setAssessments(readRecords(event.key));
      if(event.key==='tb-saved')setSaved(readRecords(event.key));
    } catch { notify('Another tab saved unreadable data. Existing records have been preserved.'); }
  }
  window.addEventListener('storage',syncRecords);
  return ()=>window.removeEventListener('storage',syncRecords);
},[]);
const activeRequest=useRef(null);
function clearFeedback(){setSelectedRevision(null);setVersions([]);activeRequest.current?.abort();activeRequest.current=null;setLoading(false);setShowFeedback(false);setFeedback(null);setFeedbackError('');}
const ex=exercises[index];
const hasNextSentence=exercises.length>1;
const todayCount=new Set(completed.filter(validPracticeAttempt).filter(item=>new Date(item.date).toDateString()===new Date().toDateString()).map(item=>item.zh)).size;
function notify(message){setToast(message);setTimeout(()=>setToast(''),2500)}
async function submit(e){
e.preventDefault();
const revising=page==='revision';
const draft=revising?revision:translation;
if(!draft.trim()||loading)return;
activeRequest.current?.abort();const controller=new AbortController();activeRequest.current=controller;
setLoading(true);setShowFeedback(true);if(!revising)setFeedback(null);setFeedbackError('');
const timeout=setTimeout(()=>controller.abort(),35000);
try{
const response=await fetch('https://translatebetter-api.jinping4038.workers.dev/feedback',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({source:ex.zh,reference:ex.en,translation:draft.trim()})});
let data;try{data=await response.json()}catch{throw new Error('The feedback backend is not ready yet. Please finish deploying the Cloudflare Worker code.')}
if(!response.ok)throw new Error(data.error||'Feedback is unavailable. Please try again.');
if(!data.feedback||!['meaning','grammar','naturalness','improvedTranslation'].every(key=>typeof data.feedback[key]==='string'&&data.feedback[key].trim()))throw new Error('The AI returned incomplete feedback. Please try again.');
const scores=validatedPracticeScores(data.feedback.scores);
if(data.feedback.overall!==undefined&&(!validScore(data.feedback.overall)||Math.abs(data.feedback.overall-scores.overall)>0.051)){
  throw new Error('Scoring returned an invalid or inconsistent overall score. Please request feedback again.');
}
if(activeRequest.current!==controller)return;
const attempt={id:crypto.randomUUID(),text:draft.trim(),scores,overall:scores.overall,date:new Date().toISOString(),revision:revising};
setCompleted(await appendRecord('tb-completed',{...attempt,mode:'practice',zh:ex.zh}));
if(activeRequest.current!==controller)return;
const updatedVersions=revising?appendVersions(versions,[attempt]):[attempt];
setVersions(updatedVersions);
setSelectedRevision(null);
setFeedback(data.feedback);
if(revising){
  try {
    const collection=await updateRecords('tb-saved',previous=>previous.map(sentence=>{
      if(sentence.zh!==ex.zh)return sentence;
      return {...sentence,history:appendVersions(savedHistory(sentence),updatedVersions),translation:attempt.text};
    }));
    setSaved(collection);
    setSelectedSentence(current=>collection.find(sentence=>sentence.zh===current?.zh)||current);
  } catch (error) { notify(error.message); }
  setTranslation(draft);
  setPage(current=>current==='revision'?'comparison':current);
}

}catch(error){if(activeRequest.current===controller)setFeedbackError(error.name==='AbortError'?'The request timed out. Please try again.':error instanceof TypeError?'Could not connect to the feedback service. Check your connection and Cloudflare setup.':error.message)}
finally{clearTimeout(timeout);if(activeRequest.current===controller){activeRequest.current=null;setLoading(false)}}
}
function goToSentence(nextIndex){
  clearFeedback();
  setIndex(nextIndex);
  setTranslation('');
  setHint(0);
  setShowAnswer(false);
  setPage('practice');
}
function next(){
  if(practicePosition+1<practiceTrail.length){
    setPracticePosition(practicePosition+1);
    goToSentence(practiceTrail[practicePosition+1]);
    return;
  }
  const nextIndex=selectPracticeSentence(exercises,completed,preferences,practiceTrail.slice(0,practicePosition+1));
  if(nextIndex===null)return;
  setPracticeTrail([...practiceTrail.slice(0,practicePosition+1),nextIndex]);
  setPracticePosition(practicePosition+1);
  goToSentence(nextIndex);
}
function previous(){
  if(practicePosition===0)return;
  setPracticePosition(practicePosition-1);
  goToSentence(practiceTrail[practicePosition-1]);
}
function reviseTranslation(){
  setHint(0);
  setRevision(translation);
  setFeedbackError('');
  setPage('revision');
}
const comparedRevision=versions[selectedRevision??versions.length-1];
const hasRevisions=versions.length>1;
const existingSentence=saved.find(s=>s.zh===ex.zh);
const savedCurrentTranslation=existingSentence?.translation===translation.trim()&&
  versions.every(version=>savedHistory(existingSentence).some(existing=>sameVersion(existing,version)));
async function saveMyTranslation(){
  try {
    const collection=await updateRecords('tb-saved',previous=>{
      const existing=previous.find(sentence=>sentence.zh===ex.zh);
      const entry={...existing,...ex,translation:translation.trim(),history:appendVersions(existing?savedHistory(existing):[],versions)};
      return existing?previous.map(sentence=>sentence.zh===ex.zh?entry:sentence):[...previous,entry];
    });
    setSaved(collection);
    notify('Translation saved to My Sentences');
  } catch(error){notify(error.message);}
}
async function deleteSavedVersion(index){
  if(!window.confirm('Delete this saved translation version?'))return;
  const version=savedHistory(selectedSentence)[index];
  try{
    const collection=await updateRecords('tb-saved',previous=>previous.map(sentence=>{
      if(sentence.zh!==selectedSentence.zh)return sentence;
      const history=savedHistory(sentence).filter(item=>!sameVersion(item,version));
      return {...sentence,history,translation:history.at(-1)?.text};
    }));
    setSaved(collection);
    setSelectedSentence(collection.find(sentence=>sentence.zh===selectedSentence.zh));
    notify('Translation version deleted');
  }catch(error){notify(error.message);}
}
async function removeSavedSentence(sentence){
  try{setSaved(await updateRecords('tb-saved',previous=>previous.filter(item=>item.zh!==sentence.zh)));}
  catch(error){notify(error.message);}
}
function practiceSaved(sentence){
  const exerciseIndex=exercises.findIndex(item=>item.zh===sentence.zh);
  if(exerciseIndex<0)return;
  clearFeedback();
  setPracticeTrail([...practiceTrail.slice(0,practicePosition+1),exerciseIndex]);
  setPracticePosition(practicePosition+1);
  setIndex(exerciseIndex);
  setTranslation('');
  setHint(0);
  setShowAnswer(false);
  setPage('practice');
}
async function save(){
  try {
    setSaved(await updateRecords('tb-saved',previous=>previous.some(sentence=>sentence.zh===ex.zh)?previous:[...previous,ex]));
    notify('Sentence saved to My Sentences');
  } catch(error){notify(error.message);}
}
function speak(){if('speechSynthesis' in window){speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(ex.zh);utterance.lang='zh-CN';speechSynthesis.speak(utterance)}else notify('Audio is unavailable in this browser')}
const sourceSentence=<div className="sentence"><span>{ex.zh}</span><button onClick={speak} className="icon-button" aria-label="Listen to Chinese sentence"><Volume2 size={21}/></button></div>;
const referenceAnswer=showAnswer&&<section id="reference-answer" className="feedback inline-result" aria-label="Reference answer"><h3><BookOpen size={19}/>Reference answer</h3><div className="reference"><p>{ex.en}</p><button className="icon-button" onClick={async()=>{try{await navigator.clipboard.writeText(ex.en);notify('Reference answer copied')}catch{notify('Copy is unavailable in this browser')}}} aria-label="Copy reference answer"><Copy size={17}/></button></div><button className="save-button" onClick={save}><Bookmark size={15}/>{saved.some(s=>s.zh===ex.zh)?'Saved to my sentences':'Save this sentence'}</button></section>;
return <div className="app"><header><button className="brand" onClick={()=>setPage('home')} aria-label="TranslateBetter home"><span className="brand-icon"><BookOpen size={31}/></span><span><strong>TranslateBetter</strong><small>AI-assisted English translation practice</small></span></button></header>
{page==='home'?<main className="landing"><section className="hero"><div className="hero-copy"><span className="eyebrow"><span/> A LITTLE PRACTICE. A LOT OF PROGRESS.</span><h1>Improve your English<br/>through <span>real translations.</span></h1><p>Find the right words. Make them your own.<br/>Practice Chinese → English translation with thoughtful feedback that helps you grow.</p><div className="hero-actions"><button className="primary start" onClick={()=>setPage('practice')}>Start practicing <ArrowRight size={19}/></button><button className="secondary check-level" onClick={()=>setPage('assessment')}><ChartNoAxesColumnIncreasing size={20}/>Check Your Level</button></div><div className="hero-note"><Check size={15}/> No pressure. Just progress, one sentence at a time.</div></div><div className="illustration" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="twinkle one">✦</span><span className="twinkle two">✧</span><div className="bubble chinese">中</div><div className="bubble english">A</div><div className="book"><div className="book-page left"><i/><i/><i/><i/><i/></div><div className="book-page right"><i/><i/><i/><i/><i/></div></div><span className="book-shadow"/><span className="mini-pill"><Sparkles size={14}/> Words open worlds</span></div></section><div className="section-heading"><h2>A better way to learn by doing</h2><span>Small steps. Lasting confidence.</span></div><section className="features">{[[Heart,'amber','Personalized feedback','Understand the meaning, grammar, and naturalness of your writing.'],[FileCheck2,'purple','Revise and improve','Compare your versions and discover how to make each sentence better.'],[Bookmark,'green','Keep the good ones','Build a personal collection of useful sentences to revisit.'],[ChartNoAxesColumnIncreasing,'blue','See your progress','Turn everyday practice into improvement you can feel.']].map(([Icon,color,title,text],i)=><article key={title}><div className={'feature-icon '+color}><Icon size={23}/></div><span className="feature-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</section><footer><span>Made for the moments when you want to get a little better.</span><span>中文 <ArrowRight size={12}/> English</span></footer></main>:
<div className="workspace">
{<aside className="sidebar"><div>{nav.filter(([id])=>id!=='settings').map(([id,label,Icon])=><button key={id} className={page===id||(id==='assessment'&&page==='assessment-history')||(id==='practice'&&['revision','comparison'].includes(page))||(id==='saved'&&page==='saved-detail')?'selected':''} onClick={()=>setPage(id)}><Icon size={19}/>{label}</button>)}<button className={page==='settings'?'selected':''} onClick={()=>setPage('settings')}><Settings size={19}/>Settings</button></div><div className="goal"><span>Today’s goal</span><div><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/><circle cx="20" cy="20" r="16" style={{strokeDasharray:`${Math.min(todayCount,10)*10.05} 101`}}/></svg><strong>{Math.min(todayCount,10)} <small>/ 10<br/>sentences</small></strong></div><p>{todayCount>=10?'Goal reached. Nice work!':'You’re building a good habit.'}</p></div></aside>}
{['assessment','assessment-history'].includes(page)?<Assessment key={page} showHistory={page==='assessment-history'} assessments={assessments} onComplete={completeAssessment} onPractice={()=>setPage('practice')} onProgress={()=>setPage('progress')}/>:page==='comparison'?<main className="practice-main revision-view">
  <h1>Your Improvement</h1>
  <p className="revision-description">Compare your original and revised translations.</p>
  <div className="revision-picker">
    <label htmlFor="revision-choice">Compare original with</label>
    <select id="revision-choice" value={selectedRevision??versions.length-1} onChange={event=>setSelectedRevision(Number(event.target.value))}>
      {versions.slice(1).map((version,position)=><option key={version.id||position} value={position+1}>
        Revision {position+1}{position===versions.length-2?' (latest)':''}{version.date?' · '+new Date(version.date).toLocaleString():''}
      </option>)}
    </select>
  </div>
  <div className="comparison-versions">
    <section><h2>Original Translation</h2><p>{versions[0].text}</p></section>
    <section><h2>Revised Translation</h2><p>{comparedRevision.text}</p></section>
  </div>
  <ScoreComparison original={versions[0]} revised={comparedRevision}/>
  <div className="revision-actions">
    <button type="button" className="secondary" onClick={()=>setPage('practice')}>View AI Feedback</button>
    <button type="button" className="secondary" onClick={saveMyTranslation} disabled={savedCurrentTranslation}><Bookmark size={17}/>{savedCurrentTranslation?'Saved to My Sentences':'Save to My Sentences'}</button>
    {hasNextSentence&&<button type="button" className="primary" onClick={next}>Next Sentence <ArrowRight size={17}/></button>}
  </div>
</main>:page==='saved-detail'?<main className="utility revision-view">
  <button className="secondary" onClick={()=>setPage('saved')}>← Back to My Sentences</button>
  <h1 className="saved-detail-title">{selectedSentence.zh}</h1>
  <p className="muted">Reference answer · {selectedSentence.en}</p>
  <h2>Your Translation History</h2>
  {savedHistory(selectedSentence).length?savedHistory(selectedSentence).map((version,i)=><section className="history-version" key={i}>
    <div className="history-version-heading">
      <h3>{version.revision?`Revision ${savedHistory(selectedSentence).slice(0,i+1).filter(item=>item.revision).length}`:i===0?'Original Translation':`Saved Version ${i+1}`}</h3>
      <button type="button" className="icon-button" aria-label={`Delete translation version ${i+1}`} onClick={()=>deleteSavedVersion(i)}><Trash2 size={17}/></button>
    </div>
    {version.date&&<time className="muted" dateTime={version.date}>{new Date(version.date).toLocaleString()}</time>}
    <p>{version.text}</p>
    {version.scores&&<div className="history-scores">{scoreCategories.map(([key,label])=><span key={key}>{label} {formatScore(version.scores[key])}</span>)}</div>}
  </section>):<p className="muted">Practice this sentence and save your translation to start its history.</p>}
</main>:page==='revision'?<main className="practice-main revision-view">
  <h1>Revise Your Translation</h1>
  <p className="revision-description">Use the feedback to improve your translation.</p>
  {sourceSentence}
  <form onSubmit={submit}>
    <div className="label-row">Original Translation</div>
    <p className="revision-original">{translation}</p>
    <div className="label-row"><label htmlFor="revision">Your Revision</label></div>
    <div className="textarea-wrap">
      <textarea id="revision" value={revision} onChange={e=>setRevision(e.target.value)} maxLength={500} disabled={loading} required/>
      <span className="counter">{revision.length}/500</span>
    </div>
    {feedbackError&&<p role="alert" className="feedback-error">{feedbackError}</p>}
    <div className="revision-actions">
      <button type="button" className="secondary" disabled={loading} onClick={()=>{setFeedbackError('');setPage('practice')}}>← Back</button>
      <button type="submit" className="primary" disabled={loading||!revision.trim()||revision.trim()===translation.trim()}>
        {loading?'Reviewing revision…':'Submit Revision'} <ArrowRight size={17}/>
      </button>
    </div>
  </form>
  {referenceAnswer}
  {feedback&&<section className="feedback inline-result" aria-label="Previous AI feedback">
    <div className="feedback-heading"><h3><Sparkles size={19}/>AI feedback on your previous translation</h3></div>
    <FeedbackCards feedback={feedback}/>
  </section>}
</main>:page==='practice'?<><main className="practice-main"><div className="practice-top"><span>Sentence {index+1}</span>{feedback&&<button type="button" className="secondary practice-save" onClick={saveMyTranslation} disabled={savedCurrentTranslation}>{savedCurrentTranslation?<Check size={17}/>:<Bookmark size={17}/>} {savedCurrentTranslation?'Saved to My Sentences':'Save to My Sentences'}</button>}</div>{sourceSentence}{page==='practice'&&<p className="instructions">Take a moment to understand the sentence, then make it your own in English.</p>}<form onSubmit={submit}><div className="label-row"><label htmlFor="translation">Your translation</label>{page==='feedback'&&<button type="button" className="text-button" onClick={()=>setPage('practice')}>Edit <Pencil size={13}/></button>}</div><div className={'textarea-wrap '+(page==='feedback'?'submitted':'')}><textarea id="translation" placeholder="Type your English translation here…" maxLength={500} value={translation} readOnly={page==='feedback'} onChange={e=>{setTranslation(e.target.value);if(!e.target.value.trim())setShowAnswer(false);clearFeedback()}} required/><span className="counter">{translation.length}/500</span></div>{hint>0&&<div className="hint" id="practice-hints">
  <Lightbulb size={18}/>
  <div className="hint-content" aria-live="polite">
    <p><strong>Hint 1</strong> {ex.gentleHint||'Identify the main idea, then check what the other words add to it.'}</p>
    {hint===1?<button type="button" className="hint-button" onClick={()=>setHint(2)}>Show Hint 2</button>:<p><strong>Hint 2</strong> {ex.hint}</p>}
  </div>
  <button type="button" className="icon-button" aria-label="Close hints" onClick={()=>setHint(0)}><X size={15}/></button>
</div>}<div className="practice-actions inline-actions"><button type="button" className="secondary" disabled={!translation.trim()} onClick={()=>setShowAnswer(!showAnswer)} aria-expanded={showAnswer} aria-controls="reference-answer"><BookOpen size={17}/>{showAnswer?'Hide the answer':'See the answer'}</button><button className="primary" disabled={!translation.trim()||loading} aria-controls="practice-feedback"><Sparkles size={17}/>{loading?'Getting feedback…':'Get AI feedback'}</button></div><div className="practice-tools"><button className="hint-button" type="button" aria-expanded={hint>0} onClick={()=>setHint(hint?0:1)}><Lightbulb size={16}/>Need a hint?</button><button type="button" className="text-button" onClick={()=>{clearFeedback();setTranslation('');setHint(0);setShowAnswer(false);setShowFeedback(false)}}><RotateCcw size={15}/>Reset</button><div className="sentence-navigation">
  {practicePosition>0&&<button type="button" className="text-button" onClick={previous}>Previous sentence</button>}
    {hasNextSentence&&<button type="button" className="text-button" onClick={next}>Next sentence<ArrowRight size={15}/></button>}
</div></div></form>{referenceAnswer}{showFeedback&&<section id="practice-feedback" className="feedback inline-result" aria-label="Practice feedback" aria-live="polite"><div className="feedback-heading"><h3><Sparkles size={19}/>AI feedback</h3></div>{loading&&<p role="status">Reviewing your translation…</p>}{feedbackError&&<p role="alert" className="feedback-error">{feedbackError}</p>}{feedback&&<><FeedbackCards feedback={feedback}/><div className="feedback-actions">
  {hasRevisions&&<button type="button" className="secondary" onClick={()=>setPage('comparison')}>View Comparison</button>}
  <button type="button" className="primary" onClick={reviseTranslation}><Pencil size={17}/>{hasRevisions?'Revise Again':'Revise Translation'}</button>
</div></>}<p className="demo-note">Your translation is sent to Groq for review. AI feedback may contain mistakes.</p></section>}<div className="practice-footnote"><span className="status-dot"/>Keep editing your translation above and request feedback again whenever you’re ready.</div></main></>:
page==='progress'?<Progress completed={completed}/>:<main className="utility"><span className="eyebrow">YOUR LEARNING SPACE</span><h1>{page==='saved'?'My Sentences':page==='progress'?'A little better, every day.':'Make practice your own.'}</h1><p className="muted">{page==='saved'?'Revisit useful expressions and let them become second nature.':page==='progress'?'Every sentence is another step toward confidence.':'Choose your practice preferences.'}</p>{page==='saved'?saved.length?saved.map(s=><article className="saved-card" key={s.zh}><BookOpen size={22}/><button type="button" className="saved-history-link" onClick={()=>{setSelectedSentence(s);setPage('saved-detail')}}>
  <span><strong>{s.zh}</strong><small>View translation history</small>
  {savedHistory(s).at(-1)?.scores&&<span className="history-scores">{scoreCategories.map(([key,label])=>{
    const history=savedHistory(s);
    const first=history[0].scores?.[key],last=history.at(-1).scores?.[key];
    return <span key={key}>{label} {Number.isInteger(first)&&first!==last?`${formatScore(first)} → `:''}{formatScore(last)}</span>;
  })}</span>}</span>
</button><button type="button" className="secondary saved-practice" onClick={()=>practiceSaved(s)}>Practice Again</button><button className="icon-button" aria-label="Remove saved sentence" onClick={()=>removeSavedSentence(s)}><Trash2 size={17}/></button></article>):<div className="empty"><Bookmark size={35}/><h3>Your collection starts with one sentence.</h3><p>Save a reference answer after completing an exercise.</p><button className="primary" onClick={()=>setPage('practice')}>Start practicing <ArrowRight size={17}/></button></div>:page==='progress'?<><div className="stats">{[[completed.length,'Translations submitted'],[saved.length,'Sentences saved'],[`${Math.min(todayCount,10)}/10`,'Daily goal']].map(([number,label])=><article key={label}><strong>{number}</strong><span>{label}</span></article>)}</div><h3>Recent practice</h3>{completed.length?completed.slice(-5).reverse().map((item,i)=><article className="saved-card" key={i}><Check size={20}/><div><h3>{item.zh}</h3><p>{item.text}</p></div></article>):<p className="empty">Your first practice session is waiting for you.</p>}</>:<><div className="settings-card"><label htmlFor="level">Practice level</label><select id="level" value={difficulty} onChange={e=>{setDifficulty(e.target.value);localStorage.setItem('tb-level',JSON.stringify(e.target.value))}}>{['Beginner','Intermediate','Advanced'].map(v=><option key={v}>{v}</option>)}</select><p className="muted">This preference labels your session. The collection includes 100 intermediate Chinese-to-English exercises.</p></div><PracticePreferences preferences={preferences} onChange={changePreference}/></>}</main>}
</div>}{toast&&<div className="toast" role="status"><Check size={17}/>{toast}</div>}</div>}
createRoot(document.getElementById('root')).render(<App/>);
