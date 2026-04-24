// Abstraction: all API calls go through this service
// The rest of the app never calls fetch() directly — loose coupling

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function sendMessage(sessionId, message, config) {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message, config }),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}

export async function resetSession(sessionId, config) {
  const res = await fetch(`${BASE}/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, config }),
  });
  if (!res.ok) throw new Error("Reset failed");
  return res.json();
}

export async function updateConfig(sessionId, config) {
  const res = await fetch(`${BASE}/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, config }),
  });
  if (!res.ok) throw new Error("Config update failed");
  return res.json();
}
