

// import { executeKREAMFunction } from "@/services/api.services";
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';


export const SP_GetUFSChargeData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const {trans_mode, trans_type, user_id, ipaddr } = Param;
  
  const params = {
    inparam : [
        "in_trans_mode"
      , "in_trans_type"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        trans_mode
      , trans_type
      , user_id
      , ipaddr
    ],
    inproc: 'ufsm.f_common_get_charge',
    isShowLoading: false
    }
  
    const result = await executeKREAMFunction(params);
    return result![0];
}




