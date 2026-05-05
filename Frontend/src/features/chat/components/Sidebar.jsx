import { useState } from "react";
import { CreateChats } from "../../../api/Chat";
import "./NewChatButton.css"; // مسار الـ axios function تبعتك

function NewChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setStatus({ msg: "Please enter a title.", type: "error" });
      return;
    }
    setLoading(true);
    setStatus({ msg: "Creating...", type: "" });
    try {
      await CreateChats({ title });
      setStatus({ msg: "Chat created!", type: "success" });
      setTitle("");
    } catch (e) {
      setStatus({
        msg: e.response?.data?.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="new-chat-btn" onClick={() => setIsOpen(true)}>
        <span className="plus-icon">＋</span>
        New Chat
      </button>

      {isOpen && (
        <div className="overlay">
          <div className="modal">
            <p className="modal-title">New chat</p>
            <input
              type="text"
              placeholder="Chat title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {status.msg && (
              <p className={`status ${status.type}`}>{status.msg}</p>
            )}
            <div className="modal-actions">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTitle("");
                  setStatus({ msg: "", type: "" });
                }}
              >
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ChatItem({ chat, active, onClick, style }) {
  return (
    <div
      className={`chat-item ${active ? "active" : ""}`}
      onClick={() => onClick(chat.id)}
      style={style}
    >
      <span className="chat-item-icon">💬</span>
      <div className="chat-item-info">
        <div className="chat-item-title">{chat.title}</div>
        <div className="chat-item-title">{chat.id}</div>
      </div>
    </div>
  );
}

function ChatList({ chats, activeId, onSelect }) {
  return (
    <div className="chat-list">
      {chats.map((chat, i) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          active={chat.id === activeId}
          onClick={onSelect}
          style={{ animationDelay: `${i * 1.06}s` }}
        />
      ))}
    </div>
  );
}

export default function Sidebar({ chats, activeChat, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">✦</div>
        <span className="logo-text">Chats With AI</span>
      </div>

      <NewChatButton />

      <div className="section-label">Recent Chats</div>

      <ChatList chats={chats} activeId={activeChat} onSelect={onSelect} />

      <div className="sidebar-footer">
        <div className="avatar">TM</div>
        <div className="user-info">
          <div className="user-name">Tareq Mardini</div>
          <div className="user-role">Pro Plan</div>
        </div>
        <button className="logout-btn" title="Logout">
          ⎋
        </button>
      </div>
    </aside>
  );
}
