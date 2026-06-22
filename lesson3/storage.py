import json
import os

STORAGE_FILE = 'topics.json'

def save_topics(chat_id, topics):
    data = {}
    if os.path.exists(STORAGE_FILE):
        with open(STORAGE_FILE, 'r') as f:
            data = json.load(f)
    data[str(chat_id)] = topics
    with open(STORAGE_FILE, 'w') as f:
        json.dump(data, f)

def get_topics(chat_id):
    if not os.path.exists(STORAGE_FILE):
        return {}
    with open(STORAGE_FILE, 'r') as f:
        data = json.load(f)
    return data.get(str(chat_id), {})
