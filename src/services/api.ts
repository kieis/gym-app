import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.data) {
      return Promise.reject(new AppError(error.response.data.message));
    }
    return Promise.reject(error);
  }
);

export { api };