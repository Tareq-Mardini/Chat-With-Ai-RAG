import axios from "./private/axiosPrivate";

export const DisplayChats = () => {
  return axios.get("/auth/chats");
};

export const CreateChats = (data) => {
    return axios.post("/auth/chats", data);
}

export const GetChatMessages = (id) => {
  return axios.get(`/auth/chats/${id}/messages`);
};

export const SendMessage = (id, data) => {
  return axios.post(`/auth/chats/${id}/messages`, data);
};