export interface IdFactory { prompt():string; section():string; line():string; }
const pad=(n:number)=>String(n).padStart(6,"0");
export function createSequentialIdFactory(start=1):IdFactory { let p=start,s=1,l=1; return {prompt:()=>`pg_${pad(p++)}`,section:()=>`pg_section_${pad(s++)}`,line:()=>`pg_line_${pad(l++)}`}; }
export function createUniqueIdFactory():IdFactory { const seed=Date.now().toString(36); let n=0; const make=(part:string)=>`pg${part}_${seed}_${(++n).toString(36)}`; return {prompt:()=>make(""),section:()=>make("_section"),line:()=>make("_line")}; }
