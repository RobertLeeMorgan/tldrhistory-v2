const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const esbuild = require('../frontend/node_modules/esbuild');
const root = path.resolve(__dirname, '..');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const fixtureHook = `import {useState,useEffect,useCallback} from 'react';
const makePosts=(count,reverse=false)=>Array.from({length:count},(_,i)=>({id:String(i+1),name:'Fixture '+(i+1),type:'period',startYear:reverse?2000-i*10:1000+i*10,endYear:0,startMonth:0,startDay:0,endMonth:0,endDay:0,startDescription:'Historical fixture description. '.repeat(2+i%7),endDescription:'',country:{name:'France',continent:'Europe'},subjects:[],group:null,user:{id:'1',username:'Fixture'},likes:0,liked:false,startSignificance:0,endSignificance:0,imageUrl:i%3?'':"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='"+(i%2?200:70)+"'%3E%3Crect width='100%25' height='100%25' fill='gray'/%3E%3C/svg%3E"}));
export default function useTimeline({filter}) { const [count,setCount]=useState(60); const [failed,setFailed]=useState(false); const [empty,setEmpty]=useState(false);const key=JSON.stringify(filter);useEffect(()=>{setCount(60);setEmpty(false);setFailed(false)},[key]);
const fetchNextPage=useCallback(()=>{setFailed(false);setCount(n=>Math.min(240,n+30));},[failed]);
useEffect(()=>{window.fixture={append:()=>setCount(240),empty:()=>setEmpty(true),fail:()=>setFailed(true),recover:()=>setFailed(false)};},[]);
window.loadedCount=empty?0:count; return {posts:empty?[]:makePosts(count,filter.sortBy===false),hasNextPage:count<240,isFetchingNextPage:false,isLoading:false,error:failed?new Error('fixture failure'):null,isFetchNextPageError:failed,refetch:()=>setFailed(false),fetchNextPage};}`;
  const build = await esbuild.build({ entryPoints: [path.join(__dirname,'timeline-browser-fixture.tsx')], bundle: true, write: false, format: 'iife', jsx: 'automatic', absWorkingDir: root, nodePaths: [path.join(root,'frontend/node_modules')], define: { 'process.env.NODE_ENV': '"development"' }, plugins: [{ name: 'isolated-data', setup(build) {
    build.onResolve({filter: /hooks\/useTimeline$/}, () => ({path:'timeline-fixture',namespace:'fixture'}));
    build.onResolve({filter: /context\/AuthContext$/}, () => ({path:'auth-fixture',namespace:'fixture'}));
    build.onResolve({filter: /lib\/(graphql|api)$/}, args => ({path:args.path.endsWith('graphql')?'graphql-fixture':'api-fixture',namespace:'fixture'}));
    build.onLoad({filter: /.*/,namespace:'fixture'}, args => ({contents: args.path==='timeline-fixture'?fixtureHook:args.path==='auth-fixture'?`export const useAuth=()=>({isAuth:{id:'1',token:'fixture',role:'USER',username:'Fixture'},loading:false,logout:async()=>{}});`:args.path==='graphql-fixture'?`const article=(id,name,type)=>({id,name,type,startDescription:'Fixture article description.',endDescription:'',startYear:1000,startMonth:0,startDay:0,endYear:0,endMonth:0,endDay:0,startSignificance:1,endSignificance:0,imageUrl:null,imageCredit:null,sourceUrl:null,cdnId:null,civilisation:false,country:{name:'France',continent:'Europe'},subjects:[],group:{id:1,name:'Fixture group',icon:'military'},user:{id:'1',username:'Fixture'},likes:0,liked:false});export const graphqlRequest=async query=>{const source=String(query);if(source.includes('GetPopulation'))return {getPopulation:8000000};if(source.includes('GetSignificant'))return {getSignificant:{person:article('person','Fixture person','person'),event:article('event','Fixture event','event'),landmark:article('landmark','Fixture landmark','landmark')}};if(source.includes('GetCivilisation'))return {getCivilisation:Array.from({length:5},(_,i)=>({id:'civ'+i,name:'Fixture civilisation '+(i+1),startYear:900,endYear:1800,startSignificance:1-i/10,country:{name:'France',continent:'Europe'},group:{id:i+1}}))};return {likePost:{liked:true,likes:1}};};`:`export const api={post:async()=>({data:{data:{}}})};`,loader:'js',resolveDir:path.join(root,'frontend')}));
  }}] });
  const assetsDir=path.join(root,'frontend/build/client/assets');
  const cssName=fs.readdirSync(assetsDir).find(name=>name.startsWith('root-')&&name.endsWith('.css'));
  const css=cssName?fs.readFileSync(path.join(assetsDir,cssName)):Buffer.from('');
  const server=http.createServer((req,res)=>{res.setHeader('Content-Type',req.url==='/bundle.js'?'text/javascript':req.url==='/style.css'?'text/css':'text/html');res.end(req.url==='/bundle.js'?build.outputFiles[0].contents:req.url==='/style.css'?css:'<!doctype html><html><head><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>');});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'tldr-browser-'));
  const edge=spawn(process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--remote-debugging-port=0','--remote-debugging-address=127.0.0.1','--user-data-dir='+profile,'--no-first-run','--disable-background-networking','--disable-sync','--disable-gpu','about:blank'],{windowsHide:true,stdio:'ignore'});
  let ws;
  try {
    const active=path.join(profile,'DevToolsActivePort');
    for(let i=0;i<100&&!fs.existsSync(active);i++) await sleep(100);
    const port=fs.readFileSync(active,'utf8').split('\n')[0];
    const page=await (await fetch('http://127.0.0.1:'+port+'/json/new?about:blank',{method:'PUT'})).json();
    ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
    let id=0;const pending=new Map();const errors=[];
    ws.onmessage=event=>{const message=JSON.parse(event.data);if(message.id){const p=pending.get(message.id);pending.delete(message.id);message.error?p.reject(message.error):p.resolve(message.result)}else if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text+': '+message.params.exceptionDetails.exception?.description)};
    const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
    const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||'evaluate failed');return result.result.value};
    const until=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await sleep(100)}throw new Error('Timed out: '+expression+'; '+JSON.stringify(errors))};
    await call('Runtime.enable');await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
    await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/timeline'});
    await until("document.querySelectorAll('[data-post-id]').length > 0");await sleep(600);
    const baseline=await evaluate("({cards:document.querySelectorAll('[data-post-id]').length,loaded:window.loadedCount})");
    if(process.env.AUDIT_BASELINE){console.log('baseline DOM',baseline);return;}
    assert.ok(baseline.cards<baseline.loaded,JSON.stringify(baseline));
    const headerGeometry=await evaluate(`(()=>{const title=document.querySelector('#timeline-context-header h1').parentElement.getBoundingClientRect();const strip=document.querySelector('[aria-label^="Historical eras"]').getBoundingClientRect();return {titleRight:title.right,stripLeft:strip.left,headerHasYear:document.querySelector('#timeline-context-header').textContent.includes('Timeline year'),statsHasYear:document.querySelector('aside[aria-label="Timeline context"]').textContent.includes('Timeline year')}})()`);
    assert.ok(headerGeometry.titleRight<=headerGeometry.stripLeft+1,'era strip overlaps title column: '+JSON.stringify(headerGeometry));
    assert.equal(headerGeometry.headerHasYear,false,'timeline year must be removed from the header');
    assert.equal(headerGeometry.statsHasYear,true,'timeline year must appear in statistics');
    assert.equal(await evaluate(`document.querySelectorAll('button[aria-label^="Open most significant"]').length`),3,'three significant article controls must render');
    await evaluate(`document.querySelector('button[aria-label^="Open most significant person"]').click()`);await until(`Boolean(document.querySelector('[role=dialog][aria-label^="Article: Fixture person"]'))`);
    await evaluate("window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))");await until("document.body.style.overflow!== 'hidden'");
    assert.ok(await evaluate(`document.body.textContent.includes('See 2 more')`),'additional civilisation count must render');
    await evaluate(`[...document.querySelectorAll('button')].find(n=>n.textContent.includes('See 2 more')).click()`);await until(`Boolean(document.querySelector('[role=dialog][aria-label="Historical map"]'))`);
    await evaluate("window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))");await until("document.body.style.overflow!== 'hidden'");
    await evaluate('scrollTo(0,document.documentElement.scrollHeight)');await until('window.loadedCount>60');
    await evaluate("window.fixture.append()");await sleep(300);
    const count=await evaluate("document.querySelectorAll('[data-post-id]').length");assert.ok(count<100,'virtual DOM must stay bounded: '+count);
    const checkEra=async()=>{await sleep(900);const x=await evaluate(`(()=>{const visibleTop=document.querySelector('#timeline-context-header').getBoundingClientRect().bottom;const cards=[...document.querySelectorAll('[data-post-id]')].map(n=>({year:Number(n.dataset.startYear),top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom})).filter(n=>n.bottom>visibleTop&&n.top<innerHeight);return {year:Number(document.querySelector('#era').dataset.year),visible:cards.map(n=>n.year),dots:document.querySelectorAll('#map svg circle').length}})()`);assert.ok(x.visible.includes(x.year),JSON.stringify(x));assert.equal(x.dots,x.year>=1200&&x.year<=1600?1:0,'map must follow tracked year: '+JSON.stringify(x));};
    for(const y of [0,1600,6000,2500,0]){await evaluate('scrollTo(0,'+y+')');await checkEra();}
    for(const viewport of [[320,844],[480,844],[768,1024],[1024,768],[1536,900],[1920,1080],[844,480]]){
      await call('Emulation.setDeviceMetricsOverride',{width:viewport[0],height:viewport[1],deviceScaleFactor:1,mobile:false});await sleep(250);
      assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),true,'horizontal overflow at '+viewport.join('x'));
    }
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});await sleep(400);await checkEra();
    const mobileStats=await evaluate(`(()=>{const aside=document.querySelector('aside[aria-label="Timeline context"]');const rect=aside.getBoundingClientRect();return {bottom:rect.bottom,height:rect.height,columns:getComputedStyle(aside.firstElementChild).gridTemplateColumns.split(' ').length}})()`);
    assert.ok(Math.abs(mobileStats.bottom-844)<2,'mobile statistics must be fixed to viewport bottom: '+JSON.stringify(mobileStats));
    assert.equal(mobileStats.columns,3,'mobile statistics must use three columns');
    await evaluate('scrollTo(0,1400)');await sleep(450);assert.ok(await evaluate("document.querySelector('nav[aria-label=\"Primary navigation\"]').getBoundingClientRect().bottom<=1"),'mobile nav should hide after sustained downward scroll');
    await evaluate('scrollBy(0,-120)');await sleep(450);assert.ok(await evaluate("document.querySelector('nav[aria-label=\"Primary navigation\"]').getBoundingClientRect().bottom>1"),'mobile nav should return after sustained upward scroll');
    await evaluate("document.querySelector(\"[aria-label^='Open filters']\").click()");await until("document.querySelector('[role=dialog][aria-label=\"Timeline filters\"]') && document.body.style.overflow==='hidden'");
    await evaluate("window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))");await until("!document.querySelector('[role=dialog][aria-label=\"Timeline filters\"]') && document.body.style.overflow!=='hidden'");
    await evaluate('scrollTo(0,3000)');await checkEra();
    await evaluate("document.querySelector('#region').click()");await checkEra();
    await evaluate("document.querySelector('#reverse').click();scrollTo(0,0)");await sleep(600);await checkEra();
    await evaluate('scrollTo(0,1800)');await checkEra();
    await evaluate("document.querySelector('[data-post-id]').click()");await until("document.body.style.overflow==='hidden'");
    await evaluate("window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))");await until("document.body.style.overflow!== 'hidden'");
    await evaluate("(()=>{const input=document.querySelector('input[type=search]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'uncommitted');input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#saved').click()})()");await sleep(600);assert.equal(await evaluate("document.querySelector('input[type=search]').value"),'saved');assert.ok((await evaluate('location.search')).includes('q=saved'));
    await evaluate("document.querySelector('#reset').click()");await sleep(600);assert.equal(await evaluate("document.querySelector('input[type=search]').value"),'');assert.equal(await evaluate('location.search'),'');
    await evaluate('history.back()');await sleep(600);assert.equal(await evaluate("document.querySelector('input[type=search]').value"),'saved');
    await evaluate("window.fixture.fail()");await until("document.body.textContent.includes('Retry')");
    await evaluate("[...document.querySelectorAll('button')].find(n=>n.textContent==='Retry').click()");await sleep(300);
    await evaluate("window.fixture.empty()");await until("document.body.textContent.includes('No posts yet')");
    assert.deepEqual(errors,[]);console.log('PASS browser fixture: bounded DOM, scroll/reverse scroll, append, resize, era/region, saved/reset/history, error and empty states.',baseline);
  } finally {if(ws)ws.close();edge.kill();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
