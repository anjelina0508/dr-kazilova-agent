const fs = require('fs');
const path = require('path');

const TOPICS_FILE = path.join(__dirname, 'topics.json');

function load() {
  if (fs.existsSync(TOPICS_FILE)) {
    return JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));
  }
  return {};
}

function save(data) {
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let data = load();

function saveTopics(chatId, topics) {
  data[String(chatId)] = topics;
  save(data);
}

function getTopics(chatId) {
  return data[String(chatId)] || {};
}

module.exports = { saveTopics, getTopics };
