import { useState, useEffect } from "react";
import { ChatContext } from "./ChatContext";
import { DisplayChats } from "../api/Chat";

const getChats = async () => {
  try {
    const res = await DisplayChats(); // axios
    return res.data; // هنا البيانات
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch chats");
  }
};

export default function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [test, setTest] = useState(45);
  useEffect(() => {
    console.log("hon sar api");
    const fetchChats = async () => {
      try {
        const data = await getChats();
        setChats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchChats(); // أول ما يصير mount
  }, []);

  const RefreshDB = async () => {
    try {
      const data = await getChats();
      setChats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ChatContext.Provider
      value={{ chats, setChats, error, RefreshDB, test, setTest }}
    >
      {children}
    </ChatContext.Provider>
  );
}
