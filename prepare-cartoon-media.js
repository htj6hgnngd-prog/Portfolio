import { spawn } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root=path.dirname(fileURLToPath(import.meta.url));
const outDir=path.join(root,"assets","generated");
await mkdir(outDir,{recursive:true});
const publicUrl="https://disk.yandex.ru/i/Q6JaTkvI-IB1tw";
const api="https://cloud-api.yandex.net/v1/disk/public/resources?public_key="+encodeURIComponent(publicUrl);
const response=await fetch(api,{headers:{accept:"application/json","user-agent":"Mozilla/5.0 PortfolioBuild/1.0"}});
if(!response.ok)throw new Error("Yandex metadata "+response.status);
const meta=await response.json();
if(!meta.file)throw new Error("Cartoon direct file URL missing");

const output=path.join(outDir,"cartoon.mp4");
await new Promise((resolve,reject)=>{
  const args=[
    "-y","-hide_banner","-loglevel","error",
    "-i",meta.file,
    "-map","0:v:0","-map","0:a?",
    "-c:v","libx264","-preset","veryfast","-crf","23","-pix_fmt","yuv420p",
    "-c:a","aac","-b:a","160k",
    "-movflags","+faststart",
    output
  ];
  const child=spawn(ffmpegPath,args,{stdio:["ignore","ignore","pipe"]});
  let err="";
  child.stderr.on("data",chunk=>{err+=chunk.toString();if(err.length>12000)err=err.slice(-12000)});
  child.on("error",reject);
  child.on("exit",code=>code===0?resolve():reject(new Error("cartoon transcode: "+err.slice(-2500))));
});
const info=await stat(output);
if(info.size<100000)throw new Error("Cartoon output too small");
console.log("cartoon: browser-safe H.264 "+(info.size/1024/1024).toFixed(1)+" MB");
