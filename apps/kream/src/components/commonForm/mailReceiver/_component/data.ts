

// import { executeKREAMFunction } from "@/services/api.services";
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';

export const TRANPOSRT_EMAIL_LIST_OE = "TRANPOSRT_EMAIL_LIST_OE";
export const CUSTOMER_EMAIL_LIST_OE = "CUSTOMER_EMAIL_LIST_OE";


// export const SP_Load = async (searchParam:any) => {
//   // unstable_noStore();
//   const {user_id, ipaddr} = searchParam;
//   const params = {
//     inparam: ["in_user", "in_ipaddr"],
//     invalue: [user_id, ipaddr],
//     inproc: 'account.f_acct3001_load',
//     isShowLoading: false
//   }
//   // log("Acct2003Load", p);
//   const result = await executeKREAMFunction(params);
//   return result;
// }

export const SP_GetMailReceiver = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { pgm_code, cust_code, user_id, ipaddr } = Param;  

  const params = {
    inparam : [
        "in_pgm_code"
      , "in_cust_code"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        pgm_code
      , cust_code
      , user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0013_get_email_rcvlist',
    isShowLoading: true
    }

    const result = await executeKREAMFunction(params);
    return result![0];
}
export const SP_SaveData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  // log("param : ", param)
  const { pgm_code, seq, email, remark,use_yn, user_id, ipaddr} = Param;
  const params = {
    inparam : [
      "in_pgm_code"
    , "in_seq"
    , "in_email"
    , "in_remark"
    , "in_use_yn"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      pgm_code
    , seq
    , email
    , remark
    , use_yn
    , user_id
    , ipaddr
    ],
    inproc: 'public.f_stnd0013_ins_email_rcvlist',
    isShowLoading: true,
    isShowComplete:true,
    }
  
    const result = await executeKREAMFunction(params);
    return result![0];
}
