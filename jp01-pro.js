(function(){
  const links={
    fieldnotes:[['Fieldnotes case study','/Assets/Fieldnotes/Fieldnotes_Jaikar_Pothula_Case_Study.pdf'],['Unity evidence UI','/Assets/Fieldnotes/fieldnotes-evidence.png'],['Connections UI','/Assets/Fieldnotes/fieldnotes-connections.png']],
    work:[['Selected work','#work'],['Visual showcase','#showcase'],['Case files','#documentation']],
    resume:[['Game UI résumé','/Assets/resumes/Jaikar_Pothula_Master_Resume_Game_UI_UX.pdf'],['Product résumé','/Assets/resumes/Jaikar_Pothula_Master_Resume_Product_Design.pdf']],
    contact:[['Email Jaikar','mailto:Jaikardevgame@gmail.com'],['LinkedIn','https://www.linkedin.com/in/jaikar-pothula-489b681a5/']],
    steam:[['The Dark Arrival on Steam','https://store.steampowered.com/app/3295930/THE_DARK_ARRIVAL__SHADOWS_OF_THE_PAST/'],['Project details','#work']],
    octopus:[['Find the Octopus on Google Play','https://play.google.com/store/apps/details?id=com.vaultgames.findtheoctopushiddenobjectgames&hl=en_US'],['Mobile UI work','#work']],
    figma:[['The Dark Arrival Figma','https://www.figma.com/design/MaSahDVicf0yEAzQPHE5LF/DARK-ARRIVAL-NEW?node-id=108-2'],['Suite 13 Figma','https://www.figma.com/design/GY9Xha8TuDwjtyIfUJiHHO/SUITE-13?node-id=0-1']],
  };
  const topics=[
    {keys:['fieldnotes','visionos','vision pro','spatial','polyspatial','gaze','pinch'],answer:'Fieldnotes is a visionOS-inspired spatial investigator journal designed and implemented in Unity 6.3 with URP and C#. It combines three inspectable procedural clues, a world-space journal, rotation and zoom, saved evidence connections, a case timeline, clear navigation states and reduced-motion settings. The Windows build completed with zero errors and was launch/render checked. Native PolySpatial, gaze-and-pinch input, simulator and Vision Pro hardware validation are the documented next steps.',links:'fieldnotes'},
    {keys:['unity','c#','unity 3d','ugui'],answer:'Jaikar works in Unity UI and C#. Fieldnotes demonstrates world-space UI, procedural 3D evidence, interaction states, persistence with PlayerPrefs, reduced motion and a verified Windows build. His broader Unity work also includes mobile game UI, responsive canvases, prefab-driven systems and runtime implementation.',links:'fieldnotes'},
    {keys:['unreal','ue5','umg','blueprint'],answer:'Jaikar builds real-time interfaces in Unreal Engine 5 using UMG and Blueprints. The Dark Arrival includes a diegetic 3D Investigator Journal, HUD and menus built as a modular component system. That work is shipped on Steam and represented in the GDC 2026 playable build.',links:'steam'},
    {keys:['dark arrival','shipped','steam','gdc'],answer:'The Dark Arrival: Shadows of the Past is Jaikar’s strongest shipped PC game UI example. He owned the diegetic Investigator Journal, HUD and menu work, using modular UMG and Blueprint systems. The title is live on Steam, and its production UI appears in the GDC 2026 playable build.',links:'steam'},
    {keys:['octopus','mobile','android','google play','live ops'],answer:'Find the Octopus demonstrates shipped mobile game UI. Jaikar’s portfolio highlights level progression, rewards, VIP monetization, reusable interface patterns, responsive layout and production implementation. The game is available on Google Play.',links:'octopus'},
    {keys:['figma','prototype','wireframe','design system','handoff'],answer:'Jaikar uses Figma for user flows, wireframes, interactive prototypes, component libraries, visual systems and developer handoff. His process connects design decisions to implementation in Unity or Unreal so states, hierarchy and motion survive production.',links:'figma'},
    {keys:['experience','background','years','about','who is','who are'],answer:'Jaikar Pothula is a San Francisco Bay Area Technical UI/UX Designer with 3+ years of experience across games and digital products. He holds an M.A. in Game Development from Academy of Art University and works across UI/UX, visual design, motion and real-time implementation. His toolkit includes Figma, Unreal Engine 5, UMG, Blueprints, Unity, C#, Photoshop, Illustrator, After Effects, Git and Perforce.',links:'work'},
    {keys:['award','rookie','recognition'],answer:'Jaikar was recognized as Rookie of the Year at The Rookies 2025. His portfolio also includes shipped Steam and Google Play work and a GDC 2026 playable presentation. These are presented as concrete proof points rather than estimated impact claims.',links:'work'},
    {keys:['available','availability','hire','role','job','open to work','location','remote','hybrid'],answer:'Jaikar is available for Game UI/UX, Technical UI, Product UI and spatial-interface opportunities. He is based in the San Francisco Bay Area and is open to suitable hybrid, remote and on-site work. For role-specific review, recruiters can open either the Game UI résumé or Product Design résumé.',links:'resume'},
    {keys:['resume','cv'],answer:'Two focused résumés are available: one for Game UI and Technical UI roles, and one for Product Design roles. Both are linked directly below so a recruiter can review the most relevant profile without searching the site.',links:'resume'},
    {keys:['contact','email','linkedin','connect','reach'],answer:'The fastest way to contact Jaikar is jaikardevgame@gmail.com. Recruiters and collaborators can also connect through LinkedIn. He welcomes conversations about full-time, contract and freelance UI/UX work.',links:'contact'},
    {keys:['process','workflow','how does','approach'],answer:'Jaikar’s process moves from mechanics and requirements to user flows, information hierarchy and prototypes, then into reusable architecture and in-engine implementation. He tests states, scale, overlap, readability, motion and persistence in the running build, and documents what is complete versus what remains.',links:'work'},
    {keys:['best','strongest','recommend','start','portfolio','projects','work'],answer:'For a fast review, start with Fieldnotes for Unity spatial UI/UX, The Dark Arrival for shipped Unreal Engine UI, and Find the Octopus for shipped mobile UI. Together they show spatial interaction, diegetic game systems, technical implementation and production experience.',links:'work'},
    {keys:['product','smart guardian','ux'],answer:'Jaikar’s product UX work includes Smart Guardian, a health and emergency-flow concept focused on fast comprehension, accessible interaction and confident action. His product process covers research framing, flows, wireframes, prototypes, visual systems and handoff.',links:'resume'},
    {keys:['skills','tools','software','capabilities'],answer:'Core capabilities: UX and systems design, visual UI, Technical UI, motion and feedback. Daily tools include Figma, Unreal Engine 5, UMG, Blueprints, Unity, C#, Photoshop, Illustrator, After Effects, Git, Perforce, Jira and Confluence.',links:'work'}
  ];
  const clean=s=>(s||'').toLowerCase().replace(/[^a-z0-9+# ]/g,' ');
  function answer(question){
    const q=clean(question); let best=null,score=0;
    topics.forEach(t=>{let n=0;t.keys.forEach(k=>{if(q.includes(k))n+=k.split(' ').length+1});if(n>score){score=n;best=t}});
    return best||{answer:'I can help you evaluate Jaikar’s fit across Unity, Unreal Engine, spatial UI, game UI/UX, product design, experience, tools, availability, résumés and contact information. Try asking “What is his strongest Unity project?” or “Is he available for Technical UI roles?”',links:'work'};
  }
  function init(){
    if(document.getElementById('jp01-panel')) return;
    document.body.insertAdjacentHTML('beforeend',`
      <button id="jp01-launch" type="button" aria-haspopup="dialog" aria-controls="jp01-panel" aria-expanded="false"><span class="jp-orb"><img src="/Assets/static-ui/jp01-robot-v2.png" alt=""></span><span>Ask JP-01</span><span class="jp-live" aria-hidden="true"></span></button>
      <aside id="jp01-panel" role="dialog" aria-modal="true" aria-labelledby="jp01-title">
        <header class="jp-head"><div class="jp-id"><span class="jp-avatar"><img src="/Assets/static-ui/jp01-robot-v2.png" alt="JP-01 robot assistant"></span><div><div class="jp-name" id="jp01-title">JP-01 / Recruiter Assistant</div><div class="jp-status"><span class="jp-status-dot" aria-hidden="true"></span>PROFILE KNOWLEDGE ONLINE · VERIFIED PORTFOLIO ANSWERS</div></div></div><button class="jp-close" type="button" aria-label="Close JP-01">×</button></header>
        <div class="jp-prompts" aria-label="Suggested questions"><button type="button">Strongest work</button><button type="button">Unity skills</button><button type="button">Fieldnotes</button><button type="button">Availability</button><button type="button">Résumé</button></div>
        <div class="jp-log" aria-live="polite"></div>
        <form class="jp-form"><label class="sr-only" for="jp01-question">Ask about Jaikar</label><input id="jp01-question" autocomplete="off" placeholder="Ask about skills, projects, availability…"><button type="submit">ASK ↵</button><div class="jp-note">Answers use verified portfolio information and link to supporting work.</div></form>
      </aside>`);
    const panel=document.getElementById('jp01-panel'), log=panel.querySelector('.jp-log'), input=panel.querySelector('input');
    function add(text,who='bot',linkKey){
      const box=document.createElement('div');box.className='jp-msg '+who;
      const label=document.createElement('span');label.className='jp-label';label.textContent=who==='bot'?'JP-01':'YOU';box.append(label);
      const copy=document.createElement('div');copy.textContent=text;box.append(copy);
      if(linkKey&&links[linkKey]){const row=document.createElement('div');row.className='jp-links';links[linkKey].forEach(([name,url])=>{const a=document.createElement('a');a.href=url;a.textContent=name;if(!url.startsWith('#')){a.target='_blank';a.rel='noreferrer'}row.append(a)});box.append(row)}
      log.append(box);log.scrollTop=log.scrollHeight;
    }
    function ask(q){if(!q.trim())return;add(q,'user');const result=answer(q);setTimeout(()=>add(result.answer,'bot',result.links),180)}
    add('Hello. I’m JP-01. Ask me about Jaikar’s projects, Unity or Unreal implementation, UI/UX process, experience, availability, résumés or contact details.','bot','work');
    const launcher=document.getElementById('jp01-launch');
    launcher.onclick=()=>{panel.classList.add('open');launcher.setAttribute('aria-expanded','true');input.focus()};
    panel.querySelector('.jp-close').onclick=()=>{panel.classList.remove('open');launcher.setAttribute('aria-expanded','false');launcher.focus()};
    panel.querySelector('form').onsubmit=e=>{e.preventDefault();const q=input.value;input.value='';ask(q)};
    panel.querySelectorAll('.jp-prompts button').forEach(b=>b.onclick=()=>ask(b.textContent));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))panel.querySelector('.jp-close').click()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,900));else setTimeout(init,900);
  setInterval(init,2200);
})();
