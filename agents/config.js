require('dotenv').config();

const config = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || '',
  CLAUDE_MODEL: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
};

function validate() {
  if (!config.TELEGRAM_TOKEN) {
    throw new Error('TELEGRAM_TOKEN не задан в .env');
  }
}

module.exports = { config, validate };
