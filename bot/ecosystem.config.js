module.exports = {
  apps: [{
    name: 'kazilova-bot',
    script: 'bot.js',
    cwd: '/home/agent/projects/kazilova/bot',
    env: {
      TELEGRAM_TOKEN: '8648961158:AAHS7EOc_uMRiEnx8vKb6g8LtZVAWQJYwQI'
    },
    restart_delay: 5000,
    max_restarts: 10,
    autorestart: true,
  }]
};
