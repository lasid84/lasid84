

import { executFunction } from "@/services/api.services";
import { MutationFunction } from "@tanstack/react-query";
import { unstable_noStore } from "next/cache";

const { log } = require('@repo/kwe-lib/components/logHelper');
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosResponse } from "axios";

interface cursorData {
  cursorData: {}[]
}

export const SP_Load = async (searchParam:any) => {
  // unstable_noStore();
  const {user_id, ipaddr} = searchParam;
  const params = {
    inparam: [ "in_user", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'public.f_stnd0010_load',
    isShowLoading: false
  }

  const result = await executFunction(params);
  return result;
}

export const SP_GetData = async (searchParam: any) => {
  console.log('searchParam', searchParam)
  const Param = searchParam.queryKey[1]

  const { trans_mode, user_id, ipaddr } = Param;

  const params = {
    inparam : [
      "in_trans_mode"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      trans_mode
      ,  user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0010_get_port',
    isShowLoading: true
    }
  
    const result = await executFunction(params);
    return result![0];
}


export const SP_CreateIFData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  const { in_pgm_code, port_code, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_pgm_code"
    , "in_blno"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      in_pgm_code
    , port_code
    , user_id
    , ipaddr
    ],
    inproc: 'scrap.f_scrp0001_ins_if_data',
    isShowLoading: true,
    isShowComplete:true,
    }
  
    const result = await executFunction(params);
    return result![0];
}


