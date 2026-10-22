(()=>{'use strict';
const ORIGIN='https://emudhra.we-have-a-problem.com';
const PREFIX=['dv-g3b','dv-g3c','ov-g3b','ov-g3c','ev-g3b','ev-g3c','dv-g3b-aaa','dv-g3c-aaa','ov-g3b-aaa','ov-g3c-aaa','ev-g3b-aaa','ev-g3c-aaa'];
const HOSTS=PREFIX.map(key=>({key,host:key+'-emudhra.we-have-a-problem.com',root:key.endsWith('-aaa')?'AAA Certificate Services':'emSign Root TLS CA - G3'}));
const $=id=>document.getElementById(id);
const t=key=>window.CERT_I18N[lang]?.[key]??window.CERT_I18N.en[key]??key;
const validLang=['zh','ja','en'];
let lang='zh',theme='light',os='windows',running=false;
let results=HOSTS.map(()=>({state:'pending'})),control='pending',lastRun=null,runId=0;
try{
 const stored=localStorage.getItem('certtrust-language');
 lang=validLang.includes(stored)?stored:(navigator.language.toLowerCase().startsWith('ja')?'ja':navigator.language.toLowerCase().startsWith('zh')?'zh':'en');
 const preference=localStorage.getItem('certtrust-theme');
 theme=['dark','light'].includes(preference)?preference:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
}catch(e){}
function applyTheme(){
 document.documentElement.dataset.theme=theme;
 $('theme-toggle').textContent=theme==='dark'?'☀':'◐';
 $('theme-toggle').setAttribute('aria-label',theme==='dark'?t('lightMode'):t('darkMode'));
}
function formatTime(iso){
 return iso?new Intl.DateTimeFormat({zh:'zh-CN',ja:'ja-JP',en:'en-US'}[lang],{dateStyle:'medium',timeStyle:'medium'}).format(new Date(iso)):'';
}
function setStatus(){
 let mode='idle',title=t('idleTitle'),detail=t('idleDetail');
 if(running){mode='scanning';title=t('scanningTitle');detail=t('scanningDetail');}
 else if(lastRun){
  if(results.some(r=>r.state==='connected')){mode='connected';title=t('detectedTitle');detail=t('detectedDetail');}
  else if(control!=='connected'){mode='uncertain';title=t('offlineTitle');detail=t('offlineDetail');}
  else{mode='not-connected';title=t('inconclusiveTitle');detail=t('inconclusiveDetail');}
 }
 $('status-visual').className='status-visual '+mode;
 $('status-title').textContent=title;
 $('status-detail').textContent=detail;
 $('test-time').textContent=lastRun?t('timeLabel')+formatTime(lastRun):'';
}
function getCounts(){
 return {
  connected:results.filter(x=>x.state==='connected').length,
  blocked:results.filter(x=>x.state==='blocked').length,
  timeout:results.filter(x=>x.state==='timeout').length,
  remaining:results.filter(x=>x.state==='testing'||x.state==='pending').length
 };
}
function updateChart(){
 const c=getCounts();
 const done=12-c.remaining;
 $('stat-risk').textContent=c.connected;
 $('stat-not-connected').textContent=c.blocked;
 $('stat-uncertain').textContent=c.timeout;
 $('stat-remaining').textContent=c.remaining;
 $('chart-done').firstChild.nodeValue=String(done);
 $('chart-label').textContent=t('chartProgress');
 $('progress-fill').style.width=(done/12*100)+'%';
 $('progress-label').textContent=done+' / 12';
 const segments=[
  [c.connected,'var(--bad-fill)'],
  [c.blocked,'var(--good-fill)'],
  [c.timeout,'var(--warn-fill)'],
  [c.remaining,running?'#6096ee':'var(--pending-fill)']
 ];
 let cursor=0;
 const stops=[];
 for(const [count,color] of segments){
  if(!count)continue;
  const end=cursor+count/12*100;
  stops.push(color+' '+cursor.toFixed(5)+'% '+end.toFixed(5)+'%');
  cursor=end;
 }
 $('result-chart').style.setProperty('--chart-fill','conic-gradient('+stops.join(',')+')');
 $('result-chart').setAttribute('aria-label',t('chartAccessible')
   .replace('{done}',String(done)).replace('{risk}',String(c.connected))
   .replace('{blocked}',String(c.blocked)).replace('{unknown}',String(c.timeout))
   .replace('{remaining}',String(c.remaining)));
}
function paintRows(){
 const items=HOSTS.map((h,i)=>{
  const st=results[i].state;
  const label=['pending','testing','connected','blocked','timeout'].includes(st)?st:'timeout';
  return '<div class="result-item"><span class="result-number">'+String(i+1).padStart(2,'0')+'</span><div><div class="result-name">'+h.key.toUpperCase()+'</div><div class="result-sub">'+h.root+' · '+h.host+'</div></div><span class="result-pill '+st+'">'+t(label)+'</span></div>';
 }).join('');
 $('results-list').innerHTML=items;
 updateChart();
}
function paintControl(){
 $('control-note').textContent=control==='pending'?t('controlIdle'):control==='connected'?t('controlGood'):t('controlBad');
}
function inferOS(){
 const ua=navigator.userAgent;
 if(/iPad|iPhone|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1))return 'ios';
 if(/Android/.test(ua))return 'android';
 if(/Win/.test(ua))return 'windows';
 if(/Mac/.test(ua))return 'mac';
 if(/Linux/.test(ua))return 'linux';
 return 'windows';
}
function renderSteps(){
 $('os-tabs').querySelectorAll('[role=tab]').forEach(button=>{
  const selected=button.dataset.os===os;
  button.setAttribute('aria-selected',String(selected));
  button.tabIndex=selected?0:-1;
 });
 const ol=document.createElement('ol');
 for(const step of t('steps')[os]){
  const li=document.createElement('li');
  li.textContent=step;
  ol.appendChild(li);
 }
 $('os-content').replaceChildren(ol);
}
function translate(){
 document.documentElement.lang={zh:'zh-CN',ja:'ja',en:'en'}[lang];
 $('language').value=lang;
 document.querySelectorAll('[data-i18n]').forEach(el=>{
  const key=el.dataset.i18n;
  if(key==='heroTitle')el.innerHTML=t(key);
  else el.textContent=t(key);
 });
 $('start-label').textContent=running?t('running'):lastRun?t('again'):t('start');
 setStatus();paintRows();paintControl();renderSteps();applyTheme();
}
// A browser's fetch errors do not disclose TLS failure causes.
// Rejection may reflect certificate validation, DNS, network, proxy or other failures.
async function probe(url,timeoutMs=12000){
 const controller=new AbortController();
 let timer;
 try{
  timer=setTimeout(()=>controller.abort(),timeoutMs);
  const target=new URL(url);
  target.searchParams.set('_ct_check',String(Date.now())+Math.random().toString(36).slice(2));
  await fetch(target.toString(),{mode:'no-cors',credentials:'omit',cache:'no-store',redirect:'follow',referrerPolicy:'no-referrer',signal:controller.signal});
  return 'connected';
 }catch(err){
  return controller.signal.aborted?'timeout':'blocked';
 }finally{clearTimeout(timer);}
}
async function run(){
 if(running)return;
 running=true;
 const current=++runId;
 lastRun=null;
 control='pending';
 results=HOSTS.map(()=>({state:'testing'}));
 $('start-button').disabled=true;
 $('export-json').disabled=true;
 $('print-report').disabled=true;
 $('ai-generate').disabled=true;
 $('scan-progress').hidden=false;
 translate();
 const controlPromise=probe(ORIGIN+'/',12000).then(value=>{if(current===runId){control=value;paintControl();}return value;});
 await Promise.all(HOSTS.map(async(h,i)=>{
  const state=await probe('https://'+h.host+'/',12000);
  if(current!==runId)return;
  results[i]={state};
  paintRows();
 }));
 await controlPromise;
 if(current!==runId)return;
 lastRun=new Date().toISOString();
 running=false;
 $('start-button').disabled=false;
 $('export-json').disabled=false;
 $('print-report').disabled=false;
 $('ai-generate').disabled=false;
 $('scan-progress').hidden=true;
 translate();
}
function buildReport(){
 if(!lastRun)return null;
 const c=getCounts();
 const verdict=c.connected>0?'risk-connection-observed':control==='connected'?'no-risk-connection-observed-unverified':'inconclusive-reference-unavailable';
 return {
  tool:'CertTrust Inspector',
  version:'1.1.0',
  test:'eMudhra TLS test endpoints',
  timestamp:lastRun,
  scope:'Current browser and current network only',
  summary:{
   verdict,
   label:verdict==='risk-connection-observed'?t('detectedTitle'):verdict==='no-risk-connection-observed-unverified'?t('inconclusiveTitle'):t('offlineTitle'),
   counts:{riskConnections:c.connected,notConnected:c.blocked,timedOut:c.timeout},
   referenceSiteReachable:control==='connected'
  },
  interpretation:'A completed cross-origin fetch to an affected test endpoint merits investigation. Failed fetches cannot establish the TLS error cause or prove whole-device safety.',
  control,
  results:HOSTS.map((h,i)=>({...h,state:results[i].state}))
 };
}
function saveReport(){
 const report=buildReport();if(!report)return;
 const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;
 a.download='certtrust-report-'+lastRun.slice(0,10)+'.json';
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function makeAIPrompt(){
 const report=buildReport();if(!report)return '';
 return [
  t('aiPromptIntro'),
  '',
  t('aiPromptDevice')+': '+({windows:'Windows',mac:'macOS',ios:'iOS / iPadOS',android:'Android',linux:'Linux'}[os]),
  t('aiPromptBrowser'),
  '',
  t('aiPromptTask'),
  '',
  '--- BEGIN CERTTRUST JSON ---',
  JSON.stringify(report,null,2),
  '--- END CERTTRUST JSON ---',
  '',
  t('aiPromptSafety')
 ].join('\n');
}
function openAIPrompt(){
 if(!lastRun||running)return;
 $('ai-prompt').value=makeAIPrompt();
 $('copy-feedback').textContent='';
 const dialog=$('ai-dialog');
 if(!dialog.open)dialog.showModal();
}
async function copyAIPrompt(){
 const value=$('ai-prompt').value;
 if(!value)return;
 let ok=false;
 try{
  if(navigator.clipboard&&navigator.clipboard.writeText){
   await navigator.clipboard.writeText(value);ok=true;
  }
 }catch(e){}
 if(!ok){
  $('ai-prompt').focus();$('ai-prompt').select();
  try{ok=document.execCommand('copy');}catch(e){}
 }
 $('copy-feedback').textContent=ok?t('aiCopied'):t('aiCopyFailed');
}
$('language').addEventListener('change',e=>{
 lang=e.target.value;
 try{localStorage.setItem('certtrust-language',lang);}catch(e){}
 translate();
});
$('theme-toggle').addEventListener('click',()=>{
 theme=theme==='dark'?'light':'dark';
 try{localStorage.setItem('certtrust-theme',theme);}catch(e){}
 applyTheme();
});
$('os-tabs').querySelectorAll('button').forEach(button=>{
 button.addEventListener('click',()=>{os=button.dataset.os;renderSteps();});
 button.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const tabs=Array.from($('os-tabs').querySelectorAll('button'));
  const index=tabs.indexOf(button);
  const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  os=tabs[next].dataset.os;renderSteps();tabs[next].focus();
 });
});
$('start-button').addEventListener('click',run);
$('export-json').addEventListener('click',saveReport);
$('print-report').addEventListener('click',()=>{if(lastRun)window.print();});
$('ai-generate').addEventListener('click',openAIPrompt);
$('ai-copy').addEventListener('click',copyAIPrompt);
$('ai-close').addEventListener('click',()=>$('ai-dialog').close());
$('ai-close-icon').addEventListener('click',()=>$('ai-dialog').close());
os=inferOS();
translate();
})();