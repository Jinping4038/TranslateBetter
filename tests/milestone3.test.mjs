import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {validatedPracticeScores, validPracticeAttempt, readPracticeSession} from '../src/practice-data.js';
import {appendRecord} from '../src/storage.js';
import {appendVersions} from '../src/revision-history.js';
import {practiceProgress} from '../src/progress-data.js';
import {summarizeAssessment} from '../src/assessment-data.js';
import {assessmentForms, assessmentBankVersion} from '../src/assessment-exercises.js';

function storage() {
  const entries = new Map();
  return {getItem: key => entries.get(key) ?? null, setItem: (key,value) => entries.set(key,String(value))};
}
function hooks() {
  const states=[], refs=[], effects=[];
  let cursor=0, pending=[];
  const react={
    createElement: (type,props,...children) => ({type,props:{...props,children:children.flat(Infinity)}}),
    Fragment:'fragment',
    forwardRef: render => render,
    createContext: () => ({}),
    useState(initial) {
      const index=cursor++;
      if (!(index in states)) states[index]=typeof initial==='function'?initial():initial;
      return [states[index],value=>{states[index]=typeof value==='function'?value(states[index]):value;}];
    },
    useRef(initial) { const index=cursor++; return refs[index] ||= {current:initial}; },
    useEffect(callback, dependencies) {
      const index=cursor++;
      if (!effects[index] || dependencies.some((value,i)=>value!==effects[index].dependencies[i])) {
        pending.push(()=>{effects[index]?.cleanup?.();effects[index]={dependencies,cleanup:callback()};});
      }
    },
  };
  return {
    react,
    render(Component,props={}) {
      cursor=0;pending=[];
      const tree=Component(props);
      pending.forEach(effect=>effect());
      return tree;
    },
    cleanup(){effects.forEach(effect=>effect?.cleanup?.());},
  };
}
function nodes(tree) {
  if (!tree || typeof tree!=='object') return [];
  return [tree,...(tree.props?.children||[]).flatMap(nodes)];
}
function text(tree) {
  if (tree===null||tree===undefined||typeof tree==='boolean')return '';
  return typeof tree==='object'?(tree.props?.children||[]).map(text).join(''):String(tree);
}
function button(tree,label) {
  const found=nodes(tree).find(node=>node.type==='button'&&text(node).trim()===label);
  assert.ok(found,'Missing button '+label);
  return found;
}
const event={preventDefault(){}};

async function componentModule(file, exposeApp=false) {
  const output=await build({
    entryPoints:[file],bundle:true,platform:'node',format:'cjs',write:false,loader:{'.css':'empty'},
    plugins:[{
      name:'isolated-component-test',
      setup(builder) {
        builder.onResolve({filter:/^react-dom\/client$/},()=>({path:'react-dom-client',namespace:'dom-test'}));
        builder.onLoad({filter:/.*/,namespace:'dom-test'},()=>({contents:'export const createRoot=()=>({render(){}});'}));
        builder.onResolve({filter:/^react$/},()=>({path:'react',namespace:'test'}));
        builder.onLoad({filter:/.*/,namespace:'test'},()=>({contents:
          'const React=globalThis.__testReact;export default React;export const {useState,useRef,useEffect,forwardRef,createContext,createElement}=React;'}));
        if(exposeApp)builder.onLoad({filter:/src\/main.jsx$/},async args=>({
          loader:'jsx',contents:(await fs.readFile(args.path,'utf8')).replace("createRoot(document.getElementById('root')).render(<App/>);",'export default App;'),
        }));
      },
    }],
  });
  const module={exports:{}};
  new Function('require','module','exports',output.outputFiles[0].text)(createRequire(import.meta.url),module,module.exports);
  return module.exports;
}
const goodScores={meaning:4,grammar:3,naturalness:5};
const aiFeedback={meaning:'Meaning review',grammar:'Grammar review',naturalness:'Naturalness review',improvedTranslation:'An example.',scores:goodScores};

test('Milestone 3 regression flows with isolated storage and mocked AI',async()=>{
  globalThis.localStorage=storage();
  globalThis.sessionStorage=storage();
  globalThis.window={addEventListener(){},removeEventListener(){}};
  globalThis.document={getElementById(){return null;}};
  const originalFetch=globalThis.fetch;
  try {
    for(const bad of [undefined,{}, {...goodScores,grammar:NaN},{...goodScores,meaning:Infinity},{...goodScores,naturalness:6},{...goodScores,grammar:'3'},{...goodScores,overall:1}]) {
      assert.throws(()=>validatedPracticeScores(bad));
    }
    assert.equal(validatedPracticeScores(goodScores).overall,4);
    assert.equal(validatedPracticeScores({meaning:0,grammar:0,naturalness:0}).overall,0);
    assert.equal(validPracticeAttempt({zh:'Legacy',scores:goodScores}),true);
    assert.equal(validPracticeAttempt({zh:'Bad',scores:{grammar:3}}),false);
    assert.equal(validPracticeAttempt({mode:'assessment',zh:'Test',scores:goodScores}),false);

    // Fresh reads preserve another tab's committed record.
    await appendRecord('concurrency',{id:'tab1'});
    await appendRecord('concurrency',{id:'tab2'});
    await appendRecord('concurrency',{id:'tab1'});
    assert.equal(JSON.parse(localStorage.getItem('concurrency')).length,2);
    let lockQueue=Promise.resolve();
    Object.defineProperty(globalThis,'navigator',{configurable:true,value:{locks:{
      request(_name,callback){
        const next=lockQueue.then(callback);
        lockQueue=next.catch(()=>{});
        return next;
      },
    }}});
    await Promise.all([appendRecord('locked',{id:'one'}),appendRecord('locked',{id:'two'})]);
    assert.equal(JSON.parse(localStorage.getItem('locked')).length,2);

    let harness=hooks();
    globalThis.__testReact=harness.react;
    const {default:App}=await componentModule('src/main.jsx',true);
    let tree=harness.render(App);
    button(tree,'Start practicing').props.onClick();
    tree=harness.render(App);
    nodes(tree).find(node=>node.props?.id==='translation').props.onChange({target:{value:'My first translation.'}});
    tree=harness.render(App);
    globalThis.fetch=async()=>Response.json({feedback:{...aiFeedback,scores:{meaning:4}}});
    await nodes(tree).find(node=>node.type==='form').props.onSubmit(event);
    tree=harness.render(App);
    assert.equal(localStorage.getItem('tb-completed'),null);
    assert.ok(nodes(tree).some(node=>node.props?.role==='alert'&&text(node).includes('invalid scores')));

    globalThis.fetch=async()=>Response.json({feedback:aiFeedback});
    await nodes(tree).find(node=>node.type==='form').props.onSubmit(event);
    tree=harness.render(App);
    assert.equal(JSON.parse(localStorage.getItem('tb-completed')).length,1);
    assert.equal(JSON.parse(localStorage.getItem('tb-completed'))[0].overall,4);
    await button(tree,'Save to My Sentences').props.onClick();
    tree=harness.render(App);
    button(tree,'Revise Translation').props.onClick();
    tree=harness.render(App);
    nodes(tree).find(node=>node.props?.id==='revision').props.onChange({target:{value:'My revised translation.'}});
    harness.render(App);
    harness.cleanup();

    // Reload and resume the actual revision handler.
    harness=hooks();globalThis.__testReact=harness.react;
    const {default:ReloadedApp}=await componentModule('src/main.jsx',true);
    tree=harness.render(ReloadedApp);
    assert.equal(nodes(tree).find(node=>node.props?.id==='revision').props.value,'My revised translation.');
    await nodes(tree).find(node=>node.type==='form').props.onSubmit(event);
    tree=harness.render(ReloadedApp);
    assert.ok(text(tree).includes('Your Improvement'));
    assert.equal(JSON.parse(localStorage.getItem('tb-completed')).filter(item=>item.revision).length,1);
    assert.equal(JSON.parse(localStorage.getItem('tb-saved'))[0].history.length,2);
    assert.equal(readPracticeSession().page,'comparison');
    const versions=JSON.parse(localStorage.getItem('tb-saved'))[0].history;
    assert.equal(appendVersions(versions,JSON.parse(JSON.stringify(versions))).length,2);
    button(tree,'View AI Feedback').props.onClick();
    tree=harness.render(ReloadedApp);
    button(tree,'View Comparison').props.onClick();
    harness.render(ReloadedApp);
    const snapshot=readPracticeSession();
    assert.equal(snapshot.versions.length,2);
    harness.cleanup();

    // Baseline, repeat assessment, and storage idempotency through real component callbacks.
    const practiceCount=JSON.parse(localStorage.getItem('tb-completed')).length;
    let assessments=[];
    const props={
      assessments,
      async onComplete(result){assessments=await appendRecord('tb-assessments',result);},
      onPractice(){},onProgress(){},
    };
    for(let round=0;round<2;round++){
      globalThis.fetch=async()=>Response.json({feedback:{...aiFeedback,scores:round===0?{meaning:1,grammar:1,naturalness:1}:{meaning:5,grammar:5,naturalness:5}}});
      const draft={id:'assessment'+round,bankVersion:assessmentBankVersion,index:4,submitted:false,items:assessmentForms[round].map(q=>({...q,answer:'An independent answer.',scores:null}))};
      localStorage.setItem('tb-assessment-draft',JSON.stringify(draft));
      const assessmentHarness=hooks();globalThis.__testReact=assessmentHarness.react;
      const {default:Assessment}=await componentModule('src/Assessment.jsx');
      let assessmentTree=assessmentHarness.render(Assessment,{...props,assessments});
      assert.ok(!text(assessmentTree).includes('Hint 1'));
      assert.ok(!text(assessmentTree).includes(draft.items[4].en));
      await nodes(assessmentTree).find(node=>node.type==='form').props.onSubmit(event);
      assessmentTree=assessmentHarness.render(Assessment,{...props,assessments});
      assert.ok(text(assessmentTree).includes('Check Your Translation Level'));
      assert.equal(assessments.length,round+1);
      assessmentHarness.cleanup();
    }
    assert.equal(assessments[0].overall,1);
    assert.equal(summarizeAssessment(assessments[1].answers).overall,5);
    assert.equal(JSON.parse(localStorage.getItem('tb-completed')).length,practiceCount);
    harness=hooks();globalThis.__testReact=harness.react;
    const {default:Progress}=await componentModule('src/Progress.jsx');
    const progress=harness.render(Progress,{completed:JSON.parse(localStorage.getItem('tb-completed')),assessments});
    assert.ok(text(progress).includes('Average Practice Score4.0 / 5'));
    assert.ok(text(progress).includes('Practice Sessions1'));
    assert.ok(!text(progress).includes('Sentences Practiced'));
    assert.ok(!text(progress).includes('Difference from Baseline'));
    assert.ok(text(progress).includes('Independent Assessment'));
    assert.ok(text(progress).includes('Latest Assessment 5.0 / 5'));
    let historyOpened=false;
    const linkedProgress=harness.render(Progress,{
      completed:JSON.parse(localStorage.getItem('tb-completed')),assessments,
      onAssessmentHistory:()=>{historyOpened=true;},
    });
    button(linkedProgress,'View Assessment History').props.onClick();
    assert.equal(historyOpened,true);
    const {default:AssessmentHistory}=await componentModule('src/AssessmentHistory.jsx');
    const history=AssessmentHistory({assessments});
    assert.ok(text(history).includes('Difference from Baseline+4.0'));
    assert.equal(nodes(history).filter(node=>node.type==='tbody')[0].props.children.length,2);
    const rows=nodes(history).find(node=>node.type==='tbody').props.children;
    assert.ok(text(rows[0]).includes('5.0 / 5'));
    assert.ok(text(rows[1]).includes('· Baseline'));
    assert.equal(nodes(history).filter(node=>node.type==='details').length,2);
    assert.ok(!nodes(history).some(node=>node.type==='ul'));
    const details=nodes(history).filter(node=>node.type==='details');
    assert.ok(text(details[0]).includes('Assessment Summary'));
    assert.ok(text(details[0]).includes('4.0 higher than your previous assessment'));
    assert.ok(!text(details[0]).includes('/ 5'));
    assert.ok(!text(details[1]).includes('Compared with your previous assessment'));
    const comparisonHistory=AssessmentHistory({assessments:[
      {...assessments[0],date:'2026-01-01',skills:{meaning:4,grammar:3,naturalness:4}},
      {...assessments[1],date:'2026-01-02',skills:{meaning:3.6,grammar:3,naturalness:3.6}},
      {...assessments[1],id:'third',date:'2026-01-03',skills:{meaning:3.7,grammar:3,naturalness:3.6}},
    ].reverse()});
    const comparisonDetails=nodes(comparisonHistory).filter(node=>node.type==='details');
    assert.ok(text(comparisonDetails[0]).includes('Meaning Accuracy: 0.1 higher'));
    assert.ok(text(comparisonDetails[1]).includes('Meaning Accuracy: 0.4 lower'));
    assert.ok(text(comparisonDetails[1]).includes('Grammar: no difference'));
    assert.ok(!text(comparisonDetails[2]).includes('Compared with your previous assessment'));
    assert.equal(nodes(comparisonHistory).find(node=>node.type==='thead').props.children[0].props.children.length,6);
    const decline=AssessmentHistory({assessments:[assessments[0],{...assessments[1],overall:0.7}]});
    assert.ok(text(decline).includes('Difference from Baseline−0.3'));
    const single=AssessmentHistory({assessments:[assessments[0]]});
    assert.ok(text(single).includes('Latest Assessment1.0 / 5'));
    assert.ok(text(single).includes('Difference from Baseline—'));
    const landingHarness=hooks();globalThis.__testReact=landingHarness.react;
    const {default:LandingAssessment}=await componentModule('src/Assessment.jsx');
    let landing=landingHarness.render(LandingAssessment,{...props,assessments,showHistory:true});
    assert.ok(!text(landing).includes('Skill Breakdown'));
    assert.ok(!text(landing).includes('Start Practicing'));
    button(landing,'Take Another Assessment →');
    landingHarness.cleanup();
    localStorage.setItem('tb-assessment-draft','null');
    const firstHarness=hooks();globalThis.__testReact=firstHarness.react;
    const {default:FirstAssessment}=await componentModule('src/Assessment.jsx');
    const first=firstHarness.render(FirstAssessment,{...props,assessments:[]});
    button(first,'Start Assessment →').props.onClick();
    const started=firstHarness.render(FirstAssessment,{...props,assessments:[]});
    assert.ok(text(started).includes('Sentence 1 of 5'));
    assert.equal(JSON.parse(localStorage.getItem('tb-assessments')).length,2);
    firstHarness.cleanup();
    const pendingDraft={id:'unfinished' ,bankVersion:assessmentBankVersion,index:1,submitted:false,items:assessmentForms[2].map(q=>({...q,answer:'Partial answer',scores:null}))};
    localStorage.setItem('tb-assessment-draft',JSON.stringify(pendingDraft));
    const draftBefore=localStorage.getItem('tb-assessment-draft');
    const historyHarness=hooks();globalThis.__testReact=historyHarness.react;
    const {default:HistoryAssessment}=await componentModule('src/Assessment.jsx');
    const historyPage=historyHarness.render(HistoryAssessment,{...props,assessments,showHistory:true});
    assert.ok(text(historyPage).includes('Check Your Translation Level'));
    assert.ok(nodes(historyPage).some(node=>node.type?.name==='AssessmentHistory'));
    assert.equal(localStorage.getItem('tb-assessment-draft'),draftBefore);
    button(historyPage,'Resume Assessment →').props.onClick();
    const resumed=historyHarness.render(HistoryAssessment,{...props,assessments,showHistory:true});
    assert.ok(text(resumed).includes('Sentence 2 of 5'));
    assert.equal(nodes(resumed).find(node=>node.props?.id==='assessment-answer').props.value,'Partial answer');
    assert.equal(localStorage.getItem('tb-assessment-draft'),draftBefore);
    historyHarness.cleanup();
    assert.ok(text(progress).includes('Revisions Completed1'));
    const datedPractice=[
      {zh:'First',date:'2026-11-09',scores:{meaning:4,grammar:4,naturalness:4}},
      {zh:'Recent',date:'2026-11-12',scores:{meaning:5,grammar:3,naturalness:4}},
      {zh:'Recent revision',date:'2026-11-13',scores:{meaning:5,grammar:5,naturalness:5},revision:true},
    ];
    const chartHarness=hooks();globalThis.__testReact=chartHarness.react;
    const {default:ChartProgress}=await componentModule('src/Progress.jsx');
    let chartPage=chartHarness.render(ChartProgress,{completed:datedPractice,assessments});
    let chart=nodes(chartPage).find(node=>node.props?.className==='progress-trend');
    assert.ok(chart.props['aria-label'].includes('Nov 12 4.0 out of 5'));
    assert.ok(!chart.props['aria-label'].includes('Nov 13'));
    nodes(chartPage).find(node=>node.props?.['aria-label']==='Score category').props.onChange({target:{value:'grammar'}});
    chartPage=chartHarness.render(ChartProgress,{completed:datedPractice,assessments});
    chart=nodes(chartPage).find(node=>node.props?.className==='progress-trend');
    assert.ok(chart.props['aria-label'].includes('Nov 12 3.0 out of 5'));
    assert.ok(text(chartPage).includes('Daily trend'));
    assert.ok(!text(chartPage).includes('Weekly trend'));
    chartHarness.cleanup();


    // Practice selection navigation and preferences persist without touching saved history.
    const preservedSaved=localStorage.getItem('tb-saved');
    const preservedAssessments=localStorage.getItem('tb-assessments');
    sessionStorage.setItem('tb-active-practice','null');
    const selectionHarness=hooks();globalThis.__testReact=selectionHarness.react;
    const {default:SelectionApp}=await componentModule('src/main.jsx',true);
    let selection=selectionHarness.render(SelectionApp);
    button(selection,'Start practicing').props.onClick();
    selection=selectionHarness.render(SelectionApp);
    const firstSource=text(nodes(selection).find(node=>node.props?.className==='sentence'));
    button(selection,'Next sentence').props.onClick();
    selection=selectionHarness.render(SelectionApp);
    const nextSource=text(nodes(selection).find(node=>node.props?.className==='sentence'));
    assert.notEqual(firstSource,nextSource);
    button(selection,'Previous sentence').props.onClick();
    selection=selectionHarness.render(SelectionApp);
    assert.equal(text(nodes(selection).find(node=>node.props?.className==='sentence')),firstSource);
    button(selection,'Next sentence').props.onClick();
    selection=selectionHarness.render(SelectionApp);
    assert.equal(text(nodes(selection).find(node=>node.props?.className==='sentence')),nextSource);
    button(selection,'Settings').props.onClick();
    selection=selectionHarness.render(SelectionApp);
    const preferences=nodes(selection).find(node=>node.type?.name==='PracticePreferences');
    assert.equal(preferences.props.preferences.prioritizeUnseen,true);
    preferences.props.onChange('prioritizeUnseen',false);
    selection=selectionHarness.render(SelectionApp);
    assert.equal(JSON.parse(localStorage.getItem('tb-practice-preferences')).prioritizeUnseen,false);
    assert.equal(localStorage.getItem('tb-saved'),preservedSaved);
    assert.equal(localStorage.getItem('tb-assessments'),preservedAssessments);
    const pathBefore=readPracticeSession().practiceTrail;
    selectionHarness.cleanup();
    const refreshedSelection=hooks();globalThis.__testReact=refreshedSelection.react;
    const {default:RefreshedSelectionApp}=await componentModule('src/main.jsx',true);
    selection=refreshedSelection.render(RefreshedSelectionApp);
    assert.equal(nodes(selection).find(node=>node.type?.name==='PracticePreferences').props.preferences.prioritizeUnseen,false);
    assert.deepEqual(readPracticeSession().practiceTrail,pathBefore);
    button(selection,'Practice').props.onClick();
    selection=refreshedSelection.render(RefreshedSelectionApp);
    assert.equal(text(nodes(selection).find(node=>node.props?.className==='sentence')),nextSource);
    button(selection,'My Sentences').props.onClick();
    selection=refreshedSelection.render(RefreshedSelectionApp);
    button(selection,'Practice Again').props.onClick();
    selection=refreshedSelection.render(RefreshedSelectionApp);
    assert.ok(text(nodes(selection).find(node=>node.props?.className==='sentence')).includes(JSON.parse(preservedSaved)[0].zh));
    assert.equal(localStorage.getItem('tb-saved'),preservedSaved);
    assert.equal(nodes(selection).find(node=>node.props?.id==='translation').props.value,'');
    const beforeReplay=practiceProgress(JSON.parse(localStorage.getItem('tb-completed')));
    nodes(selection).find(node=>node.props?.id==='translation').props.onChange({target:{value:'A fresh translation after Practice Again.'}});
    selection=refreshedSelection.render(RefreshedSelectionApp);
    await nodes(selection).find(node=>node.type==='form').props.onSubmit(event);
    selection=refreshedSelection.render(RefreshedSelectionApp);
    const afterReplay=practiceProgress(JSON.parse(localStorage.getItem('tb-completed')));
    assert.equal(afterReplay.practiceSessions,beforeReplay.practiceSessions+1);
    assert.equal(afterReplay.revisionsCompleted,beforeReplay.revisionsCompleted);
    button(selection,'Revise Translation').props.onClick();
    selection=refreshedSelection.render(RefreshedSelectionApp);
    nodes(selection).find(node=>node.props?.id==='revision').props.onChange({target:{value:'A revised translation after Practice Again.'}});
    selection=refreshedSelection.render(RefreshedSelectionApp);
    await nodes(selection).find(node=>node.type==='form').props.onSubmit(event);
    selection=refreshedSelection.render(RefreshedSelectionApp);
    const afterRevision=practiceProgress(JSON.parse(localStorage.getItem('tb-completed')));
    assert.equal(afterRevision.practiceSessions,afterReplay.practiceSessions);
    assert.equal(afterRevision.revisionsCompleted,afterReplay.revisionsCompleted+1);
    refreshedSelection.cleanup();

  } finally {
    globalThis.fetch=originalFetch;
  }
});
