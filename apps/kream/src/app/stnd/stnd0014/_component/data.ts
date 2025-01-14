

// import { executeKREAMFunction } from "@/services/api.services";
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';

export const SP_Load = async (searchParam:any) => {
  // unstable_noStore();
  const {user_id, ipaddr} = searchParam;
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'public.f_stnd0014_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executeKREAMFunction(params);
  return result;
}

export const SP_GetHolidayData = async (searchParam: any) => {
  // console.log('searchParam', searchParam)
  const Param = searchParam.queryKey[1]

  const {year, type, user_id, ipaddr } = Param;
  
  const params = {
    inparam : [
        "in_year"
      , "in_type"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        year
      , type
      , user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0014_get_holiday',
    isShowLoading: true
    }
  
    const result = await executeKREAMFunction(params);
    return result![0];
}

export const SP_SaveHoliday = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  const {
    solar_dd, day_nm, day_off, remark,
    user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_solar_dd"
    , "in_day_nm"
    , "in_day_off"
    , "in_remark"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      solar_dd
    , day_nm
    , day_off
    , remark
    , user_id
    , ipaddr
    ],
    inproc: 'public.f_stnd0014_upd_holiday',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executeKREAMFunction(params);
    return result![0];
}
