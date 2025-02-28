import { log } from '@repo/kwe-lib-new';
import { DataRoutes } from "@/services/api.constants";
import { executeKREAMFunction, callUnipass } from "@/services/api/apiClient";
import { paramsUtils } from "@/components/react-query/utils/paramUtils";
import { toastError } from "@/components/toast";
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
  let keys: string[] = [];
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

  const result = await executeKREAMFunction(params);

  if(result![0]?.data){
    result![0].data?.forEach(async (node:any)=>{
      const data = node;

      //axios timeout 오류로 반출신고,수입신고수리 상태가 아닌경우에만 unipass 요청대상으로 함
      if(data["__highlight"]==='N'){
        keys.push(data["waybill_no"]);
      }
    })
    const year = fr_date?.slice(0, 4);
 
    const body = {
      blYy:year,
      hblNo:keys.join(' '),
      user_id:user_id
    }
    log('body',body)
    let unipass_result = await callUnipass(DataRoutes.URI.GET_CARG_CSCL_PRGS_INFO_QRY, body);
    
    if (unipass_result.status !== 200) {    
      toastError(unipass_result);
    } 
  }
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
    // inproc: 'airimp.f_airi4002_ins_dtd2',
    inproc: 'airimp.f_airi4002_ins_domestic_inv',
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

