import test from 'node:test';
import assert from 'node:assert/strict';
import {practiceProgress} from '../src/progress-data.js';

const record=(id,date,values=[4,4,4],extra={})=>({id,zh:'Sentence '+id,date,mode:'practice',scores:{meaning:values[0],grammar:values[1],naturalness:values[2]},...extra});

test('Daily trend contains all actual completion dates, averages same-day attempts, and adds no empty days',()=>{
  const data=[record('today','2026-11-12T17:00:00'),record('earlier','2026-11-09T12:00:00'),
    record('yesterday','2026-11-11T13:00:00',[2,3,4]),record('second','2026-11-12T20:00:00',[2,3,4]),
    record('old','2026-01-01T12:00:00',[3,3,3])];
  const before=JSON.stringify(data);
  const progress=practiceProgress(data);
  assert.deepEqual(progress.days.map(day=>day.key),['2026-01-01','2026-11-09','2026-11-11','2026-11-12']);
  assert.deepEqual(progress.days.map(day=>day.value),[3,4,3,3.5]);
  assert.equal(progress.days.at(-1).count,2);
  assert.equal(progress.practiceAttempts,5);
  assert.equal(progress.average,3.4);
  assert.equal(progress.days.reduce((sum,day)=>sum+day.value*day.count,0)/progress.attempts.length,progress.average);
  assert.equal(JSON.stringify(data),before);
});
test('Category filters recompute daily means and overall uses the category average',()=>{
  const data=[record('one','2026-11-12',[5,3,4]),record('two','2026-11-12',[3,1,2])];
  for(const [category,expected] of [['meaning',4],['grammar',2],['naturalness',3],['overall',3]]){
    const progress=practiceProgress(data,category);
    assert.equal(progress.days[0].value,expected);
    if(category!=='overall')assert.equal(progress.breakdown[category],expected);
  }
});
test('Revisions and assessments never inflate independent practice metrics or create practice days',()=>{
  const data=[record('original','2026-11-09',[3,3,3]),
    record('revision','2026-11-12',[5,5,5],{revision:true}),
    record('assessment','2026-11-11',[1,1,1],{mode:'assessment'}),
    record('bad','2026-11-12',[9,3,3]),record('undated','invalid',[5,5,5])];
  const progress=practiceProgress(data);
  assert.equal(progress.average,3);
  assert.deepEqual(progress.breakdown,{meaning:3,grammar:3,naturalness:3});
  assert.equal(progress.practiceAttempts,1);
  assert.equal(progress.revisionsCompleted,1);
  assert.deepEqual(progress.days.map(day=>day.key),['2026-11-09']);
  assert.deepEqual(practiceProgress([]).days,[]);
});
test('Local calendar days handle UTC boundaries, DST, calendar-only legacy dates, and different years',()=>{
  const previous=process.env.TZ;
  process.env.TZ='America/Los_Angeles';
  try {
    const progress=practiceProgress([
      record('utc','2026-11-12T01:00:00Z'), // Nov 11 locally.
      record('legacy','2026-11-12'),
      record('dst1','2026-11-01T08:30:00Z'),record('dst2','2026-11-01T09:30:00Z'),
      record('year','2025-11-12'),record('bad','2026-02-30'),
    ]);
    assert.deepEqual(progress.days.map(day=>day.key),['2025-11-12','2026-11-01','2026-11-11','2026-11-12']);
    assert.equal(progress.days[1].count,2);
    assert.ok(progress.days[0].label.includes('2025'));
    assert.equal(progress.attempts.length,5);
  } finally {
    if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;
  }
});

test('Practice Attempts counts repeated sentences across all dates with the same records used for average and trend',()=>{
  const data=[
    record('one','2026-11-05',[5,5,5],{zh:'Same sentence'}),
    record('two','2026-11-05',[3,3,3],{zh:'Same sentence'}),
    record('three','2026-11-12',[1,1,1],{zh:'Same sentence'}),
    record('revision','2026-11-12',[5,5,5],{zh:'Same sentence',revision:true}),
    record('assessment','2026-11-12',[5,5,5],{mode:'assessment'}),
  ];
  const before=JSON.stringify(data);
  const progress=practiceProgress(data);
  assert.equal(progress.practiceAttempts,3);
  assert.equal(progress.average,3);
  assert.deepEqual(progress.days.map(day=>[day.key,day.value,day.count]),[
    ['2026-11-05',4,2],['2026-11-12',1,1],
  ]);
  assert.equal(progress.days.reduce((sum,day)=>sum+day.count,0),progress.practiceAttempts);
  assert.equal(progress.revisionsCompleted,1);
  assert.equal(practiceProgress([]).practiceAttempts,0);
  assert.equal(JSON.stringify(data),before);
});
