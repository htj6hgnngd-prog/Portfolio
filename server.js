import http from "node:http";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync, constants as zlibConstants } from "node:zlib";

const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||3000);
const AI_ID="5-9tzVe57JY";
const ADOBE_EMBED="https://www-ccv.adobe.io/v1/player/ccv/"+AI_ID+"/embed?api_key=behance1&bgcolor=%23191919";
const CARTOON_PUBLIC_URL="https://disk.yandex.ru/i/Q6JaTkvI-IB1tw";

const types={
  ".html":"text/html; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".js":"text/javascript; charset=utf-8",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".png":"image/png",
  ".webp":"image/webp",
  ".svg":"image/svg+xml",
  ".mp4":"video/mp4"
};

let aiCache=null;
let aiExpires=0;
let cartoonDownload=null;
let cartoonExpires=0;

function decodeEmbedded(value){
  if(!value)return null;
  let decoded=value;
  try{decoded=JSON.parse('"'+value+'"')}catch{}
  return decoded.replaceAll("&amp;","&").replaceAll("&#38;","&").replaceAll("\\u0026","&");
}

async function resolveAI(){
  if(aiCache&&Date.now()<aiExpires)return aiCache;
  const response=await fetch(ADOBE_EMBED,{redirect:"follow",headers:{accept:"text/html","user-agent":"Mozilla/5.0 Portfolio/1.0"}});
  if(!response.ok)throw new Error("Adobe "+response.status);
  const html=await response.text();
  const mp4Raw=html.match(/"mp4URL"\s*:\s*"([^"]+)"/i)?.[1];
  const hlsRaw=html.match(/"m3u8URL"\s*:\s*"([^"]+)"/i)?.[1];
  let mp4=decodeEmbedded(mp4Raw);
  const hls=decodeEmbedded(hlsRaw);
  if(!mp4&&hls)mp4=hls.replace("/rend/master.m3u8","/rend/"+AI_ID+"_576.mp4");
  let poster=decodeEmbedded(html.match(/data-poster=["']([^"']+)["']/i)?.[1]||html.match(/"posterURL"\s*:\s*"([^"]+)"/i)?.[1]);
  if(!poster&&hls){const u=new URL(hls);poster=u.origin+"/"+AI_ID+"/image/"+AI_ID+"_poster.jpg"+u.search}
  if(!mp4)throw new Error("AI MP4 missing");
  aiCache={mp4,poster};
  aiExpires=Date.now()+10*60*1000;
  return aiCache;
}

async function resolveCartoon(){
  if(cartoonDownload&&Date.now()<cartoonExpires)return cartoonDownload;
  const api="https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key="+encodeURIComponent(CARTOON_PUBLIC_URL);
  const response=await fetch(api,{redirect:"follow",headers:{accept:"application/json","user-agent":"Mozilla/5.0 Portfolio/1.0"}});
  if(!response.ok)throw new Error("Yandex "+response.status);
  const data=await response.json();
  if(!data.href)throw new Error("Cartoon URL missing");
  cartoonDownload=data.href;
  cartoonExpires=Date.now()+25*60*1000;
  return cartoonDownload;
}

async function streamRemoteVideo(req,res,href,contentType="video/mp4"){
  const headers={accept:"*/*","user-agent":"Mozilla/5.0 PortfolioStream/1.0"};
  if(req.headers.range)headers.range=req.headers.range;
  const response=await fetch(href,{redirect:"follow",headers});
  if(!response.ok&&response.status!==206)throw new Error("Remote video "+response.status);
  const outgoing={
    "content-type":response.headers.get("content-type")||contentType,
    "accept-ranges":response.headers.get("accept-ranges")||"bytes",
    "cache-control":"public, max-age=3600"
  };
  const length=response.headers.get("content-length");
  const range=response.headers.get("content-range");
  if(length)outgoing["content-length"]=length;
  if(range)outgoing["content-range"]=range;
  res.writeHead(response.status===206?206:200,outgoing);
  if(req.method==="HEAD"||!response.body)return res.end();
  const reader=response.body.getReader();
  const pump=async()=>{
    for(;;){
      const {done,value}=await reader.read();
      if(done)break;
      if(!res.write(Buffer.from(value)))await new Promise(resolve=>res.once("drain",resolve));
    }
    res.end();
  };
  try{await pump()}catch(error){try{reader.cancel()}catch{}throw error}
}

function redirect(res,location,cacheControl="no-store"){
  res.writeHead(302,{location,"cache-control":cacheControl});
  res.end();
}

function cacheControl(ext,versioned){
  if(ext===".html")return "no-store, max-age=0";
  if(versioned)return "public, max-age=31536000, immutable";
  return "public, max-age=604800, stale-while-revalidate=86400";
}

function parseRange(header,size){
  if(!header)return null;
  const match=/bytes=(\d*)-(\d*)/.exec(header);
  if(!match)return null;
  let start=match[1]?Number(match[1]):0;
  let end=match[2]?Number(match[2]):size-1;
  if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<start||start>=size)return null;
  end=Math.min(end,size-1);
  return {start,end};
}

async function serveFile(req,res,file,url){
  const info=await stat(file);
  const ext=path.extname(file).toLowerCase();
  const type=types[ext]||"application/octet-stream";
  const versioned=url.searchParams.has("v");
  const cc=cacheControl(ext,versioned);

  if(ext===".mp4"){
    const range=parseRange(req.headers.range,info.size);
    if(range){
      const length=range.end-range.start+1;
      res.writeHead(206,{
        "content-type":type,
        "content-length":length,
        "content-range":"bytes "+range.start+"-"+range.end+"/"+info.size,
        "accept-ranges":"bytes",
        "cache-control":cc
      });
      if(req.method==="HEAD")return res.end();
      return createReadStream(file,{start:range.start,end:range.end}).pipe(res);
    }
    res.writeHead(200,{
      "content-type":type,
      "content-length":info.size,
      "accept-ranges":"bytes",
      "cache-control":cc
    });
    if(req.method==="HEAD")return res.end();
    return createReadStream(file).pipe(res);
  }

  const textAsset=[".html",".css",".js",".svg"].includes(ext);
  if(textAsset){
    const body=await readFile(file);
    let output=body;
    const headers={"content-type":type,"cache-control":cc};
    const accepted=String(req.headers["accept-encoding"]||"");
    if(body.length>1024&&accepted.includes("br")){
      output=brotliCompressSync(body,{params:{[zlibConstants.BROTLI_PARAM_QUALITY]:4}});
      headers["content-encoding"]="br";
      headers.vary="Accept-Encoding";
    }else if(body.length>1024&&accepted.includes("gzip")){
      output=gzipSync(body,{level:6});
      headers["content-encoding"]="gzip";
      headers.vary="Accept-Encoding";
    }
    headers["content-length"]=output.length;
    res.writeHead(200,headers);
    if(req.method==="HEAD")return res.end();
    return res.end(output);
  }

  res.writeHead(200,{"content-type":type,"content-length":info.size,"cache-control":cc});
  if(req.method==="HEAD")return res.end();
  createReadStream(file).pipe(res);
}

const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,"http://"+(req.headers.host||"localhost"));

    if(url.pathname==="/health"){
      res.writeHead(200,{"content-type":"text/plain; charset=utf-8","cache-control":"no-store"});
      return res.end("ok");
    }
    if(url.pathname==="/media/ai-video")return redirect(res,(await resolveAI()).mp4);
    if(url.pathname==="/media/ai-poster"){
      const poster=(await resolveAI()).poster;
      if(!poster)throw new Error("AI poster missing");
      return redirect(res,poster,"public, max-age=300");
    }
    if(url.pathname==="/media/cartoon-video")return await streamRemoteVideo(req,res,await resolveCartoon(),"video/mp4");

    const requested=decodeURIComponent(url.pathname==="/"?"/index.html":url.pathname);
    const normalized=path.normalize(requested).replace(/^(\.\.(\/|\\|$))+/,"");
    let file=path.join(root,normalized);
    if(!file.startsWith(root))throw new Error("Invalid path");
    try{
      if((await stat(file)).isDirectory())file=path.join(file,"index.html");
    }catch{
      file=path.join(root,"index.html");
    }
    await serveFile(req,res,file,url);
  }catch(error){
    console.error("request failed:",error.message);
    res.writeHead(404,{"content-type":"text/plain; charset=utf-8","cache-control":"no-store"});
    res.end("Not found");
  }
});

server.listen(port,"0.0.0.0",()=>{
  console.log("Portfolio listening on "+port);
  setTimeout(()=>Promise.allSettled([resolveAI(),resolveCartoon()]),700).unref();
});
