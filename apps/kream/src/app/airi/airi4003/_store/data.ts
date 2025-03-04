import { log } from '@repo/kwe-lib-new';
import { executeKREAMFunction } from "@/services/api/apiClient";
import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { queryClient } from "@/components/react-query/queryClient";


export const SP_GetLoad = async () => {

  const {user_id, ipaddr} = paramsUtils();
  
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'airimp.f_airi4001_load',
    isShowLoading: false
  }

  const result = await executeKREAMFunction(params);
  return result;
}

export const SP_GetMainData = async (searchParam: any) => {
  const {fr_date, to_date, search_gubn,  no} = searchParam;
  const {user_id, ipaddr} = paramsUtils();

  const params = {
    inparam : [
        "in_fr_date"
      , "in_to_date"
      , "in_cust_id"
      , "in_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        fr_date
      , to_date
      , search_gubn
      , no
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4003_get_master',
    isShowLoading: true
  }
  const result = await queryClient("SP_GetPreInfoMainData",params);  
  return result![0];
}


export const SP_GetDetailData = async (searchParam: any) => {
  log('searchParam',searchParam)
  const {fr_date, to_date, cust_code,  no} = searchParam;
  const {user_id, ipaddr} = paramsUtils();

  const params = {
    inparam : [
        "in_fr_date"
      , "in_to_date"
      , "in_cust_id"
      , "in_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        fr_date
      , to_date
      , cust_code
      , no
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4003_get_detail',
    isShowLoading: true
  }
  const result = await queryClient("SP_GetPreInfoMainData",params);  
  return result![0];
}
