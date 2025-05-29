const el = document.getElementById('flutuante');
let isDragging = false;
let offsetX, offsetY;

el.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - el.offsetLeft;
  offsetY = e.clientY - el.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Limites da janela
    const maxLeft = window.innerWidth - el.offsetWidth;
    const maxTop = window.innerHeight - el.offsetHeight;

    // Restringir dentro da janela
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    el.style.left = newLeft + 'px';
    el.style.top = newTop + 'px';
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
