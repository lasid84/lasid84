

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
    invalue: [ 'EDI810', ''],
    inproc: 'airimp.f_airi3001_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executFunction(params);
  return result;
}

export const SP_GetEDIData = async (searchParam: any) => {  
  const Param = searchParam.queryKey[1];
  const {fr_date, to_date, search_gubn, no, state, user_id, ipaddr} = Param;
  
  const params = {
    inparam : [
       "in_fr_date"
      , "in_to_date"
      , "in_gubn"  //0 : 810, 1: 858
      , "in_no"
      , "in_state"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      fr_date
      , to_date
      , search_gubn
      , no
      , state
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi3001_get_data',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}


export const SP_InsertData = async (searchParam: any) => {  
  const Param = searchParam.queryKey[1];
  const {fr_date, to_date, search_gubn, no, state, user_id, ipaddr} = Param;
  
  const params = {
    inparam : [
       "in_fr_date"
      , "in_to_date"
      , "in_gubn"  //0 : 810, 1: 858
      , "in_no"
      , "in_state"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      fr_date
      , to_date
      , search_gubn
      , no
      , state
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi3001_get_data',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}

export const SP_UpdateData = async (param: any) => {  
  const {waybill_no, invoice_no, user_id , ipaddr} = param;
  const params = {
    inparam : [
       "in_waybill_no"
      , "in_invoice_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      waybill_no
      , invoice_no
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi3001_upd_edi_data',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}