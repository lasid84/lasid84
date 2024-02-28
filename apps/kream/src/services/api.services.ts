'use client'

// import { NextRequest, NextResponse } from "next/server";
import { useUserSettings } from "states/useUserSettings"
import { navigate, getSession, getCookies, getToken } from './serverAction';


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

    const session = await getSession();
    const token = await getToken();
    log("executeFunction", session, token);
    // if (!session && !params.isLoginPage) {        
    if (!session) {        
        return navigate('/login');
    }

    try {      
        const {inproc, inparam, invalue, isAuth, isShowLoading } = params;
        
        // log("===================");
        // const token = useUserSettings((state) => state.data.token);
        // log("===================",token);
        const config = await initConfig(isAuth, token);
        const client = await init(config);

        if (isShowLoading) {
            client.interceptors.request.use(requestUseService, requestHasError);
            client.interceptors.response.use((response: any) => responseUseService(response), responseHasError);
        }

        const returnData:returnData = await dataCall(client, inproc,inparam, invalue, config);
        const { cursorData, numericData, textData } = returnData;

        // sleep(5000);
        log("here", returnData)
        if (numericData !== 0) {
            alert(numericData + " : " + textData);

            // log("==",numericData + " : " + textData);
            return null;
        }

        return cursorData;
    } catch (err) {
        const typedErr = err as Error
        // log("executFunction", typedErr.message);
    } finally {
        // useUserSettings.getState().actions.setData({ loading: "OFF" });
    }

};

export async function checkADLogin(params:checkLogin) {

    // log("?")
    const initial = await initConfig(false, "");
    const conig = {
        ...initial,
        url: initial.url + params.url,
        user_id: params.user_id,
        password: params.password
    };
    return await postCall(conig);
}

const requestUseService = (config: any) => {
    log("requestUseService");
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
    log("responseUseService");
    setTimeout(() => {
        useUserSettings.getState().actions.setData({ loading: "OFF" });
        // log("requestUseService 시작 OFF")
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
