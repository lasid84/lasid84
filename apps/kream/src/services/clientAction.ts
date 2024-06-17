import { log } from "@repo/kwe-lib/components/logHelper";
import { executFunction } from "./api.services";

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
  }