'use client'

// import { NextRequest, NextResponse } from "next/server";
import { useUserSettings } from "states/useUserSettings"
import { navigate, getSession, getCookies, getToken, getHeaders } from './serverAction';
import { toastSuccess, toastWaring } from "components/toast";
import { DataRoutes, FileRoutes } from "./api.constants";

const { initAPIService, apiCallPost, init, dataCall, postCall, getCall, responseBlobPostCall } = require('@repo/kwe-lib/components/api.service');
// import { init, dataCall, postCall } from '@repo/kwe-lib/components/api.service';
const { log } = require('@repo/kwe-lib/components/logHelper');
const { sleep } = require('@repo/kwe-lib/components/sleep');

const productionEnv = process.env.NODE_ENV === 'production';

export const unipassAPI001 = "getCargCsclPrgsInfoQry";
const unipassUrl = "/api/external/k-customs";

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


function initConfig(isAuth: boolean | undefined | null, token:any) {

    const config = {
        isAuth: !isAuth ? false : isAuth,
        url: process.env.NEXT_PUBLIC_API_URL,
        accessToken: token,
        // host: new URL(process.env.NEXT_PUBLIC_API_URL!).host //new URL(process.env.NEXT_PUBLIC_KREAM_URL!).host

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
        // log("====================================returnData : ", inproc, returnData);
        const { cursorData = [], numericData, textData } = returnData;

        

        if (numericData !== 0) {
            toastWaring((numericData + " : " + textData))
            // log("==",numericData + " : " + textData);
            // throw new Error(numericData + " : " + textData);
            return null;
        }
        if (isShowComplete) {
            toastSuccess(numericData + " : " + textData);
        }
        return cursorData;
    } catch (err) {
        log("executFunction", err);
        const typedErr = err as Error
        throw new Error(typedErr.message);
        
    } finally {
        //useUserSettings.getState().actions.setData({ loading: "OFF" });
    }

};

export async function callUnipass(apiType:string, body:any) {
    /*
    1. getCargCsclPrgsInfoQry : 화물통관 진행 정보
    */ 
    const token = await getToken();
    let config = await initConfig(null, token);

    // const urlParams = new URLSearchParams(params);
    const url = `${config.url}${unipassUrl}/${apiType}`;
    config = {
        ...config,
        ...body,
        url:url        
    };
    return await postCall(config);
}

export async function callDescartes(apiType:string, body:any) {
    /*
    1. getCargCsclPrgsInfoQry : 화물통관 진행 정보
    */ 
    const token = await getToken();
    let config = await initConfig(null, token);

    let path;
    switch(apiType) {
        case "0":
            path = DataRoutes.URI.GET_DESCARTES_CUSTOMS_INFO;
            break;
        default:
            path = DataRoutes.URI.GET_DESCARTES_CUSTOMS_INFO;
            break;
    }

    const url = `${config.url}${DataRoutes.BASE}/${path}`;
    config = {
        ...config,
        ...body,
        url:url        
    };

    const result = await postCall(config);
    return result;
}

export async function executeReportDownload(data:any) {
    const token = await getToken();
    let config = await initConfig(null, token);
    
    const url = `${config.url}${FileRoutes.BASE}${FileRoutes.URI.REPORT_DOWNLOAD}`;
    
    config = {
        ...config,
        ...data,
        url:url
    };
    return await responseBlobPostCall(config);
}

export async function executeReportUpload(data:any) {
    const token = await getToken();
    let config = await initConfig(null, token);
    
    const url = `${config.url}${FileRoutes.BASE}${FileRoutes.URI.REPORT_UPLOAD}`;
    
    config = {
        ...config,
        ...data,
        url:url
    };
    return await responseBlobPostCall(config);
}



export async function executeFileUpload(data:any) {
    const token = await getToken();
    let config = await initConfig(null, token);
    
    const url = `${config.url}${FileRoutes.BASE}${FileRoutes.URI.FILE_UPLOAD}`;
    
    config = {
        ...config,
        ...data,
        url:url
    };
    return await postCall(config);
}

// export const callSendEmail = async (params:exeFuncParams, attachments) => {
//     const session = await getSession();
//     if (!session) {        
//         return navigate('/login');
//     }

//     const client = initAPIService("2");
//     const params = {

//     }
//     return await apiCallPost(client, exeFuncParams);
// }

export async function checkADLogin(params:checkLogin) {
    const initial = await initConfig(false, "");
    const config = {
        ...initial,
        url: initial.url + params.url,
        user_id: params.user_id,
        password: params.password,
        // host: headers.get('x-forwarded-host')
        // host: new URL(process.env.NEXT_PUBLIC_API_URL!).host//new URL(process.env.NEXT_PUBLIC_KREAM_URL!).host//new URL(process.env.NEXT_PUBLIC_API_URL!).host
    };
    // log("log checkADLogin", config);
    return await postCall(config);
}

const requestUseService = (config: any) => {
    useUserSettings.getState().actions.setData({ loading: "ON" });
    // const access_token = localStorage.getItem("access_token") || "";
    // config.headers["Authorization"] = `Bearer ${access_token}`;
    // log("requestUseService 시작 On")
    return config;
};

const requestHasError = (error: any) => {
    useUserSettings.getState().actions.setData({ loading: "OFF" });
    return Promise.reject(error);
};

const responseUseService = (response: any) => {
    // log("responseUseService");
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
