'use client'

// import { NextRequest, NextResponse } from "next/server";
import { useUserSettings } from "states/useUserSettings"
import { navigate, getSession, getCookies, getToken } from './serverAction';
import { toastSuccess, toastWaring } from "components/toast";


const { init, dataCall, postCall } = require('@repo/kwe-lib/components/api.service');
// import { init, dataCall, postCall } from '@repo/kwe-lib/components/api.service';
const { log } = require('@repo/kwe-lib/components/logHelper');
const { sleep } = require('@repo/kwe-lib/components/sleep');

const productionEnv = process.env.NODE_ENV === 'production';

type exeFuncParams = {
    inproc: string
    inparam: string[]
    invalue: string[]
    isAuth?: boolean | undefined
    isShowLoading?: boolean | undefined
    isLoginPage?: boolean | undefined
    isShowComplete?: boolean | undefined
};

type checkLogin = {
    url: string
    user_id: string
    password: string
}

type configs = {
    isAuth: boolean
    isShowLoading: boolean
    url: string
}

export interface returnData {
    cursorData: {}[]
    numericData: number;
    textData: string;
  }

function initConfig(isAuth: boolean | undefined, token:any) {

    const config = {
        isAuth: !isAuth ? false : isAuth,
        url: process.env.NEXT_PUBLIC_API_URL,
        accessToken: token
    }

    return config;
}

export async function executFunction(params:exeFuncParams) {

    // log("executeFunction", params);
    const session = await getSession();
    const token = await getToken();
    // log("executeFunction", session, token);
    // if (!session && !params.isLoginPage) {        
    if (!session) {        
        return navigate('/login');
    }

    try {      
        const {inproc, inparam, invalue, isAuth, isShowLoading, isShowComplete } = params;
        
         //log("===================");
         //const token = useUserSettings((state) => state.data.token);
         //log("===================",token);
        const config = await initConfig(isAuth, token);
        const client = await init(config);

        // log("isShowLoading", isShowLoading);
        if (isShowLoading) {
            client.interceptors.request.use(requestUseService, requestHasError);
            client.interceptors.response.use((response: any) => responseUseService(response), responseHasError);
        } 
        else {
            // useUserSettings.getState().actions.setData({ loading: "OFF" });
            client.interceptors.request.eject(requestUseService, requestHasError);
            client.interceptors.response.eject((response: any) => responseUseService(response), responseHasError);
        }

        const returnData:returnData = await dataCall(client, inproc,inparam, invalue, config);
        const { cursorData, numericData, textData } = returnData;

        // log("====================================", cursorData);

        if (numericData !== 0) {
            toastWaring((numericData + " : " + textData))
            // log("==",numericData + " : " + textData);
            return null;
        }
        if (isShowComplete) {
            toastSuccess(numericData + " : " + textData);
        }
        return cursorData;
    } catch (err) {
        const typedErr = err as Error
        log("executFunction", typedErr.message);
    } finally {
        // useUserSettings.getState().actions.setData({ loading: "OFF" });
    }

};

export async function checkADLogin(params:checkLogin) {

    // log("?")
    const initial = await initConfig(false, "");
    const config = {
        ...initial,
        url: initial.url + params.url,
        user_id: params.user_id,
        password: params.password
    };
    console.log(config);
    return await postCall(config);
}

const requestUseService = (config: any) => {
    log("requestUseService", config);
    useUserSettings.getState().actions.setData({ loading: "ON" });
    // const access_token = localStorage.getItem("access_token") || "";
    // config.headers["Authorization"] = `Bearer ${access_token}`;
    // log("requestUseService 시작 On")
    return config;
};

const requestHasError = (error: any) => {
    log("requestHasError");
    useUserSettings.getState().actions.setData({ loading: "OFF" });
    return Promise.reject(error);
};

const responseUseService = (response: any) => {
    // log("responseUseService");
    setTimeout(() => {
        useUserSettings.getState().actions.setData({ loading: "OFF" });
        log("requestUseService 시작 OFF")
    }, 300);
    return response;
};

const responseHasError = async (error: any) => {
    log("responseHasError");
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
