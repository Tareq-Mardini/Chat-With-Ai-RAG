import { useState, useEffect } from "react";
import galaxy from "../../videos/galaxy.mp4";
import MainContent from "../../features/chat/components/MainContent";
import Sidebar from "../../features/chat/components/Sidebar";
import "../../styles/Chat.css";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

import { Link } from "react-router-dom";
// ===================== LAYOUT =====================
function DashboardLayout() {
  const { chats, RefreshDB, test, setTest } = useContext(ChatContext);

  const [activeChat, setActiveChat] = useState(1);
  const [chatList, setChatList] = useState(chats?.chats || []);
  const [value, setValue] = useState("");
  const [Error, setError] = useState("");

  console.log("Tareq");


  useEffect(() => {
    if (chats?.chats?.length) {
      setChatList(chats.chats);
      setActiveChat(chats.chats[0].id); // تحديد أول chat بشكل افتراضي
    }
  }, [chats]);
  return (
    <>
      <div className="dash-wrapper">
        {/* Place the video here */}
        <video autoPlay muted loop playsInline className="background-video">
          <source src={galaxy} type="video/mp4" />
        </video>{" "}
        <Sidebar
          chats={chatList}
          activeChat={activeChat}
          onSelect={setActiveChat}
          // onNewChat={handleNewChat}
        />
        <div className="right-side">
          <MainContent>
            <div style={{ marginTop: "60px" }} className="welcome-root">
              <div className="orb-wrap">
                <div className="orb-ring" />
                <div className="orb-dot d1" />
                <div className="orb-dot d2" />
                <div className="orb-dot d3" />
                <div style={{ color: "white" }} className="orb-core">
                  ✦
                </div>
              </div>

              <h1 className="w-heading">
                Welcome to Chats With AI{" "}
                <span
                  style={{
                    color: "rgba(99,102,241,0.7)",

                    fontWeight: "400",
                  }}
                >
                  ( RAG )
                </span>
              </h1>

              <p className="w-sub">
                An intelligent assistant that reads your documents and answers
                questions from their actual content — not guesses.
              </p>

              <div className="chips">
                {[
                  "📄 PDF documents",
                  "🔍 Semantic search",
                  "🧠 RAG powered",
                  "💬 Contextual chat",
                ].map((c) => (
                  <div key={c} className="chip">
                    {c}
                  </div>
                ))}
              </div>

              <div className="steps" style={{ color: "white" }}>
                {[
                  { num: "01", icon: "⬆", label: "Upload your PDF" },
                  { num: "02", icon: "🗄", label: "We index it for you" },
                  { num: "03", icon: "💬", label: "Ask anything" },
                ].map((s) => (
                  <div key={s.num} className="step">
                    <div className="step-num">STEP {s.num}</div>
                    <div className="step-icon">{s.icon}</div>
                    <div className="step-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </MainContent>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
