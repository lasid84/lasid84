

import { executFunction } from "@/services/api.services";
import { MutationFunction } from "@tanstack/react-query";
import { unstable_noStore } from "next/cache";
import { FaBullseye } from "react-icons/fa6";

const { log } = require('@repo/kwe-lib/components/logHelper');

export const SP_GetDetailData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]

  const {carrier_code, cont_type, user_id, ipaddr } = Param;
  log("search Detail Data:", Param);
  
  const params = {
    inparam : [
        "in_carrier_code"
      , "in_cont_type"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
        carrier_code
      , cont_type
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen0001_get_detail',
    isShowLoading: false
    }
  
    const result = await executFunction(params);
    log(`data.ts get_detail`, result)
    return result![0];
}

export const SP_UpdateData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  
  const {carrier_code, cont_type, cont_seq, pic_nm, email, tel_num,fax_num, remark, use_yn, def, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_carrier_code"
    , "in_cont_seq"
    , "in_cont_type"
    , "in_pic_nm"
    , "in_email"
    , "in_tel_num"
    , "in_fax_num"
    , "in_remark"
    , "in_use_yn"
    , "in_def"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      carrier_code
    , cont_seq
    , cont_type
    , pic_nm
    , email
    , tel_num
    , fax_num
    , remark
    , use_yn
    , def
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen0001_upd_cont_detail',
    isShowLoading: true,
    isShowComplete:false,
    }
  
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_InsertData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  const {carrier_code, cont_type, pic_nm, email, fax_num, tel_num, remark, use_yn, def, user_id, ipaddr} = Param;
  const params = {
    inparam : [
      "in_carrier_code"
    , "in_cont_type"
    , "in_pic_nm"
    , "in_email"
    , "in_tel_num"
    , "in_fax_num"
    , "in_remark"
    , "in_use_yn"
    , "in_def"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      carrier_code
    , cont_type
    , pic_nm
    , email
    , tel_num
    , fax_num
    , remark
    , use_yn
    , def
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen0001_ins_cont_detail',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executFunction(params);
    return result![0];
}



