export type FrontmatterValue=string|number|boolean|null|string[];
export interface PromptDocument { readonly id:string; title:string; styles:string[]; bpm:number|null; key:string|null; instrumental:boolean; extraFrontmatter:Record<string,FrontmatterValue>; preamble:PromptLine[]; sections:PromptSection[]; sourcePath:string|null; sourceText:string|null; createdAt:string; updatedAt:string; }
export interface PromptSection { readonly id:string; label:string; lines:PromptLine[]; }
export interface PromptLine { readonly id:string; text:string; enabled:boolean; }
export interface ValidationIssue { readonly code:string; readonly severity:"warning"|"error"; readonly message:string; readonly sectionId?:string; readonly lineId?:string; }
export interface SunoExportResult { output:string; characterCount:number; warnings:ValidationIssue[]; }
export interface PromptGridSettings { inboxFolder:string; exportFolder:string; defaultTitlePrefix:string; characterWarningThreshold:number; preserveSourceText:boolean; prependInstrumental:boolean; }
