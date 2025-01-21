import { toastSuccess, toastWaring } from "@/components/toast";

import { log, signJwtAccessToken } from '@repo/kwe-lib-new';
import { createApiClient } from '@repo/kwe-lib-new'
import { ProcedureResult } from '@repo/kwe-lib-new';
import { setupAxiosInterceptors } from "./apiInterceptors";
import { AuthRoutes, DataRoutes, FileRoutes } from "../api.constants";

type exeFuncParams = {
    inproc: string
    inparam: string[]
    invalue: string[]
    isAuth?: boolean | undefined
    isShowLoading?: boolean | undefined
    isLoginPage?: boolean | undefined
    isShowComplete?: boolean | undefined
};

const apiClient = createApiClient({
    baseURL: process.env.NEXT_PUBLIC_KREAM_API_URL
});

setupAxiosInterceptors(apiClient);

export async function checkADLogin(params: { user_id: string; password: string; }) {
  //로그인 할땐 토큰이 없어 인터셉터 없는 axios 객체 사용.. 구조 수정 필요
  const apiClient = createApiClient({
    baseURL: process.env.NEXT_PUBLIC_KREAM_API_URL
  });
  
  return await apiClient.post(AuthRoutes.URI.LOGIN, params);
}

const executeFunction = async (url: string, params:exeFuncParams) => {
    const {inproc, inparam, invalue, isShowComplete } = params;
    // const data = {inproc, inparam, invalue};
    const data = params;
    const config = {
      // withCredentials: true,  // 쿠키를 포함하기 위한 설정
    };
    const response = await apiClient.executeProcedure<ProcedureResult>(url, data, config);
    
    const { numericData, textData, cursorData } = response
    if (+numericData !== 0) {
        toastWaring((numericData + " : " + textData))
        return null;
    }
    if (isShowComplete) {
        toastSuccess(numericData + " : " + textData);
    }

    return cursorData || [];
}

export const executeKREAMFunction = async (params:exeFuncParams) => {
  const url = `${DataRoutes.BASE}${DataRoutes.URI.GET_DATA}`;
  const result = await executeFunction(url, params);

  return result;
}

export const executeTMSFunction = async (params:exeFuncParams) => {
  const url = `${DataRoutes.BASE}${DataRoutes.URI.GET_TMSDATA}`;
  const result = await executeFunction(url, params);

  return result;
}

export async function callUnipass(path:string, body:any) {
  /*
  1. getCargCsclPrgsInfoQry : 화물통관 진행 정보
  */ 
  const url = `${DataRoutes.BASE}${path}`;
  return await apiClient.post(url, body);
}

export async function callDescartes(apiType:string, body:any) {
  const url = `${DataRoutes.BASE}${DataRoutes.URI.GET_DESCARTES_CUSTOMS_INFO}`;
  return await apiClient.post(url, body);
}

export async function executeReportDownload(body:any) {
  const url = `${FileRoutes.BASE}/${FileRoutes.URI.REPORT_DOWNLOAD}`;
  return await apiClient.post(url, body);
}

export async function executeReportUpload(body:any) {
  const url = `${FileRoutes.BASE}/${FileRoutes.URI.REPORT_UPLOAD}`;
  return await apiClient.post(url, body);
}

export async function executeFileUpload(body:any) {
  const url = `${FileRoutes.BASE}/${FileRoutes.URI.REPORT_UPLOAD}`;
  return await apiClient.post(url, body);
}
