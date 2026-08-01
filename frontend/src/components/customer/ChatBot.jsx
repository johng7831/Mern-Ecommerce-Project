import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../api";
import "./ChatBot.css";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I can help with products, categories, brands, cart, and checkout. What are you looking for?",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const text = message.trim();
    const userMessage = { sender: "user", text };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    // Build recent history for multi-turn context (exclude the welcome tip)
    const history = [...messages, userMessage]
      .filter((m) => m.text)
      .slice(-6)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

    try {
      // API_URL already ends with /api → correct path is /aichatbot
      const res = await axios.post(`${API_URL}/aichatbot`, {
        message: text,
        history,
      });

      const reply =
        res.data?.reply ||
        res.data?.message ||
        "Sorry, I could not get a reply.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply,
        },
      ]);
    } catch (err) {
      console.error(err);

      const errorText =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: errorText,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="chat-btn"
        onClick={() => setOpen(!open)}
        aria-label="Open AI assistant"
      >
        💬
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">AI Assistant</div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="bot">Thinking...</div>}
          </div>

          <div className="chat-footer">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about products, categories..."
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
