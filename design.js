(() => {
 const nav=document.getElementById('primary-nav'),toggle=document.getElementById('mobile-toggle');
 const triggers=[...document.querySelectorAll('.nav-trigger')];
 function set(b,open){b.setAttribute('aria-expanded',String(open));document.getElementById(b.getAttribute('aria-controls')).hidden=!open;}
 function closePanels(){triggers.forEach(b=>set(b,false));}
 function closeMobile(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');document.body.style.overflow='';closePanels();}
 triggers.forEach(b=>b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')!=='true';closePanels();set(b,open);}));
 toggle.addEventListener('click',()=>{const open=!nav.classList.contains('open');if(!open){closeMobile();return;}nav.classList.add('open');toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close menu');document.body.style.overflow='hidden';});
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('.site-header')){closePanels();if(nav.classList.contains('open'))closeMobile();}});
 nav.addEventListener('focusout',e=>{if(!nav.classList.contains('open')&&e.relatedTarget&&!nav.contains(e.relatedTarget))closePanels();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const active=triggers.find(b=>b.getAttribute('aria-expanded')==='true');if(nav.classList.contains('open')){closeMobile();toggle.focus();}else{closePanels();active?.focus();}}
 if(e.key==='Tab'&&nav.classList.contains('open')){const items=[toggle,...nav.querySelectorAll('button,a')].filter(n=>n.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 window.addEventListener('resize',()=>{if(innerWidth>900)closeMobile();});
 document.getElementById('theme-toggle').addEventListener('click',e=>{const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';e.currentTarget.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');});
 document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{closeMobile();document.getElementById(b.dataset.open).showModal();}));
 document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
 document.getElementById('interest').addEventListener('change',e=>{document.getElementById('planner-result').href='https://visitfrasercoast-com-git-dev-fcte.vercel.app'+e.target.value;});
})();
