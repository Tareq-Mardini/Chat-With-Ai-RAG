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
            <h2>tareq</h2>
            <h2>tareq</h2>
            <h2>tareq</h2>
            <h2>tareq</h2>
          </MainContent>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
