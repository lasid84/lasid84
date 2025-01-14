

// import { executeKREAMFunction } from "@/services/api.services";
import { toastError } from "@/components/toast";
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';

export const SP_Load = async (searchParam: any) => {
  // unstable_noStore();
  const { user_id, ipaddr } = searchParam;
  const params = {
    inparam: ["in_user_id", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'ocean.f_ocen1000_load',
    isShowLoading: false
  }
  const result = await executeKREAMFunction(params);
  return result;
}


//SP_GetInvoiceMasterContent
export const SP_GetTemplateData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { template_id, user_id, ipaddr } = Param;

  const params = {
    inparam: ["in_template_id", "in_user", "in_ipaddr"],
    invalue: [template_id, user_id, ipaddr],
    inproc: 'ocean.f_ocen1001_get_bk_template',
    isShowLoading: true
  }
  const result = await executeKREAMFunction(params);

  return result;
}

//Create Template Data
export const SP_CreateTemplateData = async (param: any) => {
  const Param = param;

  const { 
    template_nm
    ,bk_dd
    , origin_terminal_id
    , dest_terminal_id
    , trans_mode
    , trans_type
    , vocc_id
    , customs_declation
    , state
    , milestone
    , bk_remark
    , shipper_id
    , shipper_cont_seq
    , sales_person
    , shp_remark
    , cnee_id
    , ts_port
    , vessel
    , port_of_loading
    , port_of_unloading
    , etd
    , eta
    , final_dest_port
    , final_eta
    , doc_close_dd
    , doc_close_tm
    , cargo_close_dd
    , cargo_close_tm
    , svc_type
    , movement_type
    , commodity
    , strategic_yn
    , cargo_remark
    , pickup_dd
    , pickup_tm
    , pickup_seq
    , pickup_loc
    , transport_company
    , cy_place_code
    , cy_cont_seq
    , carrier_code
    , carr_shipper_id
    , carr_cnee_id
    , cr_t_cont_seq
    , cr_s_cont_seq
    , cr_fak
    , cr_nac
    , carr_bl_type
    , bl_type
    , bill_type
    , incoterms
    , incoterms_remark
    , ams_yn
    , ams
    , aci_yn
    , aci
    , afr_yn
    , edi_yn
    , isf_yn
    , e_manifest_yn
    , use_yn
    , remark
    , cargo
    , cost
    , user_id, ipaddr } = Param;
  const params = {
    inparam: [
      "in_template_nm"
      ,"in_bk_dd"
      , "in_origin_terminal_id"
      , "in_dest_terminal_id"
      , "in_trans_mode"
      , "in_trans_type"
      , "in_vocc_id"
      , "in_customs_declation"
      , "in_state"
      , "in_milestone"
      , "in_bk_remark"
      , "in_shipper_id"
      , "in_shipper_cont_seq"
      , "in_sales_person"
      , "in_shp_remark"
      , "in_cnee_id"
      , "in_ts_port"
      , "in_vessel"
      , "in_port_of_loading"
      , "in_port_of_unloading"
      , "in_etd"
      , "in_eta"
      , "in_final_dest_port"
      , "in_final_eta"
      , "in_doc_close_dd"
      , "in_doc_close_tm"
      , "in_cargo_close_dd"
      , "in_cargo_close_tm"
      , "in_svc_type"
      , "in_movement_type"
      , "in_commodity"
      , "in_strategic_yn"
      , "in_cargo_remark"
      , "in_pickup_dd"
      , "in_pickup_tm"
      , "in_pickup_seq"
      , "in_pickup_loc"
      , "in_transport_company"
      , "in_cy_place_code"
      , "in_cy_cont_seq"
      , "in_carrier_code"
      , "in_carr_shipper_id"
      , "in_carr_cnee_id"
      , "in_cr_t_cont_seq"
      , "in_cr_s_cont_seq"
      , "in_cr_fak"
      , "in_cr_nac"
      , "in_carr_bl_type"
      , "in_bl_type"
      , "in_bill_type"
      , "in_incoterms"
      , "in_incoterms_remark"
      , "in_ams_yn"
      , "in_ams"
      , "in_aci_yn"
      , "in_aci"
      , "in_afr_yn"
      , "in_edi_yn"
      , "in_isf_yn"
      , "in_e_manifest_yn"
      , "in_use_yn"
      , "in_remark"
      , "in_cargo"
      , "in_cost"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      template_nm
      ,  bk_dd
      , origin_terminal_id
      , dest_terminal_id
      , trans_mode
      , trans_type
      , vocc_id
      , customs_declation
      , state
      , milestone
      , bk_remark
      , shipper_id
      , shipper_cont_seq
      , sales_person
      , shp_remark
      , cnee_id
      , ts_port
      , vessel
      , port_of_loading
      , port_of_unloading
      , etd
      , eta
      , final_dest_port
      , final_eta
      , doc_close_dd
      , doc_close_tm
      , cargo_close_dd
      , cargo_close_tm
      , svc_type
      , movement_type
      , commodity
      , strategic_yn
      , cargo_remark
      , pickup_dd
      , pickup_tm
      , pickup_seq
      , pickup_loc
      , transport_company
      , cy_place_code
      , cy_cont_seq
      , carrier_code
      , carr_shipper_id
      , carr_cnee_id
      , cr_t_cont_seq
      , cr_s_cont_seq
      , cr_fak
      , cr_nac
      , carr_bl_type
      , bl_type
      , bill_type
      , incoterms
      , incoterms_remark
      , ams_yn
      , ams
      , aci_yn
      , aci
      , afr_yn
      , edi_yn
      , isf_yn
      , e_manifest_yn
      , use_yn
      , remark
      , JSON.stringify(cargo)
      , JSON.stringify(cost.data)
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1001_ins_bk_template_data',
    isShowLoading: true,
    isShowComplete: true,
  }
  const result = await executeKREAMFunction(params);

  return result![0];
}
//Update Template Data
export const SP_UpdateTemplateData = async (param: any) => {
  const Param = param;
  const {
    template_id 
    ,template_nm    
    , bk_dd
    , origin_terminal_id
    , dest_terminal_id
    , trans_mode
    , trans_type
    , vocc_id
    , customs_declation
    , state
    , milestone
    , bk_remark
    , shipper_id
    , shipper_cont_seq
    , sales_person
    , shp_remark
    , cnee_id
    , ts_port
    , vessel
    , port_of_loading
    , port_of_unloading
    , etd
    , eta
    , final_dest_port
    , final_eta
    , doc_close_dd
    , doc_close_tm
    , cargo_close_dd
    , cargo_close_tm
    , svc_type
    , movement_type
    , commodity
    , strategic_yn
    , cargo_remark
    , pickup_dd
    , pickup_tm
    , pickup_seq
    , pickup_loc
    , transport_company
    , cy_place_code
    , cy_cont_seq
    , carrier_code
    , cr_t_cont_seq
    , cr_s_cont_seq
    , cr_fak
    , cr_nac
    , bl_type
    , bill_type
    , incoterms
    , incoterms_remark
    , ams_yn
    , ams
    , aci_yn
    , aci
    , afr_yn
    , edi_yn
    , isf_yn
    , e_manifest_yn
    , use_yn
    , remark, user_id, ipaddr } = Param;
  const params = {
    inparam: [
        "in_template_id"
      , "in_template_nm"
      , "in_bk_dd"
      , "in_origin_terminal_id"
      , "in_dest_terminal_id"
      , "in_trans_mode"
      , "in_trans_type"
      , "in_vocc_id"
      , "in_customs_declation"
      , "in_state"
      , "in_milestone"
      , "in_bk_remark"
      , "in_shipper_id"
      , "in_shipper_cont_seq"
      , "in_sales_person"
      , "in_shp_remark"
      , "in_cnee_id"
      , "in_ts_port"
      , "in_vessel"
      , "in_port_of_loading"
      , "in_port_of_unloading"
      , "in_etd"
      , "in_eta"
      , "in_final_dest_port"
      , "in_final_eta"
      , "in_doc_close_dd"
      , "in_doc_close_tm"
      , "in_cargo_close_dd"
      , "in_cargo_close_tm"
      , "in_svc_type"
      , "in_movement_type"
      , "in_commodity"
      , "in_strategic_yn"
      , "in_cargo_remark"
      , "in_pickup_dd"
      , "in_pickup_tm"
      , "in_pickup_seq"
      , "in_pickup_loc"
      , "in_transport_company"
      , "in_cy_place_code"
      , "in_cy_cont_seq"
      , "in_carrier_code"
      , "in_cr_t_cont_seq"
      , "in_cr_s_cont_seq"
      , "in_cr_fak"
      , "in_cr_nac"
      , "in_bl_type"
      , "in_bill_type"
      , "in_incoterms"
      , "in_incoterms_remark"
      , "in_ams_yn"
      , "in_ams"
      , "in_aci_yn"
      , "in_aci"
      , "in_afr_yn"
      , "in_edi_yn"
      , "in_isf_yn"
      , "in_e_manifest_yn"
      , "in_use_yn"
      , "in_remark"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      template_id
      , template_nm
      ,bk_dd
      , origin_terminal_id
      , dest_terminal_id
      , trans_mode
      , trans_type 
      , vocc_id
      , customs_declation
      , state
      , milestone
      , bk_remark
      , shipper_id 
      , shipper_cont_seq
      , sales_person
      , shp_remark
      , cnee_id
      , ts_port
      , vessel
      , port_of_loading	 
      , port_of_unloading
      , etd
      , eta
      , final_dest_port
      , final_eta
      , doc_close_dd
      , doc_close_tm
      , cargo_close_dd
      , cargo_close_tm
      , svc_type
      , movement_type
      , commodity
      , strategic_yn
      , cargo_remark
      , pickup_dd
      , pickup_tm
      , pickup_seq
      , pickup_loc
      , transport_company
      , cy_place_code
      , cy_cont_seq
      , carrier_code
      , cr_t_cont_seq
      , cr_s_cont_seq
      , cr_fak
      , cr_nac
      , bl_type
      , bill_type
      , incoterms
      , incoterms_remark
      , ams_yn
      , ams
      , aci_yn
      , aci
      , afr_yn
      , edi_yn
      , isf_yn
      , e_manifest_yn
      , use_yn
      , remark
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1001_upd_bk_template_data',
    isShowLoading: true,
    isShowComplete: false,
  }

  const result = await executeKREAMFunction(params);
  return result![0];
}

//shipper 담당자data get
export const SP_GetBkHblData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { bk_id, user_id, ipaddr } = Param;
  
  const params = {
    inparam: [
        "in_bk_id"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        bk_id 
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_get_bk_bl',
    isShowLoading: false
  }

  const result = await executeKREAMFunction(params);

  return result![0]
}



export const SP_GetCargoData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { bk_no, user_id, ipaddr } = Param;

  const params = {
    inparam: [
      "in_bk_id"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      bk_no
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_get_cargo',
    isShowLoading: true
  }
  const result = await executeKREAMFunction(params);

  return result![0];
}


//pickup 담당자data get
export const SP_GetPickupContData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]

  const {cust_code, pickup_type, user_id, ipaddr } = Param;

  const params = {
    inparam : [
        "in_cust_code"
      , "in_pickup_type"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
        cust_code
      , pickup_type
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen0003_get_detail',
    isShowLoading: false
    }
  
    const result = await executeKREAMFunction(params);

    return result![0];
}

//shipper 담당자data get
export const SP_GetShipperContData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { shipper_id, cont_type, user_id, ipaddr } = Param;

  if (shipper_id + "" === "") {
    return;
    toastError('Shipper Code를 선택해주세요')
  } else {
    const params = {
      inparam: [
        "in_cust_code"
        , "in_cont_type"
        , "in_user_id"
        , "in_ipaddr"
      ],
      invalue: [
        shipper_id  //  ' KR1058619'
        , cont_type   // 'ocen'
        , user_id
        , ipaddr
      ],
      inproc: 'ocean.f_ocen0002_get_detail',
      isShowLoading: false
    }

    const result = await executeKREAMFunction(params);

    return result![0]
  }
}

//shipper 담당자data get
export const SP_GetCarrierContData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { carrier_code, cont_type, user_id, ipaddr } = Param;

  if (carrier_code + "" === "") {
    return;
  } else {
    const params = {
      inparam: [
          "in_carrier_code"
        , "in_cont_type"
        , "in_user_id"
        , "in_ipaddr"
      ],
      invalue: [
          carrier_code
        , cont_type
        , user_id
        , ipaddr
      ],
      inproc: 'ocean.f_ocen0001_get_detail',
      isShowLoading: false
    }

    const result = await executeKREAMFunction(params);
    return result![0]
  }
}

export const SP_SaveTemplateCostData = async (param: any) => {
  const Param = param;  
  const { jsonData, user_id, ipaddr } = Param;

  const params = {
    inparam : [
      "in_jsondata"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      jsonData
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen1001_ins_bk_template_costdata',
    isShowLoading: true,
    isShowComplete:false,
    }

    const result = await executeKREAMFunction(params);

}

export const SP_SaveTemplateCargoData = async (param: any) => {
  const Param = param;  
  const { jsonData, user_id, ipaddr } = Param;

  const params = {
    inparam : [
      "in_jsondata"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      jsonData
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen1001_ins_bk_template_cargodata',
    isShowLoading: true,
    isShowComplete:false,
    }

    const result = await executeKREAMFunction(params);

}
