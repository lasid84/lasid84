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
};

export const SP_GetOperationListLoadData = async () => {  

  const { user_id, ipaddr } = paramsUtils();
  
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [user_id, ipaddr ],
    inproc: 'airimp.f_airi3004_get_load_data',
    isShowLoading: false
  };

  const result = await queryClient("SP_GetOperationListLoadData", params);
  return result;
};

export const SP_UpdateOperationListData = async (param: any) => {

  const { jsonData, fr_date, user_id, ipaddr } = paramsUtils(param);

  const params = {
    inparam: ["in_jsondata", "in_fr_date", "in_user", "in_ipaddr"],
    invalue: [jsonData, fr_date, user_id, ipaddr],
    inproc: 'airimp.f_airi3004_upd_data',
    isShowLoading: true,
    isShowComplete: true,
  };

  const result = await queryClient("SP_UpdateOperationListData", params);
  return result;
};

/**
 * @dev
 * 마일스톤 UFSP 등록을 위한 t_edi_history data 세팅
 */
export const SP_SetMileStoneEdiData = async (param: any) => {

  const { waybillList, user_id, ipaddr } = paramsUtils(param);

  const params = {
    inparam: ["in_waybill_list", "in_user", "in_ipaddr"],
    invalue: [waybillList, user_id, ipaddr],
    inproc: 'airimp.f_airi3004_set_milestone_edi',
    isShowLoading: true,
    isShowComplete: true,
  };

  await queryClient("SP_SetMileStoneEdiData", params);
};

/**
 * @dev
 * 마일스톤 데이터 검증을 위한 interface 데이터 조회
 */
export const SP_getMilestoneInterfaceData = async (param: any) => {
  const { waybillList, user_id, ipaddr } = paramsUtils(param);

  const params = {
    inparam: ["in_waybill_list", "in_user", "in_ipaddr"],
    invalue: [waybillList, user_id, ipaddr],
    inproc: 'airimp.f_airi3004_get_milestone_ufsp_data',
    isShowLoading: true,
    isShowComplete: true,
  };

  const result = await queryClient("SP_getMilestoneInterfaceData", params);
  return result;
}

/**
 * @dev
 * 마일스톤 데이터 등록을 위한 정보 조회
 */
export const SP_getMilestoneRegistListData = async (param: any) => {
  const { waybillList, user_id, ipaddr } = paramsUtils(param);

  const params = {
    inparam: ["in_waybill_list", "in_user", "in_ipaddr"],
    invalue: [waybillList, user_id, ipaddr],
    inproc: 'airimp.f_airi3004_get_milestone_regist_list',
    isShowLoading: true,
    isShowComplete: true,
  };

  const result = await queryClient("SP_getMilestoneRegistListData", params);
  return result;
}