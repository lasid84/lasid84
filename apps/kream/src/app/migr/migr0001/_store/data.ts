
import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { queryClient } from "@/components/react-query/queryClient";

import { log, error } from '@repo/kwe-lib-new';

export const SP_GetLoad = async () => {  

  const { user_id, ipaddr } = paramsUtils();
  
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'migration.f_migr0001_get_load',
    isShowLoading: false
  }

  const result = await queryClient("SP_GetLoad", params);
  return result;
}

export const SP_SetRTFToHtml = async (Params: any) => {

  const { cust_code, cust_mode, etc, user_id, ipaddr } = paramsUtils(Params);
  
  const params = {
    inparam: ["in_cust_code", "in_cust_mode", "in_etc", "in_user", "in_ipaddr"],
    invalue: [ cust_code, cust_mode, etc, user_id, ipaddr],
    inproc: 'migration.f_migr0001_ai_table_cust_d',
    isShowLoading: false
  }

  const result = await queryClient("SP_SetRTFToHtml", params);
}