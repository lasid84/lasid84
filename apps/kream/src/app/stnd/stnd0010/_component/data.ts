

// import { executeKREAMFunction } from "@/services/api.services";
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';

export const SP_Load = async (searchParam:any) => {
  // unstable_noStore();
  const {user_id, ipaddr} = searchParam;
  const params = {
    inparam: [ "in_user", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'public.f_stnd0010_load',
    isShowLoading: false
  }

  const result = await executeKREAMFunction(params);
  return result;
}

export const SP_GetData = async (searchParam: any) => {
  // console.log('searchParam', searchParam)
  const Param = searchParam.queryKey[1]

  const { trans_mode, user_id, ipaddr } = Param;

  const params = {
    inparam : [
      "in_trans_mode"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      trans_mode
      ,  user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0010_get_port',
    isShowLoading: true
    }
  
    const result = await executeKREAMFunction(params);
    return result![0];
}

