// 1. Находим элементы на странице
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file');
const topInput = document.getElementById('top');
const bottomInput = document.getElementById('bottom');
const sizeInput = document.getElementById('size');
const bgInput = document.getElementById('bg');
const fillInput = document.getElementById('fill');

let img = null; // загруженная картинка (или null)

// 2. Разбиваем длинный текст на строки, чтобы он влезал по ширине
function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// 3. Рисуем текст с чёрной обводкой (классический мемный стиль)
function drawText(text, position) {
  if (!text.trim()) return;
  const fontSize = canvas.width * sizeInput.value / 100;
  ctx.font = `${fontSize}px Impact, "Arial Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.lineJoin = 'round';
  ctx.lineWidth = fontSize / 6;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = fillInput.value;

  const lines = wrapText(text.toUpperCase(), canvas.width * 0.92);
  const lineHeight = fontSize * 1.1;
  const margin = fontSize * 0.4;

  lines.forEach((line, i) => {
    const y = position === 'top'
      ? margin + fontSize + i * lineHeight
      : canvas.height - margin - (lines.length - 1 - i) * lineHeight;
    ctx.strokeText(line, canvas.width / 2, y);
    ctx.fillText(line, canvas.width / 2, y);
  });
}

// 4. Главная функция: перерисовывает весь мем с нуля
function render() {
  if (img) {
    // подгоняем размер холста под картинку (не шире 700px)
    const scale = Math.min(1, 700 / img.width);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    canvas.width = 700;
    canvas.height = 700;
    ctx.fillStyle = bgInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  drawText(topInput.value, 'top');
  drawText(bottomInput.value, 'bottom');
}

// 5. Загрузка картинки с компьютера
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => { img = image; render(); };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// 6. Любое изменение настроек — сразу перерисовываем
[topInput, bottomInput, sizeInput, bgInput, fillInput].forEach(el =>
  el.addEventListener('input', render)
);

// 7. Кнопка «Убрать картинку»
document.getElementById('reset').addEventListener('click', () => {
  img = null;
  fileInput.value = '';
  render();
});

// 8. Скачивание готового мема как PNG
document.getElementById('download').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

render(); // первая отрисовка при открытии страницы
