

// import { executeKREAMFunction } from "@/services/api.services";
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';


export const SP_GetCYContactData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]
  const {place_code, cont_type, user_id, ipaddr } = Param;
  // log("SP_GetCYContactData", Param)
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
    isShowLoading: false,
    }
  
    const result = await executeKREAMFunction(params);
    return result![0];
}

export const SP_UpdateCYCont = async (param: any) => {
  
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
  
    const result = await executeKREAMFunction(params);
    return result![0];
}

export const SP_InsertCYCont = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  const {place_code, cont_seq, cont_type, pic_nm, addr, email, tel_num, fax_num, def, remark, use_yn, user_id, ipaddr } = Param;
  // log("SP_InsertDetail", Param)
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
  
    const result = await executeKREAMFunction(params);
    return result![0];
}