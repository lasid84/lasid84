

import { executFunction } from "@/services/api.services";

const { decrypt, encrypt } = require('@repo/kwe-lib/components/cryptoJS.js');

const { log } = require('@repo/kwe-lib/components/logHelper');


interface cursorData {
  cursorData: {}[]
}


// 함수 정의: 배열이나 문자열을 입력받아 value 값들을 쉼표로 구분된 문자열로 반환
function convertToCommaSeparatedString(data: (string | object | string[])[]): string {
  // 배열 요소를 처리하여 value 값을 추출하거나 문자열 그대로 사용
  const values = data.map(item => {
    if (typeof item === 'string') {
      // 쉼표로 구분된 문자열인 경우 그대로 반환
      if (item.includes(',')) {
        return item;
      }
      try {
        const parsedItem = JSON.parse(item);
        return parsedItem.value; // 객체인 경우 value 값 추출
      } catch (error) {
        console.error(`Error parsing JSON: ${item}`);
        return item; // 파싱 실패 시 그대로 반환
      }
    } else if (typeof item === 'object' && item !== null) {
      // 객체인 경우 value 값 추출
      return (item as any).value ?? item;
    } else if (Array.isArray(item)) {
      // 배열인 경우 재귀적으로 처리하여 쉼표로 구분된 문자열로 변환
      return convertToCommaSeparatedString(item);
    } else {
      return item; // 기타 경우는 그대로 반환
    }
  }).filter(value => value !== null && value !== undefined) as string[]; // null 및 undefined 필터링

  // 쉼표로 구분된 문자열로 변환
  return values.join(',');
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

  const { user_id, ipaddr } = Param;
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
  const { user_id2, ufs_pw, emp_no, ufs_id, perm_id, bz_plc_code, terminal_cd, use_yn, dept_cd, office_cd, remark, tel_num, edi_email, edi_id, edi_pass, upd_user, ip_addr } = Param;
  const ufs_pw2 = encrypt(ufs_pw)
  log("user SP_UpdateData", ufs_pw, ufs_pw2);
  const perm_id2 = convertToCommaSeparatedString(perm_id)

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
      , perm_id2
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
