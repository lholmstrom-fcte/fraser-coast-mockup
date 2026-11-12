(() => {
  const section = document.querySelector('#road-trips');
  const buttons = [...section.querySelectorAll('[data-direction]')];
  const route = section.querySelector('.road-line');
  const points = [...route.children];
  const stops = section.querySelector('.road-stops');
  const cards = [...stops.children];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  buttons.forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    const north = button.dataset.direction === 'north';
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    route.append(...(north ? points : [...points].reverse()));
    stops.append(...(north ? cards : [...cards].reverse()));
    section.querySelector('#road-summary').textContent = `${north ? 'Gympie to Bundaberg' : 'Bundaberg to Gympie'} · discover the Fraser Coast along the way`;
    [...stops.children].forEach((card, index) => {
      const label = card.querySelector('.road-number');
      label.textContent = label.textContent.replace(/^\d+/, String(index + 1).padStart(2, '0'));
    });
    if (!motion.matches) {
      for (const element of [route, stops]) {
        element.getAnimations().forEach(animation => animation.cancel());
        element.animate([{ opacity: .35, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' });
      }
    }
  }));
})();
