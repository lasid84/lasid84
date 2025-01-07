

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
    invalue: [ '', ''],
    inproc: 'airimp.f_airi4001_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executFunction(params);
  return result;
}

export const SP_GetTransportData = async (searchParam: any) => {
  const {fr_date, to_date, search_gubn,  no, user_id, ipaddr} = searchParam;

  const params = {
    inparam : [
        "in_fr_date"
      , "in_to_date"
      , "in_gubn"
      , "in_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        fr_date
      , to_date
      , search_gubn
      , no
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4002_get_data',
    isShowLoading: true
  }

  console.log('params',params)

  const result = await executFunction(params);
  console.log('f_airi4002_get_data',result)
  return result![0];
}

export const SP_GetEDIDetailData = async (searchParam: any) => {  
  // const Param = searchParam.queryKey[1];
  const {waybill_no, invoice_no, user_id, ipaddr} = searchParam;
  
  const params = {
    inparam : [
       "in_no"
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
    inproc: 'airimp.f_airi3001_get_detail',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}


export const SP_SaveData = async (param: any) => {  
  //throw new Error("Test error from SP_SaveData"); // 에러 강제 발생
  const {jsondata, settlement_date, user_id, ipaddr} = param;
  
  const params = {
    inparam : [
       "in_jsondata"
      , "in_settlement_date"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      jsondata
      , settlement_date
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4002_ins_dtd',
    isShowLoading: true
  }
  console.log('parpams',params)

  const result = await executFunction(params);  
  return result!;
}

// export const SP_SaveData = async (param: any) => {  

//   const {jsondata, user_id, ipaddr} = param;
  
//   const params = {
//     inparam : [
//        "in_jsondata"
//       , "in_user"
//       , "in_ipaddr"
//     ],
//     invalue: [
//       jsondata
//       , user_id
//       , ipaddr
//     ],
//     inproc: 'airimp.f_airi4001_ins_dtd',
//     isShowLoading: true
//   }

//   const result = await executFunction(params);
  
//   log('executefunction result', result)
//   return result!;
// }



export const SP_SaveUploadData = async (param: any) => {  

  const {jsondata, settlement_date, user_id, ipaddr} = param;
  log('jsondata+settlement_data', jsondata, settlement_date)
  const params = {
    inparam : [
       "in_jsondata"
      , "in_settlement_date"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      jsondata
      , settlement_date
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4001_ins_upload_dtd',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result!;
}

export const SP_UpdateData = async (param: any) => {  

  const {jsondata, user_id, ipaddr} = param;
  
  const params = {
    inparam : [
       "in_jsondata"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      jsondata
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4001_upd_dtd',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}

export const SP_SendEDI = async (param: any) => {  
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
    inproc: 'airimp.f_airi3001_send_edi858', //send_edi858
    isShowLoading: true
  }

  console.log('params..........',params)

  const result = await executFunction(params);
  return result![0];
}