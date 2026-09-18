import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, stat, unlink } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root=path.dirname(fileURLToPath(import.meta.url));
const outDir=path.join(root,"assets","generated");
await mkdir(outDir,{recursive:true});

const publicUrl="https://disk.yandex.ru/i/Q6JaTkvI-IB1tw";
const api="https://cloud-api.yandex.net/v1/disk/public/resources?public_key="+encodeURIComponent(publicUrl);
const metaResponse=await fetch(api,{headers:{accept:"application/json","user-agent":"Mozilla/5.0 PortfolioBuild/1.0"}});
if(!metaResponse.ok)throw new Error("Yandex metadata "+metaResponse.status);
const meta=await metaResponse.json();
if(!meta.file)throw new Error("Cartoon direct file URL missing");

const source="/tmp/portfolio-cartoon-source";
const output=path.join(outDir,"cartoon.mp4");

const download=await fetch(meta.file,{redirect:"follow",headers:{"user-agent":"Mozilla/5.0 PortfolioBuild/1.0"}});
if(!download.ok||!download.body)throw new Error("Cartoon download "+download.status);
await pipeline(Readable.fromWeb(download.body),createWriteStream(source));
const srcInfo=await stat(source);
console.log("cartoon source: "+(srcInfo.size/1024/1024).toFixed(1)+" MB");

await new Promise((resolve,reject)=>{
  const args=[
    "-y","-hide_banner","-loglevel","error",
    "-i",source,
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

const outInfo=await stat(output);
if(outInfo.size<100000)throw new Error("Cartoon output too small");
console.log("cartoon: browser-safe H.264 "+(outInfo.size/1024/1024).toFixed(1)+" MB");
await unlink(source).catch(()=>{});
