import React, {useState, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {BookOpen, Pencil, Bookmark, ChartNoAxesColumnIncreasing, Settings, Lightbulb, ArrowRight, RotateCcw, Send, Volume2, Copy, Check, Sparkles, Target, FileCheck2, MessagesSquare, Heart, X, Home} from 'lucide-react';
import './styles.css';
import exercises from './exercises.js';
const nav=[['practice','Practice',Pencil],['saved','My Sentences',Bookmark],['progress','Progress',ChartNoAxesColumnIncreasing],['settings','Settings',Settings]];
function read(key, fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const scoreCategories=[['meaning','Meaning accuracy'],['grammar','Grammar'],['naturalness','Naturalness']];
const formatScore=score=>Number.isInteger(score)?`${score}/5`:'—';
function ScoreComparison({original,revised}){
  return <table className="revision-scores">
    <thead><tr><th scope="col">Category</th><th scope="col">Original</th><th scope="col">Revised</th><th scope="col">Change</th></tr></thead>
    <tbody>{scoreCategories.map(([key,label])=>{
      const before=original.scores?.[key],after=revised.scores?.[key];
      const change=Number.isInteger(before)&&Number.isInteger(after)?after-before:null;
      return <tr key={key}><th scope="row">{label}</th><td>{formatScore(before)}</td><td>{formatScore(after)}</td>
        <td className={change>0?'score-gain':change<0?'score-loss':''}>{change===null?'—':change>0?`+${change}`:change}</td></tr>;
    })}</tbody>
  </table>;
}
function savedHistory(entry){
  return entry.history?.length?entry.history:entry.translation?[{text:entry.translation}]:[];
}
function App(){
const [page,setPage]=useState('home'),[index,setIndex]=useState(0),[translation,setTranslation]=useState(''),[hint,setHint]=useState(false),[saved,setSaved]=useState(()=>read('tb-saved',[])),[completed,setCompleted]=useState(()=>read('tb-completed',[])),[toast,setToast]=useState(''),[difficulty,setDifficulty]=useState(()=>read('tb-level','Intermediate'));
const [showAnswer,setShowAnswer]=useState(false),[showFeedback,setShowFeedback]=useState(false);
const [feedback,setFeedback]=useState(null),[feedbackError,setFeedbackError]=useState(''),[loading,setLoading]=useState(false);
const [revision,setRevision]=useState('');
const [versions,setVersions]=useState([]),[selectedSentence,setSelectedSentence]=useState(null);
const activeRequest=useRef(null);
function clearFeedback(){setVersions([]);activeRequest.current?.abort();activeRequest.current=null;setLoading(false);setShowFeedback(false);setFeedback(null);setFeedbackError('');}
const ex=exercises[index%exercises.length];
const todayCount=new Set(completed.filter(item=>new Date(item.date).toDateString()===new Date().toDateString()).map(item=>item.zh)).size;
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
if(activeRequest.current!==controller)return;
const attempt={text:draft.trim(),scores:data.feedback.scores,date:new Date().toISOString()};
setVersions(revising?[...versions,attempt]:[attempt]);
setFeedback(data.feedback);
if(revising){
  setTranslation(draft);
  setPage(current=>current==='revision'?'comparison':current);
}
const next=[...completed,{text:draft,zh:ex.zh,date:new Date().toISOString()}];setCompleted(next);localStorage.setItem('tb-completed',JSON.stringify(next));
}catch(error){if(activeRequest.current===controller)setFeedbackError(error.name==='AbortError'?'The request timed out. Please try again.':error instanceof TypeError?'Could not connect to the feedback service. Check your connection and Cloudflare setup.':error.message)}
finally{clearTimeout(timeout);if(activeRequest.current===controller){activeRequest.current=null;setLoading(false)}}
}
function next(){clearFeedback();setIndex(index+1);clearFeedback();setTranslation('');setHint(false);setShowAnswer(false);setShowFeedback(false);setPage('practice')}
function reviseTranslation(){
  setRevision(translation);
  setFeedbackError('');
  setPage('revision');
}
const existingSentence=saved.find(s=>s.zh===ex.zh);
const savedCurrentTranslation=existingSentence?.translation===translation.trim()&&
  versions.every(version=>existingSentence.history?.includes(version));
function saveMyTranslation(){
  const previous=existingSentence?savedHistory(existingSentence):[];
  const history=[...previous,...versions.filter(version=>!previous.includes(version))];
  const entry={...existingSentence,...ex,translation:translation.trim(),history};
  const next=existingSentence?saved.map(s=>s.zh===ex.zh?entry:s):[...saved,entry];
  localStorage.setItem('tb-saved',JSON.stringify(next));
  setSaved(next);
  notify('Translation saved to My Sentences');
}
function practiceSaved(sentence){
  const exerciseIndex=exercises.findIndex(item=>item.zh===sentence.zh);
  if(exerciseIndex<0)return;
  clearFeedback();
  setIndex(exerciseIndex);
  setTranslation('');
  setHint(false);
  setShowAnswer(false);
  setPage('practice');
}
function save(){if(saved.some(s=>s.zh===ex.zh)){notify('This sentence is already in your collection');return}const next=[...saved,ex];setSaved(next);localStorage.setItem('tb-saved',JSON.stringify(next));notify('Sentence saved to your collection')}
function speak(){if('speechSynthesis' in window){speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(ex.zh);utterance.lang='zh-CN';speechSynthesis.speak(utterance)}else notify('Audio is unavailable in this browser')}
return <div className="app"><header><button className="brand" onClick={()=>setPage('home')} aria-label="TranslateBetter home"><span className="brand-icon"><BookOpen size={31}/></span><span><strong>TranslateBetter</strong><small>AI-assisted English translation practice</small></span></button></header>
{page==='home'?<main className="landing"><section className="hero"><div className="hero-copy"><span className="eyebrow"><span/> A LITTLE PRACTICE. A LOT OF PROGRESS.</span><h1>Improve your English<br/>through <span>real translations.</span></h1><p>Find the right words. Make them your own.<br/>Practice Chinese → English translation with thoughtful feedback that helps you grow.</p><button className="primary start" onClick={()=>setPage('practice')}>Start practicing <ArrowRight size={19}/></button><div className="hero-note"><Check size={15}/> No pressure. Just progress, one sentence at a time.</div></div><div className="illustration" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="twinkle one">✦</span><span className="twinkle two">✧</span><div className="bubble chinese">中</div><div className="bubble english">A</div><div className="book"><div className="book-page left"><i/><i/><i/><i/><i/></div><div className="book-page right"><i/><i/><i/><i/><i/></div></div><span className="book-shadow"/><span className="mini-pill"><Sparkles size={14}/> Words open worlds</span></div></section><div className="section-heading"><h2>A better way to learn by doing</h2><span>Small steps. Lasting confidence.</span></div><section className="features">{[[Heart,'amber','Personalized feedback','Understand the meaning, grammar, and naturalness of your writing.'],[FileCheck2,'purple','Revise and improve','Compare your versions and discover how to make each sentence better.'],[Bookmark,'green','Keep the good ones','Build a personal collection of useful sentences to revisit.'],[ChartNoAxesColumnIncreasing,'blue','See your progress','Turn everyday practice into improvement you can feel.']].map(([Icon,color,title,text],i)=><article key={title}><div className={'feature-icon '+color}><Icon size={23}/></div><span className="feature-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</section><footer><span>Made for the moments when you want to get a little better.</span><span>中文 <ArrowRight size={12}/> English</span></footer></main>:
<div className="workspace">
{<aside className="sidebar"><div>{nav.slice(0,3).map(([id,label,Icon])=><button key={id} className={page===id||(id==='practice'&&['revision','comparison'].includes(page))||(id==='saved'&&page==='saved-detail')?'selected':''} onClick={()=>setPage(id)}><Icon size={19}/>{label}</button>)}<button onClick={()=>{setPage('practice');setHint(true)}}><Lightbulb size={19}/>Learning tips</button><button className={page==='settings'?'selected':''} onClick={()=>setPage('settings')}><Settings size={19}/>Settings</button></div><div className="goal"><span>Today’s goal</span><div><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/><circle cx="20" cy="20" r="16" style={{strokeDasharray:`${Math.min(todayCount,10)*10.05} 101`}}/></svg><strong>{Math.min(todayCount,10)} <small>/ 10<br/>sentences</small></strong></div><p>{todayCount>=10?'Goal reached. Nice work!':'You’re building a good habit.'}</p></div></aside>}
{page==='comparison'?<main className="practice-main revision-view">
  <h1>Your Improvement</h1>
  <p className="revision-description">Compare your original and revised translations.</p>
  <div className="comparison-versions">
    <section><h2>Original Translation</h2><p>{versions[0].text}</p></section>
    <section><h2>Revised Translation</h2><p>{versions.at(-1).text}</p></section>
  </div>
  <ScoreComparison original={versions[0]} revised={versions.at(-1)}/>
  <div className="revision-actions">
    <button type="button" className="secondary" onClick={()=>setPage('practice')}>View AI Feedback</button>
    <button type="button" className="secondary" onClick={saveMyTranslation} disabled={savedCurrentTranslation}><Bookmark size={17}/>{savedCurrentTranslation?'Saved to My Sentences':'Save to My Sentences'}</button>
    <button type="button" className="primary" onClick={next}>Next Sentence <ArrowRight size={17}/></button>
  </div>
</main>:page==='saved-detail'?<main className="utility revision-view">
  <button className="secondary" onClick={()=>setPage('saved')}>← Back to My Sentences</button>
  <h1 className="saved-detail-title">{selectedSentence.zh}</h1>
  <p className="muted">Reference answer · {selectedSentence.en}</p>
  <h2>Your Translation History</h2>
  {savedHistory(selectedSentence).length?savedHistory(selectedSentence).map((version,i)=><section className="history-version" key={i}>
    <h3>{i===0?'Original Translation':`Saved Version ${i+1}`}</h3>
    <p>{version.text}</p>
    {version.scores&&<div className="history-scores">{scoreCategories.map(([key,label])=><span key={key}>{label} {formatScore(version.scores[key])}</span>)}</div>}
  </section>):<p className="muted">Practice this sentence and save your translation to start its history.</p>}
  <div className="revision-actions"><button className="primary" onClick={()=>practiceSaved(selectedSentence)}>Practice Again <ArrowRight size={17}/></button></div>
</main>:page==='revision'?<main className="practice-main revision-view">
  <h1>Revise Your Translation</h1>
  <p className="revision-description">Use the feedback to improve your translation.</p>
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
</main>:page==='practice'?<><main className="practice-main"><div className="practice-top"><span>Sentence {index+1}</span>{feedback&&<button type="button" className="secondary practice-save" onClick={saveMyTranslation} disabled={savedCurrentTranslation}>{savedCurrentTranslation?<Check size={17}/>:<Bookmark size={17}/>} {savedCurrentTranslation?'Saved to My Sentences':'Save to My Sentences'}</button>}</div><div className="sentence"><span>{ex.zh}</span><button onClick={speak} className="icon-button" aria-label="Listen to Chinese sentence"><Volume2 size={21}/></button></div>{page==='practice'&&<p className="instructions">Take a moment to understand the sentence, then make it your own in English.</p>}<form onSubmit={submit}><div className="label-row"><label htmlFor="translation">Your translation</label>{page==='feedback'&&<button type="button" className="text-button" onClick={()=>setPage('practice')}>Edit <Pencil size={13}/></button>}</div><div className={'textarea-wrap '+(page==='feedback'?'submitted':'')}><textarea id="translation" placeholder="Type your English translation here…" maxLength={500} value={translation} readOnly={page==='feedback'} onChange={e=>{setTranslation(e.target.value);if(!e.target.value.trim())setShowAnswer(false);clearFeedback()}} required/><span className="counter">{translation.length}/500</span></div>{hint&&page==='practice'&&<div className="hint"><Lightbulb size={18}/><p>{ex.hint}</p><button type="button" className="icon-button" aria-label="Close hint" onClick={()=>setHint(false)}><X size={15}/></button></div>}<div className="practice-actions inline-actions"><button type="button" className="secondary" disabled={!translation.trim()} onClick={()=>setShowAnswer(!showAnswer)} aria-expanded={showAnswer} aria-controls="reference-answer"><BookOpen size={17}/>{showAnswer?'Hide the answer':'See the answer'}</button><button className="primary" disabled={!translation.trim()||loading} aria-controls="practice-feedback"><Sparkles size={17}/>{loading?'Getting feedback…':'Get AI feedback'}</button></div><div className="practice-tools"><button className="hint-button" type="button" onClick={()=>setHint(!hint)}><Lightbulb size={16}/>Need a hint?</button><button type="button" className="text-button" onClick={()=>{clearFeedback();setTranslation('');setHint(false);setShowAnswer(false);setShowFeedback(false)}}><RotateCcw size={15}/>Reset</button><button type="button" className="text-button" onClick={next}>Next sentence<ArrowRight size={15}/></button></div></form>{showAnswer&&<section id="reference-answer" className="feedback inline-result" aria-label="Reference answer"><h3><BookOpen size={19}/>Reference answer</h3><div className="reference"><p>{ex.en}</p><button className="icon-button" onClick={async()=>{try{await navigator.clipboard.writeText(ex.en);notify('Reference answer copied')}catch{notify('Copy is unavailable in this browser')}}} aria-label="Copy reference answer"><Copy size={17}/></button></div><button className="save-button" onClick={save}><Bookmark size={15}/>{saved.some(s=>s.zh===ex.zh)?'Saved to my sentences':'Save this sentence'}</button></section>}{showFeedback&&<section id="practice-feedback" className="feedback inline-result" aria-label="Practice feedback" aria-live="polite"><div className="feedback-heading"><h3><Sparkles size={19}/>AI feedback</h3></div>{loading&&<p role="status">Reviewing your translation…</p>}{feedbackError&&<p role="alert" className="feedback-error">{feedbackError}</p>}{feedback&&<>{[[Target,'Meaning accuracy','meaning'],[FileCheck2,'Grammar','grammar'],[MessagesSquare,'Naturalness','naturalness']].map(([Icon,title,key])=>{const rawScore=feedback.scores?.[key];const score=Number.isInteger(rawScore)&&rawScore>=0&&rawScore<=5?rawScore:null;const color=score===null?'unscored':score===5?'green':score>=3?'amber':'coral';return <article className={'feedback-card '+color} key={key}><span className="feedback-icon"><Icon size={21}/></span><div className="feedback-content"><div className="score-heading"><h4>{title}</h4>{score!==null&&<strong className="score-badge" aria-label={`${title}: ${score} out of 5`}>{score}/5</strong>}</div><p>{feedback[key]}</p></div></article>})}{!feedback.scores&&<p className="demo-note">Scores will appear after the updated Cloudflare Worker is deployed.</p>}<h3>Suggested translation</h3><div className="reference"><p>{feedback.improvedTranslation}</p></div><div className="feedback-actions"><button type="button" className="primary" onClick={reviseTranslation}><Pencil size={17}/>Revise Translation</button></div></>}<p className="demo-note">Your translation is sent to Groq for review. AI feedback may contain mistakes.</p></section>}<div className="practice-footnote"><span className="status-dot"/>Keep editing your translation above and request feedback again whenever you’re ready.</div></main></>:
<main className="utility"><span className="eyebrow">YOUR LEARNING SPACE</span><h1>{page==='saved'?'My Sentences':page==='progress'?'A little better, every day.':'Make practice your own.'}</h1><p className="muted">{page==='saved'?'Revisit useful expressions and let them become second nature.':page==='progress'?'Every sentence is another step toward confidence.':'Choose your preferred practice level.'}</p>{page==='saved'?saved.length?saved.map(s=><article className="saved-card" key={s.zh}><BookOpen size={22}/><button type="button" className="saved-history-link" onClick={()=>{setSelectedSentence(s);setPage('saved-detail')}}>
  <span><strong>{s.zh}</strong><small>{s.translation||s.en}</small>
  {savedHistory(s).at(-1)?.scores&&<span className="history-scores">{scoreCategories.map(([key,label])=>{
    const history=savedHistory(s);
    const first=history[0].scores?.[key],last=history.at(-1).scores?.[key];
    return <span key={key}>{label} {Number.isInteger(first)&&first!==last?`${formatScore(first)} → `:''}{formatScore(last)}</span>;
  })}</span>}</span><ArrowRight size={17}/>
</button><button className="icon-button" aria-label="Remove saved sentence" onClick={()=>{const next=saved.filter(item=>item.zh!==s.zh);setSaved(next);localStorage.setItem('tb-saved',JSON.stringify(next))}}><X size={17}/></button></article>):<div className="empty"><Bookmark size={35}/><h3>Your collection starts with one sentence.</h3><p>Save a reference answer after completing an exercise.</p><button className="primary" onClick={()=>setPage('practice')}>Start practicing <ArrowRight size={17}/></button></div>:page==='progress'?<><div className="stats">{[[completed.length,'Translations submitted'],[saved.length,'Sentences saved'],[`${Math.min(todayCount,10)}/10`,'Daily goal']].map(([number,label])=><article key={label}><strong>{number}</strong><span>{label}</span></article>)}</div><h3>Recent practice</h3>{completed.length?completed.slice(-5).reverse().map((item,i)=><article className="saved-card" key={i}><Check size={20}/><div><h3>{item.zh}</h3><p>{item.text}</p></div></article>):<p className="empty">Your first practice session is waiting for you.</p>}</>:<div className="settings-card"><label htmlFor="level">Practice level</label><select id="level" value={difficulty} onChange={e=>{setDifficulty(e.target.value);localStorage.setItem('tb-level',JSON.stringify(e.target.value))}}>{['Beginner','Intermediate','Advanced'].map(v=><option key={v}>{v}</option>)}</select><p className="muted">This preference labels your session. The collection includes 100 intermediate Chinese-to-English exercises.</p></div>}</main>}
</div>}{toast&&<div className="toast" role="status"><Check size={17}/>{toast}</div>}</div>}
createRoot(document.getElementById('root')).render(<App/>);
