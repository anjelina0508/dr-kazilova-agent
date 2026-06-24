const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'site', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS styles for diploms section (before </style>)
const diplomsCSS = `
  /* Diploms section */
  #diploms { background: var(--bg2); }
  .diploms-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 48px;
  }
  .diplom-thumb {
    aspect-ratio: 4/3;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid var(--border);
    transition: border-color 0.3s, transform 0.3s;
    background: var(--bg3);
  }
  .diplom-thumb:hover { border-color: var(--gold); transform: scale(1.02); }
  .diplom-thumb img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center;
    display: block; transition: opacity 0.3s;
  }
  .diplom-thumb:hover img { opacity: 0.85; }

  /* Lightbox */
  #diplom-lightbox {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.92); z-index: 9999;
    align-items: center; justify-content: center;
    flex-direction: column;
  }
  #diplom-lightbox.open { display: flex; }
  #diplom-lightbox img {
    max-width: 88vw; max-height: 82vh;
    object-fit: contain; border: 1px solid var(--border);
  }
  .dlb-close {
    position: absolute; top: 20px; right: 28px;
    font-size: 32px; color: var(--text-muted);
    background: none; border: none; cursor: pointer;
    line-height: 1; transition: color 0.2s;
  }
  .dlb-close:hover { color: var(--gold); }
  .dlb-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    font-size: 36px; color: var(--text-muted);
    background: none; border: none; cursor: pointer;
    padding: 12px; transition: color 0.2s; z-index: 1;
  }
  .dlb-nav:hover { color: var(--gold); }
  .dlb-prev { left: 16px; }
  .dlb-next { right: 16px; }
  .dlb-counter {
    margin-top: 16px; font-size: 12px;
    letter-spacing: 0.15em; color: var(--text-muted);
  }

  @media (max-width: 900px) {
    .diploms-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 600px) {
    .diploms-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    #diplom-lightbox img { max-width: 96vw; max-height: 75vh; }
  }
`;

html = html.replace('</style>', diplomsCSS + '\n</style>');

// 2. Add nav link (after "Обо мне", before "Услуги")
html = html.replace(
  '<li><a href="#about">Обо мне</a></li>\n    <li><a href="#services">Услуги</a></li>',
  '<li><a href="#about">Обо мне</a></li>\n    <li><a href="#diploms">Дипломы</a></li>\n    <li><a href="#services">Услуги</a></li>'
);

// 3. Build diploms section HTML
const docs = [
  { file: 'doc_0.jpg', label: 'Диплом ординатуры — Пластическая хирургия' },
  { file: 'doc_1.jpg', label: 'Диплом врача-педиатра' },
  { file: 'doc_2.jpg', label: 'Сертификат специалиста 2018' },
  { file: 'doc_3.jpg', label: 'Сертификат специалиста — Хирургия 2016' },
  { file: 'doc_4.jpg', label: 'Удостоверение о повышении квалификации' },
  { file: 'doc_5.jpg', label: 'Диплом ординатуры — Хирургия' },
  { file: 'doc_6.jpg', label: 'Приложение к диплому о переподготовке' },
  { file: 'doc_7.jpg', label: 'Приложение к диплому о переподготовке' },
  { file: 'doc_8.jpg', label: 'Диплом — Педиатрия' },
  { file: 'doc_9.jpg', label: 'Сертификат специалиста — Пластическая хирургия 2018' },
  { file: 'doc_10.jpg', label: 'Сертификат специалиста — Хирургия 2016' },
];

const thumbsHtml = docs.map((d, i) =>
  `      <div class="diplom-thumb reveal" onclick="openDiplomLightbox(${i})" title="${d.label}">
        <img src="img/diploms/${d.file}" alt="${d.label}" loading="lazy">
      </div>`
).join('\n');

const imagesJson = JSON.stringify(docs.map(d => ({ src: `img/diploms/${d.file}`, label: d.label })));

const diplomsSection = `
<section id="diploms">
  <div class="section-label">Дипломы и сертификаты</div>
  <h2>Образование<br><em style="font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold-light)">и квалификация</em></h2>
  <div class="gold-line"></div>
  <div class="diploms-grid">
${thumbsHtml}
  </div>
</section>

<div id="diplom-lightbox" role="dialog" aria-modal="true">
  <button class="dlb-close" onclick="closeDiplomLightbox()" aria-label="Закрыть">&#10005;</button>
  <button class="dlb-nav dlb-prev" onclick="moveDiplom(-1)" aria-label="Назад">&#8592;</button>
  <img id="dlb-img" src="" alt="">
  <div class="dlb-counter" id="dlb-counter"></div>
  <button class="dlb-nav dlb-next" onclick="moveDiplom(1)" aria-label="Вперёд">&#8594;</button>
</div>

<script>
(function() {
  var dlbDocs = ${imagesJson};
  var dlbIdx = 0;

  window.openDiplomLightbox = function(i) {
    dlbIdx = i;
    showDiplom();
    document.getElementById('diplom-lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeDiplomLightbox = function() {
    document.getElementById('diplom-lightbox').classList.remove('open');
    document.body.style.overflow = '';
  };
  window.moveDiplom = function(dir) {
    dlbIdx = (dlbIdx + dir + dlbDocs.length) % dlbDocs.length;
    showDiplom();
  };
  function showDiplom() {
    document.getElementById('dlb-img').src = dlbDocs[dlbIdx].src;
    document.getElementById('dlb-img').alt = dlbDocs[dlbIdx].label;
    document.getElementById('dlb-counter').textContent = (dlbIdx + 1) + ' / ' + dlbDocs.length;
  }
  document.addEventListener('keydown', function(e) {
    var lb = document.getElementById('diplom-lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeDiplomLightbox();
    if (e.key === 'ArrowLeft') moveDiplom(-1);
    if (e.key === 'ArrowRight') moveDiplom(1);
  });
  document.getElementById('diplom-lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeDiplomLightbox();
  });
})();
</script>
`;

// 4. Insert section between </section> (about) and <section id="services">
html = html.replace(
  '</section>\n\n<section id="services">',
  '</section>\n' + diplomsSection + '\n<section id="services">'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Дипломы добавлены!');
