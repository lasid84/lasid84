

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
    inproc: 'ufsm.f_ufsm0002_load',
    isShowLoading: false
  }
  // log("Acct1004Load", p);
  const result = await executFunction(params);
  return result;
}

//SP_GetInvoiceMasterContent
export const SP_GetMasterData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { mwb_no, trans_mode, trans_type, fr_date, to_date, cust_code, user_id, ipaddr } = Param;
  // log("===param", Param, bl_no, trans_mode, trans_type, fr_date, to_date, cust_code, user_id, ipaddr);

  const params = {
    inparam: [
        "in_mwb_no"
      , "in_trans_mode"
      , "in_trans_type" 
      , "in_fr_dd"
      , "in_to_dd"
      , "in_cust"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        mwb_no
      , trans_mode
      , trans_type
      , fr_date
      , to_date
      , cust_code
      , user_id
      , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0002_get_wb_main',
    isShowLoading: true
  }
  const result = await executFunction(params);
  return result![0]
}
export const SP_GetWBSubData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { mwb_no, user_id, ipaddr } = Param;

  const params = {
    inparam: [
        "in_mwb_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        mwb_no
      , user_id
      , ipaddr
    ],
    inproc: 'ufsm.f_ufsm0002_get_wb_sub',
    isShowLoading: true
  }
  const result = await executFunction(params);
  return result as {}[];
}
