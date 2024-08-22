

import { executFunction } from "@/services/api.services";

const { log } = require('@repo/kwe-lib/components/logHelper');

interface cursorData {
  cursorData: {}[]
}

//SP_GetInvoiceMasterContent
export const SP_GetIFData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { fr_date, to_date, user_id, ipaddr } = Param;
  // log("===param", Param, bl_no, trans_mode, trans_type, fr_date, to_date, cust_code, user_id, ipaddr);

  const params = {
    inparam: [
        "in_fr_dd"
      , "in_to_dd"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        fr_date
      , to_date
      , user_id
      , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0003_get_if_data',
    isShowLoading: true
  }
  const result = await executFunction(params);
  // log("SP_GetIFData", result)
  return result![0]
}

export const SP_CreateIFData = async (param: any) => {
  
  const Param = param;
  const { upload_gubn, excel_data, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_gubn"
    , "in_excel_data"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      upload_gubn
    , excel_data
    , user_id
    , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0003_ins_charge_upload_excel',
    isShowLoading: true,
    isShowComplete: true,
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_GetExcelFormData = async (param: any) => {
  const Param = param;
  const { user_id, ipaddr } = Param;

  const params = {
    inparam : [
      "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      user_id
    , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0003_get_excel_form',
    isShowLoading: true,
    isShowComplete: false,
    }
  
    const result = await executFunction(params);
    return result![0];
}