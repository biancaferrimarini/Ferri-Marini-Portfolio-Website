import {readFile, readdir, mkdir, writeFile, cp, stat, rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export async function buildPortfolio(root) {
  const records=async folder=>{
    const files=(await readdir(path.join(root,'content',folder))).filter(file=>file.endsWith('.json')).sort();
    return Promise.all(files.map(async file=>{
      try{return JSON.parse(await readFile(path.join(root,'content',folder,file),'utf8'));}
      catch(error){throw new Error(`${folder}/${file}: ${error.message}`);}
    }));
  };
  const [collections,projects]=await Promise.all([records('collections'),records('projects')]);
  for(const [kind,rows] of [['collection',collections],['project',projects]]){
    const ids=new Set();
    for(const row of rows){
      if(!/^[a-zA-Z0-9-]+$/.test(row.id||'')||ids.has(row.id))throw new Error(`Missing or duplicate ${kind} id`);
      ids.add(row.id);
      if(typeof row.title!=='string'||!row.title.trim())throw new Error(`Missing ${kind} title: ${row.id}`);
      if(!['draft','published'].includes(row.status))throw new Error(`Invalid ${kind} status: ${row.title}`);
      if(row.order!==undefined&&!Number.isFinite(Number(row.order)))throw new Error(`Invalid order: ${row.title}`);
    }
  }
  const ids=new Set(collections.map(row=>row.id));
  for(const project of projects){
    if(!ids.has(project.collection))throw new Error(`Choose an existing collection for: ${project.title}`);
    if(project.renders!=null&&(!Array.isArray(project.renders)||project.renders.length>5))throw new Error(`Use up to five renders: ${project.title}`);
  }
  const order=(a,b)=>(Number(a.order)||0)-(Number(b.order)||0)||a.id.localeCompare(b.id);
  const normalize=src=>typeof src==='string'?src.replace(/^\/(assets\/)/,'$1'):'';
  const checkAsset=async src=>{
    if(!src||/^https:\/\//.test(src))return;
    const local=decodeURIComponent(src);
    if(!local.startsWith('assets/')||local.split('/').includes('..')||local.includes('\\'))throw new Error(`Invalid asset path: ${src}`);
    const file=path.join(root,local);
    try{if(!(await stat(file)).isFile())throw new Error();}catch{throw new Error(`Missing asset: ${src}`);}
  };
  const published=[];
  for(const collection of collections.filter(row=>row.status==='published').sort(order)){
    const entries=[];
    for(const project of projects.filter(row=>row.collection===collection.id&&row.status==='published').sort(order)){
      const entry=structuredClone(project);
      const assets=[];
      if(entry.construction&&!Array.isArray(entry.construction))entry.construction=[['fit','Fit'],['collar','Collar / Neckline'],['pockets','Pockets'],['seams','Seams & topstitching'],['fabric','Fabric'],['volume','Volume']].map(([key,label])=>({label,text:entry.construction[key]||'To come'}));
      entry.renders=(entry.renders||[]).map(render=>({...render,src:normalize(render.src)}));
      entry.renders.forEach(render=>assets.push(render.src));
      entry.reference={...entry.reference,src:normalize(entry.reference?.src)};assets.push(entry.reference.src);
      if(entry.model?.externalURL&&!/^https:\/\//.test(entry.model.externalURL))throw new Error(`Use an HTTPS model URL: ${entry.title}`);
      entry.model={...entry.model,src:normalize(entry.model?.externalURL||entry.model?.src),poster:normalize(entry.model?.poster),preview:normalize(entry.model?.preview)};
      assets.push(entry.model.src,entry.model.poster,entry.model.preview,...(entry.model.dependencies||[]).map(normalize));
      if(entry.model.src&&!/\.(glb|gltf)(\?.*)?$/i.test(entry.model.src))throw new Error(`Use GLB or GLTF: ${entry.title}`);
      await Promise.all(assets.map(checkAsset));
      entries.push(entry);
    }
    published.push({id:collection.id,title:collection.title,projects:entries});
  }
  return {collections:published};
}

export async function run(root, dataOnly=false) {
  const data=await buildPortfolio(root);
  const output=dataOnly?root:path.join(root,'_site');
  if(!dataOnly)await rm(output,{recursive:true,force:true});
  await mkdir(path.join(output,'data'),{recursive:true});
  if(!dataOnly){
    for(const file of ['index.html','about.html','contact.html','admin.html','.nojekyll','css','js','assets'])await cp(path.join(root,file),path.join(output,file),{recursive:true});
    await cp(path.join(root,'data/site.json'),path.join(output,'data/site.json'));
  }
  await writeFile(path.join(output,'data/portfolio.json'),JSON.stringify(data,null,2)+'\n');
  console.log(`Portfolio built: ${data.collections.length} collections, ${data.collections.reduce((sum,c)=>sum+c.projects.length,0)} published projects.`);
  return output;
}
const script=fileURLToPath(import.meta.url);
if(process.argv[1]&&path.resolve(process.argv[1])===script)await run(path.resolve(path.dirname(script),'..'),process.argv.includes('--data-only'));
