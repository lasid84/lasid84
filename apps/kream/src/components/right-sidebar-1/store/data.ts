
import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { queryClient } from "@/components/react-query/queryClient";
const { log } = require('@repo/kwe-lib/components/logHelper');

export const SP_GetGridSettingLoad = async (param: any) => {  

  const { path, user_id, ipaddr } = paramsUtils(param);
  
  const params = {
    inparam: ["in_menu_code", "in_user_id", "in_ipaddr"],
    invalue: [ path, user_id, ipaddr],
    inproc: 'public.f_admn_get_column_width_load',
    isShowLoading: true
  }

  const result = await queryClient("SP_GetGridSettingLoad", params);
  return result;
}

export const SP_GetPersonalColInfoData = async (param: any) => {
  
  const { path, id, state = '', user_id, ipaddr } = paramsUtils(param);

  const params = {
    inparam: ["in_menu_code", "in_grid_id", "in_state", "in_user_id", "in_ipaddr"],
    invalue: [path, id, state, user_id, ipaddr],
    inproc: 'public.f_admn_get_column_width',
    isShowLoading: true
  }

  const result = await queryClient("SP_GetLoad", params);
  return result[0];
}

export const SP_SetGridInfoData = async (param: any) => {
  
  const { path, id, state = '', col_nms, col_widths, col_visibles, user_id, ipaddr } = paramsUtils(param);

  const params = {
    inparam: ["in_menu_code", "in_grid_id", "in_state", "in_col_nm", "in_col_width", "in_col_visible", "in_user_id", "in_ipaddr"],
    invalue: [path, id, state, col_nms, col_widths, col_visibles, user_id, ipaddr],
    inproc: 'public.f_admn_set_column_width4',
    isShowLoading: true,
    isShowComplete: true
  }

  const result = await queryClient("SP_GetLoad", params);
  return result[0];
}