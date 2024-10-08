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