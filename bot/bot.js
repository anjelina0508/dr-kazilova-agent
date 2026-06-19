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
    const systemPrompt = `Ты агент доктора Казиловой Муминат Ахмедовны — пластического хирурга в Махачкале.
Отвечаешь на вопросы потенциальных пациентов: о липосакции, абдоминопластике, блефаропластике и других услугах клиники.
Ты вежливый, профессиональный, говоришь на русском языке.
Для записи на консультацию направляй в WhatsApp: +7 (999) 516-03-89 или Telegram: @kazilova.
Не называй цены точно — говори что стоимость уточняется индивидуально на консультации.
Пиши простым текстом без звёздочек, решёток и любой другой разметки. Никакого Markdown.`;

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
