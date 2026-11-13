import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultPracticePreferences, normalizePracticePreferences, sentencePerformance, selectPracticeSentence} from '../src/practice-selection.js';

const bank=Array.from({length:12},(_,i)=>({zh:'Sentence '+i}));
const attempt=(index,scores,date='2026-11-01',extra={})=>({zh:bank[index].zh,scores,date,mode:'practice',...extra});
const strong={meaning:5,grammar:5,naturalness:5};
const weak={meaning:5,grammar:3,naturalness:5};

test('Preferences default on and preserve explicit off values',()=>{
  assert.deepEqual(normalizePracticePreferences(null),defaultPracticePreferences);
  assert.deepEqual(normalizePracticePreferences({prioritizeUnseen:false,repeatLowerScores:false}),{prioritizeUnseen:false,repeatLowerScores:false});
});
test('Latest valid practice scores, including revisions, determine review priority',()=>{
  const records=[attempt(0,weak),attempt(0,strong,'2026-11-02',{revision:true}),attempt(1,weak),
    attempt(2,strong),attempt(3,{meaning:3,grammar:3,naturalness:3}),
    attempt(4,weak,'2026-11-03',{mode:'assessment'}),attempt(5,null)];
  const original=JSON.stringify(records);
  const history=sentencePerformance(records);
  assert.equal(history.get(bank[0].zh).lowerScoring,false);
  assert.equal(history.get(bank[1].zh).lowerScoring,true); // Overall >4, one category <4.
  assert.equal(history.get(bank[2].zh).lowerScoring,false);
  assert.equal(history.get(bank[3].zh).lowerScoring,true);
  assert.equal(history.has(bank[4].zh),false);
  assert.equal(history.get(bank[5].zh).practiced,true); // Retain legacy completion knowledge.
  assert.equal(history.get(bank[5].zh).scores,undefined);
  assert.equal(sentencePerformance([...records].reverse()).get(bank[0].zh).lowerScoring,false);
  assert.equal(JSON.stringify(records),original);
});
test('New sentences are preferred with occasional weaker reviews; toggles work independently',()=>{
  const records=[attempt(0,strong),attempt(1,weak)];
  const on=defaultPracticePreferences;
  assert.equal(selectPracticeSentence(bank,records,on,[],()=>0),1);
  assert.ok(selectPracticeSentence(bank,records,on,[],()=>0.9)>=2);
  assert.equal(selectPracticeSentence(bank,records,{...on,repeatLowerScores:false},[],()=>0),2);
  assert.equal(selectPracticeSentence(bank,records,{prioritizeUnseen:false,repeatLowerScores:false},[],()=>0),0);
  assert.equal(selectPracticeSentence(bank,records,{prioritizeUnseen:false,repeatLowerScores:true},[],()=>0),1);
});
test('Recent cooldown prevents immediate and short-sequence repeats; completed sentences stay available',()=>{
  const recent=[];
  for(let i=0;i<40;i++){
    const next=selectPracticeSentence(bank,[],defaultPracticePreferences,recent,()=>0);
    assert.ok(!recent.slice(-5).includes(next));
    recent.push(next);
  }
  const records=bank.map((_,i)=>attempt(i,strong));
  assert.equal(selectPracticeSentence(bank,records,defaultPracticePreferences,[0],()=>0),1);
  assert.equal(selectPracticeSentence(bank.slice(0,2),[],defaultPracticePreferences,[0,1],()=>0),0);
  assert.equal(selectPracticeSentence([],[],defaultPracticePreferences),null);
});
test('Both defaults introduce new sentences regularly instead of exclusively reviewing weak ones',()=>{
  const records=[attempt(0,strong),attempt(1,weak)];
  let seed=42, reviews=0;
  const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  for(let i=0;i<1000;i++){
    const index=selectPracticeSentence(bank,records,defaultPracticePreferences,[],random);
    assert.notEqual(index,0);
    if(index===1)reviews++;
  }
  assert.ok(reviews>180 && reviews<320);
});
