

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
  return result![0]
}

export const SP_GetWBDetailData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { wb_no, user_id, ipaddr } = Param;

  const params = {
    inparam: [
        "in_wb_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      wb_no
      , user_id
      , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0001_get_wb_detail',
    isShowLoading: true
  }
  const result = await executFunction(params);
  return result
}


export const SP_InsertCharge = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  log("param : ", param)
  const {waybill_no, charge_code, charge_desc, sort_id, import_export_ind, ppc_ind, invoice_wb_amt, invoice_wb_currency_code, invoice_charge_amt	
    , invoice_currency_code, actual_cost_amt, cost_currency_code, vendor_id, vendor_ref_no, print_ind, vat_cat_code_ap, type, record_id, remark
    , user_id, ipaddr
  } = Param;
  const params = {
    inparam : [
      "in_waybill_no"
    , "in_charge_code"
    , "in_charge_desc"
    , "in_sort_id"
    , "in_import_export_ind"
    , "in_ppc_ind"
    , "in_invoice_wb_amt"
    , "in_invoice_wb_currency_code"
    , "in_invoice_charge_amt"
    , "in_invoice_currency_code"
    , "in_actual_cost_amt"
    , "in_cost_currency_code"
    , "in_vendor_id"
    , "in_vendor_ref_no"
    , "in_print_ind"
    , "in_vat_cat_code_ap"
    , "in_type"
    , "in_record_id"
    , "in_remark"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      waybill_no
    , charge_code
    , charge_desc
    , sort_id
    , import_export_ind
    , ppc_ind
    , invoice_wb_amt
    , invoice_wb_currency_code
    , invoice_charge_amt	
    , invoice_currency_code
    , actual_cost_amt
    , cost_currency_code
    , vendor_id
    , vendor_ref_no
    , print_ind
    , vat_cat_code_ap
    , type
    , record_id
    , remark
    , user_id
    , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0001_ins_charge_upload_data',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executFunction(params);
    log("SP_InsertCharge", result);
    return result![0];
}