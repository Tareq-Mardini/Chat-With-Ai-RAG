import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Chat/ChatPage";
import ChatProvider from "./context/ChatProvider";
import SentMessage from "./pages/Chat/SentMessage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ChatProvider>
                <Dashboard />
              </ChatProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Chat/:id"
          element={
            <ProtectedRoute>
              <ChatProvider>
                <SentMessage />
              </ChatProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
