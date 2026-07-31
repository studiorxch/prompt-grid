import type {PromptDocument,PromptLine} from "../data/promptTypes";
const scalar=(v:string)=>/[:#\[\]{},&*!|>'"%@`]|^\s|\s$/.test(v)?JSON.stringify(v):v;
const line=(x:PromptLine)=>`- [${x.id}] ${x.enabled?"":"<!-- disabled --> "}${x.text}`;
export function serializeCanonicalMarkdown(d:PromptDocument):string { const out=["---","prompt-grid: true",`prompt-id: ${d.id}`,`title: ${scalar(d.title)}`,`bpm: ${d.bpm??"null"}`,`key: ${d.key===null?"null":scalar(d.key)}`,"styles:"]; for(const s of d.styles)out.push(`  - ${scalar(s)}`);out.push("status: inbox","---","",`# ${d.title}`,"","## Preamble","");for(const x of d.preamble)out.push(line(x)); for(const s of d.sections){out.push("",`## ${s.label} {#${s.id}}`,"");for(const x of s.lines)out.push(line(x));} return out.join("\n")+"\n"; }
