
import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { queryClient } from "@/components/react-query/queryClient";


export const SP_GetLoad = async () => {  

  const { user_id, ipaddr } = paramsUtils();
  
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'airimp.f_airi3002_load',
    isShowLoading: false
  }

  const result = await queryClient("SP_GetLoad", params);
  return result;
}

export const SP_GetAppleMainData = async (searchParams: any) => {  

  const {fr_date, to_date, search_gubn, no, state, user_id, ipaddr } = paramsUtils(searchParams);
  
  const params = {
    inparam : [
        "in_search_gubn"
      , "in_fr_date"
      , "in_to_date"
      , "in_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        search_gubn
      , fr_date
      , to_date
      , no
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi3002_get_data',
    isShowLoading: true
  }
  const result = await queryClient("SP_GetPreInfoMainData", params);
  
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
    return result;
}

export const SP_SaveP5S1 = async (param: any) => {
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
    inproc: 'airimp.f_airi3002_ins_p5s1',
    isShowLoading: true,
    isShowComplete:true,
    }

    // log("SP_InsAirTracker", params);
    const result = await queryClient("SP_SaveP5S1", params);
    return result;
}

export const SP_SetAppleMainData = async (param: any) => {
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
    inproc: 'airimp.f_airi3002_upd_data',
    isShowLoading: true,
    isShowComplete:true,
    }

    // log("SP_InsAirTracker", params);
    const result = await queryClient("SP_SetAppleMainData", params);
    // return result;
}