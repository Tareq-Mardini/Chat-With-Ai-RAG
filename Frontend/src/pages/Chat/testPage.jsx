import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

export default function TestPage() {
  const { test, setTest } = useContext(ChatContext);
  function tt() {
    setTest(3);
  }
  return (
    <>
      <h2>{test}</h2>
      <h2>tareq</h2>
      <h2>tareq</h2>
      <h2>tareq</h2>
      <button onClick={tt}>twtt</button>
    </>
  );
}
