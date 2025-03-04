

// import { executeKREAMFunction } from "@/services/api.services";
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';

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
  const result = await executeKREAMFunction(params);
  return result;
}

export const SP_GetMasterData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const {user_id, ipaddr } = Param;
  // log("search Master Data:", Param);
  
  const params = {
    inparam : [
        "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen0001_get_carrier',
    isShowLoading: true
    }
  
    const result = await executeKREAMFunction(params);
    return result![0];
}

export const SP_GetDetailData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]

  const {carrier_code, cont_type, user_id, ipaddr } = Param;
  // log("search Detail Data:", Param);
  
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
  
    const result = await executeKREAMFunction(params);
    // log(`data.ts get_detail`, result)
    return result![0];
}



export const SP_UpdateData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  // log("param : ", param)
  const {carrier_code, cont_type, cont_seq, pic_nm, email, cust_office, tel_num,fax_num, tax_num ,remark, bz_plc_cd, use_yn, def, user_id, ipaddr } = Param;
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
  
  
    const result = await executeKREAMFunction(params);
    return result![0];
}

export const SP_InsertData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  // log("param : ", param)
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
  
    const result = await executeKREAMFunction(params);
    return result![0];
}



