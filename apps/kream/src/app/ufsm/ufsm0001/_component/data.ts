

import { executFunction } from "@/services/api.services";
import { MutationFunction } from "@tanstack/react-query";
import { unstable_noStore } from "next/cache";
import { FaBullseye } from "react-icons/fa6";

const { log } = require('@repo/kwe-lib/components/logHelper');
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosResponse } from "axios";

interface cursorData {
  cursorData: {}[]
}

export const SP_Load = async (searchParam: any) => {
  // unstable_noStore();
  const { user_id, ipaddr } = searchParam;
  const params = {
    inparam: ["in_user_id", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'ufsm.f_ufsm0001_load',
    isShowLoading: false
  }
  // log("Acct1004Load", p);
  const result = await executFunction(params);
  return result;
}

//SP_GetInvoiceMasterContent
export const SP_GetMasterDatax = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { waybill_no, user_id, ipaddr } = Param;

  const params = {
    inparam: [
      "in_hbl_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      waybill_no
      , user_id
      , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0001_load',
    isShowLoading: false
  }
  const result = await executFunction(params);
  console.log('result?',result)

  return result![0]
}

export const SP_GetMasterData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { wb_no, trans_mode, trans_type, fr_date, to_date, cust_code, user_id, ipaddr } = Param;

  const params = {
    inparam: [
        "in_wb_no"
      , "in_trans_mode"
      , "in_trans_type" 
      , "in_fr_dd"
      , "in_to_dd"
      , "in_cust"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      wb_no
      , trans_mode
      , trans_type
      , fr_date
      , to_date
      , cust_code
      , user_id
      , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0001_get_wb_main',
    isShowLoading: true
  }
  const result = await executFunction(params);
  log("params...", params)
  return result![0]
}

export const SP_GetWBSubData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { waybill_no, user_id, ipaddr } = Param;

  const params = {
    inparam: [
        "in_wb_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      waybill_no
      , user_id
      , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0001_get_wb_sub',
    isShowLoading: true
  }
  const result = await executFunction(params);
  return result as {}[];
}


// export const SP_GetDetailData = async (searchParam: any) => {
//   const Param = searchParam.queryKey[1]
//   const { waybill_no, trans_mode, trans_type, fr_date, to_date, cust_code, user_id, ipaddr } = Param;

//   const params = {
//     inparam: [
//         "in_wb_no"
//       , "in_trans_mode"
//       , "in_trans_type" 
//       , "in_fr_dd"
//       , "in_to_dd"
//       , "in_cust"
//       , "in_user"
//       , "in_ipaddr"
//     ],
//     invalue: [
//       waybill_no
//       , trans_mode
//       , trans_type
//       , fr_date
//       , to_date
//       , cust_code
//       , user_id
//       , ipaddr
//     ],
//     inproc: 'ufsm.f_ufsm0001_get_wb_main',
//     isShowLoading: true
//   }
//   log('result__SP_GetDetailData_param',Param)
//   const result = await executFunction(params);
//   console.log('result__SP_GetDetailData',result)
//   //return result![1];
//   return result!;
// }


export const SP_UpdateData = async (param: any) => {

  // const Param = searchParam.queryKey[1]
  const Param = param;
  log("param : ", param)
  const { invoice_no, on_board_dd, arrived_dd, user_id, ipaddr } = Param;
  const params = {
    inparam: [
      "in_invoice_no"
      , "in_on_board_dd"
      , "in_arrived_dd"
      , "in_user_id"
      , "in_ipaddr"
      , "in_form"
    ],
    invalue: [
      invoice_no
      , on_board_dd
      , arrived_dd
      , user_id
      , ipaddr
      ,'ACCT1004'
    ],
    inproc: 'account.f_acct1004_upd_invoice_master',
    isShowLoading: true,
    isShowComplete: true,
  }

  const result = await executFunction(params);
  return result![0];
}

export const SP_InsertData = async (param: any) => {

  // const Param = searchParam.queryKey[1]
  const Param = param;
  log("param : ", param)
  const { cust_code, pic_nm, email, cust_office, tel_num, user_dept, bz_plc_cd, use_yn, def, user_id, ipaddr } = Param;
  const params = {
    inparam: [
      "in_cust_code"
      , "in_pic_nm"
      , "in_email"
      , "in_cust_office"
      , "in_tel_num"
      , "in_user_dept"
      , "in_bz_plc_cd"
      , "in_use_yn"
      , "in_def"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      cust_code
      , pic_nm
      , email
      , cust_office
      , tel_num
      , user_dept
      , bz_plc_cd
      , use_yn
      , def
      , user_id
      , ipaddr
    ],
    inproc: 'account.f_acct3001_ins_cont_detail',
    isShowLoading: true,
    isShowComplete: false,
  }

  const result = await executFunction(params);
  return result![0];
}