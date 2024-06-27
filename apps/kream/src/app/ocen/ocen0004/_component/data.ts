
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
    inproc: 'ocean.f_ocen0004_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executFunction(params);
  return result;
}

export const SP_GetMasterData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const {trans_mode, trans_type, user_id, ipaddr } = Param;  
  const params = {
    inparam : [
        "in_trans_mode"
      , "in_trans_type"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        trans_mode
      , trans_type
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen0004_get_place',
    isShowLoading: true
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_GetDetailData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]
  log("ocen0004 SP_GetDetailData", Param);
  const {place_code, cont_type, user_id, ipaddr } = Param;
  
  const params = {
    inparam : [
        "in_place_code"
      , "in_cont_type"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        place_code
      , cont_type
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen0004_get_detail',
    isShowLoading: false
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_UpdateMaster = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  const {place_code, place_nm, area_code, addr, remark, use_yn, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_place_code"
    , "in_place_nm"
    , "in_area_code"
    , "in_addr"
    , "in_remark"
    , "in_use_yn"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      place_code 
    , place_nm
    , area_code
    , addr
    , remark 
    , use_yn 
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen0004_upd_place_master',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_InsertMaster = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  const {place_code, place_nm, area_code, addr, remark, use_yn, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_place_code"
    , "in_place_nm"
    , "in_area_code"
    , "in_addr"
    , "in_remark"
    , "in_use_yn"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      place_code
    , place_nm
    , area_code
    , addr
    , remark
    , use_yn 
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen0004_ins_place_master',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_UpdateDetail = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  // log("SP_UpdateDetail", Param);
  const {place_code, cont_seq, cont_type, pic_nm, addr, email, tel_num, fax_num, def, remark, use_yn, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_place_code"
    , "in_cont_seq"
    , "in_cont_type"
    , "in_pic_nm"
    , "in_addr"
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
      place_code 
    , cont_seq 
    , cont_type
    , pic_nm 
    , addr 
    , email 
    , tel_num 
    , fax_num 
    , def 
    , remark 
    , use_yn 
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen0004_upd_place_detail',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_InsertDetail = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  const {place_code, cont_seq, cont_type, pic_nm, addr, email, tel_num, fax_num, def, remark, use_yn, user_id, ipaddr } = Param;
  log("SP_InsertDetail", Param)
  const params = {
    inparam : [
      "in_place_code"
    , "in_cont_seq"
    , "in_cont_type"
    , "in_pic_nm"
    , "in_addr"
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
      place_code 
    , cont_seq 
    , cont_type
    , pic_nm 
    , addr 
    , email 
    , tel_num 
    , fax_num 
    , def 
    , remark 
    , use_yn 
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen0004_ins_place_detail',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executFunction(params);
    return result![0];
}