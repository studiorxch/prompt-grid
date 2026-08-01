import type {PromptDocument,PromptLine} from "../data/promptTypes";
import type {LineContainerId} from "../logic/promptEditor";

export const shouldRenderPreamble=(lineCount:number):boolean=>lineCount>0;
export const restoreCollapsedColumns=(value:unknown):Set<string>=>new Set(Array.isArray(value)?value.filter((item):item is string=>typeof item==="string"):[]);
export const storeCollapsedColumns=(value:Set<string>):string[]=>[...value].sort();
export const documentChanged=(before:PromptDocument,after:PromptDocument):boolean=>JSON.stringify(before)!==JSON.stringify(after);
export const instrumentalMenuChecked=(document:PromptDocument):boolean=>document.instrumental;
export const resolveCardEdit=(original:string,draft:string,commit:boolean):string|null=>{if(!commit)return null;const text=draft.trim();return text&&text!==original?text:null;};
export const resolveTitleEdit=(original:string,draft:string,commit:boolean):string|null=>{if(!commit)return null;const title=draft.trim();if(!title)throw new Error("Title cannot be empty");return title===original?null:title;};
export const resolveStyleEdit=(original:string[],draft:string,commit:boolean):string[]|null=>{if(!commit)return null;const styles=draft.split(",").map(value=>value.trim()).filter(Boolean);return JSON.stringify(styles)===JSON.stringify(original)?null:styles;};

function containerLines(document:PromptDocument,id:LineContainerId):PromptLine[]|null {if(id==="preamble")return document.preamble;return document.sections.find(section=>section.id===id)?.lines??null;}
export function planLineDrop(document:PromptDocument,sourceId:LineContainerId,lineId:string,targetId:LineContainerId,insertionIndex:number):number|null {const source=containerLines(document,sourceId),target=containerLines(document,targetId);if(!source||!target)return null;const sourceIndex=source.findIndex(line=>line.id===lineId);if(sourceIndex<0||insertionIndex<0||insertionIndex>target.length)return null;const targetIndex=source===target&&insertionIndex>sourceIndex?insertionIndex-1:insertionIndex;if(source===target&&targetIndex===sourceIndex)return null;if(targetIndex<0||targetIndex>target.length-(source===target?1:0))return null;return targetIndex;}

export const collapseAriaExpanded=(collapsed:boolean):string=>String(!collapsed);
