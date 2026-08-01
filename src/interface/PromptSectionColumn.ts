import type {PromptLine,PromptSection} from "../data/promptTypes";
import type {LineContainerId} from "../logic/promptEditor";
import {PromptLineCard,type LineCardActions} from "./PromptLineCard";
import type {FloatingMenuController} from "./FloatingMenu";
import type {App} from "obsidian";
import {requestText} from "./TextEntryModal";
import {collapseAriaExpanded} from "./composerPresentation";

export interface SectionActions {rename:(id:string,label:string)=>Promise<void>;remove:(id:string)=>Promise<void>;addLine:(container:LineContainerId)=>Promise<void>;move:(id:string,direction:-1|1)=>Promise<void>;toggleCollapse:(id:LineContainerId)=>void;sectionDragStart:(id:string)=>void;sectionDrop:(index:number)=>Promise<void>;line:LineCardActions}

export class PromptSectionColumn {
 private readonly cards:PromptLineCard;
 constructor(private readonly actions:SectionActions,private readonly menus:FloatingMenuController,private readonly app:App){this.cards=new PromptLineCard(actions.line,menus);}
 render(parent:HTMLElement,section:PromptSection|null,lines:PromptLine[],index:number,collapsed=false):void {
  const id=section?.id??"preamble",column=parent.createDiv({cls:`prompt-grid-column${collapsed?" is-collapsed":""}`});column.dataset.containerId=id;
  column.addEventListener("dragover",event=>{event.preventDefault();const target=event.target as HTMLElement;if(!collapsed&&!target.closest(".prompt-grid-card,.prompt-grid-column-header"))column.addClass("drop-at-end");});column.addEventListener("dragleave",event=>{if(!column.contains(event.relatedTarget as Node|null))column.removeClass("drop-at-end");});column.addEventListener("drop",event=>{event.preventDefault();column.removeClass("drop-at-end");void (async()=>{if(section)await this.actions.sectionDrop(index);if(!collapsed)await this.actions.line.drop(id,lines.length);})();});
  const header=column.createDiv({cls:`prompt-grid-column-header${section?" is-draggable":""}`});
  if(section){const clearDragBlock=()=>delete header.dataset.dragBlocked;header.draggable=true;header.addEventListener("pointerdown",event=>{header.dataset.dragBlocked=String(Boolean((event.target as HTMLElement|null)?.closest("button, input, textarea, .prompt-grid-floating-menu")));});header.addEventListener("pointerup",clearDragBlock);header.addEventListener("pointercancel",clearDragBlock);header.addEventListener("dragstart",event=>{if(header.dataset.dragBlocked==="true"){event.preventDefault();return;}event.dataTransfer?.setData("text/plain",section.id);this.actions.sectionDragStart(section.id);});header.addEventListener("dragover",event=>event.preventDefault());header.addEventListener("drop",event=>{event.preventDefault();event.stopPropagation();void this.actions.sectionDrop(index);});}
  const collapse=header.createEl("button",{text:collapsed?"›":"⌄",cls:"prompt-grid-collapse",attr:{"aria-label":`${collapsed?"Expand":"Collapse"} ${section?.label??"Preamble"}`,"aria-expanded":collapseAriaExpanded(collapsed)}});collapse.addEventListener("click",()=>this.actions.toggleCollapse(id));
  header.createEl("strong",{text:section?.label??"Preamble",cls:"prompt-grid-column-title"});if(section)this.menu(header,section);
  if(collapsed)return;
  const list=column.createDiv({cls:"prompt-grid-card-list"});lines.forEach((line,lineIndex)=>this.cards.render(list,line,id,lineIndex));
  const footer=column.createDiv({cls:"prompt-grid-column-footer"}),add=footer.createEl("button",{text:"+",cls:"prompt-grid-add-card",attr:{"aria-label":`Add a card to ${section?.label??"Preamble"}`}});add.addEventListener("click",()=>void this.actions.addLine(id));
 }
 private menu(parent:HTMLElement,section:PromptSection):void {const trigger=parent.createEl("button",{text:"…",cls:"prompt-grid-menu-trigger",attr:{"aria-label":`Actions for ${section.label}`,"aria-expanded":"false"}});trigger.addEventListener("click",()=>this.menus.open(trigger,`section:${section.id}`,[{label:"Rename",action:async()=>{const label=await requestText(this.app,{title:"Rename section",initialValue:section.label});if(label!==null)await this.actions.rename(section.id,label);}},{label:"Move left",action:()=>this.actions.move(section.id,-1)},{label:"Move right",action:()=>this.actions.move(section.id,1)},{label:"Delete",danger:true,action:()=>this.actions.remove(section.id)}]));}
}
