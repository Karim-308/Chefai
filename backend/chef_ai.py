import os
from openai import AsyncOpenAI
from pydantic import BaseModel
from typing import Optional

# --- Abstraction: ChefConfig decouples settings from implementation ---
class ChefConfig(BaseModel):
    temperature: float = 0.7       # 0.3 = strict/precise, 1.0 = creative
    max_tokens: int = 500
    mode: str = "balanced"         # "strict" | "balanced" | "creative"
    response_style: str = "concise" # "concise" | "detailed"

# --- Memory: stores and syncs conversation history ---
class ConversationMemory:
    def __init__(self, system_prompt: str):
        self.messages: list[dict] = [
            {"role": "system", "content": system_prompt}
        ]
    
    def add(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})
    
    def get_all(self) -> list[dict]:
        return self.messages
    
    def reset(self, system_prompt: str):
        self.messages = [{"role": "system", "content": system_prompt}]

# --- System Prompt Factory: builds persona based on config ---
def build_system_prompt(config: ChefConfig) -> str:
    style_hint = (
        "Be brief and to the point — one step at a time."
        if config.response_style == "concise"
        else "Be descriptive and thorough — explain techniques and why they matter."
    )
    creativity_hint = (
        "Stick to classic, proven recipes. No experimentation."
        if config.mode == "strict"
        else "Feel free to suggest creative twists and bold flavor combinations."
        if config.mode == "creative"
        else "Balance tradition with a touch of creativity."
    )

    return f"""You are Chef Marco — a warm, passionate, and experienced professional chef with 20 years in Michelin-starred kitchens.

Your job is to guide the user step-by-step to a great meal using whatever ingredients they have.

RULES YOU NEVER BREAK:
1. Always start by asking what ingredients they have if not provided.
2. Never skip steps — guide them one step at a time.
3. Ask clarifying questions before assuming (dietary restrictions, skill level, time available).
4. Confirm before moving to the next step.
5. Speak like a real chef — use culinary terms naturally, with warmth and enthusiasm.
6. If the user seems confused, slow down and explain more simply.

STYLE: {style_hint}
CREATIVITY: {creativity_hint}

Remember: you're not just a recipe bot — you're their personal chef guiding them through a real cooking experience. Make it feel alive."""

# --- ChefAI: main abstraction class, avoids tight coupling ---
class ChefAI:
    def __init__(self, config: ChefConfig):
        self.config = config
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        system_prompt = build_system_prompt(config)
        self.memory = ConversationMemory(system_prompt)
    
    def update_config(self, config: ChefConfig):
        self.config = config
        new_prompt = build_system_prompt(config)
        self.memory.messages[0] = {"role": "system", "content": new_prompt}
    
    def _resolve_temperature(self) -> float:
        if self.config.mode == "strict":
            return 0.3
        elif self.config.mode == "creative":
            return 1.0
        return self.config.temperature
    
    async def chat(self, user_message: str) -> str:
        self.memory.add("user", user_message)
        
        response = await self.client.chat.completions.create(
            model="gpt-4o",
            messages=self.memory.get_all(),
            temperature=self._resolve_temperature(),
            max_tokens=self.config.max_tokens,
        )
        
        reply = response.choices[0].message.content
        self.memory.add("assistant", reply)
        return reply
