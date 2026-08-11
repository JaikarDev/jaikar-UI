const q=(s,p=document)=>p.querySelector(s),qa=(s,p=document)=>[...p.querySelectorAll(s)];
const glow=q('.cursor-glow');window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
const reveals=qa('.reveal');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});reveals.forEach(e=>io.observe(e));
const sections=qa('.section'),navLinks=qa('.rail nav a');const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{threshold:.45});sections.forEach(s=>sio.observe(s));
const filters=qa('.mode-switch button'),projects=qa('.project'),counter=q('#counter'),bar=q('.progress i');let mode='game',current=0;
function list(){return projects.filter(p=>p.dataset.type===mode)}function render(){const items=list();projects.forEach(p=>p.classList.remove('active'));items[current].classList.add('active');counter.textContent=String(current+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');bar.style.width=((current+1)/items.length*100)+'%'}
filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.filter;current=0;render()}));q('#next').onclick=()=>{current=(current+1)%list().length;render()};q('#prev').onclick=()=>{current=(current-1+list().length)%list().length;render()};
qa('.timeline article button').forEach(b=>b.onclick=()=>{const a=b.parentElement,was=a.classList.contains('open');qa('.timeline article').forEach(x=>{x.classList.remove('open');q('button>b',x).textContent='+'});if(!was){a.classList.add('open');q('button>b',a).textContent='−'}});
qa('.skill-tabs button').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.skill;qa('.skill-tabs button').forEach(x=>x.classList.toggle('active',x===button));qa('.skill-panels article').forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===id))}));
function time(){const el=q('.time');if(el)el.textContent='SF '+new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}time();setInterval(time,30000);
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')q('#next').click();if(e.key==='ArrowLeft')q('#prev').click()});

// Portfolio visit alerts. Local preview traffic is intentionally ignored.
(async function sendVisitAlert(){
  if(window.__trackingStandalone)return;
  const isPreview=['localhost','127.0.0.1','::1'].includes(location.hostname);
  const allowPreviewTest=new URLSearchParams(location.search).get('notify')==='1';
  window.__visitAlertStatus={state:'starting',isPreview};
  if(isPreview&&!allowPreviewTest){window.__visitAlertStatus={state:'skipped-local-preview',isPreview};return;}

  const topic='jaikar_portfolio_live_alerts_99';
  const lastPing=Number(localStorage.getItem('jaikar_last_ping')||0);
  if(Date.now()-lastPing<30000&&!allowPreviewTest){window.__visitAlertStatus={state:'cooldown',isPreview};return;}

  let visitorId=localStorage.getItem('jaikar_vid');
  const isReturning=Boolean(visitorId);
  if(!visitorId){
    visitorId='UID-'+Math.random().toString(36).slice(2,11);
    localStorage.setItem('jaikar_vid',visitorId);
  }

  const ua=navigator.userAgent;
  const os=/Android/i.test(ua)?'Android':/iPhone|iPad|iPod/i.test(ua)?'iOS':/Windows/i.test(ua)?'Windows':/Mac OS/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Other OS';
  const browser=/Edg\//i.test(ua)?'Edge':/Firefox\//i.test(ua)?'Firefox':/Chrome\//i.test(ua)?'Chrome':/Safari\//i.test(ua)?'Safari':'Other Browser';
  const device=/iPad|Tablet/i.test(ua)?'Tablet':/Mobi|Android|iPhone/i.test(ua)?'Mobile':'Desktop';
  let source='Direct / Bookmark';
  if(document.referrer){try{source=new URL(document.referrer).hostname}catch{source='External link'}}

  let loc={city:'Unknown city',region:'',country:'Unknown country',isp:'Unknown / blocked network',ip:'Hidden'};
  const getJson=async(url,timeout=4500)=>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);try{const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw new Error('lookup failed');return await response.json()}finally{clearTimeout(timer)}};
  try{
    const data=await getJson('https://get.geojs.io/v1/ip/geo.json');
    loc={city:data.city||loc.city,region:data.region||'',country:data.country||loc.country,isp:data.organization||data.isp||loc.isp,ip:data.ip||loc.ip};
  }catch(error){
    try{const data=await getJson('https://ipwho.is/');if(data.success!==false)loc={city:data.city||loc.city,region:data.region||'',country:data.country||loc.country,isp:data.connection?.isp||data.connection?.org||loc.isp,ip:data.ip||loc.ip}}catch{console.info('Visit location unavailable.')}
  }

  const title=isPreview?'Portfolio Preview Test':(isReturning?'Returning Visitor on Portfolio!':'New Visitor on Portfolio!');
  const message=[
    `Status: ${isReturning?'Returning visitor':'New visitor'}`,
    `Location: ${loc.city}${loc.region?', '+loc.region:''}, ${loc.country}`,
    `Network: ${loc.isp}`,
    `Public IP: ${loc.ip}`,
    `Device: ${device} · ${os} · ${browser}`,
    `Screen: ${window.innerWidth}×${window.innerHeight} · ${navigator.language}`,
    `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone||'Unknown'}`,
    `Connection: ${navigator.connection?.effectiveType||'Unknown'}${navigator.connection?.downlink?' · '+navigator.connection.downlink+' Mbps':''}`,
    `Source: ${source}`,
    `Visitor ID: ${visitorId}`,
    `Page: ${location.pathname}`,
    `Environment: ${isPreview?'Local preview test':'Live website'}`
  ].join('\n');

  try{
    const options={method:'POST',body:message,keepalive:true,headers:{Title:title,Tags:isReturning?'eyes':'rocket',Priority:'default'}};
    let sent=await fetch(`https://ntfy.sh/${topic}`,options);
    if(!sent.ok) sent=await fetch(`https://ntfy.sh/${topic}`,options);
    if(sent.ok){localStorage.setItem('jaikar_last_ping',String(Date.now()));window.__visitAlertStatus={state:'delivered',status:sent.status,isPreview};}
    else window.__visitAlertStatus={state:'failed',status:sent.status,isPreview};
  }catch(error){window.__visitAlertStatus={state:'network-error',message:error.message,isPreview};console.info('Visit notification unavailable.');}
})();
