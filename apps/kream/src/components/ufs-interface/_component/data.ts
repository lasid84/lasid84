

import { executFunction } from "@/services/api.services";

const { log } = require('@repo/kwe-lib/components/logHelper');


export const SP_CreateIFData = async (param: any) => {
  
  const Param = param;
  log('param',Param)
  const { in_pgm_code, waybill_no, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_pgm_code"
    , "in_blno"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      in_pgm_code
    , waybill_no
    , user_id
    , ipaddr
    ],
    inproc: 'scrap.f_scrp0001_ins_if_data',
    isShowLoading: true,
    isShowComplete:true,
    }
  
    const result = await executFunction(params);
    return result![0];
}
