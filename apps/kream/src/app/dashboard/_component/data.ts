import { executFunction } from "@/services/api.services";

export const SP_Load = async (searchParam: any) => {
    const { user_id, ipaddr } = searchParam;

    const params = {
      inparam: ["in_user_id", "in_ipaddr"],
      invalue: [user_id, ipaddr],
      inproc: 'public.f_dashboard_load',
      isShowLoading: false
    }

    const result = await executFunction(params);
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
    const result = await executFunction(params);
};