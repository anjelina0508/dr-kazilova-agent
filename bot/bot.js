const { Telegraf } = require('telegraf');
const { spawn } = require('child_process');
const path = require('path');

const WORKSPACE = path.join(__dirname, '..');
const TOKEN = process.env.TELEGRAM_TOKEN;

if (!TOKEN) {
  console.error('TELEGRAM_TOKEN не задан');
  process.exit(1);
}

const bot = new Telegraf(TOKEN);

function askClaude(message, userId) {
  return new Promise((resolve, reject) => {
    const systemPrompt = `Ты администратор и консультант клиники пластической хирургии доктора Казиловой Муминат Ахмедовны в Махачкале.

Твоя задача — рассказывать потенциальным пациентам об услугах клиники и помогать им записаться на консультацию. Ты НЕ даёшь медицинских советов и не ставишь диагнозы — ты информируешь об услугах клиники.

Услуги клиники (можешь рассказывать о каждой):
- Липосакция — контурная пластика тела, удаление жировых отложений
- Абдоминопластика — коррекция живота, подтяжка кожи
- Блефаропластика — пластика век, устранение нависания
- Липофилинг — увеличение объёмов с помощью собственного жира
- Ринопластика — коррекция формы носа
- Маммопластика — увеличение или коррекция груди

Правила ответов:
1. Описывай что это за процедура и для кого она подходит — это информация, а не медицинский совет
2. Стоимость не называй точно — говори "цена определяется индивидуально на консультации"
3. Для записи всегда направляй: WhatsApp +7 (999) 516-03-89 или Telegram @kazilova
4. Если вопрос не связан с услугами клиники — вежливо переведи разговор на запись к доктору
5. Пиши на русском языке, простым текстом, без звёздочек и решёток`;

    const args = [
      '-p', message,
      '--output-format', 'text',
      '--max-turns', '3',
      '--dangerously-skip-permissions',
      '--append-system-prompt', systemPrompt,
    ];

    const child = spawn('claude', args, {
      cwd: WORKSPACE,
      env: { ...process.env },
      timeout: 120000,
    });

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => { output += data.toString(); });
    child.stderr.on('data', (data) => { error += data.toString(); });

    child.on('close', (code) => {
      if (output.trim()) {
        resolve(output.trim());
      } else {
        reject(new Error(error || 'Нет ответа от Claude'));
      }
    });

    child.on('error', reject);
  });
}

bot.start((ctx) => {
  ctx.reply(
    'Здравствуйте! 👋\n\nЯ помощник клиники доктора Казиловой Муминат Ахмедовны.\n\n' +
    'Могу рассказать об услугах:\n' +
    '• Липосакция тела\n' +
    '• Абдоминопластика\n' +
    '• Блефаропластика\n' +
    '• Липофилинг\n\n' +
    'Задайте ваш вопрос!'
  );
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const message = ctx.message.text;

  const typing = setInterval(() => ctx.sendChatAction('typing'), 4000);
  ctx.sendChatAction('typing');

  try {
    const response = await askClaude(message, userId);
    clearInterval(typing);
    await ctx.reply(response);
  } catch (err) {
    clearInterval(typing);
    console.error('Ошибка Claude:', err.message);
    await ctx.reply(
      'Извините, сейчас не могу ответить. Напишите напрямую:\n' +
      'WhatsApp: +7 (999) 516-03-89\n' +
      'Telegram: @kazilova'
    );
  }
});

bot.launch();
console.log('Бот запущен');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
