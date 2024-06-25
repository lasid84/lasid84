

import { executFunction } from "@/services/api.services";

const { decrypt, encrypt } = require('@repo/kwe-lib/components/cryptoJS.js');

const { log } = require('@repo/kwe-lib/components/logHelper');


interface cursorData {
  cursorData: {}[]
}

export const SP_Load = async (searchParam: any) => {
  const { user_id, ipaddr } = searchParam;
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'public.f_stnd0001_load',
    isShowLoading: false
  }
  const result = await executFunction(params);
  return result;
}

export const SP_GetMasterData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]

  const {  user_id, ipaddr } = Param;
  log("searchData:", Param);

  const params = {
    inparam: [
      "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0001_get_user',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}


export const SP_UpdateData = async (param: any) => {
  const Param = param
  const {user_id2, ufs_pw, emp_no, ufs_id, perm_id, bz_plc_code, terminal_cd, use_yn, dept_cd, office_cd, remark, tel_num, edi_email, edi_id, edi_pass, upd_user, ip_addr } = Param;
  const ufs_pw2 = encrypt(ufs_pw)

  const params = {
    inparam: [
      "in_user_id"
      , "in_emp_no"
      , "in_ufs_id"
      , "in_ufs_pw"
      , "in_perm_id"
      , "in_bz_plc_cd"
      , "in_terminal_cd"
      , "in_use_yn"
      , "in_dept_cd"
      , "in_office_cd"
      , "in_remark"
      , "in_tel_num"
      , "in_edi_email"
      , "in_edi_id"
      , "in_edi_pass"
      , "in_upd_user"
      , "in_ipaddr"
    ],
    invalue: [
      user_id2
      , emp_no
      , ufs_id
      , ufs_pw2
      , perm_id
      , bz_plc_code
      , terminal_cd
      , use_yn
      , dept_cd
      , office_cd
      , remark
      , tel_num
      , edi_email
      , edi_id
      , edi_pass
      , upd_user
      , ip_addr
    ],
    inproc: 'public.f_stnd0001_upd_user',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}
