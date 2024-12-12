

import { executFunction, executeReportDownload } from "@/services/api.services";

const { log } = require('@repo/kwe-lib/components/logHelper');

interface cursorData {
  cursorData: {}[]
}

export const SP_GetPersonalColInfoData = async (searchParam: any) => {
  // unstable_noStore();
  if (!searchParam.queryKey[1]) return null;

  let { path, id, state, user_id, ipaddr } = searchParam.queryKey[1];
  if (!id) return null;
  // state = state ? 'Minimized' : 'Normal';
  //2024.09.25 메뉴 접었을때 폇을때가 크게 중요한거 같지 않음
  state = ''

  const params = {
    inparam: ["in_menu_code", "in_grid_id", "in_state", "in_user_id", "in_ipaddr"],
    invalue: [path, id, state, user_id, ipaddr],
    inproc: 'public.f_admn_get_column_width',
    isShowLoading: false
  }
  const result = await executFunction(params);
  return result?.length ? result[0] : null;
}

export const SP_SetMyColumnInfo = async (searchParam: any) => {
  // unstable_noStore();
  
  let { path, id, state, col_nm, col_width, col_visible, user_id, ipaddr } = searchParam;
  state = state ? 'Minimized' : 'Normal';
  //2024.09.25 메뉴 접었을때 폇을때가 크게 중요한거 같지 않음
  state = ''

  const params = {
    inparam: ["in_menu_code", "in_grid_id", "in_state", "in_col_nm", "in_col_width", "in_col_visible", "in_user_id", "in_ipaddr"],
    invalue: [path, id, state, col_nm, col_width, col_visible, user_id, ipaddr],
    inproc: 'public.f_admn_set_column_width4',
    isShowLoading: false
  }
  const result = await executFunction(params);
  return result?.length ? result : null;
}


export const SP_InitMyColumnInfo = async (searchParam: any) => {
  // unstable_noStore();
  
  let { path, id, state, col_nm, col_width, col_visible, user_id, ipaddr } = searchParam;
  state = state ? 'Minimized' : 'Normal';
  //2024.09.25 메뉴 접었을때 폇을때가 크게 중요한거 같지 않음
  state = ''

  const params = {
    inparam: ["in_menu_code", "in_grid_id", "in_state", "in_user_id", "in_ipaddr"],
    invalue: [path, id, state, user_id, ipaddr],
    inproc: 'public.f_admn_set_init_column_width2',
    isShowLoading: true,
    isShowComplete: true
  }
  const result = await executFunction(params);
  return result?.length ? result[0] : null;
}
