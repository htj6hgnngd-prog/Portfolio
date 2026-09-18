import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, rename, stat, unlink } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root=path.dirname(fileURLToPath(import.meta.url));
const outDir=path.join(root,"assets","generated");
await mkdir(outDir,{recursive:true});

const items=[
  {name:"promo-1",publicUrl:"https://disk.yandex.ru/i/iIj6z28I2z0d3w",coverTime:"00:00:14.000"},
  {name:"promo-2",publicUrl:"https://disk.yandex.ru/i/CGJbZxDuh1ORXw",coverTime:"00:00:06.000"}
];

function run(args,label){
  return new Promise((resolve,reject)=>{
    const child=spawn(ffmpegPath,args,{stdio:["ignore","ignore","pipe"]});
    let err="";
    child.stderr.on("data",chunk=>{err+=chunk.toString();if(err.length>12000)err=err.slice(-12000)});
    child.on("error",reject);
    child.on("exit",code=>code===0?resolve(err):reject(new Error(label+": "+err.slice(-2500))));
  });
}

async function codec(file){
  const text=await run(["-hide_banner","-i",file],"probe").catch(error=>error.message);
  return text.match(/Video:\s*([^,\s]+)/i)?.[1]?.toLowerCase()||"unknown";
}

async function meta(publicUrl){
  const api="https://cloud-api.yandex.net/v1/disk/public/resources?public_key="+encodeURIComponent(publicUrl);
  const r=await fetch(api,{headers:{accept:"application/json","user-agent":"Mozilla/5.0 PortfolioBuild/1.0"}});
  if(!r.ok)throw new Error("Yandex metadata "+r.status);
  const x=await r.json();
  if(!x.file)throw new Error("Yandex direct file URL missing");
  return x;
}

async function download(url,file){
  const r=await fetch(url,{redirect:"follow",headers:{"user-agent":"Mozilla/5.0 PortfolioBuild/1.0"}});
  if(!r.ok||!r.body)throw new Error("download "+r.status);
  await pipeline(Readable.fromWeb(r.body),createWriteStream(file));
}

for(const item of items){
  const source="/tmp/"+item.name+"-source";
  const output=path.join(outDir,item.name+".mp4");
  const cover=path.join(outDir,item.name+"-cover.jpg");
  const x=await meta(item.publicUrl);
  console.log(item.name+": source "+Math.round(Number(x.size||0)/1024/1024)+" MB");
  await download(x.file,source);

  await run(["-y","-hide_banner","-loglevel","error","-i",source,"-map","0:v:0","-map","0:a?","-c","copy","-movflags","+faststart",output],item.name+" remux");
  let c=await codec(output);

  if(c!=="h264"&&c!=="avc1"){
    const converted=output+".h264.mp4";
    await run(["-y","-hide_banner","-loglevel","error","-i",source,"-map","0:v:0","-map","0:a?","-c:v","libx264","-preset","veryfast","-crf","22","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart",converted],item.name+" h264");
    await rename(converted,output);
    c=await codec(output);
  }

  if(c!=="h264"&&c!=="avc1")throw new Error(item.name+": incompatible codec "+c);

  await run(["-y","-hide_banner","-loglevel","error","-ss",item.coverTime,"-i",source,"-frames:v","1","-vf","scale=1600:-2","-q:v","2",cover],item.name+" cover "+item.coverTime);

  const [vi,ci]=await Promise.all([stat(output),stat(cover)]);
  if(vi.size<100000||ci.size<5000)throw new Error(item.name+": invalid output");
  console.log(item.name+": H.264 "+(vi.size/1024/1024).toFixed(1)+" MB, cover "+item.coverTime+" "+Math.round(ci.size/1024)+" KB");
  await unlink(source).catch(()=>{});
}
