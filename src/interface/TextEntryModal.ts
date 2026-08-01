import {App,Modal} from "obsidian";

export interface TextEntryOptions {title:string;initialValue?:string;placeholder?:string;allowEmpty?:boolean}

class TextEntryModal extends Modal {
 private settled=false;
 constructor(app:App,private readonly options:TextEntryOptions,private readonly resolve:(value:string|null)=>void){super(app);}
 onOpen():void {const {contentEl}=this;contentEl.empty();contentEl.addClass("prompt-grid-dialog");contentEl.createEl("h3",{text:this.options.title});const input=contentEl.createEl("input",{type:"text",placeholder:this.options.placeholder??""}),error=contentEl.createDiv({cls:"prompt-grid-dialog-error"}),actions=contentEl.createDiv({cls:"prompt-grid-dialog-actions"});input.value=this.options.initialValue??"";const cancel=actions.createEl("button",{text:"Cancel"}),confirm=actions.createEl("button",{text:"Confirm",cls:"mod-cta"});const submit=()=>{const value=input.value.trim();if(!value&&!this.options.allowEmpty){error.setText("A value is required.");input.focus();return;}this.finish(value);};cancel.addEventListener("click",()=>this.finish(null));confirm.addEventListener("click",submit);input.addEventListener("input",()=>error.empty());input.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();submit();}});window.setTimeout(()=>{input.focus();input.select();});}
 onClose():void {this.contentEl.empty();if(!this.settled){this.settled=true;this.resolve(null);}}
 private finish(value:string|null):void {if(this.settled)return;this.settled=true;this.resolve(value);this.close();}
}

class ConfirmActionModal extends Modal {
 private settled=false;
 constructor(app:App,private readonly title:string,private readonly detail:string,private readonly resolve:(confirmed:boolean)=>void){super(app);}
 onOpen():void {const {contentEl}=this;contentEl.empty();contentEl.addClass("prompt-grid-dialog");contentEl.createEl("h3",{text:this.title});contentEl.createEl("p",{text:this.detail});const actions=contentEl.createDiv({cls:"prompt-grid-dialog-actions"}),cancel=actions.createEl("button",{text:"Cancel"}),confirm=actions.createEl("button",{text:"Delete",cls:"mod-warning"});cancel.addEventListener("click",()=>this.finish(false));confirm.addEventListener("click",()=>this.finish(true));window.setTimeout(()=>cancel.focus());}
 onClose():void {this.contentEl.empty();if(!this.settled){this.settled=true;this.resolve(false);}}
 private finish(value:boolean):void {if(this.settled)return;this.settled=true;this.resolve(value);this.close();}
}

export async function requestText(app:App,options:TextEntryOptions):Promise<string|null>{const previous=document.activeElement as HTMLElement|null;const value=await new Promise<string|null>(resolve=>new TextEntryModal(app,options,resolve).open());previous?.focus();return value;}
export async function confirmAction(app:App,title:string,detail:string):Promise<boolean>{const previous=document.activeElement as HTMLElement|null;const value=await new Promise<boolean>(resolve=>new ConfirmActionModal(app,title,detail,resolve).open());previous?.focus();return value;}
