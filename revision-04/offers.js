(() => {
 const dialog = document.querySelector('#offers-popup');
 const key = 'fraser-revision04-offers-seen';
 let suppressed = false;
 try { suppressed = sessionStorage.getItem(key) === 'true'; } catch {}
 const remember = () => { suppressed = true; try { sessionStorage.setItem(key, 'true'); } catch {} };
 dialog.addEventListener('close', remember);
 document.querySelector('#newsletter-form').addEventListener('submit', remember);
 document.querySelector('#offers-form').addEventListener('submit', event => {
   event.preventDefault();
   remember();
   const status = document.querySelector('#offers-status');
   status.textContent = 'Thanks for trying the preview. No subscription has been created and your details have not been sent.';
   status.hidden = false;
   event.currentTarget.reset();
 });
 const showWhenReady = () => {
   if (suppressed) return;
   const busy = document.hidden || document.querySelector('dialog[open], .nav-trigger[aria-expanded="true"], #mobile-toggle[aria-expanded="true"]') || document.activeElement?.matches('input, textarea, select');
   if (busy) { setTimeout(showWhenReady, 1000); return; }
   dialog.showModal();
   remember();
 };
 setTimeout(showWhenReady, 45000);
})();
