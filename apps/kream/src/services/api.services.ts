"use server"

import { auth } from '@/app/api/auth/auth';
import { RedirectType, redirect } from "next/navigation";

const { dataCall, postCall } = require('@repo/kwe-lib/components/api.service');
const { log } = require('@repo/kwe-lib/components/logHelper');

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

function init(isAuth: boolean | undefined, isShowLoading?: boolean) {

    const config = {
        isAuth: !isAuth ? false : isAuth,
        isShowLoading: !isShowLoading ? false : isShowLoading,
        url: process.env.NEXT_PUBLIC_API_URL
    }

    return config;
}

// export async function executFunctionAuth(params:exeFuncParams) {
    
//     const p = {
//         ...params,
//         isAuth: true
//     };
    
//     return executFunction(p);
// }

// export async function executFunctionNonAuth(params:exeFuncParams) {
    
//     const p = {
//         ...params,
//         isAuth: false
//     };
    
//     return executFunction(p);
// }

export async function executFunction(params:exeFuncParams) {
    console.log('a나한ㅌfldf')
    const session = await auth();

    // console.log("==============",session, params.isLoginPage)
    if (!session && !params.isLoginPage) {
        redirect("/login", RedirectType.replace);
    }

    try {
    const {inproc, inparam, invalue, isAuth, isShowLoading } = params;
    
    const config = await init(isAuth, isShowLoading);

    const returnData:returnData = await dataCall(inproc,inparam, invalue, config);
    const { cursorData, numericData, textData } = returnData;

    log("==",numericData + " : " + textData, params);

    if (numericData !== 0) {
        // alert(numericData + " : " + textData);

        log("==",numericData + " : " + textData);
        return null;
    }

    return cursorData;
    } catch (err) {
        const typedErr = err as Error
        log("executFunction", typedErr.message);
    }

};

export async function checkADLogin(params:checkLogin) {

    const initial = await init(false, false);
    const conig = {
        ...initial,
        url: initial.url + params.url,
        user_id: params.user_id,
        password: params.password
    };

    return await postCall(conig);
}

