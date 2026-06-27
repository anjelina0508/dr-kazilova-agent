const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'site', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// ── 1. CSS для дисклеймера, чекбокса и модала политики ─────────────────────
const legalCss = `
  /* LEGAL */
  .disclaimer {
    font-size: 11px;
    color: var(--text-muted);
    text-align: center;
    letter-spacing: 0.08em;
    line-height: 1.7;
    padding: 16px 24px;
    border-top: 1px solid rgba(196,184,172,0.15);
    margin-top: 12px;
  }
  .form-consent {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.6;
  }
  .form-consent input[type="checkbox"] {
    flex-shrink: 0;
    margin-top: 2px;
    accent-color: var(--gold);
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .form-consent a { color: var(--gold); text-decoration: none; border-bottom: 1px solid rgba(196,184,172,0.3); }
  .form-consent a:hover { border-bottom-color: var(--gold); }
  .privacy-modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 9999;
    overflow-y: auto;
    padding: 40px 20px;
  }
  .privacy-modal.open { display: flex; align-items: flex-start; justify-content: center; }
  .privacy-box {
    background: #1a1a18;
    border: 1px solid rgba(196,184,172,0.2);
    border-radius: 4px;
    max-width: 720px;
    width: 100%;
    padding: 48px;
    position: relative;
  }
  .privacy-box h2 { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--gold-light); margin-bottom: 24px; }
  .privacy-box h3 { font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin: 24px 0 8px; }
  .privacy-box p, .privacy-box li { font-size: 13px; color: var(--text-muted); line-height: 1.8; margin-bottom: 8px; }
  .privacy-box ul { padding-left: 20px; }
  .privacy-close {
    position: absolute;
    top: 20px; right: 24px;
    background: none; border: none;
    color: var(--text-muted); font-size: 24px;
    cursor: pointer; line-height: 1;
  }
  .privacy-close:hover { color: var(--gold); }
  .footer-legal-link { font-size: 11px; color: var(--text-muted); cursor: pointer; border-bottom: 1px solid rgba(196,184,172,0.3); background: none; border-top: none; border-left: none; border-right: none; padding: 0; font-family: inherit; letter-spacing: 0.1em; }
  .footer-legal-link:hover { color: var(--gold); }
`;

html = html.replace('</style>', legalCss + '\n</style>');

// ── 2. Убрать Instagram (Meta запрещена в РФ) ───────────────────────────────
html = html.replace(
  `<a class="social-link" href="#" title="Instagram">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    </a>`,
  ''
);

// ── 3. Исправить опции формы (убрать процедуры на лице) ────────────────────
html = html.replace(
  `<option>Подтяжка лица</option>
              <option>Отопластика</option>
              <option>Контурная пластика</option>`,
  `<option>Блефаропластика</option>
              <option>Броулифт</option>
              <option>Удаление комков Биша</option>`
);

// ── 4. Чекбокс согласия перед кнопкой отправки ─────────────────────────────
html = html.replace(
  `<button type="submit" class="form-submit">Отправить заявку</button>`,
  `<label class="form-consent">
          <input type="checkbox" required id="consent-check">
          <span>Нажимая кнопку, я соглашаюсь на <button type="button" class="footer-legal-link" onclick="document.getElementById('privacy-modal').classList.add('open')">обработку персональных данных</button> в соответствии с 152-ФЗ</span>
        </label>
        <button type="submit" class="form-submit">Отправить заявку</button>`
);

// ── 5. Дисклеймер о противопоказаниях в футере ─────────────────────────────
html = html.replace(
  `<footer>
  <div class="footer-name">Казилова Муминат Ахмедовна</div>
  <div class="footer-copy">© 2025 · Пластическая хирургия</div>`,
  `<footer>
  <div class="footer-name">Казилова Муминат Ахмедовна</div>
  <div class="footer-copy">© 2025 · Пластическая хирургия</div>`
);

// Добавляем дисклеймер и ссылку на политику в конец футера
html = html.replace(
  `</footer>`,
  `  <div class="disclaimer">
    Имеются противопоказания. Необходима консультация специалиста.<br>
    <button type="button" class="footer-legal-link" onclick="document.getElementById('privacy-modal').classList.add('open')">Политика конфиденциальности</button>
  </div>
</footer>`
);

// ── 6. Модал политики конфиденциальности ───────────────────────────────────
const privacyModal = `
<div class="privacy-modal" id="privacy-modal">
  <div class="privacy-box">
    <button class="privacy-close" onclick="document.getElementById('privacy-modal').classList.remove('open')">&times;</button>
    <h2>Политика конфиденциальности</h2>

    <h3>1. Общие положения</h3>
    <p>Настоящая политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта доктора Казиловой Муминат Ахмедовны (далее — Оператор) в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</p>
    <p>Реквизиты Оператора: <em>[ИНН / ОГРН / наименование ИП — будет добавлено]</em></p>

    <h3>2. Какие данные мы собираем</h3>
    <ul>
      <li>Имя и фамилия</li>
      <li>Номер телефона</li>
      <li>Адрес электронной почты (если указан)</li>
    </ul>

    <h3>3. Цели обработки</h3>
    <p>Данные используются исключительно для связи с пациентом, записи на консультацию и предоставления информации об услугах клиники. Данные не передаются третьим лицам.</p>

    <h3>4. Хранение и защита данных</h3>
    <p>Персональные данные хранятся на защищённых серверах и не передаются третьим лицам без согласия субъекта, за исключением случаев, предусмотренных законодательством РФ.</p>

    <h3>5. Права пользователя</h3>
    <p>Вы вправе запросить изменение, уточнение или удаление своих персональных данных, обратившись по контакту: <a href="https://t.me/kazilova" style="color:var(--gold)">@kazilova</a> или WhatsApp +7 (999) 516-03-89.</p>

    <h3>6. Срок хранения</h3>
    <p>Персональные данные хранятся не дольше, чем этого требуют цели обработки, но не более 3 лет.</p>

    <h3>7. Согласие</h3>
    <p>Отправляя форму на сайте, вы подтверждаете своё согласие на обработку персональных данных на условиях настоящей политики.</p>
  </div>
</div>

<script>
  // Закрытие модала по клику на фон
  document.getElementById('privacy-modal').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') document.getElementById('privacy-modal').classList.remove('open');
  });
</script>
`;

html = html.replace('<div class="toast"', privacyModal + '\n<div class="toast"');

fs.writeFileSync(filePath, html, 'utf8');
console.log('✓ Юридические правки применены:');
console.log('  - Дисклеймер о противопоказаниях в футере');
console.log('  - Политика конфиденциальности (модал)');
console.log('  - Чекбокс согласия в форме');
console.log('  - Instagram убран');
console.log('  - Опции формы исправлены (убраны процедуры на лице)');
