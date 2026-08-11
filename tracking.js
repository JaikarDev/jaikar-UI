window.__trackingStandalone=true;
(async()=>{
  const preview=['localhost','127.0.0.1','::1'].includes(location.hostname);
  const test=new URLSearchParams(location.search).get('notify')==='1';
  const setStatus=(state,extra={})=>{window.__visitAlertStatus={state,preview,...extra};document.documentElement.dataset.ntfyStatus=state;document.dispatchEvent(new CustomEvent('ntfy-status',{detail:window.__visitAlertStatus}))};
  setStatus('starting');
  if(preview&&!test){setStatus('skipped-local-preview');return}
  const last=Number(localStorage.getItem('jaikar_last_ping')||0);
  if(Date.now()-last<30000&&!test){setStatus('cooldown');return}
  let id=localStorage.getItem('jaikar_vid');const returning=!!id;
  if(!id){id='UID-'+Math.random().toString(36).slice(2,11);localStorage.setItem('jaikar_vid',id)}
  const ua=navigator.userAgent;
  const os=/Android/i.test(ua)?'Android':/iPhone|iPad/i.test(ua)?'iOS':/Windows/i.test(ua)?'Windows':/Mac OS/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Other OS';
  const browser=/Edg\//i.test(ua)?'Edge':/Firefox\//i.test(ua)?'Firefox':/Chrome\//i.test(ua)?'Chrome':/Safari\//i.test(ua)?'Safari':'Other Browser';
  const device=/iPad|Tablet/i.test(ua)?'Tablet':/Mobi|Android|iPhone/i.test(ua)?'Mobile':'Desktop';
  let source='Direct / Bookmark';if(document.referrer){try{source=new URL(document.referrer).hostname}catch{source='External link'}}
  const lookup=async(url)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),4500);try{const r=await fetch(url,{signal:c.signal});if(!r.ok)throw Error('lookup failed');return await r.json()}finally{clearTimeout(t)}};
  let loc={city:'Unknown city',region:'',country:'Unknown country',isp:'Unknown / blocked network',ip:'Hidden'};
  try{const d=await lookup('https://get.geojs.io/v1/ip/geo.json');loc={city:d.city||loc.city,region:d.region||'',country:d.country||loc.country,isp:d.organization||d.isp||loc.isp,ip:d.ip||loc.ip}}catch{try{const d=await lookup('https://ipwho.is/');if(d.success!==false)loc={city:d.city||loc.city,region:d.region||'',country:d.country||loc.country,isp:d.connection?.isp||d.connection?.org||loc.isp,ip:d.ip||loc.ip}}catch{}}
  const title=preview?'Portfolio Preview Test':returning?'Returning Visitor on Portfolio!':'New Visitor on Portfolio!';
  const body=[`Status: ${returning?'Returning visitor':'New visitor'}`,`Location: ${loc.city}${loc.region?', '+loc.region:''}, ${loc.country}`,`Network: ${loc.isp}`,`Public IP: ${loc.ip}`,`Device: ${device} · ${os} · ${browser}`,`Screen: ${innerWidth}×${innerHeight} · ${navigator.language}`,`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone||'Unknown'}`,`Connection: ${navigator.connection?.effectiveType||'Unknown'}`,`Source: ${source}`,`Visitor ID: ${id}`,`Page: ${location.pathname}`,`Environment: ${preview?'Local preview test':'Live website'}`].join('\n');
  try{
    const endpoint=new URL('https://ntfy.sh/jaikar_portfolio_live_alerts_99');
    endpoint.searchParams.set('title',title);
    endpoint.searchParams.set('tags',returning?'eyes':'rocket');
    endpoint.searchParams.set('priority','default');
    endpoint.searchParams.set('click',location.href);
    const send=()=>fetch(endpoint,{method:'POST',body,keepalive:true,mode:'cors',credentials:'omit',headers:{'Content-Type':'text/plain;charset=UTF-8'}});
    let r=await send();
    if(!r.ok){await new Promise(resolve=>setTimeout(resolve,700));r=await send()}
    setStatus(r.ok?'delivered':'failed',{status:r.status});
    if(r.ok)localStorage.setItem('jaikar_last_ping',String(Date.now()));
  }catch(e){setStatus('network-error',{message:e.message})}
})();
