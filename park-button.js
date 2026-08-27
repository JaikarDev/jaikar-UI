(function () {
  const id = "jaikar-park-entry";
  if (document.getElementById(id)) return;

  const link = document.createElement("a");
  link.id = id;
  link.href = "/world/";
  link.setAttribute("aria-label", "Enter Jaikar Park, the 3D walkable portfolio");
  link.innerHTML = "<span>ENTER JAIKAR PARK</span><em>3D WALKABLE PORTFOLIO</em>";

  const style = document.createElement("style");
  style.textContent = `
    #${id}{
      position:fixed;
      right:1.25rem;
      bottom:6.2rem;
      z-index:79;
      display:inline-flex;
      flex-direction:column;
      gap:.24rem;
      min-width:13.5rem;
      padding:.92rem 1.15rem;
      border:1px solid color-mix(in oklab, var(--foreground, #f6f6f6) 38%, transparent);
      background:color-mix(in oklab, var(--background, #050505) 90%, transparent);
      color:var(--foreground, #f6f6f6);
      text-decoration:none;
      font-family:"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      text-transform:uppercase;
      letter-spacing:.16em;
      line-height:1;
      box-shadow:0 12px 32px rgba(0,0,0,.28);
      backdrop-filter:blur(10px);
      transition:background .22s ease, color .22s ease, border-color .22s ease, transform .22s ease;
    }
    #${id} span{font-size:.72rem;font-weight:700;}
    #${id} em{font-size:.52rem;font-style:normal;letter-spacing:.2em;opacity:.62;}
    #${id}:hover{
      transform:translateY(-2px);
      border-color:var(--foreground, #f6f6f6);
      background:var(--foreground, #f6f6f6);
      color:var(--background, #050505);
    }
    #${id}:focus-visible{outline:2px dashed currentColor;outline-offset:4px;}
    @media (max-width: 640px){
      #${id}{
        left:1rem;
        right:auto;
        bottom:5.7rem;
        min-width:0;
        max-width:calc(100vw - 2rem);
        padding:.82rem .95rem;
      }
      #${id} span{font-size:.64rem;}
      #${id} em{font-size:.48rem;}
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(link);
})();
