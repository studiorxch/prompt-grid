export const normalizeLineEndings=(value:string)=>value.replace(/\r\n?/g,"\n");
export const meaningfulSourceLines=(value:string)=>normalizeLineEndings(value).split("\n").map(x=>x.trim()).filter(x=>x&&x!=="///");
