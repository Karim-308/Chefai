import React, { useState, useRef, useEffect } from "react";
import { useChef } from "./hooks/useChef";
import ChatBubble from "./components/ChatBubble";
import ConfigPanel from "./components/ConfigPanel";
import "./App.css";

export default function App() {
  const { messages, loading, config, chat, reset, applyConfig } = useChef();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    chat(text);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="logo">👨‍🍳</span>
          <div>
            <h1>Chef Marco</h1>
            <p className="subtitle">Your personal AI sous-chef</p>
          </div>
        </div>
        <div className="header-right">
          <ConfigPanel config={config} onApply={applyConfig} />
          <button className="reset-btn" onClick={reset} title="New session">🔄 New Session</button>
        </div>
      </header>

      <div className="chat-area">
        {messages.length === 0 && (
          <div className="welcome">
            <div className="welcome-emoji">🍳</div>
            <h2>Ciao! I'm Chef Marco.</h2>
            <p>Tell me what ingredients you have and I'll guide you to something delicious — one step at a time.</p>
          </div>
        )}
        {messages.map(m => (
          <ChatBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="bubble-row chef">
            <div className="avatar">👨‍🍳</div>
            <div className="bubble chef-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Tell Chef Marco what's in your kitchen..."
          rows={2}
          disabled={loading}
        />
        <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
