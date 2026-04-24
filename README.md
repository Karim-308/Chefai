# AI Chef System 👨‍🍳

## Description
AI system that takes user ingredients and guides them step-by-step to a meal decision using a conversational chef.

## Features
- Ingredient understanding
- Step-by-step cooking guidance
- Memory (conversation context)
- Adjustable creativity (temperature)
- Response length control (max tokens)
- Multiple modes (concise / detailed)

## Tech Stack
- Backend: FastAPI (Python)
- Frontend: React
- AI Model: OpenAI API

## Concepts Implemented

### Endpoints
/chef endpoint handles user interaction.

### Abstraction
Frontend, backend, and AI model are separated.

### Temperature
Controls creativity of responses.

### Max Tokens
Limits response size.

### System Prompt
Defines chef personality and behavior.

### Memory
Conversation history stored per user.

### Memory vs Stateless
System maintains context across requests.

## How to Run

### Backend
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend
npm install
npm start

## Notes
- Memory resets when server restarts
- Designed for educational purposes
