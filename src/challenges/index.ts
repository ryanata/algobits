import type { ChallengeModule } from './types';
const modules = import.meta.glob<{default: ChallengeModule}>('./*/index.tsx', {eager:true});
export const challenges = Object.values(modules).map(module => module.default).sort((a,b) => a.id.localeCompare(b.id));
if (new Set(challenges.map(c => c.id)).size !== challenges.length) throw new Error('Challenge IDs must be unique');
export function shuffledIds(ids: string[], previous?: string): string[] {
  const result = [...ids];
  for (let i=result.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  if(result.length>1 && result[0]===previous) [result[0],result[1]]=[result[1],result[0]];
  return result;
}
