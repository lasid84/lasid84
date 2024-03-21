

import { executFunction } from "@/services/api.services";
import { unstable_noStore } from "next/cache";


const { log } = require('@repo/kwe-lib/components/logHelper');


interface cursorData {
  cursorData: {}[]
}

export const SP_Load = async (searchParam: any) => {
  // unstable_noStore();
  const { user_id, ipaddr } = searchParam;
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'public.f_stnd0005_load',
    isShowLoading: false
  }
   log("STND0005 Load");
  const result = await executFunction(params);
  return result;
}

export const SP_GetMasterData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]

  const { grp_cd, user_id, ipaddr } = Param;
  log("searchData:", Param);

  const params = {
    inparam: [
      "in_grp_cd"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      grp_cd
      , user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0005_get_codesetlist',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}


export const SP_UpdateData = async (param: any) => {
  console.log('params', param)
  const Param = param
  const { grp_cd, cd, cd_nm, cd_desc,cd_mgcd1, cd_mgcd2, use_yn, user_id, ipaddr } = Param;
  log("searchData:", grp_cd);

  const params = {
    // t(in_grp_cd text, in_cd text, in_cd_nm text, in_cd_desc text, in_cd_mgcd1 text, in_cd_mgcd2 text, in_use_yn text, in_user_id text, in_ipaddr text, OUT n_return integer, OUT v_return text, OUT c_return1 refcursor)

    inparam: [
      "in_grp_cd"
      , "in_cd"
      , "in_cd_nm"
      , "in_cd_desc"
      , "in_cd_mgcd1"
      , "in_cd_mgcd2"
      , "in_use_yn"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      grp_cd
      , cd
      , cd_nm
      , cd_desc
      , cd_mgcd1
      , cd_mgcd2
      , use_yn
      , user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0005_upd_codesetlist',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}

export const SP_InsertData = async (param: any) => {
  console.log('SP_CreateData_params', param)
  const Param = param
  const { grp_cd, cd, cd_nm, cd_desc,cd_mgcd1, cd_mgcd2, use_yn, user_id, ipaddr } = Param;
  log("searchData:", grp_cd);

  const params = {
    // t(in_grp_cd text, in_cd text, in_cd_nm text, in_cd_desc text, in_cd_mgcd1 text, in_cd_mgcd2 text, in_use_yn text, in_user_id text, in_ipaddr text, OUT n_return integer, OUT v_return text, OUT c_return1 refcursor)

    inparam: [
      "in_grp_cd"
      , "in_cd"
      , "in_cd_nm"
      , "in_cd_desc"
      , "in_cd_mgcd1"
      , "in_cd_mgcd2"
      , "in_use_yn"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      grp_cd
      , cd
      , cd_nm
      , cd_desc
      , cd_mgcd1
      , cd_mgcd2
      , use_yn
      , ''
      , ''
    ],
    inproc: 'public.f_stnd0005_ins_codesetlist',
    isShowLoading: true
  }

  const result = await executFunction(params);
  console.log('resultafds',result)
  return result![0];
}