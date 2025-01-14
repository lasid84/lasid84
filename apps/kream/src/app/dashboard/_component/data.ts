import { executeKREAMFunction, executeTMSFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';

export const SP_Load = async (searchParam: any) => {
    const { user_id, ipaddr } = searchParam;

    const params = {
      inparam: ["in_user_id", "in_ipaddr"],
      invalue: [user_id, ipaddr],
      inproc: 'public.f_dashboard_load',
      isShowLoading: false
    }

    const result = await executeKREAMFunction(params);
    return result;
};

export const SP_InsertLog = async (param: any) => {
  
  const {menu_seq, menucode, buttontype, action, user_id, ipaddr } = param;
  const params = {
    inparam : [
      "in_userid"
    , "in_ipaddr"
    , "in_menecode"
    , "in_button"
    , "in_action"
    ],
    invalue: [
      user_id
    , ipaddr
    , menu_seq ? menu_seq : menucode
    , buttontype
    , action
    ],
    inproc: 'public.f_admn_ins_accesslog',
    isShowLoading: false,
    isShowComplete:false,
    }
    const result = await executeKREAMFunction(params);
};

// export const SP_TMS_DATA = async () => {
  
//   const params = {
//     inparam: ["in_type","in_nations","in_fr_dt","in_to_dt","in_office", "in_user_id", "in_ipaddr"],
//     invalue: ['','HK,MY,CN,US','20241101','20241231','I','', ''],
//     inproc: 'aic.P_AIRI1001_GET_REPORT_DATA',
//     isShowLoading: false,
//     isShowComplete: true
//   }

//   const result = await executeTMSFunction(params);
//   log("result", result);
//   return result;
// };