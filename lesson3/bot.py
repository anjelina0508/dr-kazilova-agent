import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from telegram.error import TelegramError

from config import TELEGRAM_TOKEN, validate
from agents import run_orchestrator
from storage import save_topics, get_topics

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        'Привет! Я команда агентов клиники доктора Казиловой.\n\n'
        'Напиши задачу, например:\n'
        '— сделай пост про липосакцию для Instagram\n'
        '— напиши про блефаропластику\n'
        '— создай контент про абдоминопластику\n\n'
        'В группе с ветками сначала напиши /setup'
    )


async def setup(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat = update.effective_chat
    if chat.type not in ['group', 'supergroup']:
        await update.message.reply_text(
            '⚠️ /setup работает только в группах с включёнными темами (Topics).'
        )
        return

    agents = {
        'marketer': '📊 Маркетолог',
        'copywriter': '✍️ Копирайтер',
        'designer': '🎨 Дизайнер',
    }

    await update.message.reply_text('Создаю ветки для агентов...')
    topics = {}

    for key, name in agents.items():
        try:
            topic = await context.bot.create_forum_topic(chat.id, name)
            topics[key] = topic.message_thread_id
        except TelegramError as e:
            await update.message.reply_text(f'Ошибка при создании ветки {name}: {e}')
            return

    save_topics(chat.id, topics)
    await update.message.reply_text(
        'Готово! Ветки созданы.\n'
        'Теперь пиши задачи в General — агенты будут отвечать в своих ветках.'
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    task = update.message.text
    chat_id = update.effective_chat.id
    topics = get_topics(chat_id)

    status_msg = await update.message.reply_text('Команда агентов работает над задачей...')

    try:
        results = await run_orchestrator(task)

        if topics:
            for key, thread_id in topics.items():
                if results.get(key):
                    try:
                        await context.bot.send_message(
                            chat_id,
                            results[key],
                            message_thread_id=thread_id
                        )
                    except TelegramError as e:
                        logger.error(f'Ошибка отправки в ветку {key}: {e}')

            await status_msg.edit_text(
                'Готово! Смотри ветки:\n📊 Маркетолог\n✍️ Копирайтер\n🎨 Дизайнер'
            )
        else:
            response = (
                f'📊 МАРКЕТОЛОГ\n{results["marketer"]}\n\n'
                f'✍️ КОПИРАЙТЕР\n{results["copywriter"]}\n\n'
                f'🎨 ДИЗАЙНЕР (промпт для картинки)\n{results["designer"]}'
            )
            await status_msg.edit_text(response)

    except Exception as e:
        logger.error(f'Ошибка оркестратора: {e}')
        await status_msg.edit_text(f'Ошибка: {e}')


def main():
    validate()
    app = Application.builder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler('start', start))
    app.add_handler(CommandHandler('setup', setup))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    logger.info('Казилова Агенты (Python) запущены')
    app.run_polling(drop_pending_updates=True)


if __name__ == '__main__':
    main()
