const { spawn } = require('child_process');
const { config } = require('./config');
const { MARKETER_PROMPT, COPYWRITER_PROMPT, DESIGNER_PROMPT } = require('./prompts');

function runClaude(message, systemPrompt) {
  return new Promise((resolve) => {
    const args = [
      '-p', message,
      '--output-format', 'text',
      '--max-turns', '3',
      '--append-system-prompt', systemPrompt,
      '--model', config.CLAUDE_MODEL,
    ];

    const child = spawn('claude', args, { timeout: 120000 });
    let output = '';
    let error = '';

    child.stdout.on('data', (d) => { output += d.toString(); });
    child.stderr.on('data', (d) => { error += d.toString(); });

    child.on('close', () => {
      if (output.trim()) {
        resolve(output.trim());
      } else {
        resolve(`Агент не ответил. Ошибка: ${error.slice(0, 300)}`);
      }
    });

    child.on('error', (e) => resolve(`Ошибка запуска агента: ${e.message}`));
  });
}

async function runMarketer(task) {
  return runClaude(`Задача: ${task}`, MARKETER_PROMPT);
}

async function runCopywriter(task, marketerBrief) {
  const message = `Тема: ${task}\n\nМаркетинговый бриф:\n${marketerBrief}`;
  return runClaude(message, COPYWRITER_PROMPT);
}

async function runDesigner(task, postText) {
  const message = `Тема поста: ${task}\n\nТекст поста:\n${postText}`;
  return runClaude(message, DESIGNER_PROMPT);
}

async function runOrchestrator(task) {
  const marketer = await runMarketer(task);
  const copywriter = await runCopywriter(task, marketer);
  const designer = await runDesigner(task, copywriter);
  return { marketer, copywriter, designer };
}

module.exports = { runOrchestrator };
