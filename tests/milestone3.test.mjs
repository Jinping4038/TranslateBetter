import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {validatedPracticeScores, validPracticeAttempt, readPracticeSession} from '../src/practice-data.js';
import {appendRecord} from '../src/storage.js';
import {appendVersions} from '../src/revision-history.js';
import {summarizeAssessment} from '../src/assessment-data.js';
import {assessmentForms} from '../src/assessment-exercises.js';

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
      const draft={id:'assessment'+round,bankVersion:1,index:4,submitted:false,items:assessmentForms[round].map(q=>({...q,answer:'An independent answer.',scores:null}))};
      localStorage.setItem('tb-assessment-draft',JSON.stringify(draft));
      const assessmentHarness=hooks();globalThis.__testReact=assessmentHarness.react;
      const {default:Assessment}=await componentModule('src/Assessment.jsx');
      let assessmentTree=assessmentHarness.render(Assessment,{...props,assessments});
      assert.ok(!text(assessmentTree).includes('Hint 1'));
      assert.ok(!text(assessmentTree).includes(draft.items[4].en));
      await nodes(assessmentTree).find(node=>node.type==='form').props.onSubmit(event);
      assessmentTree=assessmentHarness.render(Assessment,{...props,assessments});
      assert.ok(text(assessmentTree).includes('Your Translation Level'));
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
    const assessmentSection=nodes(progress).find(node=>node.type?.name==='AssessmentProgress');
    assert.ok(text(assessmentSection.type(assessmentSection.props)).includes('Change from Baseline+4.0'));
    assert.ok(text(progress).includes('Revisions Completed1'));
  } finally {
    globalThis.fetch=originalFetch;
  }
});
