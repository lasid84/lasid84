

import { executFunction } from "@/services/api.services";
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
    inparam: ["in_trans_mode", "in_trans_type", "in_user", "in_ipaddr"],
    invalue: ['', '', user_id, ipaddr],
    inproc: 'public.f_stnd0006_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executFunction(params);
  return result;
}

export const SP_GetData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const {trans_mode, trans_type, user_id, ipaddr } = Param;
  // log("searchData:", trans_mode, trans_type);
  
  const params = {
    inparam : [
        "in_user"
      , "in_ipaddr"
      , "in_trans_mode"
      , "in_trans_type"
    ],
    invalue: [
        user_id
      , ipaddr
      , trans_mode
      , trans_type
    ],
    inproc: 'public.f_stnd0006_get_chargesetlist',
    isShowLoading: true
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_UpdateData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  // log("param : ", param)
  const {trans_mode, trans_type, prod_gr_cd,charge_code,charge_desc,ass_transaction,category,major_category,report_category,vat_yn,billing_yn,vat_type,rem_prt_yn,vat_rt,fe_prt_yn,fins_yn,fe_ref_item,fin_category,use_yn,uas_gl_code,rem_prt_nm,bill_gr1_cd,bill_gr2_cd,gl_gr1_cd,gl_gr2_cd,user_id,ipaddr } = Param;
  // log("==================================SP_UpdateData:", Param,trans_mode,trans_type,prod_gr_cd,charge_code,charge_desc,ass_transaction,category,major_category,report_category,vat_yn,billing_yn,vat_type,rem_prt_yn,vat_rt,fe_prt_yn,fins_yn,fe_ref_item,fin_category,use_yn,uas_gl_code,rem_prt_nm,bill_gr1_cd,bill_gr2_cd,gl_gr1_cd,gl_gr2_cd,user_id,ipaddr);
  const params = {
    inparam : [
      "in_trans_mode"
    , "in_trans_type"
    , "in_prod_gr_cd"
    , "in_charge_code"
    , "in_charge_desc"
    , "in_ass_transaction"
    , "in_category"
    , "in_major_category"
    , "in_report_category"
    , "in_vat_yn"
    , "in_billing_yn"
    , "in_vat_type"
    , "in_rem_prt_yn"
    , "in_vat_rt"
    , "in_fe_prt_yn"
    , "in_fins_yn"
    , "in_fe_ref_item"
    , "in_fin_category"
    , "in_use_yn"
    , "in_uas_gl_code"
    , "in_rem_prt_nm"
    , "in_bill_gr1_cd"
    , "in_bill_gr2_cd"
    , "in_gl_gr1_cd"
    , "in_gl_gr2_cd"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      trans_mode
    , trans_type
    , prod_gr_cd
    , charge_code
    , charge_desc
    , ass_transaction
    , category
    , major_category
    , report_category
    , vat_yn
    , billing_yn
    , vat_type
    , rem_prt_yn
    , vat_rt
    , fe_prt_yn
    , fins_yn
    , fe_ref_item
    , fin_category
    , use_yn
    , uas_gl_code
    , rem_prt_nm
    , bill_gr1_cd
    , bill_gr2_cd
    , gl_gr1_cd
    , gl_gr2_cd
    , user_id
    , ipaddr
    ],
    inproc: 'public.f_stnd0006_upd_chargesetlist',
    isShowLoading: true,
    isShowComplete:true,
    }
  
    const result = await executFunction(params);
    return result![0];
}