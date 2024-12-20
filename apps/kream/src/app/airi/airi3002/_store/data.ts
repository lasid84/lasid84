
import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { queryClient } from "@/components/react-query/queryClient";
const { log } = require('@repo/kwe-lib/components/logHelper');

export const SP_GetLoad = async () => {  

  const { user_id, ipaddr } = paramsUtils();
  
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'airimp.f_airi3002_load',
    isShowLoading: false
  }

  const result = await queryClient("SP_GetLoad", params);
  log("SP_GetLoad", result);
  return result;
}

export const SP_GetAppleMainData = async (searchParams: any) => {  

  const {fr_date, to_date, search_gubn, no, state, user_id, ipaddr } = paramsUtils(searchParams);
  
  const params = {
    inparam : [
       "in_fr_date"
      , "in_to_date"
      , "in_gubn"  //0 : 810, 1: 858
      , "in_no"
      , "in_state"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      fr_date
      , to_date
      , search_gubn
      , no
      , state
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi3001_get_data',
    isShowLoading: true
  }
  const result = await queryClient("SP_GetAppleMainData", params);
  
  return result[0];
}

export const SP_SaveAirTracker = async (param: any) => {
  const { jsonData, user_id, ipaddr } = paramsUtils(param);

  const params = {
    inparam : [
      "in_jsondata"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      jsonData
    , user_id
    , ipaddr
    ],
    inproc: 'airimp.f_airi3002_ins_air_tracker',
    isShowLoading: true,
    isShowComplete:true,
    }

    // log("SP_InsAirTracker", params);
    const result = await queryClient("SP_InsAirTracker", params);

}