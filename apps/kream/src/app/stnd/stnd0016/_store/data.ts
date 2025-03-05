
import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { queryClient } from "@/components/react-query/queryClient";

import { log, error } from '@repo/kwe-lib-new';

export const SP_GetLoad = async () => {  

  const { user_id, ipaddr } = paramsUtils();
  
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'public.f_stnd0016_load',
    isShowLoading: false
  }

  const result = await queryClient("SP_GetLoad", params);
  return result;
}

export const SP_GetCustDetailData = async (Params: any) => {  

  const { cust_code, cust_mode, user_id, ipaddr } = paramsUtils(Params);

  const params = {
    inparam: ["in_cust_code", "in_cust_mode", "in_user", "in_ipaddr"],
    invalue: [ cust_code, cust_mode, user_id, ipaddr],
    inproc: 'public.f_stnd0016_get_cust_data',
    isShowLoading: true
  }

  const result = await queryClient("SP_GetCustMainData", params);
  return result;
}

export const SP_SetCustDetailData = async (Params: any) => {  

  const { jsonData, user_id, ipaddr } = paramsUtils(Params);
  
  const params = {
    inparam: ["in_jsondata", "in_user", "in_ipaddr"],
    invalue: [ jsonData, user_id, ipaddr],
    inproc: 'public.f_stnd0016_set_cust_data',
    isShowLoading: true,
    isShowComplete: true
  }

  const result = await queryClient("SP_SetCustDetailData", params);
  return result;
}

export const SP_GetCustChargeData = async (Params: any) => {  

  const { cust_code, cust_mode, shipping_type, user_id, ipaddr } = paramsUtils(Params);
  
  const params = {
    inparam: ["in_cust_code", "in_cust_mode", "in_shipping_type", "in_user", "in_ipaddr"],
    invalue: [ cust_code, cust_mode, shipping_type, user_id, ipaddr],
    inproc: 'public.f_stnd0016_get_cust_charge',
    isShowLoading: false
  }

  const result = await queryClient("SP_GetCustChargeData", params);
  return result;
}

export const SP_SetRTFToHtml = async (Params: any) => {

  const { cust_code, cust_mode, etc, user_id, ipaddr } = paramsUtils(Params);
  
  const params = {
    inparam: ["in_cust_code", "in_cust_mode", "in_etc", "in_user", "in_ipaddr"],
    invalue: [ cust_code, cust_mode, etc, user_id, ipaddr],
    inproc: 'migration.f_mig_ai_table_cust_d',
    isShowLoading: false
  }

  const result = await queryClient("SP_SetRTFToHtml", params);
  log("finish SP_SetRTFToHtml", result, params)
}

export const SP_GetTransportFee = async (Params: any) => {  

  const { cust_code, cust_mode, user_id, ipaddr } = paramsUtils(Params);
  
  const params = {
    inparam: ["in_cust_code", "in_cust_mode", "in_user", "in_ipaddr"],
    invalue: [ cust_code, cust_mode, user_id, ipaddr],
    inproc: 'public.f_stnd0016_get_transport_fee',
    isShowLoading: false
  }

  const result = await queryClient("SP_GetTransportFee", params);
  return result;
}

export const SP_SetTransportFee = async (Params: any) => {  

  const { jsonData, user_id, ipaddr } = paramsUtils(Params);
  
  const params = {
    inparam: ["in_jsondata", "in_user", "in_ipaddr"],
    invalue: [ jsonData, user_id, ipaddr],
    inproc: 'public.f_stnd0016_set_transport_fee',
    isShowLoading: true,
    isShowComplete: true
  }

  const result = await queryClient("SP_SetTransportFee", params);
  return result;
}