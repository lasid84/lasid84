
import { executFunction } from "@/services/api.services";
import { paramsUtils } from "@/components/react-query/utils/paramUtils";

const { log } = require('@repo/kwe-lib/components/logHelper');
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosResponse } from "axios";

interface cursorData {
  cursorData: {}[]
}

export const SP_Load = async () => {
  // unstable_noStore();
  const {user_id, ipaddr} = paramsUtils();
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'airimp.f_airi4001_load',
    isShowLoading: false
  }
  const result = await executFunction(params);
  return result;
}

//청구내역서 조회
export const SP_GetDTDMainData = async (searchParam: any) => {
  console.log('SP_GetDTDMainData', searchParam)  
  const {fr_date, to_date,  no, create_date} = searchParam;
  //user_id, ipaddr
  const params = {
    inparam : [
       "in_fr_date"
      , "in_to_date"
      , "in_no"
      , "in_create_user"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      fr_date
      , to_date
      , no
      , create_date
      , ''
      , ''
    ],
    inproc: 'airimp.f_airi4001_get_dtd_list',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}



//청구내역서 Detail 조회
export const SP_GetDTDDetailData = async (searchParam: any) => {
  console.log('SP_GetDTDDetailData', searchParam)  
  const { seq,  waybill_no} = searchParam;
  const {user_id, ipaddr} = paramsUtils();
  //user_id, ipaddr
  const params = {
    inparam : [
       "in_waybill_no"
      , "in_seq"
      , "in_create_user"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      waybill_no
      , seq
      , ''
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4001_get_dtd_detail',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}


//INSERT & UPDATE
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
    inproc: 'airimp.f_airi4001_ins_dtd2',
    isShowLoading: true
  }
  const result = await executFunction(params);  
  return result!;
}

export const SP_SaveUploadData = async (param: any) => {  

  const {jsondata, settlement_date} = param;
  const {user_id, ipaddr} = paramsUtils();
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
    inproc: 'airimp.f_airi4001_ins_upload_dtd2',
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