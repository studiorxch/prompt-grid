import type {PromptLine} from "../data/promptTypes";
import type {LineContainerId} from "../logic/promptEditor";

export interface LineCardActions {edit:(container:LineContainerId,id:string,text:string)=>Promise<void>;remove:(container:LineContainerId,id:string)=>Promise<void>;toggle:(container:LineContainerId,id:string,enabled:boolean)=>Promise<void>;move:(container:LineContainerId,id:string,direction:-1|1)=>Promise<void>;dragStart:(container:LineContainerId,id:string)=>void;drop:(container:LineContainerId,index:number)=>Promise<void>}

export class PromptLineCard {
 constructor(private readonly actions:LineCardActions){}
 render(parent:HTMLElement,line:PromptLine,containerId:LineContainerId,index:number):void {
  const card=parent.createDiv({cls:`prompt-grid-card${line.enabled?"":" is-disabled"}`});card.dataset.lineId=line.id;
  card.addEventListener("dragover",event=>event.preventDefault());card.addEventListener("drop",event=>{event.preventDefault();event.stopPropagation();void this.actions.drop(containerId,index);});
  const row=card.createDiv({cls:"prompt-grid-card-row"}),handle=row.createSpan({text:"⠿",cls:"prompt-grid-drag-handle",attr:{draggable:"true","aria-label":"Drag card","data-tooltip-position":"top"}});
  handle.addEventListener("dragstart",event=>{event.dataTransfer?.setData("text/plain",line.id);this.actions.dragStart(containerId,line.id);});
  const text=row.createDiv({text:line.text,cls:"prompt-grid-card-text",attr:{tabindex:"0",role:"button","aria-label":"Edit prompt card"}});
  text.addEventListener("dblclick",()=>this.edit(card,text,line,containerId));text.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();this.edit(card,text,line,containerId);}});
  this.menu(row,line,containerId);
 }
 private edit(card:HTMLElement,text:HTMLElement,line:PromptLine,containerId:LineContainerId):void {if(card.hasClass("is-editing"))return;card.addClass("is-editing");text.hide();const editor=card.createEl("textarea",{cls:"prompt-grid-card-editor",attr:{"aria-label":"Edit prompt card"}});editor.value=line.text;const resize=()=>{editor.style.height="auto";editor.style.height=`${editor.scrollHeight}px`;};resize();editor.focus();editor.setSelectionRange(editor.value.length,editor.value.length);let finished=false;const finish=(commit:boolean)=>{if(finished)return;finished=true;if(commit&&editor.value.trim()!==line.text)void this.actions.edit(containerId,line.id,editor.value);else{editor.remove();text.show();card.removeClass("is-editing");}};editor.addEventListener("input",resize);editor.addEventListener("blur",()=>finish(true));editor.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();finish(false);}else if(event.key==="Enter"&&(event.metaKey||event.ctrlKey)){event.preventDefault();finish(true);}});}
 private menu(parent:HTMLElement,line:PromptLine,containerId:LineContainerId):void {const details=parent.createEl("details",{cls:"prompt-grid-menu"}),summary=details.createEl("summary",{text:"…",attr:{"aria-label":"Card actions"}}),menu=details.createDiv({cls:"prompt-grid-menu-popover",attr:{role:"menu"}});summary.addEventListener("click",event=>event.stopPropagation());this.item(menu,"Move up",()=>this.actions.move(containerId,line.id,-1),details);this.item(menu,"Move down",()=>this.actions.move(containerId,line.id,1),details);this.item(menu,line.enabled?"Disable":"Enable",()=>this.actions.toggle(containerId,line.id,!line.enabled),details);this.item(menu,"Delete",()=>this.actions.remove(containerId,line.id),details,true);}
 private item(parent:HTMLElement,label:string,action:()=>Promise<void>,details:HTMLDetailsElement,danger=false):void {const button=parent.createEl("button",{text:label,cls:danger?"is-danger":"",attr:{role:"menuitem"}});button.addEventListener("click",()=>{details.open=false;void action();});}
}
