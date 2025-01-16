// axiosInterceptors.ts
import { useUserSettings } from "@/states/useUserSettings";
import { log } from "@repo/kwe-lib-new";
import { AxiosInstance } from "axios";
import { getToken } from "../serverAction";
import { logOut } from "@/services/serverAction";
// import { redirect } from "next/dist/server/api-utils";
// import { redirect, RedirectType } from 'next/navigation';
import Router from 'next/router';

export const setupAxiosInterceptors = (apiClient: AxiosInstance) => {
    apiClient.interceptors.request.use(
        async (request) => {
          const token = await getToken();  //쿠키에서 가져오게끔 변경 예정
          // const token = localStorage.getItem('KREAMToken');
        
          if (token) {
            request.headers = request.headers || {};
            request.headers.Authorization = `${token}`;
          } 
                
          const { isShowLoading } = request.data;
          // log("interceptor 시작", request, isShowLoading);
          if (isShowLoading) {
            useUserSettings.getState().actions.setData({ loading: "ON" });
          }
      
          return request;
        },
        async (error) => {
          const originalRequest = error.config;
      
          try {
            const dataObj = JSON.parse(originalRequest.data);
            if (dataObj.isShowLoading) {
              useUserSettings.getState().actions.setData({ loading: "OFF" });
            }
          } catch (parseErr) {
            log("request : Failed to parse originalRequest.data:", parseErr);
          } finally {
            useUserSettings.getState().actions.setData({ loading: "OFF" });
          }
      
          return Promise.reject(error);
        }
      );
      
      apiClient.interceptors.response.use(
        async (response) => {
          const { isShowLoading = true } = JSON.parse(response.config.data);
          // log("interceptor 끝", response, response.config.data, isShowLoading);
          if (isShowLoading) {
            useUserSettings.getState().actions.setData({ loading: "OFF" });
          }
                
          return response;
        },
        async (error) => {
          const originalRequest = error.config;
      
          try {
            const dataObj = JSON.parse(originalRequest.data);
            if (dataObj.isShowLoading) {
              useUserSettings.getState().actions.setData({ loading: "OFF" });
            }
          } catch (parseErr) {
            log("response : Failed to parse originalRequest.data:", parseErr);
          } finally {
            useUserSettings.getState().actions.setData({ loading: "OFF" });
          }
      
          return Promise.reject(error);
        }
      );
}
