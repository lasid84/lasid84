import {useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

const baseURL = 'http://10.33.63.50:5005';
//const baseURL = "http://10.33.63.171:5000" pr
// eslint-disable-next-line
const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

const getData = (searchParam: any) => {
  console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]
  const inparam = ["in_no", "in_user_id", "in_ipaddr"]
  const invalue = [Param.no, Param.user_id , '1.1.1.1']
  const inproc = 'account.f_acct1005_get_data';
  return axios.post<returnData>(`${baseURL}/api/data`, { inproc, inparam, invalue })
}

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export const Acct1005Load = () => {
  const inparam = ["in_user_id", "in_ipaddr"]
  const invalue = ['doni.lee.web', '10.33.33.96']
  const inproc = 'account.f_acct1005_load'

  return axios.post<returnData>(`${baseURL}/api/data`, { inproc, inparam, invalue })
}


//조회 command 처리 hooks. (hooks네이밍규칙은 use카멜케이스)
export const useGetData = (searchParam: any) => {
  console.log(searchParam, 'searchParam')
  const { isLoading, data, isError } = useQuery(["codeFind", searchParam], getData);
  return { data, isLoading, isError }
}


//LOAD hooks
export const useLoadData = () => {
  const { isLoading, data, isError } = useQuery(["Acct1005Load"], Acct1005Load)
  return { data, isLoading, isError }
}
