# ChefAI 👨‍🍳

An AI chef system that guides users step-by-step to a meal using their available ingredients.

## Architecture

```
frontend (React)  →  backend (FastAPI)  →  OpenAI GPT-4o
     ↓                     ↓
  useChef hook         ChefAI class
  (MemorySync)      (Abstraction Layer)
```

## Key Concepts Implemented

| Concept | Where |
|---|---|
| **Endpoints** | `main.py` — `/chat`, `/reset`, `/config`, `/history/:id` |
| **Abstraction / loose coupling** | `ChefAI` class wraps OpenAI; frontend only talks to REST API |
| **Temperature** | Configurable: `strict=0.3`, `balanced=0.7`, `creative=1.0` |
| **Max tokens** | Configurable via `ChefConfig.max_tokens` |
| **Memory** | `ConversationMemory` class stores full message history |
| **MemorySync** | `useChef` hook keeps frontend state in sync with backend session |
| **System prompt** | `build_system_prompt()` dynamically builds persona from config |

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env      # add your OPENAI_API_KEY
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Usage

1. Open `http://localhost:3000`
2. Tell Chef Marco what ingredients you have
3. He'll guide you step-by-step to a meal decision
4. Use ⚙️ Settings to adjust creativity and response style
5. Use 🔄 New Session to start fresh
