


// import { executeKREAMFunction, callUnipass, unipassAPI001 } from "@/services/api.services";
import { executeKREAMFunction } from "@/services/api/apiClient";

import { log } from '@repo/kwe-lib-new';

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
  const result = await executeKREAMFunction(params);
  return result;
}

export const SP_GetAppleMainData = async (searchParam: any) => {
  console.log('searchParam', searchParam)  
  //const Param = searchParam.queryKey[1];
  const {fr_date, to_date, search_gubn, no, state} = searchParam;
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
      , ''
      , ''
    ],
    inproc: 'airimp.f_airi3001_get_data',
    isShowLoading: true
  }

  const result = await executeKREAMFunction(params);
  console.log('result',result)
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

  const result = await executeKREAMFunction(params);
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

  const result = await executeKREAMFunction(params);
  return result![0];
}

export const SP_UpdateData = async (param: any) => {  

  const { waybill_no, invoice_no, declnum, mwb_no, exrate, incoterms, decldate, decltime, ccdate, 
          cctime, totaldeclvalue, totaldeclfltvalue, totaldeclinsvalue, jsonData, user_id, ipaddr } = param;
  const params = {
    inparam : [
        "in_waybill_no"
      , "in_invoice_no"
      , "in_declnum"
      , "in_mwb_no"
      , "in_exrate"
      , "in_incoterms"
      , "in_decldate"
      , "in_decltime"
      , "in_ccdate"
      , "in_cctime"
      , "in_totaldeclvalue"
      , "in_totaldeclfltvalue"
      , "in_totaldeclinsvalue"
      , "in_jsondata"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      waybill_no, invoice_no, declnum, mwb_no, exrate, incoterms, decldate, decltime, ccdate, 
      cctime, totaldeclvalue, totaldeclfltvalue, totaldeclinsvalue
    , jsonData
    , user_id
    , ipaddr
    ],
    inproc: 'airimp.f_airi3001_upd_edi_data',
    isShowLoading: true,
    isShowComplete:false,
    }

    
    console.log('param..', params)
  const result = await executeKREAMFunction(params);

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

  const result = await executeKREAMFunction(params);
  return result![0];
}