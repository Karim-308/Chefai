import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendMessage, resetSession, updateConfig } from "../api";

// MemorySync: keeps frontend message history in sync with backend session
// This mirrors the backend ConversationMemory — same source of truth via session_id
export function useChef() {
  const sessionId = useRef(uuidv4());

  const [messages, setMessages] = useState([]);  // frontend memory
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    temperature: 0.7,
    max_tokens: 500,
    mode: "balanced",        // strict | balanced | creative
    response_style: "concise",
  });

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, id: uuidv4() }]);
  };

  const chat = useCallback(async (text) => {
    addMessage("user", text);
    setLoading(true);
    try {
      const data = await sendMessage(sessionId.current, text, config);
      addMessage("assistant", data.reply);
    } catch (e) {
      addMessage("assistant", "⚠️ Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [config]);

  const reset = useCallback(async () => {
    setMessages([]);
    await resetSession(sessionId.current, config);
  }, [config]);

  const applyConfig = useCallback(async (newConfig) => {
    setConfig(newConfig);
    await updateConfig(sessionId.current, newConfig);
  }, []);

  return { messages, loading, config, chat, reset, applyConfig, sessionId: sessionId.current };
}
