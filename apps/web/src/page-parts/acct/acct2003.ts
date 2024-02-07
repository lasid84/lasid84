import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addInvoiceReq,
} from "page-parts/base/invoice/types/invoice-type";
import { toastSuccess, toastError } from "tmpl/toast";
import axios, { AxiosResponse } from "axios";
import { useUserSettings } from "states/useUserSettings";

// const { data:initdata} = useLanguage()
// console.log('허허',initdata)

const baseURL = 'http://10.33.63.50:5005';
//const baseURL = "http://10.33.63.171:5000" pr
// eslint-disable-next-line
const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}


const codeFind = (searchParam: any) => {
  console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]
  const inparam = ["in_trans_mode"
    , "in_trans_type"
    , "in_office_cd"
    , "in_no"
    , "in_fr_date"
    , "in_to_date"
    , "in_fr_inv_date"
    , "in_to_inv_date"
    , "in_cust_code"
    , "in_issue_or"
    , "in_user_id"
    , "in_ipaddr"]
  const invalue = [Param.trans_mode, Param.trans_type, Param.office_cd, Param.no, Param.fr_date.replace(reg, ''), Param.to_date.replace(reg, ''), Param.fr_inv_date, Param.to_inv_date, Param.cust_code,
  Param.issue_or, 'doni.lee', '1.1.1.1']
  const inproc = 'account.f_acct2003_get_master';
  return ApiNonAuthService.post<returnData>(`/api/data`, { inproc, inparam, invalue })
}



export const Acct2003Load = () => {
  const inparam = ["in_user_id", "in_ipaddr"]
  const invalue = ['doni.lee.web', '10.33.33.96']
  const inproc = 'account.f_acct2003_load'

  //const result = axios.post<returnData>(`${baseURL}/api/data`, {inproc, inparam, invalue})
  return ApiNonAuthService.post<AxiosResponse>(`/api/data`, { inproc, inparam, invalue })
}


//조회 command 처리 hooks. (hooks네이밍규칙은 use카멜케이스)
export const useGetData = (searchParam: any) => {
  console.log(searchParam, 'searchParam')
  const { isLoading, data, isError } = useQuery(["codeFind", searchParam], codeFind);
  return { data, isLoading, isError }
}


// CODE LOAD hooks
export const useLoadData = () => {
  const { isLoading, data, isError } = useQuery(["Acct2003Load"], Acct2003Load)
  return { data, isLoading, isError }
}



/* 계산서 생성  */
export async function create(params: addInvoiceReq): Promise<any> {
  //eslint-disable-next-line
  console.log("create 세금계산서 : ", JSON.stringify(params, null, 2));

  const inproc = 'account.f_acct2003_ins_create_tax';
  const inparam = ['in_invoices', 'in_bill_dd', 'in_issue_or', 'in_merge_type', 'in_cust_code', 'in_user_id', 'in_ipaddr', 'in_form']
  const invalue = [params.no, params.fr_date, 'COD', '3', '', 'doni.lee', '', '']
  const response = await ApiNonAuthService.post(`/api/data`, { inproc, inparam, invalue });

  console.log('create계산서 response', response)
  return response;
}

/* 계산서 생성 hook */
export const useCreateCode = () => {
  const queryClient = useQueryClient();

  return useMutation(create, {
    // onSuccess: async (res) => {
    //   const { result } = res;
    //   if(res.data.numericData!==0){
    //     toastError(res.data.textData);
    //     return { textdata : res.data.textData}
    //   }else{
    //       //queryClient.invalidateQueries(["codeFind"]) get(새로고침)사용안함.
    //       toastSuccess("계산서생성이 완료되긴했는데  ")
    //       return  res
    //   }
    // },
    onSettled: async (res) => {
      if (res.data.numericData !== 0) {
        toastError(res.data.textData);
        return { textdata: res.data.textData }
      } else {
        //queryClient.invalidateQueries(["codeFind"]) get(새로고침)사용안함.
        toastSuccess("onSettled: 계산서생성이 완료 되었습니다.")
        return res
      }
    },
    onError: async (error) => {
      toastSuccess("code 등록에 오류가 있습니다.");
    },

  })
}

// 기본 API 서비스
export const ApiNonAuthService = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});


const responseUseService = (response: any) => {
  setTimeout(() => {
    useUserSettings.getState().actions.setData({ loading: "OFF" });
  }, 300);
  return response;
};


const requestUseService = (config: any) => {
  useUserSettings.getState().actions.setData({ loading: "ON" });
  const access_token = localStorage.getItem("access_token") || "";
  config.headers["Authorization"] = `Bearer ${access_token}`;
  return config;
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
  // Access Token was expired
  console.log("ApiService.interceptor ===>", JSON.stringify(error.response.data));
  if (error.response.status === 404) {
    useUserSettings
      .getState()
      .actions.setData({ hasError: true, errMsg: error.response.data.message });
    return;
  }
  if (
    error.response.status === 401 &&
    error.response.data.message === "Unauthorized" &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    const storedToken = localStorage.getItem("refresh_token") || "";
    const storedUserId = localStorage.getItem("user_id") || "";
    // Token refresh 요청
    try {
      const rs = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        user_id: storedUserId,
        refresh_token: storedToken,
      });
      const { access_token, refresh_token } = rs.data;

      // Local Storage 저장, 사용자 정보는 Login시에 저장됨
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // ApiService.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      // return ApiService(originalRequest);
    } catch (_error) {
      localStorage.clear();
      window.location.href = "/login";
    }
  } else {
    return error.response;
  }
};


const requestHasError = (error: any) => {
  useUserSettings.getState().actions.setData({ loading: "OFF" });
  return Promise.reject(error);
};
// 응답 인터셉터 추가
ApiNonAuthService.interceptors.response.use(
  (response) => responseUseService(response),
  responseHasError
);

// 요청 인터셉터 추가
ApiNonAuthService.interceptors.request.use(requestUseService, requestHasError);