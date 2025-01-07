
import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { queryClient } from "@/components/react-query/queryClient";
const { log } = require('@repo/kwe-lib/components/logHelper');

export const SP_GetLoad = async () => {  

  const { user_id, ipaddr } = paramsUtils();
  
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'public.f_stnd0015_load',
    isShowLoading: false
  }

  const result = await queryClient("SP_GetLoad", params);
  return result;
}

export const SP_GetMainData = async (searchParams: any) => {  

  const {trans_mode, trans_type, search_cust_code: cust_code, user_id, ipaddr } = paramsUtils(searchParams);
    
  const params = {
    inparam : [
        "in_trans_mode"
      , "in_trans_type"
      , "in_cust_code"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        trans_mode
      , trans_type
      , cust_code
      , user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0015_get_data',
    isShowLoading: true
  }
  const result = await queryClient("SP_GetPreInfoMainData", params);
  
  return result[0];
}

export const SP_SetMainData = async (Params: any) => {  

  const {user_id, ipaddr} = paramsUtils(Params);

  const params = {
    inparam : [
        "in_jsondata"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        JSON.stringify(Params)
      , user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0015_set_data',
    isShowLoading: true,
    isShowComplete: true
  }
  const result = await queryClient("SP_SetMainData", params);
  
  return result[0];
}
