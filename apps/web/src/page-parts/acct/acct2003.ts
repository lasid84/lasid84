import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addInvoiceReq,
} from "page-parts/base/invoice/types/invoice-type";
import { toastSuccess, toastError } from "tmpl/toast";
import axios, { AxiosResponse } from "axios";

// const { data:initdata} = useLanguage()
// console.log('허허',initdata)

const baseURL = "http://10.33.63.171:5000"
// eslint-disable-next-line
const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

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
  return axios.post<returnData>(`${baseURL}/api/data`, { inproc, inparam, invalue })
}

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export const Acct2003Load = () => {
  const inparam = ["in_user_id", "in_ipaddr"]
  const invalue = ['doni.lee.web', '10.33.33.96']
  const inproc = 'account.f_acct2003_load'

  //const result = axios.post<returnData>(`${baseURL}/api/data`, {inproc, inparam, invalue})
  return axios.post<returnData>(`${baseURL}/api/data`, { inproc, inparam, invalue })
}


//조회 command 처리 hooks. (hooks네이밍규칙은 use카멜케이스)
export const useGetData = (searchParam: any) => {
  console.log(searchParam, 'searchParam')
  const { isLoading, data, isError } = useQuery(["codeFind", searchParam], codeFind);
  return { data, isLoading, isError }
}


//CODE LOAD hooks
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
  const response = await axios.post(`${baseURL}/api/data`, { inproc, inparam, invalue });

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
