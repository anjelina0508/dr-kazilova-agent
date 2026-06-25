const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'site', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace the bulky diploms-grid CSS with minimal styles
html = html.replace(
  `  /* Diploms section */
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
  .diplom-thumb:hover img { opacity: 0.85; }`,
  `  /* Diploms section */
  #diploms { background: var(--bg2); }
  .diploms-open-btn {
    display: inline-flex; align-items: center; gap: 12px;
    margin-top: 40px;
    padding: 14px 32px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    font-family: 'Montserrat', sans-serif;
    font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; transition: border-color 0.3s, color 0.3s;
  }
  .diploms-open-btn:hover { border-color: var(--gold); color: var(--gold); }
  .diploms-open-btn svg { width: 16px; height: 16px; opacity: 0.6; transition: opacity 0.3s; }
  .diploms-open-btn:hover svg { opacity: 1; }`
);

// Replace the grid HTML with a single button
html = html.replace(
  /  <div class="diploms-grid">\n[\s\S]*?  <\/div>\n<\/section>\n\n<div id="diplom-lightbox"/,
  `  <button class="diploms-open-btn" onclick="openDiplomLightbox(0)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/><path d="M13 3v6h6"/></svg>
    Дипломы и сертификаты — 11 документов
  </button>
</section>

<div id="diplom-lightbox"`
);

// Fix media query - remove diploms-grid references
html = html.replace(
  `  @media (max-width: 900px) {
    .diploms-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 600px) {
    .diploms-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    #diplom-lightbox img { max-width: 96vw; max-height: 75vh; }
  }`,
  `  @media (max-width: 600px) {
    #diplom-lightbox img { max-width: 96vw; max-height: 75vh; }
  }`
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Дипломы — минималистичный вид готов');
