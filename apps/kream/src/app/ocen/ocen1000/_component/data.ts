

import { executFunction } from "@/services/api.services";
import { MutationFunction } from "@tanstack/react-query";
import { unstable_noStore } from "next/cache";
import { FaBullseye } from "react-icons/fa6";

import { toastError } from "components/toast";
const { log } = require('@repo/kwe-lib/components/logHelper');
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosResponse } from "axios";

interface cursorData {
  cursorData: {}[]
}

export const SP_Load = async (searchParam: any) => {
  // unstable_noStore();
  const { user_id, ipaddr } = searchParam;
  const params = {
    inparam: ["in_user_id", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'ocean.f_ocen1000_load',
    isShowLoading: false
  }
  const result = await executFunction(params);
  return result;
}


export const SP_GetMData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { no, search_gubn, state, create_user, fr_date, to_date, doc_fr_dt, doc_to_dt, bk_id, cust_code, user_id, ipaddr } = Param;

  const params = {
    inparam: [
        "in_fr_date"
      , "in_to_date"
      , "in_cust_code"
      , "in_no"
      , "in_search_gubn"
      , "in_state"
      , "in_create_user"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
        fr_date
      , to_date
      , cust_code
      , no
      , search_gubn
      , state
      , create_user
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_get_bk_main2',
    isShowLoading: true
  }

  const result = await executFunction(params);
  log('mainData Result', result)
  log('mainData Result?', result![0])
  return result
}

export const SP_GetMasterData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { no, search_gubn, state, create_user, fr_date, to_date, doc_fr_dt, doc_to_dt, bk_id, cust_code, user_id, ipaddr } = Param;

  const params = {
    inparam: [
        "in_fr_date"
      , "in_to_date"
      , "in_cust_code"
      , "in_no"
      , "in_search_gubn"
      , "in_state"
      , "in_create_user"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
        fr_date
      , to_date
      , cust_code
      , no
      , search_gubn
      , state
      , create_user
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_get_bk_main2',
    isShowLoading: true
  }

  const result = await executFunction(params);
  log('mainData Result', result)
  log('mainData Result?', result![0])
  return result![0]
}

//Create BookingNote
export const SP_CreateData = async (param: any) => {
  const Param = param;

  const { bk_dd
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
      "in_bk_dd"
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
        bk_dd
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
    inproc: 'ocean.f_ocen1000_ins_bk_data',
    isShowLoading: true,
    isShowComplete: false,
  }
  const result = await executFunction(params);

  return result![0];
}
//Update BookingNote
export const SP_UpdateData = async (param: any) => {
  const Param = param;
  const {
    bk_id 
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
        "in_bk_id"
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
      bk_id
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
    inproc: 'ocean.f_ocen1000_upd_bk_data',
    isShowLoading: true,
    isShowComplete: false,
  }
  const result = await executFunction(params);
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

  const result = await executFunction(params);

  return result![0]
}

//shipper 담당자data get
export const SP_GetBkTemplateData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { user_id, ipaddr } = Param;
  
  const params = {
    inparam: [
        "in_user"
      , "in_ipaddr"
    ],
    invalue: [
        user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_get_bk_template',
    isShowLoading: false
  }

  const result = await executFunction(params);
  // log('result??',result)
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
  const result = await executFunction(params);
  //log('getCargo?', result)

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
  
    const result = await executFunction(params);

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

    const result = await executFunction(params);

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

    const result = await executFunction(params);
    return result![0]
  }
}

export const SP_InsertCargo = async (param: any) => {
  const Param = param;
  
  const {  bk_id					   , seq 		        , piece				        , pkg_type 
          , slac_stc 			   , stc_uom 			  , container_refno 		, container_type      , seal_no 
          , description		   , measurement		, measurement_uom	    , gross_wt		        , gross_uom       , chargeable_wt          , chargeable_uom
          , volume_factor    , volume_wt 			, volume_uom 			    , commodity_cd        , dg_yn 
          , hs_cd 			     , length         , width 			        , height 			
          , weight           , soc            , empty               , temp 
          , vent 			       , un_no 	        , remark              , use_yn 
          , user_id          , ipaddr
  } = Param;

  const params = {
    inparam : [
      "in_bk_id" 
      , "in_seq" 
      , "in_container_type" 
      , "in_piece" 
      , "in_pkg_type" 
      , "in_container_refno" 
      , "in_seal_no"
      , "in_slac_stc" 
      , "in_stc_uom" 
      , "in_gross_wt" 
      , "in_gross_uom" 
      , "in_measurement" 
      , "in_measurement_uom" 
      , "in_dg_yn" 
      , "in_length" 
      , "in_width" 
      , "in_height" 
      , "in_weight" 
      , "in_soc" 
      , "in_empty" 
      , "in_temp" 
      , "in_vent" 
      , "in_un_no" 
      , "in_class" 
      , "in_volume_factor" 
      , "in_commodity_cd" 
      , "in_hs_cd" 
      , "in_remark" 
      , "in_use_yn" 
      , "in_user_id" 
      , "in_ipaddr" 
    ],
    invalue: [
      bk_id				
      , seq 				
      , container_type				
      , piece 
      , pkg_type 			
      , container_refno 			
      , seal_no 		
      , slac_stc 
      , stc_uom 
      , gross_wt		
      , gross_uom		
      , measurement	 
      , measurement_uom		
      , dg_yn
      , length  
      , width 			
      , height 			
      , weight
      , soc
      , empty 
      , temp 
      , vent 			
      , un_no 					
      , "class"	 //class ????				
      , volume_factor   
      , commodity_cd 
      , hs_cd 
      , remark 
      , use_yn 
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_ins_cargo_detail',
    isShowLoading: true,
    isShowComplete:false,
    }

    const result = await executFunction(params);

    return result![0];
}

//update cargo 업데이트
//select box 업데이트
// 이벤트 2개 만들기
//1. (piece로 늘어나는 컴포넌트의 cargo_type, piece 웹이 안보이게 처리)
//2. 체크박스 same처리.
//3. use_yn

export const SP_UpdateCargo = async (param: any) => {
  const Param = param;
  
  const {  bk_id					   , seq 		        , piece				        , pkg_type 
          , slac_stc 			   , stc_uom 			  , container_refno 		, container_type      , seal_no 
          , description		   , measurement		, measurement_uom	    , gross_wt		        , gross_uom       , chargeable_wt          , chargeable_uom
          , volume_factor    , volume_wt 			, volume_uom 			    , commodity_cd        , dg_yn 
          , hs_cd 			     , length         , width 			        , height 			
          , weight           , soc            , empty               , temp 
          , vent 			       , un_no 	        , remark              , use_yn 
          , user_id          , ipaddr
} = Param;
  const params = {
    inparam : [
      "in_bk_id" 
      , "in_seq" 
      , "in_container_type" 
      , "in_piece" 
      , "in_pkg_type" 
      , "in_container_refno" 
      , "in_seal_no"
      , "in_slac_stc" 
      , "in_stc_uom" 
      , "in_gross_wt" 
      , "in_gross_uom" 
      , "in_measurement" 
      , "in_measurement_uom" 
      , "in_dg_yn" 
      , "in_length" 
      , "in_width" 
      , "in_height" 
      , "in_weight" 
      , "in_soc" 
      , "in_empty" 
      , "in_temp" 
      , "in_vent" 
      , "in_un_no" 
      , "in_class" 
      , "in_volume_factor" 
      , "in_commodity_cd" 
      , "in_hs_cd" 
      , "in_remark" 
      , "in_use_yn" 
      , "in_user_id" 
      , "in_ipaddr" 
    ],
    invalue: [
      bk_id				
      , seq 				
      , container_type				
      , piece 
      , pkg_type 			
      , container_refno 			
      , seal_no 		
      , slac_stc 
      , stc_uom 
      , gross_wt		
      , gross_uom		
      , measurement	 
      , measurement_uom		
      , dg_yn
      , length  
      , width 			
      , height 			
      , weight
      , soc
      , empty 
      , temp 
      , vent 			
      , un_no 					
      , "class"	 //class ????				
      , volume_factor   
      , commodity_cd 
      , hs_cd 
      , remark 
      , use_yn 
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_upd_cargo_detail',
    isShowLoading: true,
    isShowComplete:false,
    }
    log('params',params)

    const result = await executFunction(params);

    return result![0];
}


//cost data get
export const SP_GetCostData = async (searchParam: any) => {
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
    inproc: 'ocean.f_ocen1000_get_cost',
    isShowLoading: true
  }
  const result = await executFunction(params);

  return result![0];
  
}


export const SP_InsertCost = async (param: any) => {
  // const Param = searchParam.queryKey[1]
  const Param = param;
  
  const {   bk_id					            , waybill_no        , remark              , charge_code 		           , charge_desc				  , sort_id 
          , import_export_ind         , ppc_ind   			  , invoice_wb_amt 	  	, invoice_wb_currency_code   , invoice_charge_amt 
          , invoice_currency_code		  , actual_cost_amt		, cost_currency_code	, vendor_id		               , vendor_ref_no 
          , print_ind                 , vat_cat_code_ap 	, type                , category_code       , use_yn                     , user_id            , ipaddr
  } = Param;

  const params = {
    inparam : [
      "in_bk_id"
    , "in_waybill_no"
    , "in_remark"
    , "in_charge_code"
    , "in_charge_desc"
    , "in_sort_id"
    , "in_import_export_ind"
    , "in_ppc_ind"
    , "in_invoice_wb_amt"
    , "in_invoice_wb_currency_code"
    , "in_invoice_charge_amt"
    , "in_invoice_currency_code"
    , "in_actual_cost_amt"
    , "in_cost_currency_code"
    , "in_vendor_id"
    , "in_vendor_ref_no"
    , "in_print_ind"
    , "in_vat_cat_code_ap"
    , "in_type"
    , "in_category_code"
    , "in_use_yn" 
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      bk_id					            , waybill_no        , remark              , charge_code 		             , charge_desc				  , sort_id 
      , import_export_ind         , ppc_ind   			  , invoice_wb_amt 	  	, invoice_wb_currency_code   , invoice_charge_amt 
      , invoice_currency_code		  , actual_cost_amt		, cost_currency_code	, vendor_id		               , vendor_ref_no      , print_ind
      , vat_cat_code_ap 	        , type              , category_code       , use_yn             , user_id                   , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_ins_cost_detail',    
    isShowLoading: true,
    isShowComplete:false,
    }

    const result = await executFunction(params);

    return result![0];
}

export const SP_UpdateCost = async (param: any) => {
  const Param = param;

  
    
    const {   bk_id					      , waybill_no        , remark              , uuid                       , charge_code 		           , charge_desc				  , sort_id 
      , import_export_ind         , ppc_ind   			  , invoice_wb_amt 	  	, invoice_wb_currency_code   , invoice_charge_amt 
      , invoice_currency_code		  , actual_cost_amt		, cost_currency_code	, vendor_id		               , vendor_ref_no 
      , print_ind                 , vat_cat_code_ap 	, type                , category_code              , use_yn                     , user_id            , ipaddr
      } = Param;
    
  const params = {
    inparam : [
      "in_bk_id"
    , "in_waybill_no"
    , "in_remark"
    , "in_uuid"
    , "in_charge_code"
    , "in_charge_desc"
    , "in_sort_id"
    , "in_import_export_ind"
    , "in_ppc_ind"
    , "in_invoice_wb_amt"
    , "in_invoice_wb_currency_code"
    , "in_invoice_charge_amt"
    , "in_invoice_currency_code"
    , "in_actual_cost_amt"
    , "in_cost_currency_code"
    , "in_vendor_id"
    , "in_vendor_ref_no"
    , "in_print_ind"
    , "in_vat_cat_code_ap"
    , "in_type"
    , "in_category_code"
    , "in_use_yn" 
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
       bk_id					            , waybill_no        , remark                , uuid                      , charge_code 		             , charge_desc				  , sort_id 
      , import_export_ind         , ppc_ind   			  , invoice_wb_amt 	  	, invoice_wb_currency_code   , invoice_charge_amt 
      , invoice_currency_code		  , actual_cost_amt		, cost_currency_code	, vendor_id		               , vendor_ref_no      , print_ind
      , vat_cat_code_ap 	        , type              , category_code       , use_yn             , user_id                   , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_upd_cost_detail',    
    isShowLoading: true,
    isShowComplete:false,
    }


    const result = await executFunction(params);

    return result![0];
}