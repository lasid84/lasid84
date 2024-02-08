import axios from "axios"
import { useUserSettings } from "../../../states/useUserSettings"

// 기본 API 서비스
export const ApiService = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});


const requestUseService = (config: any) => {
    useUserSettings.getState().actions.setData({ loading: "ON" });
    const access_token = localStorage.getItem("access_token") || "";
    config.headers["Authorization"] = `Bearer ${access_token}`;
    return config;
};

const requestHasError = (error: any) => {
    useUserSettings.getState().actions.setData({ loading: "OFF" });
    return Promise.reject(error);
};

const responseUseService = (response: any) => {
    setTimeout(() => {
        useUserSettings.getState().actions.setData({ loading: "OFF" });
    }, 300);
    return response;
};

const responseHasError = async (error: any) => {
    useUserSettings.getState().actions.setData({ loading: "OFF" });
    const originalRequest = error.config;
    // response가 없을 경우 : server connection fail
    if (!error.response) {
        useUserSettings
            .getState()
            .actions.setData({ hasError: true, errMsg: "서버로부터 응답이 없습니다." });
        return;
    }
}

ApiService.interceptors.request.use(requestUseService, requestHasError);
ApiService.interceptors.response.use((response) => responseUseService(response), responseHasError);