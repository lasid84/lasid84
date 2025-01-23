


// import { executeKREAMFunction, callUnipass, unipassAPI001 } from "@/services/api.services";
import { queryClient } from "@/components/react-query/queryClient";
import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { executeKREAMFunction } from "@/services/api/apiClient";

import { log } from '@repo/kwe-lib-new';

export const SP_Load = async () => {
  // unstable_noStore();
  const {user_id, ipaddr} = paramsUtils();
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'airimp.f_airi3001_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executeKREAMFunction(params);
  return result;
}

export const SP_GetAppleMainData = async (searchParam: any) => {
  
  const {fr_date, to_date, search_gubn, no, state, user_id, ipaddr} = paramsUtils(searchParam);
  //user_id, ipaddr
  const params = {
    inparam : [
       "in_fr_date"
      , "in_to_date"
      , "in_gubn"  //0 : 810수신일, 1: 858송신일 
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

  const result = await executeKREAMFunction(params);
  return result![0];
}

export const SP_GetEDIDetailData = async (searchParam: any) => {  
  // const Param = searchParam.queryKey[1];
  const {waybill_no, invoice_no, user_id, ipaddr} = paramsUtils(searchParam);
  
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

  const result = await executeKREAMFunction(params);
  return result![0];
}

export const SP_GetExcelCustomsData = async (Params: any) => {  
  const {jsonData, user_id, ipaddr} = paramsUtils(Params);

  const params = {
    inparam : [
      "in_jsondata"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      jsonData
    , user_id
    , ipaddr
    ],
    inproc: 'airimp.f_airi3001_get_excel_customs',
    isShowLoading: true,
  }

  const result = await queryClient("SP_GetExcelCustomsData", params);
  return result;

}

export const SP_InsExcelCustomsData = async (Params: any) => {  
  const {jsonData, user_id, ipaddr} = paramsUtils(Params);

  const params = {
    inparam : [
      "in_jsondata"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      jsonData
    , user_id
    , ipaddr
    ],
    inproc: 'airimp.f_airi3001_ins_excel_customs',
    isShowLoading: true,
    isShowComplete: true
  }

  const result = await queryClient("SP_InsExcelCustomsData", params);
  return result;

}

export const SP_GetExtractHSCode = async (param: any) => {  
  const {keys, user_id , ipaddr} = paramsUtils(param);
  const params = {
    inparam : [
        "in_keys"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        keys
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi3001_get_hscode', //send_edi858
    isShowLoading: true
  }
  
  const result = await queryClient("SP_GetExtractHSCode", params);
  return result;
}

export const SP_SendEDI = async (param: any) => {  
  const {waybill_no, invoice_no, user_id , ipaddr} = paramsUtils(param);
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
  
  const result = await queryClient("SP_SendEDI", params);
  return result![0];
}