import {validPracticeAttempt, validatedPracticeScores} from './practice-data.js';

const skills = ['meaning', 'grammar', 'naturalness'];
const mean = values => values.length ? values.reduce((sum,value)=>sum+value,0)/values.length : null;

function practiceDate(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  // Legacy calendar-only dates already identify the learner's day; parsing them
  // as UTC would move them to the previous day in some browser time zones.
  const calendar = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = calendar ? new Date(Number(calendar[1]),Number(calendar[2])-1,Number(calendar[3])) : new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  if (calendar && (date.getFullYear()!==Number(calendar[1]) || date.getMonth()!==Number(calendar[2])-1 || date.getDate()!==Number(calendar[3]))) return null;
  return date;
}

export function practiceProgress(activity, category = 'overall') {
  const validRecords = activity.filter(validPracticeAttempt);
  const attempts = validRecords.filter(record=>!record.revision).flatMap(record=>{
    const date = practiceDate(record.date);
    return date ? [{...record, scores:validatedPracticeScores(record.scores), completedDate:date}] : [];
  });
  const buckets = new Map();
  for (const attempt of attempts) {
    const date = attempt.completedDate;
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    if (!buckets.has(key)) buckets.set(key,{key,date,values:[]});
    buckets.get(key).values.push(attempt.scores[skills.includes(category)?category:'overall']);
  }
  const days = [...buckets.values()].sort((a,b)=>a.key.localeCompare(b.key));
  const multipleYears = new Set(days.map(day=>day.date.getFullYear())).size>1;
  return {
    attempts,
    practiceAttempts:attempts.length,
    revisionsCompleted:validRecords.filter(record=>record.revision).length,
    average:mean(attempts.map(attempt=>attempt.scores.overall)),
    breakdown:Object.fromEntries(skills.map(key=>[key,mean(attempts.map(attempt=>attempt.scores[key]))])),
    days:days.map(day=>({key:day.key,
      label:day.date.toLocaleDateString('en-US',{month:'short',day:'numeric',...(multipleYears?{year:'numeric'}:{})}),
      value:mean(day.values),count:day.values.length,
    })),
  };
}
