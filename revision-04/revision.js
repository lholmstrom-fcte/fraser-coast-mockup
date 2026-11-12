(() => {
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.immersive-hero');
  const chatLauncher = document.querySelector('.chat-launcher');
  const form = document.querySelector('#newsletter-form');
  const status = document.querySelector('#newsletter-status');

  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }, { rootMargin: '-104px 0px 0px 0px' }).observe(hero);

  new IntersectionObserver(([entry]) => {
    const pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
    chatLauncher.classList.toggle('is-visible', pastHero);
  }).observe(hero);

  form.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = 'Signup preview complete. In the live site, this step will subscribe you to Fraser Coast updates. Your details have stayed in this browser.';
    status.hidden = false;
    form.reset();
  });
})();
