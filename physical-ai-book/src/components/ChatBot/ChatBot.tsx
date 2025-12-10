import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import styles from "./ChatBot.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ filename: string; chunk_index: number; score: number }>;
}

const ChatBot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [showSelectionButton, setShowSelectionButton] = useState(false);
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectionButtonRef = useRef<HTMLDivElement>(null);

  // ✅ Process env hata kar direct link lagaya hai taake crash na ho
  const API_BASE_URL = "http://127.0.0.1:8000";

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle text selection
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const selectedText = selection.toString().trim();
        setSelectedText(selectedText);

        // Get selection position
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Button ko text ke thora upar show karein
        setSelectionPosition({
          x: rect.left + (rect.width / 2) - 40, // Center mein
          y: rect.top - 50, // Thora upar
        });

        setShowSelectionButton(true);
      } else {
        setShowSelectionButton(false);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        query: input,
        conversation_id: conversationId || undefined,
        user_id: user?.id || undefined,
      });

      setConversationId(response.data.conversation_id);

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.response,
        sources: response.data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please try again or check if the backend server is running.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionExplain = async () => {
    if (!selectedText) return;

    // ✅ FIX: Button dabate hi Chatbot khol do (Wait mat karo)
    if (!isOpen) {
      setIsOpen(true);
    }

    const userMessage: Message = {
      role: "user",
      content: `[Selected Text] ${selectedText}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowSelectionButton(false);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/ask-selection`, {
        selected_text: selectedText,
        conversation_id: conversationId || undefined,
        user_id: user?.id || undefined,
      });

      setConversationId(response.data.conversation_id);

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.response,
        sources: response.data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error explaining the selected text.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error explaining selection:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Selection Button */}
      {showSelectionButton && (
        <div
          ref={selectionButtonRef}
          className={styles.selectionButton}
          style={{
            position: "fixed",
            left: `${selectionPosition.x}px`,
            top: `${selectionPosition.y}px`,
            zIndex: 10000,
          }}
        >
          <button onClick={handleSelectionExplain} title="Ask AI to explain this">
            💡 Ask AI
          </button>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen ? (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3>📚 Physical AI Assistant</h3>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <p>
                  👋 Hello! I'm your Physical AI Assistant. Ask me anything about
                  the book!
                </p>
                <p style={{ fontSize: "0.9em", marginTop: "10px", opacity: 0.7 }}>
                  💡 Tip: Highlight any text in the book and click "Ask AI" to learn
                  more.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${styles[message.role]}`}
              >
                <div className={styles.messageContent}>{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div className={styles.sources}>
                    <details>
                      <summary>📖 Sources</summary>
                      <ul>
                        {message.sources.map((source, idx) => (
                          <li key={idx}>
                            {source.filename} (Chunk {source.chunk_index})
                            <br />
                            <small>Relevance: {(source.score * 100).toFixed(0)}%</small>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputContainer}>
            <textarea
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about the Physical AI book..."
              disabled={loading}
              rows={3}
            />
            <button
              className={styles.sendButton}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <button
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          💬
        </button>
      )}
    </>
  );
};

export default ChatBot;