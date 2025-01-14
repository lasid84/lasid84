

// import { executFunction } from "@/services/api.services";
import { executeKREAMFunction } from 'services/api/apiClient'
import { log, error } from '@repo/kwe-lib-new';

interface cursorData {
  cursorData: {}[]
}

export const SP_Load = async (searchParam:any) => {
  // unstable_noStore();
  const {user_id, ipaddr} = searchParam;
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'account.f_acct3001_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executeKREAMFunction(params);
  return result;
}

export const SP_GetMasterData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const {user_id, ipaddr } = Param;  
  const params = {
    inparam : [
        "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
        user_id
      , ipaddr
    ],
    inproc: 'account.f_acct2011_get_cust',
    isShowLoading: true
    }
  
    const result = await executeKREAMFunction(params);
    return result![0];
}
