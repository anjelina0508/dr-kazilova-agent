const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'site', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS for stats strip
const statsCSS = `
  /* Stats strip */
  #stats-strip {
    background: var(--bg3);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 56px 48px;
  }
  .stats-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
    max-width: 860px;
    margin: 0 auto;
  }
  .stat-item {
    flex: 1;
    text-align: center;
    padding: 0 40px;
    position: relative;
  }
  .stat-item + .stat-item::before {
    content: '';
    position: absolute; left: 0; top: 50%;
    transform: translateY(-50%);
    width: 1px; height: 48px;
    background: var(--border);
  }
  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px; font-weight: 300;
    color: var(--gold-light);
    line-height: 1;
    letter-spacing: -0.01em;
  }
  .stat-label {
    margin-top: 8px;
    font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  @media (max-width: 600px) {
    #stats-strip { padding: 40px 20px; }
    .stats-row { gap: 0; }
    .stat-item { padding: 0 16px; }
    .stat-num { font-size: 36px; }
    .stat-label { font-size: 9px; letter-spacing: 0.14em; }
  }
`;

html = html.replace('</style>', statsCSS + '\n</style>');

// 2. Insert stats strip between hero and about
const statsHTML = `
<section id="stats-strip">
  <div class="stats-row">
    <div class="stat-item reveal">
      <div class="stat-num">12+</div>
      <div class="stat-label">лет опыта</div>
    </div>
    <div class="stat-item reveal">
      <div class="stat-num">9</div>
      <div class="stat-label">направлений работы</div>
    </div>
    <div class="stat-item reveal">
      <div class="stat-num">1000+</div>
      <div class="stat-label">успешных операций</div>
    </div>
  </div>
</section>
`;

html = html.replace(
  '</section>\n\n<section id="about">',
  '</section>\n' + statsHTML + '\n<section id="about">'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Полоса с цифрами добавлена');
