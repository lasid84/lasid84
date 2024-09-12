

import { toastError } from "@/components/toast";
import { executFunction, callUnipass, unipassAPI001 } from "@/services/api.services";
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
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'unipass.f_unip1001_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executFunction(params);
  return result;
}

export const SP_GetCustomsData = async (searchParam: any) => {
  
  var {search_gubn, blyy, blno, user_id, ipaddr } = searchParam.queryKey[1];
  
  const body = {
    blYy:blyy,
    hblNo:blno,
    user_id:user_id
  }

  let result = await callUnipass(unipassAPI001, body);
  
  if (result.status !== 200) {
    blno = null;
    toastError(result);
  } 

  const params = {
    inparam : [
        "in_type"  //0 : detail, 1: summary
      , "in_blno"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        search_gubn
      , blno
      , user_id
      , ipaddr
    ],
    inproc: 'unipass.f_unip1001_get_customs_data',
    isShowLoading: true
  }

  result = await executFunction(params);
  return result[0];

}