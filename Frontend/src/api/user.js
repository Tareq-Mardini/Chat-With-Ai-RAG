import axios from "./private/axiosPrivate";

export const DisplayInfoUser = () => {
  return axios.get("/auth/me" );
};