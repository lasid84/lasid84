
import { executeKREAMFunction } from "@/services/api/apiClient";
const { log } = require('@repo/kwe-lib/components/logHelper');

import { paramsUtils } from "@/components/react-query/utils/paramUtils";

export const SP_GetLoad = async (searchParam:any) => {
  // unstable_noStore();
  const {user_id, ipaddr} = paramsUtils();
  
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [ user_id, ipaddr],
    inproc: 'airimp.f_airi4001_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executeKREAMFunction(params);
  return result;
}

export const SP_GetTransportData = async (searchParam: any) => {
  const {fr_date, to_date, search_gubn,  no} = searchParam;
  const {user_id, ipaddr} = paramsUtils();

  const params = {
    inparam : [
        "in_fr_date"
      , "in_to_date"
      , "in_gubn"
      , "in_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        fr_date
      , to_date
      , search_gubn
      , no
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4002_get_data',
    isShowLoading: true
  }

  console.log('params',params)

  const result = await executeKREAMFunction(params);
  console.log('f_airi4002_get_data',result)
  return result![0];
}



export const assignDTDItem = async (param: any) => {  
  //throw new Error("Test error from SP_SaveData"); // 에러 강제 발생
  const {jsondata, settlement_date} = param;
  const {user_id, ipaddr} = paramsUtils();

  
  const params = {
    inparam : [
       "in_jsondata"
      , "in_settlement_date"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      jsondata
      , settlement_date
      , user_id
      , ipaddr
    ],
    inproc: 'airimp.f_airi4002_ins_dtd2',
    isShowLoading: true
  }
  console.log('assignDTDItem',params)

  const result = await executeKREAMFunction(params);  
  return result!;
}



// export const SP_SaveUploadData = async (param: any) => {  

//   const {jsondata, settlement_date, user_id, ipaddr} = param;
//   log('jsondata+settlement_data', jsondata, settlement_date)
//   const params = {
//     inparam : [
//        "in_jsondata"
//       , "in_settlement_date"
//       , "in_user"
//       , "in_ipaddr"
//     ],
//     invalue: [
//       jsondata
//       , settlement_date
//       , user_id
//       , ipaddr
//     ],
//     inproc: 'airimp.f_airi4001_ins_upload_dtd',
//     isShowLoading: true
//   }

//   const result = await executeKREAMFunction(params);
//   return result!;
// }

// export const SP_UpdateData = async (param: any) => {  

//   const {jsondata, user_id, ipaddr} = param;
  
//   const params = {
//     inparam : [
//        "in_jsondata"
//       , "in_user"
//       , "in_ipaddr"
//     ],
//     invalue: [
//       jsondata
//       , user_id
//       , ipaddr
//     ],
//     inproc: 'airimp.f_airi4001_upd_dtd',
//     isShowLoading: true
//   }

//   const result = await executeKREAMFunction(params);
//   return result![0];
// }

