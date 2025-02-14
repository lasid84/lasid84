
// import { executFunction } from "@/services/api.services";
import { paramsUtils } from "@/components/react-query/utils/paramUtils";

// import { executeKREAMFunction, callUnipass, unipassAPI001 } from "@/services/api.services";
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';

export const SP_Load = async () => {
  // unstable_noStore();
  const {user_id, ipaddr} = paramsUtils();
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'airimp.f_airi4001_load',
    isShowLoading: false
  }
  const result = await executeKREAMFunction (params);
  return result;
}

//청구내역서 조회
export const SP_GetDTDMainData = async (searchParam: any) => {
  log('SP_GetDTDMainData', searchParam)  
  const {fr_date, to_date,  no, settlement_user,logis_id, broker_id} = searchParam;
  const {user_id, ipaddr} = paramsUtils();
  //user_id, ipaddr
  const params = {
    inparam : [
       "in_fr_date"
      , "in_to_date"
      , "in_no"
      , "in_settlement_user"
      , "in_logis_id"
      , "in_broker_id"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      fr_date
      , to_date
      , no
      , settlement_user
      , logis_id
      , broker_id
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4001_get_dtd_list',
    isShowLoading: true
  }
  log('params', params)

  const result = await executeKREAMFunction(params);
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
    inproc: 'airimp.f_airi4001_get_dtd_detail2',
    isShowLoading: false
  }

  const result = await executeKREAMFunction(params);
  console.log('result', result)
  return result![0];
}


//청구내역서 Detail 조회2
export const SP_GetDTDDetailData2 = async (searchParam: any) => {
  log('SP_GetDTDDetailData2', searchParam)  
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
    inproc: 'airimp.f_airi4001_get_dtd_detail22',
    isShowLoading: false
  }

  const result = await executeKREAMFunction(params);
  // console.log('f_airi4001_get_dtd_detail22 22', result)
  return result;
}


//청구내역서 Detail 조회 - LIST
export const SP_GetDTDDetailDatas = async (searchParam: any) => {  
  const { jsondata,  waybill_no} = searchParam;
  const {user_id, ipaddr} = paramsUtils();
  //user_id, ipaddr
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
    inproc: 'airimp.f_airi4001_get_dtd_detail4',
    isShowLoading: false
  }

  const result = await executeKREAMFunction(params);
  console.log('f_airi4001_get_dtd_detail4', result)
  return result;
}

//INSERT & UPDATE AT DTD INVOICE DETAIL
export const SP_SaveDTDDetail = async (param: any) => {  

  const {jsondata} = param;
  const {user_id, ipaddr} = paramsUtils();
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
    inproc: 'airimp.f_airi4001_ins_dtd_detail',
    isShowLoading: true
  }

  const result = await executeKREAMFunction(params);  
  return result!;
}



//INSERT & UPDATE AT AG-GRID
export const SP_SaveData = async (param: any) => {  
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
    inproc: 'airimp.f_airi4001_ins_dtd2',
    isShowLoading: true
  }

  const result = await executeKREAMFunction(params);  
  return result!;
}



//INSERT & UPDATE AT AG-GRID
export const SP_CloseDate = async (param: any) => {  
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
    inproc: 'airimp.f_airi4001_upd_closedate',
    isShowLoading: true
  }

  const result = await executeKREAMFunction(params);  
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

  const result = await executeKREAMFunction(params);
  return result!;
}

