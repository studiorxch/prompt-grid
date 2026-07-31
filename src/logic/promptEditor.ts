import type {PromptDocument,PromptLine} from "../data/promptTypes";
import type {IdFactory} from "../utilities/identifiers";

export type LineContainerId="preamble"|string;
export interface MetadataPatch {title?:string;styles?:string[];bpm?:number|null;key?:string|null;instrumental?:boolean}

export const clonePrompt=(document:PromptDocument):PromptDocument=>structuredClone(document);

function sectionIndex(document:PromptDocument,id:string):number {const index=document.sections.findIndex(section=>section.id===id);if(index<0)throw new Error(`Unknown section: ${id}`);return index;}
function lines(document:PromptDocument,id:LineContainerId):PromptLine[]{return id==="preamble"?document.preamble:document.sections[sectionIndex(document,id)]!.lines;}
function required(value:string,label:string):string {const result=value.trim();if(!result)throw new Error(`${label} cannot be empty`);return result;}

export function editMetadata(document:PromptDocument,patch:MetadataPatch):void {if(patch.title!==undefined)document.title=required(patch.title,"Title");if(patch.styles!==undefined)document.styles=patch.styles.map(x=>x.trim()).filter(Boolean);if(patch.bpm!==undefined){if(patch.bpm!==null&&(!Number.isFinite(patch.bpm)||patch.bpm<=0))throw new Error("BPM must be positive");document.bpm=patch.bpm;}if(patch.key!==undefined)document.key=patch.key?.trim()||null;if(patch.instrumental!==undefined)document.instrumental=patch.instrumental;}
export function addSection(document:PromptDocument,label:string,ids:IdFactory):string {const id=ids.section();document.sections.push({id,label:required(label,"Section label"),lines:[]});return id;}
export function renameSection(document:PromptDocument,id:string,label:string):void {document.sections[sectionIndex(document,id)]!.label=required(label,"Section label");}
export function deleteSection(document:PromptDocument,id:string):void {document.sections.splice(sectionIndex(document,id),1);}
export function reorderSection(document:PromptDocument,id:string,toIndex:number):void {const from=sectionIndex(document,id);if(toIndex<0||toIndex>=document.sections.length)throw new Error("Invalid section destination");const [section]=document.sections.splice(from,1);document.sections.splice(toIndex,0,section!);}
export function addLine(document:PromptDocument,containerId:LineContainerId,text:string,ids:IdFactory):string {const id=ids.line();lines(document,containerId).push({id,text:required(text,"Prompt line"),enabled:true});return id;}
export function editLine(document:PromptDocument,containerId:LineContainerId,id:string,text:string):void {const line=lines(document,containerId).find(x=>x.id===id);if(!line)throw new Error(`Unknown line: ${id}`);line.text=required(text,"Prompt line");}
export function deleteLine(document:PromptDocument,containerId:LineContainerId,id:string):void {const list=lines(document,containerId),index=list.findIndex(x=>x.id===id);if(index<0)throw new Error(`Unknown line: ${id}`);list.splice(index,1);}
export function setLineEnabled(document:PromptDocument,containerId:LineContainerId,id:string,enabled:boolean):void {const line=lines(document,containerId).find(x=>x.id===id);if(!line)throw new Error(`Unknown line: ${id}`);line.enabled=enabled;}
export function moveLine(document:PromptDocument,fromContainer:LineContainerId,id:string,toContainer:LineContainerId,toIndex:number):void {const source=lines(document,fromContainer),target=lines(document,toContainer),from=source.findIndex(x=>x.id===id);if(from<0)throw new Error(`Unknown line: ${id}`);if(toIndex<0||toIndex>target.length-(source===target?1:0))throw new Error("Invalid line destination");const [line]=source.splice(from,1);target.splice(toIndex,0,line!);}
