import React from "react";
import "./Messages.css";

const Messages = ({ messages }) => {
  return (
    <div className="messages-container">
      <h2>Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="message-list">
          {messages.map((message) => (
            <div key={message.id} className="message-card">
              <p>
                <strong>{message.sender}</strong>: {message.message}
              </p>
              <span className="message-timestamp">{message.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
