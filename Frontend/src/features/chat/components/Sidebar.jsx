function NewChatButton({ onClick }) {
  return (
    <button className="new-chat-btn" onClick={onClick}>
      <span className="plus-icon">＋</span>
      New Chat
    </button>
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

export default function Sidebar({ chats, activeChat, onSelect, onNewChat }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">✦</div>
        <span className="logo-text">Chats With AI</span>
      </div>

      <NewChatButton onClick={onNewChat} />

      <div className="section-label">Recent Chats</div>

      <ChatList chats={chats} activeId={activeChat} onSelect={onSelect} />

      <div className="sidebar-footer">
        <div className="avatar">AH</div>
        <div className="user-info">
          <div className="user-name">Ahmed Dev</div>
          <div className="user-role">Pro Plan</div>
        </div>
        <button className="logout-btn" title="Logout">
          ⎋
        </button>
      </div>
    </aside>
  );
}
