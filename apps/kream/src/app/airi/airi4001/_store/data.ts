import { paramsUtils } from "@/components/react-query/utils/paramUtils";
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

//ag-grid 청구내역서 조회
export const SP_GetDTDMainData = async (searchParam: any) => {
  const {fr_date, to_date,  no, settlement_user,logis_id, broker_id, dtd_fh} = searchParam;
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
      , "in_dtd_fh"
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
      , dtd_fh
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4001_get_domestic_inv_list',
    isShowLoading: true
  }
  log('wayparams1',params)
  const result = await executeKREAMFunction(params);
  return result![0];
}

//청구내역서 Detail 조회 - LIST
export const SP_GetDTDDetailDatas = async (searchParam: any) => {  
  const { jsondata,  waybill_no} = searchParam;
  const {user_id,t, ipaddr} = paramsUtils();
  //user_id, ipaddr
  const params = {
    inparam : [
       "in_jsondata"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      jsondata
      , t
      , ipaddr
    ],
    inproc: 'airimp.f_airi4001_get_domestic_detail_list',
    isShowLoading: false
  }
  const result = await executeKREAMFunction(params);
  return result;
}

//INSERT & UPDATE AT DTD INVOICE DETAIL
export const SP_SaveDomesticINVDetail = async (param: any) => {  

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
    // inproc: 'airimp.f_airi4001_ins_dtd_detail',
    inproc: 'airimp.f_airi4001_upd_domestic_inv_detail',
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
    inproc: 'airimp.f_airi4001_upd_domestic_inv',
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
    inproc: 'airimp.f_airi4001_ins_upload_dom',
    isShowLoading: true
  }

  const result = await executeKREAMFunction(params);
  return result!;
}
export const saveFinancialRecord = async (param: any) => {  
  const {waybill_no, seq, transaction_category, transaction_amount, transaction_date, transaction_remark } = param;
  const {user_id, ipaddr} = paramsUtils();

    const params = {
    inparam : [
       "in_waybill_no"       
      , "in_seq"
      , "in_transaction_category"      
      , "in_transaction_amount"
      , "in_transaction_date"      
      , "in_transaction_remark"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      waybill_no
      , seq
      , transaction_category
      , transaction_amount 
      , transaction_date
      , transaction_remark
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4003_ins_financial_transaction',
    isShowLoading: true
  }




  const result = await executeKREAMFunction(params);  
  return result!;
}
