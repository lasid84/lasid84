'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import PageSearch from "layouts/search-form/page-search-row";
import { Button } from "components/button";
import { gridData } from "components/grid/ag-grid-enterprise";
import { ReactSelect, data } from "@/components/select/react-select2";
import CustomSelect from "components/select/customSelect";
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined
}


type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

const BKMain = memo(({ loadItem, mainData }: any) => {

  const { dispatch, objState } = useAppContext();
  const [data, setData] = useState<any>();

  const methods = useForm({
    defaultValues: {
    }
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = methods;


  const [custcode, setCustcode] = useState([])
  const [incoterms, setIncoterms] = useState([])
  const [billtype, setBillType] = useState([])

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    if (loadItem) {
      log('loadItem', loadItem)
      setCustcode(loadItem[0])
      setIncoterms(loadItem[7])
      setBillType(loadItem[8])
    }
  }, [loadItem])

  useEffect(() => {
    log("maindata", mainData);
    if (mainData)
      setData((mainData?.[0] as gridData).data[0]);
  }, [mainData])


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">


        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Shipper</span>}>
          <CustomSelect
            id="shipper_id"
            initText='Select an option'
            listItem={custcode as gridData}
            valueCol={["cust_code", "cust_nm", "bz_reg_no"]}
            displayCol="cust_nm"
            gridOption={{
              colVisible: { col: ["cust_code", "cust_nm", "bz_reg_no"], visible: true },
            }}
            gridStyle={{ width: '600px', height: '300px' }}
            style={{ width: '1000px', height: "8px" }}
            isDisplay={true}
            inline={true}
          />

          {/* <MaskedInputField id="shipper_id" value={data?.shipper_id} options={{ isReadOnly: false, useIcon: true }} /> */}
          <MaskedInputField id="shipper_nm" value={data?.shipper_nm} options={{ isReadOnly: false }} />
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_addr" value={data?.shipper_addr} options={{ isReadOnly: false }} />
          </div>
          <MaskedInputField id="sales_person" value={data?.sales_person} options={{ isReadOnly: false }} />
          <MaskedInputField id="shp_cont_pic_nm" value={data?.shp_cont_pic_nm} options={{ isReadOnly: false }} />
          <MaskedInputField id="shp_cont_email" value={data?.shp_cont_email} options={{ isReadOnly: false }} />
          <MaskedInputField id="shp_tel_num" value={data?.shp_tel_num} options={{ isReadOnly: false }} />
          <MaskedInputField id="shp_fax_num" value={data?.shp_fax_num} options={{ isReadOnly: false }} />

          <div className="col-start-1 col-end-6 "><TextArea id="ship_remark" rows={6} cols={32} value={data?.ship_remark} options={{ isReadOnly: false }} /></div>

          <hr></hr><hr></hr> <hr></hr><hr></hr> <hr></hr>
          <MaskedInputField id="terminal_id" value={data?.terminal_id} options={{ isReadOnly: false, useIcon: true }} />
          <div className={"col-span-2"}>
            <MaskedInputField id="terminal_nm" value={data?.terminal_nm} options={{ isReadOnly: false }} />
          </div>
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Carrier</span>}>

          <div className="col-span-6">
            <PageSearch
              right={
                <>
                  <Button id={"manage"} label={"manage_con"} width="w-15" />
                </>}>
              <>
                <MaskedInputField id="carrier_code" value={data?.carrier_code} options={{ isReadOnly: false, useIcon: true }} />
                <div className={"col-span-4"}>
                  <MaskedInputField id="carrier_nm" value={data?.carrier_nm} options={{ isReadOnly: false }} />
                </div>
              </>
            </PageSearch>
          </div>
          {/* <MaskedInputField id="carrier_code" value={data?.carrier_code} options={{ isReadOnly: false, useIcon:true }} />
          <div className={"col-span-4"}>
            <MaskedInputField id="carrier_nm" value={data?.carrier_nm} options={{ isReadOnly: false }} />
          </div> */}

          <div className="flex col-start-1 col-end-6">
            <fieldset className="flex w-1/2 p-3 pb-3 space-x-1 space-y-1 border-2 border-solid dark:border-gray-800">
              <legend className="text-base font-bold text-blue-800 ">업무 담당자</legend>
              <MaskedInputField id="cr_t_pic_nm" value={data?.cr_t_pic_nm} options={{ isReadOnly: false }} />
              <MaskedInputField id="cr_t_email" value={data?.cr_t_email} options={{ isReadOnly: false }} width="w-96" />
              <MaskedInputField id="cr_t_tel_num" value={data?.cr_t_tel_num} options={{ isReadOnly: false }} />
            </fieldset>
          </div>
          <div className="col-start-1 col-end-6 ">
            <fieldset className="flex w-1/2 p-3 pb-3 space-x-1 space-y-1 border-2 border-solid dark:border-gray-800">
              <legend className="text-base font-bold text-blue-800">영업 담당자</legend>
              <MaskedInputField id="cr_s_pic_nm" value={data?.cr_s_pic_nm} options={{ isReadOnly: false }} />
              <MaskedInputField id="cr_s_email" value={data?.cr_s_email} options={{ isReadOnly: false }} width="w-96" />
              <MaskedInputField id="cr_s_tel_num" value={data?.cr_s_tel_num} options={{ isReadOnly: false }} />
            </fieldset>
          </div>
        </PageContent>
        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">ETC</span>}>
          <MaskedInputField id="bl_type" value={data?.bl_type} options={{ isReadOnly: false }} />
          <ReactSelect
            id="bill_type" dataSrc={billtype as data}
            options={{
              keyCol: "billtype",
              displayCol: ['billtype', 'billtype_nm'],
              defaultValue: data?.bill_type,
              isAllYn: false
            }} />
          <ReactSelect
            id="incoterms" dataSrc={incoterms as data}
            options={{
              keyCol: "incoterms",
              displayCol: ['incoterms', 'incoterms_nm'],
              defaultValue: data?.incoterms,
              isAllYn: false
            }} />
          <MaskedInputField id="incoterms_remark" value={data?.incoterms_remark} options={{ isReadOnly: false }} />

          <div className="col-start-1 col-end-2 ">
            <MaskedInputField id="ams_yn" value={data?.ams_yn} options={{ isReadOnly: false }} />
          </div>
          <MaskedInputField id="ams" value={data?.ams} options={{ isReadOnly: false }} />
          <MaskedInputField id="aci_yn" value={data?.aci_yn} options={{ isReadOnly: false }} />
          <MaskedInputField id="aci" value={data?.aci} options={{ isReadOnly: false }} />
          <MaskedInputField id="afr_yn" value={data?.afr_yn} options={{ isReadOnly: false }} />
          <MaskedInputField id="edi_yn" value={data?.edi_yn} options={{ isReadOnly: false }} />
          <MaskedInputField id="isf_yn" value={data?.isf_yn} options={{ isReadOnly: false }} />
          <MaskedInputField id="e_manifest_yn" value={data?.e_manifest_yn} options={{ isReadOnly: false }} />
        </PageContent>

        <PageContent>
          <div className="col-start-1 col-end-6 "><TextArea id="remark" rows={6} cols={32} value={data?.remark} options={{ isReadOnly: false }} /></div>
        </PageContent>

      </form>
    </FormProvider>
  );
});


export default BKMain