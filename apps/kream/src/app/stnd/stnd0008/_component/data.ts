

// import { executeKREAMFunction } from "@/services/api.services";
import { executeKREAMFunction } from "@/services/api/apiClient";
import { log } from '@repo/kwe-lib-new';

export const CUST_TYPE_TRANSPORT = "TRANSPORT";

export const SP_Load = async (searchParam:any) => {
  // unstable_noStore();
  const {user_id, ipaddr} = searchParam;
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: [user_id, ipaddr],
    inproc: 'public.f_stnd0008_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executeKREAMFunction(params);
  return result;
}

export const SP_GetData = async (searchParam: any) => {
  // console.log('searchParam', searchParam)
  const Param = searchParam.queryKey[1]

  const {carrier_type, user_id, ipaddr } = Param;
  
  const params = {
    inparam : [
      "in_user"
      , "in_ipaddr"
    ],
    invalue: [
       user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0008_get_custsetlist', 
    isShowLoading: true
    }
    
    const result = await executeKREAMFunction(params);
    return result![0];
}


export const SP_UpdateData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  // const Param = param;
  log("param : ", param)
  const {user_id, ipaddr, jsondata} = param;
  // const {trans_mode, trans_type, prod_gr_cd,charge_code,charge_desc,ass_transaction,category,major_category,report_category,vat_yn,billing_yn,vat_type,rem_prt_yn,vat_rt,fe_prt_yn,fins_yn,fe_ref_item,fin_category,use_yn,uas_gl_code,rem_prt_nm,bill_gr1_cd,bill_gr2_cd,gl_gr1_cd,gl_gr2_cd,user_id,ipaddr } = Param;
  // log("==================================SP_UpdateData:", Param,trans_mode,trans_type,prod_gr_cd,charge_code,charge_desc,ass_transaction,category,major_category,report_category,vat_yn,billing_yn,vat_type,rem_prt_yn,vat_rt,fe_prt_yn,fins_yn,fe_ref_item,fin_category,use_yn,uas_gl_code,rem_prt_nm,bill_gr1_cd,bill_gr2_cd,gl_gr1_cd,gl_gr2_cd,user_id,ipaddr);
  const params = {
    inparam : [
      "in_jsondata"
    , "in_user"
    , "in_ipaddr"
    ],
    invalue: [
      jsondata
    , user_id
    , ipaddr
    ],
    inproc: 'public.f_stnd0008_upd_customersetlist2',
    isShowLoading: true,
    isShowComplete:true,
    }
  
    const result = await executeKREAMFunction(params);
    return result![0];
}

export const SP_InsertCustData = async (param: any) => {
  
  // const Param = searchParam.queryKey[1]
  const Param = param;
  const {cust_code, main_cust_code, bz_type, bz_reg_no, cust_nm, cust_nm_abbr, cust_nm_chi, cust_nm_eng, executive_nm, corp_reg_no, bz_con, bz_item, nation_code, area_cd, bz_kind_cd, tel_no, fax_no, contact_nm, post_no1, addr1, addr2, addr3, city_nm, addr1_eng, addr2_eng, addr3_eng, city_nm_eng, home_page_addr, use_yn, remark, vendor_id, sale_cust_yn, prch_cust_yn, gen_cust_yn, cal_except_yn, user_id, ipaddr } = Param;
  // log("==================================SP_UpdateData:", Param,trans_mode,trans_type,prod_gr_cd,charge_code,charge_desc,ass_transaction,category,major_category,report_category,vat_yn,billing_yn,vat_type,rem_prt_yn,vat_rt,fe_prt_yn,fins_yn,fe_ref_item,fin_category,use_yn,uas_gl_code,rem_prt_nm,bill_gr1_cd,bill_gr2_cd,gl_gr1_cd,gl_gr2_cd,user_id,ipaddr);
  const params = {
    inparam : [
      "in_cust_code", 
      "in_main_cust_code", 
      "in_bz_type", 
      "in_bz_reg_no", 
      "in_cust_nm", 
      "in_cust_nm_abbr", 
      "in_cust_nm_chi", 
      "in_cust_nm_eng", 
      "in_executive_nm", 
      "in_corp_reg_no", 
      "in_bz_con", 
      "in_bz_item", 
      "in_nation_code", 
      "in_area_cd", 
      "in_bz_kind_cd", 
      "in_tel_no", 
      "in_fax_no", 
      "in_contact_nm", 
      "in_post_no1", 
      "in_addr1", 
      "in_addr2", 
      "in_addr3", 
      "in_city_nm", 
      "in_addr1_eng", 
      "in_addr2_eng", 
      "in_addr3_eng", 
      "in_city_nm_eng", 
      "in_home_page_addr", 
      "in_use_yn", 
      "in_remark", 
      "in_vendor_id", 
      "in_sale_cust_yn", 
      "in_prch_cust_yn", 
      "in_gen_cust_yn", 
      "in_cal_except_yn", 
      "in_user_id", 
      "in_ipaddr"
    ],
    invalue: [
      cust_code, 
      main_cust_code, 
      bz_type, 
      bz_reg_no, 
      cust_nm, 
      cust_nm_abbr, 
      cust_nm_chi, 
      cust_nm_eng, 
      executive_nm, 
      corp_reg_no, 
      bz_con, 
      bz_item, 
      nation_code, 
      area_cd, 
      bz_kind_cd, 
      tel_no, 
      fax_no, 
      contact_nm, 
      post_no1, 
      addr1, 
      addr2, 
      addr3, 
      city_nm,
      addr1_eng, 
      addr2_eng, 
      addr3_eng, 
      city_nm_eng, 
      home_page_addr, 
      use_yn, 
      remark, 
      vendor_id, 
      sale_cust_yn, 
      prch_cust_yn, 
      gen_cust_yn, 
      cal_except_yn, 
      user_id, 
      ipaddr
    ],
    inproc: 'public.f_stnd0008_ins_customersetlist',
    isShowLoading: true,
    isShowComplete:true,
    }
  
    const result = await executeKREAMFunction(params);

    // return result![0];
}