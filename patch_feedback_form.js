const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'site', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// ── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  /* FEEDBACK SECTION */
  #feedback-cta {
    background: var(--bg2);
    padding: 80px 40px;
    text-align: center;
    border-top: 1px solid rgba(196,184,172,0.1);
  }
  #feedback-cta .section-tag { margin-bottom: 16px; }
  #feedback-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 4vw, 42px); font-weight: 300; margin-bottom: 16px; }
  #feedback-cta p { color: var(--text-muted); font-size: 14px; line-height: 1.8; max-width: 480px; margin: 0 auto 36px; }
  .btn-feedback {
    display: inline-block;
    padding: 16px 48px;
    border: 1px solid var(--gold);
    color: var(--gold);
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    background: transparent;
    font-family: inherit;
    transition: all 0.3s;
  }
  .btn-feedback:hover { background: var(--gold); color: #0f0f0d; }

  /* FEEDBACK MODAL */
  .feedback-modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.9);
    z-index: 9998;
    overflow-y: auto;
    padding: 40px 20px;
  }
  .feedback-modal.open { display: flex; align-items: flex-start; justify-content: center; }
  .feedback-box {
    background: #141412;
    border: 1px solid rgba(196,184,172,0.15);
    max-width: 680px;
    width: 100%;
    padding: 56px 48px;
    position: relative;
  }
  @media(max-width:600px){ .feedback-box { padding: 40px 24px; } }
  .feedback-box .modal-close {
    position: absolute; top: 20px; right: 24px;
    background: none; border: none; color: var(--text-muted);
    font-size: 24px; cursor: pointer; line-height: 1;
  }
  .feedback-box .modal-close:hover { color: var(--gold); }
  .feedback-header { text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid rgba(196,184,172,0.15); }
  .feedback-header .clinic-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--gold-light); letter-spacing: 0.05em; }
  .feedback-header .form-title { font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-top: 6px; }

  .fb-section { margin-bottom: 32px; }
  .fb-section + .fb-section { border-top: 1px solid rgba(196,184,172,0.08); padding-top: 32px; }
  .fb-num { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; }
  .fb-question { font-size: 14px; font-weight: 400; color: var(--text-light); margin-bottom: 14px; line-height: 1.6; }

  .fb-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
  .fb-option { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .fb-option input[type="radio"], .fb-option input[type="checkbox"] { display: none; }
  .fb-box {
    width: 16px; height: 16px; flex-shrink: 0;
    border: 1px solid rgba(196,184,172,0.35);
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s;
  }
  .fb-option:hover .fb-box { border-color: var(--gold); }
  .fb-option input:checked + .fb-box { border-color: var(--gold); background: var(--gold); }
  .fb-option input:checked + .fb-box::after { content: ''; width: 6px; height: 6px; background: #0f0f0d; }
  .fb-label { font-size: 13px; color: var(--text-muted); }

  .fb-write { margin-top: 16px; }
  .fb-write .fb-question { font-size: 13px; margin-bottom: 10px; }
  .fb-lines { display: flex; flex-direction: column; gap: 0; }
  .fb-line {
    height: 40px;
    border-bottom: 1px solid rgba(196,184,172,0.2);
    width: 100%;
    background: transparent;
    border-top: none; border-left: none; border-right: none;
    color: var(--text-light);
    font-family: inherit;
    font-size: 13px;
    outline: none;
    padding: 0 4px;
  }
  .fb-line:focus { border-bottom-color: var(--gold); }
  .fb-line::placeholder { color: rgba(196,184,172,0.25); font-size: 12px; }

  .fb-consent-block {
    background: rgba(196,184,172,0.04);
    border: 1px solid rgba(196,184,172,0.1);
    padding: 16px;
    margin-top: 12px;
  }
  .fb-submit {
    width: 100%;
    padding: 18px;
    background: var(--gold);
    color: #0f0f0d;
    border: none;
    font-family: inherit;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 32px;
    transition: background 0.3s;
  }
  .fb-submit:hover { background: var(--gold-light); }
  .fb-success {
    display: none;
    text-align: center;
    padding: 40px 0;
  }
  .fb-success .fb-check { font-size: 36px; color: var(--gold); margin-bottom: 16px; }
  .fb-success h3 { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300; margin-bottom: 12px; }
  .fb-success p { color: var(--text-muted); font-size: 13px; }
`;

html = html.replace('</style>', css + '\n</style>');

// ── Секция с кнопкой перед футером ──────────────────────────────────────────
const feedbackSection = `
<section id="feedback-cta">
  <div class="section-tag">Ваше мнение</div>
  <h2>Расскажите о вашем опыте</h2>
  <p>Каждый отзыв помогает нам становиться лучше и помогает другим пациентам сделать правильный выбор.</p>
  <button class="btn-feedback" onclick="document.getElementById('feedback-modal').classList.add('open')">
    Оставить отзыв
  </button>
</section>
`;

html = html.replace('<footer>', feedbackSection + '\n<footer>');

// ── Модал с анкетой ──────────────────────────────────────────────────────────
const feedbackModal = `
<div class="feedback-modal" id="feedback-modal">
  <div class="feedback-box">
    <button class="modal-close" onclick="document.getElementById('feedback-modal').classList.remove('open')">&times;</button>

    <div id="fb-form-wrap">
      <div class="feedback-header">
        <div class="clinic-name">Казилова Муминат Ахмедовна</div>
        <div class="form-title">Анкета обратной связи</div>
      </div>

      <form id="fb-form">

        <!-- 01 -->
        <div class="fb-section">
          <div class="fb-num">01 · Общая оценка</div>
          <div class="fb-question">Как вы оцениваете своё обращение в клинику в целом?</div>
          <div class="fb-options">
            <label class="fb-option"><input type="radio" name="q1" value="Отлично"><span class="fb-box"></span><span class="fb-label">Отлично</span></label>
            <label class="fb-option"><input type="radio" name="q1" value="Хорошо"><span class="fb-box"></span><span class="fb-label">Хорошо</span></label>
            <label class="fb-option"><input type="radio" name="q1" value="Удовлетворительно"><span class="fb-box"></span><span class="fb-label">Удовлетворительно</span></label>
            <label class="fb-option"><input type="radio" name="q1" value="Плохо"><span class="fb-box"></span><span class="fb-label">Плохо</span></label>
          </div>
        </div>

        <!-- 02 -->
        <div class="fb-section">
          <div class="fb-num">02 · Доктор Казилова Муминат Ахмедовна</div>
          <div class="fb-question">Как вы оцениваете работу доктора?</div>
          <div class="fb-options">
            <label class="fb-option"><input type="radio" name="q2" value="Очень довольна / доволен"><span class="fb-box"></span><span class="fb-label">Очень довольна / доволен</span></label>
            <label class="fb-option"><input type="radio" name="q2" value="Доволен(а)"><span class="fb-box"></span><span class="fb-label">Доволен(а)</span></label>
            <label class="fb-option"><input type="radio" name="q2" value="Остались вопросы"><span class="fb-box"></span><span class="fb-label">Остались вопросы</span></label>
            <label class="fb-option"><input type="radio" name="q2" value="Не доволен(а)"><span class="fb-box"></span><span class="fb-label">Не доволен(а)</span></label>
          </div>
          <div class="fb-write">
            <div class="fb-question">Что вам особенно понравилось?</div>
            <div class="fb-lines">
              <input class="fb-line" type="text" placeholder="Ваш ответ...">
              <input class="fb-line" type="text" placeholder="">
              <input class="fb-line" type="text" placeholder="">
            </div>
          </div>
        </div>

        <!-- 03 -->
        <div class="fb-section">
          <div class="fb-num">03 · Консультация</div>
          <div class="fb-question">Доктор понятно объяснила процедуру, риски и восстановление?</div>
          <div class="fb-options">
            <label class="fb-option"><input type="radio" name="q3" value="Да, всё понятно"><span class="fb-box"></span><span class="fb-label">Да, всё понятно</span></label>
            <label class="fb-option"><input type="radio" name="q3" value="Частично"><span class="fb-box"></span><span class="fb-label">Частично</span></label>
            <label class="fb-option"><input type="radio" name="q3" value="Хотелось бы больше информации"><span class="fb-box"></span><span class="fb-label">Хотелось бы больше информации</span></label>
          </div>
        </div>

        <!-- 04 -->
        <div class="fb-section">
          <div class="fb-num">04 · Результат</div>
          <div class="fb-question">Вы довольны результатом операции?</div>
          <div class="fb-options">
            <label class="fb-option"><input type="radio" name="q4" value="Очень доволен(а)"><span class="fb-box"></span><span class="fb-label">Очень доволен(а)</span></label>
            <label class="fb-option"><input type="radio" name="q4" value="Доволен(а)"><span class="fb-box"></span><span class="fb-label">Доволен(а)</span></label>
            <label class="fb-option"><input type="radio" name="q4" value="Ожидал(а) другого"><span class="fb-box"></span><span class="fb-label">Ожидал(а) другого</span></label>
            <label class="fb-option"><input type="radio" name="q4" value="Пока сложно оценить"><span class="fb-box"></span><span class="fb-label">Пока сложно оценить (раннее восстановление)</span></label>
          </div>
        </div>

        <!-- 05 -->
        <div class="fb-section">
          <div class="fb-num">05 · Пожелания</div>
          <div class="fb-question">Что можно улучшить? Напишите, что хотелось бы изменить:</div>
          <div class="fb-lines">
            <input class="fb-line" type="text" placeholder="Ваш ответ...">
            <input class="fb-line" type="text" placeholder="">
            <input class="fb-line" type="text" placeholder="">
            <input class="fb-line" type="text" placeholder="">
          </div>
        </div>

        <!-- 06 -->
        <div class="fb-section">
          <div class="fb-num">06 · Рекомендация</div>
          <div class="fb-question">Порекомендуете ли вы клинику друзьям и близким?</div>
          <div class="fb-options">
            <label class="fb-option"><input type="radio" name="q6" value="Да, обязательно"><span class="fb-box"></span><span class="fb-label">Да, обязательно порекомендую</span></label>
            <label class="fb-option"><input type="radio" name="q6" value="Скорее да"><span class="fb-box"></span><span class="fb-label">Скорее да</span></label>
            <label class="fb-option"><input type="radio" name="q6" value="Нет"><span class="fb-box"></span><span class="fb-label">Нет</span></label>
          </div>
          <div class="fb-write">
            <div class="fb-question">Почему?</div>
            <div class="fb-lines">
              <input class="fb-line" type="text" placeholder="Ваш ответ...">
              <input class="fb-line" type="text" placeholder="">
            </div>
          </div>
        </div>

        <!-- 07 -->
        <div class="fb-section">
          <div class="fb-num">07 · Ваш отзыв</div>
          <div class="fb-question">Если готовы оставить отзыв для сайта или соцсетей — напишите его здесь:</div>
          <div class="fb-lines">
            <input class="fb-line" type="text" placeholder="Ваш отзыв...">
            <input class="fb-line" type="text" placeholder="">
            <input class="fb-line" type="text" placeholder="">
            <input class="fb-line" type="text" placeholder="">
            <input class="fb-line" type="text" placeholder="">
          </div>
          <div class="fb-consent-block" style="margin-top:16px;">
            <label class="fb-option">
              <input type="checkbox" id="fb-consent"><span class="fb-box"></span>
              <span class="fb-label" style="font-size:12px;">Согласен(а) на публикацию отзыва на сайте и в соцсетях клиники</span>
            </label>
          </div>
        </div>

        <button type="submit" class="fb-submit">Отправить анкету</button>
      </form>
    </div>

    <div class="fb-success" id="fb-success">
      <div class="fb-check">✦</div>
      <h3>Спасибо за ваш отзыв</h3>
      <p>Ваше мнение очень важно для нас.<br>Мы учтём его в нашей работе.</p>
    </div>
  </div>
</div>

<script>
  // Закрытие по фону и Escape
  document.getElementById('feedback-modal').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') document.getElementById('feedback-modal').classList.remove('open');
  });
  // Сабмит формы
  document.getElementById('fb-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('fb-form-wrap').querySelector('form').style.display = 'none';
    document.getElementById('fb-success').style.display = 'block';
    // Через 3 сек закрываем модал
    setTimeout(function() {
      document.getElementById('feedback-modal').classList.remove('open');
      document.getElementById('fb-form-wrap').querySelector('form').style.display = 'block';
      document.getElementById('fb-success').style.display = 'none';
    }, 3000);
  });
</script>
`;

html = html.replace('<div class="privacy-modal"', feedbackModal + '\n<div class="privacy-modal"');

fs.writeFileSync(filePath, html, 'utf8');
console.log('✓ Анкета обратной связи добавлена на сайт');
