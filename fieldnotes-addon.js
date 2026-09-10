(function(){
  function replaceText(root,from,to){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())) if(node.nodeValue&&node.nodeValue.includes(from)) node.nodeValue=node.nodeValue.replaceAll(from,to);
  }
  function init(){
    const work=document.getElementById('work');
    const hero=document.getElementById('top');
    if(!work||!hero) return setTimeout(init,250);

    document.title='Jaikar Pothula — Technical UI/UX Designer | Games, Real-Time UI & Spatial Interfaces';
    document.querySelectorAll('meta[name="description"],meta[property="og:description"]').forEach(m=>m.content='Technical UI/UX Designer creating shipped game interfaces, Unity and Unreal systems, product flows, and spatial-computing prototypes.');

    replaceText(document.body,'Hire me ↗','Contact Jaikar ↗');
    replaceText(document.body,'Technical UI Designer','Technical UI/UX Designer');
    replaceText(document.body,'UI/UX Designer with 2+ years','UI/UX Designer with 3+ years');

    const heroRole=[...hero.querySelectorAll('span')].find(el=>el.textContent.trim()==='Technical UI/UX Designer');
    if(heroRole) heroRole.textContent='Technical UI/UX Designer — Games, Real-Time UI & Spatial Interfaces';
    const heroCopy=[...hero.querySelectorAll('p')].find(el=>el.textContent.includes('player- and user-facing systems'));
    if(heroCopy&&!document.querySelector('.fn-availability')){
      const availability=document.createElement('p');
      availability.className='fn-availability';
      availability.textContent='Available for Game UI/UX, Technical UI, Product UI and spatial-interface opportunities — SF Bay Area, hybrid or remote.';
      heroCopy.after(availability);
      const jump=document.createElement('a');
      jump.className='fn-hero-link'; jump.href='#fieldnotes-feature'; jump.textContent='View Unity spatial work ↓';
      availability.after(jump);
    }

    if(!document.getElementById('fieldnotes-feature')){
      const section=document.createElement('section');
      section.id='fieldnotes-feature';
      section.setAttribute('aria-labelledby','fieldnotes-title');
      section.innerHTML=`
      <div class="fn-shell">
        <div class="fn-kicker">01 / Selected work — First</div>
        <div class="fn-head">
          <h2 class="fn-title" id="fieldnotes-title">Fieldnotes<br><em>in space.</em></h2>
          <div>
            <p class="fn-intro">A visionOS-inspired investigator journal designed and implemented in Unity 3D. The interface brings evidence, object inspection and case-building into one world-space system.</p>
            <div class="fn-chips"><span class="fn-chip">Unity 6.3</span><span class="fn-chip">C#</span><span class="fn-chip">URP</span><span class="fn-chip">World-space UI</span><span class="fn-chip">Spatial UX</span></div>
          </div>
        </div>
        <div class="fn-stage">
          <a class="fn-media" href="/Assets/Fieldnotes/fieldnotes-evidence.png" target="_blank" rel="noreferrer" aria-label="Open the Fieldnotes Unity evidence interface render">
            <img src="/Assets/Fieldnotes/fieldnotes-evidence.png" alt="Fieldnotes world-space investigator journal running in Unity with an inspectable brass key">
          </a>
          <div class="fn-panel">
            <div class="fn-proof-title">Case 004 / The Quiet Observatory</div>
            <h3>Inspect. Connect. Reconstruct.</h3>
            <div class="fn-flow">
              <div class="fn-step"><b>01</b><span>Choose one of three procedural 3D clues.</span></div>
              <div class="fn-step"><b>02</b><span>Rotate, zoom and read evidence in world space.</span></div>
              <div class="fn-step"><b>03</b><span>Save connections and rebuild the case timeline.</span></div>
              <div class="fn-step"><b>04</b><span>Control motion, navigation and persistent state.</span></div>
            </div>
            <div class="fn-actions">
              <a href="/Assets/Fieldnotes/Fieldnotes_Jaikar_Pothula_Case_Study.pdf" target="_blank" rel="noreferrer">Open 10-page case study ↓</a>
              <a href="/Assets/Fieldnotes/fieldnotes-connections.png" target="_blank" rel="noreferrer">View Connections UI ↗</a>
            </div>
          </div>
        </div>
        <div class="fn-proof">
          <div><span class="fn-proof-title">Role</span><strong>Technical UI/UX</strong><p>Direction, interaction design, visual hierarchy and Unity implementation.</p></div>
          <div><span class="fn-proof-title">Working build</span><strong>0 build errors</strong><p>Windows launch and render verified after iterative refinement.</p></div>
          <div><span class="fn-proof-title">System</span><strong>3D + interface</strong><p>Inspectable evidence, Connections, case notes and saved state.</p></div>
          <div><span class="fn-proof-title">Next horizon</span><strong>Native visionOS</strong><p>PolySpatial, gaze and pinch, simulator and headset validation.</p></div>
        </div>
      </div>`;
      work.before(section);
    }

    const workStatus=[...work.querySelectorAll('*')].find(el=>el.children.length===0&&el.textContent.includes('Now showing case study'));
    if(workStatus) workStatus.textContent='Continue with case study 02 of 09: THE DARK ARRIVAL';
    const workLabel=[...work.querySelectorAll('*')].find(el=>el.children.length===0&&el.textContent.includes('SELECTED WORK')&&el.textContent.includes('8'));
    if(workLabel) workLabel.textContent='02 / SELECTED WORK — 8 MORE TITLES';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(init,700));
  else setTimeout(init,700);
  setInterval(init,1800);
})();
