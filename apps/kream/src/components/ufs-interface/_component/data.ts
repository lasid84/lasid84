

import { executFunction } from "@/services/api.services";

const { log } = require('@repo/kwe-lib/components/logHelper');

export const SCRAP_UFSP_HBL = 'SCRAP_UFSP_HBL';                           //(House BL 다운)
export const SCRAP_UFSP_MBL = 'SCRAP_UFSP_MBL';                           //(Master BL 다운)
export const SCRAP_UFSP_CHARGE_UPLOAD = 'SCRAP_UFSP_CHARGE_UPLOAD';       //(차지코드 업로드)
export const SCRAP_UFSP_PROFILE_CARRIER = 'SCRAP_UFSP_PROFILE_CARRIER';   //(Carrier 프로파일 다운)
export const SCRAP_UFSP_PROFILE_CUSTOMER = 'SCRAP_UFSP_PROFILE_CUSTOMER'; //(Customer 프로파일 다운)
export const SCRAP_UFSP_PROFILE_PORT = 'SCRAP_UFSP_PROFILE_PORT';         //(Port 프로파일 다운)
export const SCRAP_UFSP_INVOICING = 'SCRAP_UFSP_INVOICING';               //(인보이싱 업로드)
export const SCRAP_UFSP_CODE_MASTER = 'SCRAP_UFSP_CODE_MASTER';           // (코드 다운 - batch)

export const SP_CreateIFData = async (param: any) => {
  
  const Param = param;
  log('param',Param)
  const { pgm_code, id, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_pgm_code"
    , "in_blno"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      pgm_code
    , id
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
