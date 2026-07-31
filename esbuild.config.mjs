import esbuild from "esbuild";
import builtins from "builtin-modules";
const ctx=await esbuild.context({entryPoints:["src/main.ts"],bundle:true,external:["obsidian","electron",...builtins],format:"cjs",target:"es2022",outfile:"main.js"});
await ctx.rebuild(); await ctx.dispose();
