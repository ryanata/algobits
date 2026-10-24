import { describe, expect, it, vi } from 'vitest';
import { twoSum, threeSum, findDuplicate } from './algorithms';
import { challenges, shuffledIds } from './index';
function* arrays(length:number,values:number[]):Generator<number[]> {
 if(length===0){yield [];return;}
 for(const prefix of arrays(length-1,values)) for(const value of values) yield [...prefix,value];
}
describe('Two Sum',()=>{
 it('requires distinct indices and handles index zero, repeats and negative values',()=>{
  expect(twoSum([3,2,4],6)).toEqual([1,2]);
  expect(twoSum([3],6)).toBeNull();
  expect(twoSum([3,3],6)).toEqual([0,1]);
  expect(twoSum([-3,0,3],0)).toEqual([0,2]);
 });
 it('agrees with a brute-force oracle on small arrays',()=>{
  for(let length=0;length<=4;length++)for(const a of arrays(length,[-2,-1,0,1,2]))for(let target=-4;target<=4;target++){
   let exists=false;
   for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i]+a[j]===target)exists=true;
   const pair=twoSum(a,target);
   expect(pair!==null).toBe(exists);
   if(pair){expect(pair[0]).not.toBe(pair[1]);expect(a[pair[0]]+a[pair[1]]).toBe(target);}
  }
 });
});
describe('3Sum',()=>{
 it('returns the fixture exactly once without mutating the input',()=>{
  const a=[-2,0,0,2,2],snapshot=[...a];
  expect(threeSum(a)).toEqual([[-2,0,2]]);expect(a).toEqual(snapshot);
  expect(threeSum([0,0,0,0])).toEqual([[0,0,0]]);
  expect(threeSum([-1,0,1,2,-1,-4])).toEqual([[-1,-1,2],[-1,0,1]]);
 });
 it('agrees with distinct triples from a brute-force oracle',()=>{
  for(let length=0;length<=5;length++)for(const a of arrays(length,[-2,-1,0,1,2])){
   const oracle=new Set<string>();
   for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)for(let k=j+1;k<a.length;k++)if(a[i]+a[j]+a[k]===0)oracle.add([a[i],a[j],a[k]].sort((x,y)=>x-y).join(','));
   const result=threeSum(a).map(t=>t.join(','));
   expect(result.length).toBe(new Set(result).size);
   expect(result.sort()).toEqual([...oracle].sort());
  }
 });
});
describe('Find Duplicate',()=>{
 it('finds cycle entrances including a self-loop and more than two repeats',()=>{
  expect(findDuplicate([1,3,4,2,2])).toBe(2);
  expect(findDuplicate([1,1])).toBe(1);
  expect(findDuplicate([3,3,3,3,3])).toBe(3);
 });
 it('agrees with counts for all valid small arrays, leaving input intact',()=>{
  for(let n=1;n<=4;n++)for(const a of arrays(n+1,Array.from({length:n},(_,i)=>i+1))){
   const duplicates=[...new Set(a)].filter(v=>a.filter(x=>x===v).length>1);
   if(duplicates.length!==1)continue;
   const snapshot=[...a];expect(findDuplicate(a)).toBe(duplicates[0]);expect(a).toEqual(snapshot);
  }
 });
});
describe('challenge registry and review',()=>{
 it('automatically discovers complete modules, including the first edition',()=>{
  expect(challenges.length).toBeGreaterThanOrEqual(3);
  expect(challenges.map(c=>c.problem.number)).toEqual(expect.arrayContaining([1,15,287]));
  expect(new Set(challenges.map(c=>c.id)).size).toBe(challenges.length);
  for(const c of challenges){expect(c.Component).toBeTypeOf('function');expect(c.explanation.length).toBeGreaterThan(0);expect(c.tags.length).toBeGreaterThan(0);expect(c.problem.url).toMatch(/^https:\/\/leetcode.com\/problems\//);}
 });
 it('shuffles complete decks without repeats and avoids an immediate repeated challenge',()=>{
  const ids=challenges.map(c=>c.id);
  for(const random of [0,.2,.6,.999]){
   vi.spyOn(Math,'random').mockReturnValue(random);
   const deck=shuffledIds(ids,ids[0]);
   expect([...deck].sort()).toEqual([...ids].sort());expect(deck[0]).not.toBe(ids[0]);expect(ids).toEqual(challenges.map(c=>c.id));
   vi.restoreAllMocks();
  }
  expect(shuffledIds([])).toEqual([]);expect(shuffledIds(['only'],'only')).toEqual(['only']);
 });
});
