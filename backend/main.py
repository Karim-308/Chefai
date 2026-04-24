from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from chef_ai import ChefAI, ChefConfig

app = FastAPI(title="ChefAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions: dict[str, ChefAI] = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str
    config: Optional[ChefConfig] = None

class ConfigRequest(BaseModel):
    session_id: str
    config: ChefConfig

@app.post("/chat")
async def chat(req: ChatRequest):
    if req.session_id not in sessions:
        sessions[req.session_id] = ChefAI(req.config or ChefConfig())
    
    chef = sessions[req.session_id]
    
    if req.config:
        chef.update_config(req.config)
    
    response = await chef.chat(req.message)
    return {
        "reply": response,
        "history_length": len(chef.memory.messages),
    }

@app.post("/reset")
async def reset(req: ConfigRequest):
    sessions[req.session_id] = ChefAI(req.config)
    return {"status": "reset", "session_id": req.session_id}

@app.post("/config")
async def update_config(req: ConfigRequest):
    if req.session_id not in sessions:
        sessions[req.session_id] = ChefAI(req.config)
    else:
        sessions[req.session_id].update_config(req.config)
    return {"status": "updated", "config": req.config}

@app.get("/history/{session_id}")
async def get_history(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    chef = sessions[session_id]
    return {"messages": chef.memory.messages}
