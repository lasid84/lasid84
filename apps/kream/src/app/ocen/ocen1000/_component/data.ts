

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


//SP_GetInvoiceMasterContent
export const SP_GetMasterData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { wb_no, state, create_user, fr_date, to_date, doc_fr_dt, doc_to_dt, bk_id, cust_code, user_id, ipaddr } = Param;
  log("===SP_GetMasterData", Param, fr_date, to_date, cust_code, user_id, ipaddr);

  const params = {
    inparam: [
      "in_fr_date"
      , "in_to_date"
      , "in_cust_code"
      , "in_wb_no"
      , "in_state"
      , "in_create_user"
      , "in_doc_fr_dt"
      , "in_doc_to_dt"
      , "in_bk_id"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      fr_date
      , to_date
      , cust_code
      , wb_no
      , state
      , create_user
      , doc_fr_dt
      , doc_to_dt
      , bk_id
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_get_bk_main',
    isShowLoading: true
  }
  const result = await executFunction(params);
  return result![0]
}

//Create BookingNote
export const SP_CreateData = async (param: any) => {
  const Param = param;
  log('=========onBKSave  Create BookingNote..', Param)
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
      '20240719'//bk_dd
      , origin_terminal_id
      , dest_terminal_id
      , 'O' //trans_mode
      , 'E' //trans_type
      , vocc_id
      , customs_declation
      , state
      , milestone
      , bk_remark
      , '1' //shipper_id
      , shipper_cont_seq
      , sales_person
      , shp_remark
      , cnee_id
      , ts_port
      , vessel
      , 'KRPUS'	 //port_of_loading
      , 'HKHKG' //port_of_unloading
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
    isShowComplete: true,
  }
  const result = await executFunction(params);
  log(result, 'success return 데이터2')
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
    isShowComplete: true,
  }
  const result = await executFunction(params);
  return result![0];
}

//Shipper 담당자 관리(INSERT)
export const SP_InsertShipContData = async (param: any) => {

  // const Param = searchParam.queryKey[1]
  const Param = param;
  log("param : ", param)
  const { cust_code, cont_type, pic_nm, email, cust_office, tel_num, fax_num, user_dept, bz_plc_cd, use_yn, def, user_id, ipaddr } = Param;
  const params = {
    inparam: [
      "in_cust_code"
      , "in_cont_type"
      , "in_pic_nm"
      , "in_email"
      , "in_cust_office"
      , "in_tel_num"
      , "in_fax_num"
      , "in_user_dept"
      , "in_bz_plc_cd"
      , "in_use_yn"
      , "in_def"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      cust_code
      , cont_type
      , pic_nm
      , email
      , cust_office
      , tel_num
      , fax_num
      , user_dept
      , bz_plc_cd
      , use_yn
      , def
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen0002_ins_cont_detail',
    isShowLoading: true,
    isShowComplete: false,
  }

  const result = await executFunction(params);
  log('ins_cont_detail', result)
  return result![0];
}

//Shipper 담당자 관리(UPDATE)
export const SP_UpdateShipContData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  log("param : ", param)
  const {cust_code, cont_type, cont_seq, pic_nm, email, cust_office, tel_num,fax_num, user_dept, bz_plc_cd, use_yn, def, user_id, ipaddr } = Param;
  const params = {
    inparam : [
      "in_cust_code"
    , "in_cont_seq"
    , "in_cont_type"
    , "in_pic_nm"
    , "in_email"
    , "in_cust_office"
    , "in_tel_num"
    , "in_fax_num"
    , "in_user_dept"
    , "in_bz_plc_cd"
    , "in_use_yn"
    , "in_def"
    , "in_user_id"
    , "in_ipaddr"
    ],
    invalue: [
      cust_code
    , cont_seq
    , cont_type
    , pic_nm
    , email
    , cust_office
    , tel_num
    , fax_num
    , user_dept
    , bz_plc_cd
    , use_yn
    , def
    , user_id
    , ipaddr
    ],
    inproc: 'ocean.f_ocen0002_upd_cont_detail',
    isShowLoading: true,
    isShowComplete:false,
    }
  
    const result = await executFunction(params);
    return result![0];
}

export const SP_GetBKDetailData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { no, user_id, ipaddr } = Param;
  log('ocen1000 bk_no', no)

  const params = {
    inparam: [
      "in_no"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      no
      , user_id
      , ipaddr
    ],
    inproc: 'ocean.f_ocen1000_get_bk_detail',
    isShowLoading: true
  }
  const result = await executFunction(params);
  log('SP_GetDetailsterData', result)
  return result
}


//pickup 담당자data get
export const SP_GetPickupContData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const {cust_code, pickup_type, user_id, ipaddr } = Param;
  log("search pickup 담당자 get Data:", Param);
  
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
export const SP_GetContData = async (searchParam: any) => {
  const Param = searchParam.queryKey[1]
  const { shipper_id, cont_type, user_id, ipaddr } = Param;
  log("mSelectedRow?.shipper_id param sp data: ", Param, cont_type, shipper_id)
  if (shipper_id === undefined) {
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


export const SP_InsertCargo = async (param: any) => {

  // const Param = searchParam.queryKey[1]
  const Param = param;
  log("param : ", param)
  // const {waybill_no, charge_code, charge_desc, sort_id, import_export_ind, ppc_ind, invoice_wb_amt, invoice_wb_currency_code, invoice_charge_amt	
  //   , invoice_currency_code, actual_cost_amt, cost_currency_code, vendor_id, vendor_ref_no, print_ind, vat_cat_code_ap, type, record_id, remark
  //   , user_id, ipaddr
  // } = Param;
  // const params = {
  //   inparam : [
  //    waybill_no"
  //   ,charge_code"
  //   ,charge_desc"
  //   ,sort_id"
  //   ,import_export_ind"
  //   ,ppc_ind"
  //   ,invoice_wb_amt"
  //   ,invoice_wb_currency_code"
  //   ,invoice_charge_amt"
  //   ,invoice_currency_code"
  //   , "in_actual_cost_amt"
  //   , "in_cost_currency_code"
  //   , "in_vendor_id"
  //   , "in_vendor_ref_no"
  //   , "in_print_ind"
  //   , "in_vat_cat_code_ap"
  //   , "in_type"
  //   , "in_record_id"
  //   , "in_remark"
  //   , "in_user_id"
  //   , "in_ipaddr"
  //   ],
  //   invalue: [
  //     waybill_no
  //   , charge_code
  //   , charge_desc
  //   , sort_id
  //   , import_export_ind
  //   , ppc_ind
  //   , invoice_wb_amt
  //   , invoice_wb_currency_code
  //   , invoice_charge_amt	
  //   , invoice_currency_code
  //   , actual_cost_amt
  //   , cost_currency_code
  //   , vendor_id
  //   , vendor_ref_no
  //   , print_ind
  //   , vat_cat_code_ap
  //   , type
  //   , record_id
  //   , remark
  //   , user_id
  //   , ipaddr
  //   ],
  //   inproc: 'ufsm.f_ufsm0001_ins_charge_upload_data',
  //   isShowLoading: true,
  //   isShowComplete:false,
  //   }

  //   const result = await executFunction(params);
  //   log("SP_InsertCharge", result);
  //   return result![0];
}