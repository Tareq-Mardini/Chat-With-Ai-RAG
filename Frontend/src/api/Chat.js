import axios from "./private/axiosPrivate";

export const DisplayChats = () => {
  return axios.get("/auth/chats");
};

export const CreateChats = (data) => {
    return axios.post("/auth/chats", data);
}