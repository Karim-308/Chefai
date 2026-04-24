import React from "react";

export default function ChatBubble({ role, content }) {
  const isChef = role === "assistant";
  return (
    <div className={`bubble-row ${isChef ? "chef" : "user"}`}>
      {isChef && <div className="avatar">👨‍🍳</div>}
      <div className={`bubble ${isChef ? "chef-bubble" : "user-bubble"}`}>
        {content.split("\n").map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </div>
      {!isChef && <div className="avatar">🧑</div>}
    </div>
  );
}
