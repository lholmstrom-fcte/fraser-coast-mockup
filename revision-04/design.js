(() => {
 const nav=document.getElementById('primary-nav'),toggle=document.getElementById('mobile-toggle');
 const triggers=[...document.querySelectorAll('.nav-trigger')];
 const panelAnimations = new WeakMap();
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

 function set(button, open) {
   if ((button.getAttribute('aria-expanded') === 'true') === open) return;
   const panel = document.getElementById(button.getAttribute('aria-controls'));
   const previousAnimation = panelAnimations.get(panel);
   const currentStyle = getComputedStyle(panel);
   const from = panel.hidden
     ? { opacity: 0, transform: 'translateY(-14px) scaleY(.98)' }
     : { opacity: currentStyle.opacity, transform: currentStyle.transform };
   previousAnimation?.cancel();
   button.setAttribute('aria-expanded', String(open));
   panel.inert = !open;
   panel.classList.toggle('is-opening', open);

   if (reducedMotion.matches) {
     panel.hidden = !open;
     panelAnimations.delete(panel);
     return;
   }

   panel.hidden = false;
   const to = open
     ? { opacity: 1, transform: 'translateY(0) scaleY(1)' }
     : { opacity: 0, transform: 'translateY(-8px) scaleY(.99)' };
   const animation = panel.animate([from, to], {
     duration: open ? 380 : 150,
     easing: open ? 'cubic-bezier(.16, 1, .3, 1)' : 'cubic-bezier(.4, 0, 1, 1)',
   });
   panelAnimations.set(panel, animation);
   animation.onfinish = () => {
     if (panelAnimations.get(panel) !== animation) return;
     panel.hidden = !open;
     panelAnimations.delete(panel);
   };
 }
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
