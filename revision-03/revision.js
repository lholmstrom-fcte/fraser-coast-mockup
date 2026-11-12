(() => {
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.immersive-hero');
  const form = document.querySelector('#newsletter-form');
  const status = document.querySelector('#newsletter-status');

  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }, { rootMargin: '-104px 0px 0px 0px' }).observe(hero);

  form.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = 'Signup preview complete. In the live site, this step will subscribe you to Fraser Coast updates. Your details have stayed in this browser.';
    status.hidden = false;
    form.reset();
  });
})();
