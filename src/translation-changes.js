// Word-level longest-common-subsequence comparison; whitespace alone is ignored.
export function translationChanges(original, revised) {
  const before=original.trim()?original.trim().split(/\s+/):[];
  const after=revised.trim()?revised.trim().split(/\s+/):[];
  const lengths=Array.from({length:before.length+1},()=>Array(after.length+1).fill(0));
  for(let i=before.length-1;i>=0;i--)for(let j=after.length-1;j>=0;j--){
    lengths[i][j]=before[i]===after[j]?1+lengths[i+1][j+1]:Math.max(lengths[i+1][j],lengths[i][j+1]);
  }
  const result={original:[],revised:[]};
  let i=0,j=0;
  while(i<before.length||j<after.length){
    if(i<before.length&&j<after.length&&before[i]===after[j]){
      result.original.push({text:before[i++],changed:false});
      result.revised.push({text:after[j++],changed:false});
    }else if(i<before.length&&(j===after.length||lengths[i+1][j]>=lengths[i][j+1])){
      result.original.push({text:before[i++],changed:true});
    }else result.revised.push({text:after[j++],changed:true});
  }
  return result;
}
