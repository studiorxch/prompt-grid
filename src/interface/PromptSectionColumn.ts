import type {PromptLine,PromptSection} from "../data/promptTypes";
import type {LineContainerId} from "../logic/promptEditor";
import {PromptLineCard,type LineCardActions} from "./PromptLineCard";

export interface SectionActions {rename:(id:string,label:string)=>Promise<void>;remove:(id:string)=>Promise<void>;addLine:(container:LineContainerId)=>Promise<void>;move:(id:string,direction:-1|1)=>Promise<void>;sectionDragStart:(id:string)=>void;sectionDrop:(index:number)=>Promise<void>;line:LineCardActions}

export class PromptSectionColumn {
 private readonly cards:PromptLineCard;
 constructor(private readonly actions:SectionActions){this.cards=new PromptLineCard(actions.line);}
 render(parent:HTMLElement,section:PromptSection|null,lines:PromptLine[],index:number):void {
  const id=section?.id??"preamble",column=parent.createDiv({cls:"prompt-grid-column"});column.dataset.containerId=id;
  column.addEventListener("dragover",event=>event.preventDefault());column.addEventListener("drop",event=>{event.preventDefault();void (async()=>{if(section)await this.actions.sectionDrop(index);await this.actions.line.drop(id,lines.length);})();});
  const header=column.createDiv({cls:"prompt-grid-column-header"});
  if(section){const handle=header.createSpan({text:"⠿",cls:"prompt-grid-drag-handle",attr:{draggable:"true","aria-label":"Drag section"}});handle.addEventListener("dragstart",event=>{event.dataTransfer?.setData("text/plain",section.id);this.actions.sectionDragStart(section.id);});header.addEventListener("dragover",event=>event.preventDefault());header.addEventListener("drop",event=>{event.preventDefault();event.stopPropagation();void this.actions.sectionDrop(index);});}
  else header.createSpan({text:"⠿",cls:"prompt-grid-drag-handle is-static",attr:{"aria-hidden":"true"}});
  header.createEl("strong",{text:section?.label??"Preamble",cls:"prompt-grid-column-title"});header.createSpan({text:String(lines.length),cls:"prompt-grid-card-count",attr:{"aria-label":`${lines.length} cards`}});
  if(section)this.menu(header,section);
  const list=column.createDiv({cls:"prompt-grid-card-list"});lines.forEach((line,lineIndex)=>this.cards.render(list,line,id,lineIndex));
  const add=column.createEl("button",{text:"+ Add a card",cls:"prompt-grid-add-card"});add.addEventListener("click",()=>void this.actions.addLine(id));
 }
 private menu(parent:HTMLElement,section:PromptSection):void {const details=parent.createEl("details",{cls:"prompt-grid-menu"});details.createEl("summary",{text:"…",attr:{"aria-label":`Actions for ${section.label}`}});const menu=details.createDiv({cls:"prompt-grid-menu-popover",attr:{role:"menu"}});this.item(menu,"Rename",async()=>{const label=window.prompt("Section name",section.label);if(label!==null)await this.actions.rename(section.id,label);},details);this.item(menu,"Move left",()=>this.actions.move(section.id,-1),details);this.item(menu,"Move right",()=>this.actions.move(section.id,1),details);this.item(menu,"Delete",()=>this.actions.remove(section.id),details,true);}
 private item(parent:HTMLElement,label:string,action:()=>Promise<void>,details:HTMLDetailsElement,danger=false):void {const button=parent.createEl("button",{text:label,cls:danger?"is-danger":"",attr:{role:"menuitem"}});button.addEventListener("click",()=>{details.open=false;void action();});}
}
