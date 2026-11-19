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


test('Hint 1 revision preserves every Chinese sentence, reference, and Hint 2',()=>{
  const digest=createHash('sha256').update(JSON.stringify(exercises.map(({zh,en,hint})=>({zh,en,hint})))).digest('hex');
  assert.equal(digest,'a2c4b0fa0ca75f1a95043acf4b3fa4bc05d3f7535ac840a727b3ac54285b115d');
});

test('Hint 1 contains no exact reference content-word overlap outside function words',()=>{
  // Surface-word screening supplements editorial review; it does not prove absence of semantic paraphrase.
  const functionWords=new Set('a an the i you he she it we they me him her us them my your his its our their myself yourself ourselves themselves this that these those what which who whom whose how when where why whether if as than to of in on at by for from with without into over under between through and or but so yet not no nor can could would should will shall may might must do does did done doing have has had having be am is are was were been being s t m re ve ll d'.split(' '));
  const words=text=>(text.toLowerCase().match(/[a-z]+/g)||[]);
  const flagged=exercises.flatMap((item,index)=>{
    const reference=new Set(words(item.en));
    const shared=[...new Set(words(item.gentleHint).filter(word=>reference.has(word)&&!functionWords.has(word)))];
    return shared.length?[{number:index+1,shared}]:[];
  });
  assert.deepEqual(flagged,[]);
});
