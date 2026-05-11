import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import { GetChatMessages, SendMessage } from "../../api/Chat";
import galaxy from "../../videos/galaxy.mp4";
import MainContent from "../../features/chat/components/MainContent";
import Sidebar from "../../features/chat/components/Sidebar";
import "../../styles/Chat.css";
import "./Chat.css";
import ReactMarkdown from "react-markdown";

export default function SentMessage() {
  const { chats } = useContext(ChatContext);
  const [activeChat, setActiveChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const { id } = useParams();

  // تحميل قائمة الشات
  useEffect(() => {
    if (chats?.chats?.length) {
      setChatList(chats.chats);
      setActiveChat(id || chats.chats[0].id);
    }
  }, [chats, id]);

  // جلب الرسائل حسب id من الرابط
  useEffect(() => {
    if (!id) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await GetChatMessages(id);
        setMessages(res.data.messages || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [id]);

  // سكرول تلقائي لآخر رسالة
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 إرسال الرسالة مع typing animation
  const handleSend = async () => {
    if (!input.trim() || !id) return;

    const currentInput = input;

    const userMessage = {
      role: "user",
      content: currentInput,
    };

    const tempAIMessage = {
      role: "assistant",
      content: "",
      isTyping: true,
    };

    // إضافة رسالة المستخدم + typing مباشرة
    setMessages((prev) => [...prev, userMessage, tempAIMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await SendMessage(id, {
        message: currentInput,
      });

      const aiMessage = res.data.ai_message;

      // استبدال typing بالرد الحقيقي
      setMessages((prev) => {
        const newMessages = [...prev];
        const index = newMessages.findIndex((m) => m.isTyping);

        if (index !== -1) {
          newMessages[index] = aiMessage;
        }

        return newMessages;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="dash-wrapper">
      <video autoPlay muted loop playsInline className="background-video">
        <source src={galaxy} type="video/mp4" />
      </video>

      <Sidebar
        chats={chatList}
        activeChat={activeChat}
        onSelect={setActiveChat}
      />

      <div className="right-side">
        <MainContent>
          {loadingMessages ? (
            <div className="empty-state">
              <div className="typing-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <p>Start a new conversation</p>
            </div>
          ) : (
            <div style={{ minHeight: "500px" }} className="messages-list">
              {messages.map((msg, i) => (
                <div key={i} className={`message-row ${msg.role}`}>
                  {msg.role === "assistant" && (
                    <div className="msg-avatar assistant-avatar">AI</div>
                  )}

                  <div
                    style={{ paddingLeft: "24px" }}
                    className={`message-bubble ${msg.role}`}
                  >
                    {msg.isTyping ? (
                      <div className="typing-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="msg-avatar user-avatar">TM</div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </MainContent>

        {/* Input area */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              className="chat-textarea"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
            />

            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <p className="input-hint">
            Press Enter to send · Shift+Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}
