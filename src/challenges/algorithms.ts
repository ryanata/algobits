export function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number,number>();
  for(let i=0;i<nums.length;i++) {
    const other = seen.get(target-nums[i]);
    if(other!==undefined) return [other,i];
    seen.set(nums[i],i);
  }
  return null;
}
export function threeSum(nums: number[]): number[][] {
  const a=[...nums].sort((x,y)=>x-y), result:number[][]=[];
  for(let i=0;i<a.length-2;i++) {
    if(i>0 && a[i]===a[i-1]) continue;
    let l=i+1,r=a.length-1;
    while(l<r) {
      const sum=a[i]+a[l]+a[r];
      if(sum<0) l++; else if(sum>0) r--; else {
        result.push([a[i],a[l],a[r]]);
        const left=a[l],right=a[r];
        while(l<r && a[l]===left) l++;
        while(l<r && a[r]===right) r--;
      }
    }
  }
  return result;
}
// Contract: n+1 integers in [1,n], with exactly one distinct repeated value.
export function findDuplicate(nums: number[]): number {
  let slow=0,fast=0;
  do { slow=nums[slow]; fast=nums[nums[fast]]; } while(slow!==fast);
  slow=0;
  while(slow!==fast) { slow=nums[slow]; fast=nums[fast]; }
  return slow;
}
