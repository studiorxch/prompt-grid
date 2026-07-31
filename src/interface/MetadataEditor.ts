import type {PromptDocument} from "../data/promptTypes";
import type {MetadataPatch} from "../logic/promptEditor";

export class MetadataEditor {
 constructor(private readonly container:HTMLElement,private readonly commit:(patch:MetadataPatch)=>Promise<void>){}
 render(document:PromptDocument):void {this.container.empty();this.container.addClass("prompt-grid-metadata");this.text("Title",document.title,value=>({title:value}));this.text("Style",document.styles.join(", "),value=>({styles:value.split(",")}));this.text("BPM",document.bpm===null?"":String(document.bpm),value=>({bpm:value.trim()?Number(value):null}),"number");this.text("Key",document.key??"",value=>({key:value}));const label=this.container.createEl("label",{cls:"prompt-grid-field prompt-grid-toggle"});label.createSpan({text:"Instrumental"});const input=label.createEl("input",{type:"checkbox"});input.checked=document.instrumental;input.addEventListener("change",()=>void this.commit({instrumental:input.checked}));}
 private text(labelText:string,current:string,patch:(value:string)=>MetadataPatch,type="text"):void {const label=this.container.createEl("label",{cls:"prompt-grid-field"});label.createSpan({text:labelText});const input=label.createEl("input",{type});input.value=current;input.addEventListener("change",()=>void this.commit(patch(input.value)));}
}
