(() => {
  const map = document.querySelector('.homepage-map');
  const viewport = map.querySelector('.map-viewport');
  const canvas = viewport.querySelector('canvas');
  const context = canvas.getContext('2d');
  const pins = [...map.querySelectorAll('.map-pin')];
  const placeButtons = [...map.querySelectorAll('[data-place]')];
  const details = [...map.querySelectorAll('[data-place-details]')];
  const zoomIn = map.querySelector('[data-map-action="zoom-in"]');
  const zoomOut = map.querySelector('[data-map-action="zoom-out"]');
  const reset = map.querySelector('[data-map-action="reset"]');
  const { bounds, land } = fraserCoastMapData;
  const maxZoom = 3;
  let zoom = 1;
  let left = 0;
  let top = 0;
  let drag = null;

  function project(lng, lat) {
    return [(lng - bounds.west) / (bounds.east - bounds.west), (bounds.north - lat) / (bounds.north - bounds.south)];
  }

  const coastline = new Path2D();
  for (const polygon of land) {
    for (const ring of polygon) {
      const [first, ...rest] = ring;
      coastline.moveTo(...project(...first));
      for (const point of rest) coastline.lineTo(...project(...point));
      coastline.closePath();
    }
  }

  const points = new Map(pins.map(pin => [pin.dataset.place, project(Number(pin.dataset.lng), Number(pin.dataset.lat))]));

  function draw() {
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    const density = window.devicePixelRatio || 1;
    const pixelWidth = Math.round(width * density);
    const pixelHeight = Math.round(height * density);
    left = Math.min(0, Math.max(width * (1 - zoom), left));
    top = Math.min(0, Math.max(height * (1 - zoom), top));

    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    const styles = getComputedStyle(viewport);
    context.resetTransform();
    context.fillStyle = styles.getPropertyValue('--map-water');
    context.fillRect(0, 0, pixelWidth, pixelHeight);
    context.setTransform(pixelWidth * zoom, 0, 0, pixelHeight * zoom, left * density, top * density);
    context.fillStyle = styles.getPropertyValue('--map-land');
    context.fill(coastline, 'evenodd');

    for (const pin of pins) {
      const [x, y] = points.get(pin.dataset.place);
      const screenX = left + x * width * zoom;
      const screenY = top + y * height * zoom;
      pin.style.left = `${screenX}px`;
      pin.style.top = `${screenY}px`;
      pin.hidden = screenX < 18 || screenX > width - 18 || screenY < 18 || screenY > height - 18;
    }
    viewport.classList.toggle('is-zoomed', zoom > 1);
    zoomIn.disabled = zoom === maxZoom;
    zoomOut.disabled = zoom === 1;
    reset.disabled = zoom === 1;
  }

  function changeZoom(nextZoom) {
    const ratio = nextZoom / zoom;
    const centreX = viewport.clientWidth / 2;
    const centreY = viewport.clientHeight / 2;
    left = centreX - (centreX - left) * ratio;
    top = centreY - (centreY - top) * ratio;
    zoom = nextZoom;
    draw();
  }

  for (const button of placeButtons) {
    button.addEventListener('click', () => {
      const place = button.dataset.place;
      for (const peer of placeButtons) peer.setAttribute('aria-pressed', String(peer.dataset.place === place));
      for (const item of details) item.hidden = item.dataset.placeDetails !== place;
      const pin = pins.find(marker => marker.dataset.place === place);
      if (pin.hidden) {
        const [x, y] = points.get(place);
        left = viewport.clientWidth * (0.5 - x * zoom);
        top = viewport.clientHeight * (0.5 - y * zoom);
        draw();
      }
    });
  }

  zoomIn.addEventListener('click', () => changeZoom(Math.min(maxZoom, zoom + 0.5)));
  zoomOut.addEventListener('click', () => changeZoom(Math.max(1, zoom - 0.5)));
  reset.addEventListener('click', () => {
    changeZoom(1);
    zoomIn.focus();
  });

  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport || zoom === 1) return;
    const directions = { ArrowLeft: [48, 0], ArrowRight: [-48, 0], ArrowUp: [0, 48], ArrowDown: [0, -48] };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    left += direction[0];
    top += direction[1];
    draw();
  });

  canvas.addEventListener('pointerdown', event => {
    if (zoom === 1 || !event.isPrimary || event.button !== 0) return;
    drag = { x: event.clientX, y: event.clientY, left, top };
    canvas.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', event => {
    if (!drag || !canvas.hasPointerCapture(event.pointerId)) return;
    left = drag.left + event.clientX - drag.x;
    top = drag.top + event.clientY - drag.y;
    draw();
  });
  canvas.addEventListener('lostpointercapture', () => {
    drag = null;
    viewport.classList.remove('is-dragging');
  });

  new ResizeObserver(draw).observe(viewport);
  new MutationObserver(draw).observe(document.documentElement, { attributeFilter: ['data-theme'] });
  draw();
})();
