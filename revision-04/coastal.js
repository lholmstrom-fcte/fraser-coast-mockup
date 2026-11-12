(() => {
 const buttons = [...document.querySelectorAll('[data-coast-filter]')];
 const cards = [...document.querySelectorAll('.coastal-card')];
 buttons.forEach(button => button.addEventListener('click', () => {
   const filter = button.dataset.coastFilter;
   buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
   cards.forEach(card => { card.hidden = filter !== 'all' && !card.dataset.activities.split(' ').includes(filter); });
   const count = cards.filter(card => !card.hidden).length;
   document.querySelector('#coast-count').textContent = `${count} coastal ${count === 1 ? 'stop' : 'stops'} to explore`;
 }));
})();
