

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
    inproc: 'account.f_acct1004_load',
    isShowLoading: false
  }
  // log("Acct1004Load", p);
  const result = await executFunction(params);
  return result;
}

export const SP_GetMasterData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]
  console.log('paramg확인', Param)

  const { trans_mode, trans_type, fr_date, to_date, no, cust_code, user_id, ipaddr } = Param;
  log("search Master Data:", Param);
  log("search Master Data:", fr_date.replace(/[^0-9]/g, ""))


  const params = {
    inparam: [
      "in_trans_mode"
      , "in_trans_type"
      , "in_fr_date"
      , "in_to_date"
      , "in_no"
      , "in_cust_code"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      trans_mode
      , trans_type
      , fr_date.replace(/[^0-9]/g, "")
      , to_date.replace(/[^0-9]/g, "")
      , no
      , cust_code
      , user_id
      , ipaddr
    ],
    inproc: 'account.f_acct1004_get_master',
    isShowLoading: true
  }
  const result = await executFunction(params);
  console.log('result', result)
  return result![0]
}

export const SP_GetInvoiceMasterContent = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]

  const { invoice_no, user_id, ipaddr } = Param;

  const params = {
    inparam: [
      "in_trans_mode"
      , "in_trans_type"
      , "in_fr_date"
      , "in_to_date"
      , "in_no"
      , "in_cust_code"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      'ALL'
      , 'ALL'
      , '20230101'
      , '20230331'
      , invoice_no
      , ''
      , user_id
      , ipaddr
    ],
    inproc: 'account.f_acct1004_get_master',
    isShowLoading: true
  }
  const result = await executFunction(params);
  return result![0]
}

export const SP_GetDetailData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const { invoice_no, user_id, ipaddr } = Param;
  log("search Detail Data:", Param);

  const params = {
    inparam: [
      "in_invoice_no"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      invoice_no
      , user_id
      , ipaddr
    ],
    inproc: 'account.f_acct1002_get_detail',
    isShowLoading: false
  }

  const result = await executFunction(params);
  return result![0];
}


export const SP_UpdateData = async (param: any) => {

  // const Param = searchParam.queryKey[1]
  const Param = param;
  log("param : ", param)
  const { cust_code, cont_seq, pic_nm, email, cust_office, tel_num, user_dept, bz_plc_cd, use_yn, def, user_id, ipaddr } = Param;
  const params = {
    inparam: [
      "in_cust_code"
      , "in_cont_seq"
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
      , cont_seq
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
    inproc: 'account.f_acct3001_upd_cont_detail',
    isShowLoading: true,
    isShowComplete: false,
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