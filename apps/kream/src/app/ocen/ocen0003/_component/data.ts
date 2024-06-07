

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

export const SP_Load = async (searchParam:any) => {
  // unstable_noStore();
  const {user_id, ipaddr} = searchParam;
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'account.f_acct3001_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executFunction(params);
  return result;
}

export const SP_GetMasterData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const {user_id, ipaddr } = Param;  
  const params = {
    inparam : [
        "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
        user_id
      , ipaddr
    ],
    inproc: 'account.f_acct2011_get_cust',
    isShowLoading: true
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_GetDetailData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const {cust_code, pickup_type, user_id, ipaddr } = Param;
  log("search Detail Data:", Param);
  
  const params = {
    inparam : [
        "in_cust_code"
      , "in_pickup_type"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
        cust_code
      , pickup_type
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen0003_get_detail',
    isShowLoading: false
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_UpdateData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  log("param : ", param)
  const {cust_code,pickup_seq,pickup_type,pickup_nm,addr,pic_nm,email,tel_num,fax_num,def,remark,use_yn, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_cust_code"
    , "in_pickup_seq"
    , "in_pickup_nm"
    , "in_addr"
    , "in_pic_nm"
    , "in_email"
    , "in_tel_num"
    , "in_fax_num"
    , "in_def"
    , "in_remark"
    , "in_use_yn"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      cust_code
    , pickup_seq
    , pickup_nm
    , addr
    , pic_nm
    , email
    , tel_num
    , fax_num
    , def
    , remark
    , use_yn
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen0003_upd_pickup_detail',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_InsertData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  log("param : ", param)
  const {cust_code,pickup_seq,pickup_type,pickup_nm,addr,pic_nm,email,tel_num,fax_num,def,remark,use_yn, user_id, ipaddr} = Param;
  const params = {
    inparam : [
      "in_cust_code"
    , "in_pickup_seq"
    , "in_pickup_type"
    , "in_pickup_nm"
    , "in_addr"
    , "in_pic_nm"
    , "in_email"
    , "in_tel_num"
    , "in_fax_num"
    , "in_def"
    , "in_remark"
    , "in_use_yn"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      cust_code
    , pickup_seq
    , pickup_type
    , pickup_nm
    , addr
    , pic_nm
    , email
    , tel_num
    , fax_num
    , def
    , remark
    , use_yn
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen0003_ins_pickup_detail',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executFunction(params);
    return result![0];
}
