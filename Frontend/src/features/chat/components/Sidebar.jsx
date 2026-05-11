import { useState } from "react";
import { CreateChats } from "../../../api/Chat";
import "./NewChatButton.css"; // مسار الـ axios function تبعتك
import { useNavigate } from "react-router-dom";
import { UploadPdf, IndexChunks } from "../../../api/Chat";
import { useContext } from "react"; // أضف هاد
import { ChatContext } from "../../../context/ChatContext";

function NewChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);
  const { RefreshDB } = useContext(ChatContext);

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
      await RefreshDB();
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

function ChatItem({ chat, active, style }) {
  const navigate = useNavigate();

  return (
    <div
      className={`chat-item ${active ? "active" : ""}`}
      onClick={() => navigate(`/Chat/${chat.id}`)}
      style={style}
    >
      <span className="chat-item-icon">💬</span>
      <div className="chat-item-info">
        <div className="chat-item-title">{chat.title}</div>
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

function UploadPdfButton() {
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatus({ msg: "Uploading...", type: "" });

    try {
      // الخطوة 1: رفع الـ PDF
      await UploadPdf(file);
      setStatus({ msg: "Indexing...", type: "" });

      // الخطوة 2: عمل index تلقائياً
      await IndexChunks();

      setStatus({ msg: "✓ PDF indexed successfully!", type: "success" });
    } catch (e) {
      setStatus({
        msg: e.response?.data?.message || "Upload failed.",
        type: "error",
      });
    } finally {
      setLoading(false);
      // إخفاء الرسالة بعد 3 ثواني
      setTimeout(() => setStatus({ msg: "", type: "" }), 3000);
      // reset input
      e.target.value = "";
    }
  };

  return (
    <div className="upload-pdf-wrapper">
      <label className={`upload-pdf-btn ${loading ? "loading" : ""}`}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          disabled={loading}
          style={{ display: "none" }}
        />
        {loading ? (
          <>
            <span className="upload-spinner" />
            Processing...
          </>
        ) : (
          <>
            <span>📄</span>
            Upload PDF
          </>
        )}
      </label>

      {status.msg && (
        <p className={`upload-status ${status.type}`}>{status.msg}</p>
      )}
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
      <UploadPdfButton />
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
