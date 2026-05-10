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

export const UploadPdf = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post("/auth/upload-pdf", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const IndexChunks = () => {
  return axios.post("/auth/index-chunks");
};