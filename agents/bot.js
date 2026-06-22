const { Telegraf } = require('telegraf');
const { config, validate } = require('./config');
const { runOrchestrator } = require('./agents');
const { saveTopics, getTopics } = require('./storage');

validate();
const bot = new Telegraf(config.TELEGRAM_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    'Привет! Я команда агентов для создания контента клиники Казиловой.\n\n' +
    'Напиши задачу, например:\n' +
    '— сделай пост про липосакцию для Instagram\n' +
    '— напиши про блефаропластику\n' +
    '— создай контент про абдоминопластику\n\n' +
    'В группе с ветками сначала напиши /setup'
  );
});

bot.command('setup', async (ctx) => {
  const chat = ctx.chat;
  if (!['group', 'supergroup'].includes(chat.type)) {
    return ctx.reply('⚠️ Команда /setup работает только в группах с включёнными темами (Topics).');
  }

  const agents = {
    marketer: '📊 Маркетолог',
    copywriter: '✍️ Копирайтер',
    designer: '🎨 Дизайнер',
  };

  await ctx.reply('Создаю ветки для агентов...');
  const topics = {};

  for (const [key, name] of Object.entries(agents)) {
    try {
      const topic = await ctx.telegram.createForumTopic(chat.id, name);
      topics[key] = topic.message_thread_id;
    } catch (e) {
      return ctx.reply(`Ошибка при создании ветки ${name}: ${e.message}`);
    }
  }

  saveTopics(chat.id, topics);
  await ctx.reply(
    'Готово! Ветки созданы.\n' +
    'Теперь пиши задачи в General — агенты будут отвечать в своих ветках.'
  );
});

bot.on('text', async (ctx) => {
  const task = ctx.message.text;
  const chatId = ctx.chat.id;
  const topics = getTopics(chatId);

  const typing = setInterval(() => ctx.sendChatAction('typing'), 4000);
  ctx.sendChatAction('typing');

  const statusMsg = await ctx.reply('Команда агентов работает над задачей...');

  try {
    const results = await runOrchestrator(task);
    clearInterval(typing);

    if (Object.keys(topics).length > 0) {
      for (const [key, threadId] of Object.entries(topics)) {
        if (results[key]) {
          await ctx.telegram.sendMessage(chatId, results[key], {
            message_thread_id: threadId,
          });
        }
      }
      await ctx.telegram.editMessageText(
        chatId, statusMsg.message_id, null,
        'Готово! Смотри ветки:\n📊 Маркетолог\n✍️ Копирайтер\n🎨 Дизайнер'
      );
    } else {
      const response =
        `📊 МАРКЕТОЛОГ\n${results.marketer}\n\n` +
        `✍️ КОПИРАЙТЕР\n${results.copywriter}\n\n` +
        `🎨 ДИЗАЙНЕР (промпт для картинки)\n${results.designer}`;

      await ctx.telegram.editMessageText(chatId, statusMsg.message_id, null, response);
    }
  } catch (e) {
    clearInterval(typing);
    await ctx.telegram.editMessageText(chatId, statusMsg.message_id, null, `Ошибка: ${e.message}`);
  }
});

bot.launch();
console.log('Казилова Агенты запущены');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
