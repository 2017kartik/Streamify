import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const res = await axiosInstance.post("/auth/sign-up", signupData);
  return res.data;
};

export const getAuthUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};
