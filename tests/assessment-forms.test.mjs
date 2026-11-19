import test from 'node:test';
import assert from 'node:assert/strict';
import exercises from '../src/exercises.js';
import {assessmentForms,assessmentFormIndex,nextAssessmentFormIndex,selectAssessmentForm} from '../src/assessment-exercises.js';
import {reviewerMeanings} from '../src/reviewer-meanings.js';

const completed=(index,sequence)=>({id:'assessment-'+sequence,date:new Date(2026,0,sequence+1).toISOString(),answers:assessmentForms[index].map(item=>({zh:item.zh,text:'Test answer'}))});

test('Four fixed forms have five unique, practice-exclusive sentences and reviewer meanings',()=>{
  assert.equal(assessmentForms.length,4);
  assert.deepEqual(assessmentForms.map(form=>form.length),[5,5,5,5]);
  const items=assessmentForms.flat();
  assert.equal(new Set(items.map(item=>item.zh)).size,20);
  const practice=new Set(exercises.map(item=>item.zh));
  for(const item of items){
    assert.ok(!practice.has(item.zh));
    assert.ok(item.en.length>0);
    assert.ok(reviewerMeanings[item.zh]?.length>0);
  }
  assert.equal(assessmentFormIndex(items.slice(3,8)),-1); // Mixed pools are not forms.
});
test('Completed assessments advance A, B, C, D, A without immediate repeats',()=>{
  const history=[];
  for(let round=0;round<12;round++){
    const expected=round%4;
    assert.equal(nextAssessmentFormIndex(history),expected);
    assert.equal(selectAssessmentForm(history),assessmentForms[expected]);
    history.push({...completed(expected,round),formIndex:expected});
  }
});
test('Existing histories remain unchanged and continue after their latest identifiable form',()=>{
  const oldHistory=[completed(0,0),completed(1,1),completed(2,2)];
  const before=JSON.stringify(oldHistory);
  assert.equal(nextAssessmentFormIndex(oldHistory),3);
  assert.equal(nextAssessmentFormIndex([...oldHistory].reverse()),3);
  assert.equal(JSON.stringify(oldHistory),before);
  // Recognition takes precedence over record count, avoiding an immediate repeat.
  assert.equal(nextAssessmentFormIndex([completed(3,0)]),0);
  assert.equal(nextAssessmentFormIndex([{date:'2026-01-01',formIndex:2}]),3);
  // Older unknown sentence banks still advance deterministically without rewriting records.
  assert.equal(nextAssessmentFormIndex([{id:'legacy'}]),1);
});
