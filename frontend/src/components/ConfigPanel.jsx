import React, { useState } from "react";

export default function ConfigPanel({ config, onApply }) {
  const [draft, setDraft] = useState(config);
  const [open, setOpen] = useState(false);

  const set = (key, val) => setDraft(p => ({ ...p, [key]: val }));

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  return (
    <div className="config-wrapper">
      <button className="config-toggle" onClick={() => setOpen(o => !o)}>
        ⚙️ Settings
      </button>
      {open && (
        <div className="config-panel">
          <h3>Chef Settings</h3>

          <label>Mode</label>
          <div className="btn-group">
            {["strict", "balanced", "creative"].map(m => (
              <button
                key={m}
                className={draft.mode === m ? "active" : ""}
                onClick={() => set("mode", m)}
              >
                {m === "strict" ? "🎯 Strict" : m === "balanced" ? "⚖️ Balanced" : "🎨 Creative"}
              </button>
            ))}
          </div>

          <label>Response Style</label>
          <div className="btn-group">
            {["concise", "detailed"].map(s => (
              <button
                key={s}
                className={draft.response_style === s ? "active" : ""}
                onClick={() => set("response_style", s)}
              >
                {s === "concise" ? "⚡ Concise" : "📖 Detailed"}
              </button>
            ))}
          </div>

          <label>Temperature: <strong>{draft.temperature}</strong></label>
          <input
            type="range" min="0" max="1" step="0.1"
            value={draft.temperature}
            onChange={e => set("temperature", parseFloat(e.target.value))}
          />

          <label>Max Tokens: <strong>{draft.max_tokens}</strong></label>
          <input
            type="range" min="100" max="1000" step="50"
            value={draft.max_tokens}
            onChange={e => set("max_tokens", parseInt(e.target.value))}
          />

          <button className="apply-btn" onClick={handleApply}>Apply Changes</button>
        </div>
      )}
    </div>
  );
}
