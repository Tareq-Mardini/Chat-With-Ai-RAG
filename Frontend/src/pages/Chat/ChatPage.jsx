import { useState, useEffect } from "react";
import galaxy from "../../videos/galaxy.mp4";
import MainContent from "../../features/chat/components/MainContent";
import Sidebar from "../../features/chat/components/Sidebar";
import "../../styles/Chat.css";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { CreateChats } from "../../api/Chat";
import { Link } from "react-router-dom";
// ===================== LAYOUT =====================
function DashboardLayout() {
  const { chats, RefreshDB, test, setTest } = useContext(ChatContext);

  const [activeChat, setActiveChat] = useState(1);
  const [chatList, setChatList] = useState(chats?.chats || []);
  const [value, setValue] = useState("");
  const [Error, setError] = useState("");
  // useEffect(() => {
  //   setTest(2);
  // }, []);
  console.log("Tareq");

  const handleNewChat = async (data) => {
    try {
      const res = await CreateChats(data);

      console.log(res.data);
      RefreshDB();
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // يمنع الريلود

    handleNewChat({
      title: value, // 👈 هون المهم
    });

    setValue(""); // فضي الحقل بعد الإرسال
  };
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
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

              <button type="submit">Add Chat</button>
            </form>
            {Error && <h2 style={{ color: "Red" }}>{Error}</h2>}
            <Link to="/test">Go to Test Page</Link>
            <h2 style={{ color: "red" }}>{test}</h2>
          </MainContent>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
