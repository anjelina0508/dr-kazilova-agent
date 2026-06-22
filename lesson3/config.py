import os
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
CLAUDE_MODEL = os.getenv('CLAUDE_MODEL', 'claude-sonnet-4-6')

def validate():
    if not TELEGRAM_TOKEN:
        raise ValueError("TELEGRAM_TOKEN не установлен в .env")
