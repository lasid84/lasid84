import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { queryClient } from "@/components/react-query/queryClient";

export const SP_GetOperationListData = async (fr_date: string, waybill_no?: string) => {  

  const { user_id, ipaddr } = paramsUtils();
  
  const params = {
    inparam: ["in_fr_date", "in_no", "in_user", "in_ipaddr"],
    invalue: [fr_date, waybill_no, user_id, ipaddr ],
    inproc: 'airimp.f_airi3004_get_operation_list',
    isShowLoading: false
  };

  const result = await queryClient("SP_GetOperationListData", params);
  return result;
}