

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
    inproc: 'ocean.f_ocen1000_load',
    isShowLoading: false
  }
  // log("Acct1004Load", p);
  const result = await executFunction(params);
  return result;
}

//SP_GetInvoiceMasterContent
export const SP_GetMasterData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { wb_no, state, create_user, fr_date, to_date, doc_fr_dt, doc_to_dt, bk_id, cust_code, user_id, ipaddr } = Param;
  log("===SP_GetMasterData", Param, fr_date, to_date, cust_code, user_id, ipaddr);

  const params = {
    inparam: [
      "in_fr_date"
      , "in_to_date"
      , "in_cust_code"
      , "in_wb_no"
      , "in_state"
      , "in_create_user"
      , "in_doc_fr_dt"
      , "in_doc_to_dt"
      , "in_bk_id"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      fr_date
      , to_date
      , cust_code
      , wb_no
      , state
      , create_user
      , doc_fr_dt
      , doc_to_dt
      , bk_id
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_get_bk_main',
    isShowLoading: true
  }
  const result = await executFunction(params);
  return result![0]
}

export const SP_CreateIFData = async (param: any) => {
  const Param = param;
  const { in_pgm_code, mwb_no, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_pgm_code"
    , "in_blno"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      in_pgm_code
    , mwb_no
    , user_id
    , ipaddr
    ],
    inproc: 'scrap.f_scrp0001_ins_if_data',
    isShowLoading: true,
    isShowComplete:true,
    }
  
    const result = await executFunction(params);
    return result![0];
}


export const SP_GetWBDetailData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { no, user_id, ipaddr } = Param;
  log('ocen1000 bk_no', no)

  const params = {
    inparam: [
      "in_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      no
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_get_bk_detail',
    isShowLoading: true
  }
  const result = await executFunction(params);
  return result
}
