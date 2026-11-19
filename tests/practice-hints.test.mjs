import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import exercises from '../src/exercises.js';

const normalize=text=>text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();

test('Practice still has exactly 100 original source/reference pairs in their original order',()=>{
  assert.equal(exercises.length,100);
  const digest=createHash('sha256').update(JSON.stringify(exercises.map(({zh,en})=>({zh,en})))).digest('hex');
  // Fingerprint captured before the hint-only edit; detects any changed or deleted sentence/reference.
  assert.equal(digest,'f4eb8d7427263daf6666d082a10dfcfa8d503cb2a98bc59468014d222da4e808');
});
test('Every Practice sentence has two nonempty distinct static hints with no generic fallback',()=>{
  for(const [index,item] of exercises.entries()){
    assert.ok(item.gentleHint?.trim(),'Missing Hint 1 for '+(index+1));
    assert.ok(item.hint?.trim(),'Missing Hint 2 for '+(index+1));
    assert.notEqual(normalize(item.gentleHint),normalize(item.hint));
    assert.ok(!item.gentleHint.includes('Identify the main idea, then check what the other words add to it.'));
  }
  assert.equal(new Set(exercises.map(item=>normalize(item.gentleHint))).size,100);
  assert.equal(new Set(exercises.map(item=>normalize(item.hint))).size,100);
});
test('Neither hint contains the complete reference translation',()=>{
  for(const [index,item] of exercises.entries())for(const key of ['gentleHint','hint']){
    assert.ok(!normalize(item[key]).includes(normalize(item.en)),'Reference leaked in '+key+' for '+(index+1));
  }
});


test('Every Hint 1 is a compact vocabulary list rather than a sentence or grammar explanation',()=>{
  for(const [index,item] of exercises.entries()){
    assert.ok(item.gentleHint.startsWith('Vocabulary: '),'Missing vocabulary label at '+(index+1));
    const entries=item.gentleHint.slice('Vocabulary: '.length).split(',').map(value=>value.trim());
    assert.ok(entries.length>=1&&entries.length<=2,'Too many vocabulary items at '+(index+1));
    for(const entry of entries){
      assert.match(entry,/^[a-z]+(?:-[a-z]+)*(?: [a-z]+(?:-[a-z]+)*){0,2}$/i);
    }
  }
});
test('Hint 2 adds structure support rather than repeating Hint 1 vocabulary items',()=>{
  for(const [index,item] of exercises.entries()){
    const entries=item.gentleHint.slice('Vocabulary: '.length).split(',').map(value=>value.trim().toLowerCase());
    for(const entry of entries)assert.ok(!item.hint.toLowerCase().includes(entry),'Repeated vocabulary-only help at '+(index+1)+': '+entry);
  }
});
