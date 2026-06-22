import asyncio
import subprocess
from config import CLAUDE_MODEL
from prompts import MARKETER_PROMPT, COPYWRITER_PROMPT, DESIGNER_PROMPT


def run_claude(message, system_prompt, tools=None):
    args = [
        'claude', '-p', message,
        '--output-format', 'text',
        '--max-turns', '3',
        '--append-system-prompt', system_prompt,
        '--model', CLAUDE_MODEL,
    ]
    if tools:
        args += ['--allowedTools', tools]

    try:
        result = subprocess.run(
            args,
            capture_output=True,
            text=True,
            timeout=180
        )
        output = result.stdout.strip()
        if output:
            return output
        return f"Агент не ответил. Ошибка: {result.stderr[:300]}"
    except subprocess.TimeoutExpired:
        return "Агент превысил время ожидания (3 минуты)"
    except Exception as e:
        return f"Ошибка запуска агента: {e}"


def run_marketer(task):
    return run_claude(f"Задача: {task}", MARKETER_PROMPT, tools="WebSearch")


def run_copywriter(task, marketer_brief):
    message = f"Тема: {task}\n\nМаркетинговый бриф:\n{marketer_brief}"
    return run_claude(message, COPYWRITER_PROMPT)


def run_designer(task, post_text):
    message = f"Тема поста: {task}\n\nТекст поста:\n{post_text}"
    return run_claude(message, DESIGNER_PROMPT)


async def run_orchestrator(task):
    marketer = await asyncio.to_thread(run_marketer, task)
    copywriter = await asyncio.to_thread(run_copywriter, task, marketer)
    designer = await asyncio.to_thread(run_designer, task, copywriter)
    return {
        'marketer': marketer,
        'copywriter': copywriter,
        'designer': designer,
    }
