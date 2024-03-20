import { AppError } from "@utils/AppError";
import axios, { AxiosError, AxiosInstance } from "axios";

import * as authTokenStorage from "@storage/authToken";

type SignOut = () => void;
type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing: boolean = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === "token.expired" ||
          requestError.response.data?.message === "token.invalid"
        ) {
          const { refresh_token } = (await authTokenStorage.get()) || {};
          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalReqConfig = requestError.config;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalReqConfig.headers = {
                    ...originalReqConfig.headers,
                    Authorization: `Bearer ${token}`,
                  };
                  resolve(api(originalReqConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isRefreshing = true;

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post("/sessions/refresh-token", {
                refresh_token,
              });

              await authTokenStorage.set({
                token: data.token,
                refresh_token: data.refresh_token,
              });

              if (
                originalReqConfig.data &&
                !(originalReqConfig.data instanceof FormData) //img upload fix
              ) {
                originalReqConfig.data = JSON.parse(originalReqConfig.data);
              }

              originalReqConfig.headers = {
                ...originalReqConfig.headers,
                Authorization: `Bearer ${data.token}`,
              };
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;

              failedQueue.forEach((req) => {
                req.onSuccess(data.token);
              });

              resolve(api(originalReqConfig));
            } catch (error: any) {
              failedQueue.forEach((req) => {
                req.onFailure(error);
              });

              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
              failedQueue = [];
            }
          });
        }

        signOut();
      }

      if (requestError?.response?.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      }
      return Promise.reject(requestError);
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
