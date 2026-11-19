import test from 'node:test';
import assert from 'node:assert/strict';
import {translationChanges} from '../src/translation-changes.js';

test('Show Changes identifies removed and added words while preserving both versions',()=>{
  const change=translationChanges('Although it is hard, but I learn a lot.','Although it is hard, I have learned a lot.');
  assert.deepEqual(change.original.filter(word=>word.changed).map(word=>word.text),['but','learn']);
  assert.deepEqual(change.revised.filter(word=>word.changed).map(word=>word.text),['have','learned']);
  assert.equal(change.original.map(word=>word.text).join(' '),'Although it is hard, but I learn a lot.');
  assert.equal(change.revised.map(word=>word.text).join(' '),'Although it is hard, I have learned a lot.');
});
test('Text comparison handles identical text, empty input, repeats, and complete replacements',()=>{
  assert.ok(translationChanges('A short sentence.','A short sentence.').original.every(word=>!word.changed));
  assert.ok(translationChanges('','New words').revised.every(word=>word.changed));
  assert.ok(translationChanges('Old words','').original.every(word=>word.changed));
  const repeated=translationChanges('I had had time.','I had time.');
  assert.equal(repeated.original.filter(word=>word.changed).length,1);
  assert.ok(translationChanges('Old.','New.').revised[0].changed);
});
