'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DateInput, DatePicker } from 'components/date'
import { gridData } from "components/grid/ag-grid-enterprise";

// import { useGetData } from './test'
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


  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    log("maindata", mainData);
    if (mainData)
      setData((mainData?.[0] as gridData).data[0]);
  }, [mainData])


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">


        <PageContent
          title={<span className="px-1 py-1 text-blue-500">Shipper</span>}>
          <MaskedInputField id="shipper_id" value={data?.shipper_id} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_nm" value={data?.shipper_nm} options={{ isReadOnly: true }} />
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_addr" value={data?.shipper_addr} options={{ isReadOnly: true }} />
          </div>
          <MaskedInputField id="sales_person" value={data?.sales_person} options={{ isReadOnly: true }} />
          <MaskedInputField id="shp_cont_pic_nm" value={data?.shp_cont_pic_nm} options={{ isReadOnly: true }} />
          <MaskedInputField id="shp_cont_email" value={data?.shp_cont_email} options={{ isReadOnly: true }} />
          <MaskedInputField id="shp_tel_num" value={data?.shp_tel_num} options={{ isReadOnly: true }} />
          <MaskedInputField id="shp_fax_num" value={data?.shp_fax_num} options={{ isReadOnly: true }} />

          <div className="col-start-1 col-end-6 "><TextArea id="ship_remark" rows={6} cols={32} value={data?.ship_remark} options={{ isReadOnly: true }} /></div>

          <hr></hr><hr></hr> <hr></hr><hr></hr> <hr></hr>
          <MaskedInputField id="terminal_id" value={data?.terminal_id} options={{ isReadOnly: true }} />
          <div className={"col-span-2"}>
            <MaskedInputField id="terminal_nm" value={data?.terminal_nm} options={{ isReadOnly: true }} />
          </div>
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-blue-500">Carrier</span>}>
          <MaskedInputField id="carrier_code" value={data?.carrier_code} options={{ isReadOnly: true }} />
          <div className={"col-span-4"}>
            <MaskedInputField id="carrier_nm" value={data?.carrier_nm} options={{ isReadOnly: true }} />
          </div>
          <hr></hr><hr></hr> <hr></hr><hr></hr> <hr></hr>
          <div className="flex col-start-1 col-end-6">
            <fieldset className="flex w-1/2 p-1 space-x-1 space-y-1 border-2 border-solid dark:border-gray-800">
              <legend className="text-sx">업무 담당자</legend>
              <MaskedInputField id="cr_t_pic_nm" value={data?.cr_t_pic_nm} options={{ isReadOnly: true }} />
              <MaskedInputField id="cr_t_email" value={data?.cr_t_email} options={{ isReadOnly: true }} width="w-96" />
              <MaskedInputField id="cr_t_tel_num" value={data?.cr_t_tel_num} options={{ isReadOnly: true }} />
             </fieldset>

            <fieldset className="flex w-1/2 p-1 space-x-1 space-y-1 border-2 border-solid dark:border-gray-800">
              <legend className="text-sx">영업 담당자</legend>
              <MaskedInputField id="cr_s_pic_nm" value={data?.cr_s_pic_nm} options={{ isReadOnly: true }} />
              <MaskedInputField id="cr_s_email" value={data?.cr_s_email} options={{ isReadOnly: true }} width="w-96" />
              <MaskedInputField id="cr_s_tel_num" value={data?.cr_s_tel_num} options={{ isReadOnly: true }} />
             </fieldset>
          </div>
        </PageContent>
        <PageContent
          title={<span className="px-1 py-1 text-blue-500">ETC</span>}>
          <MaskedInputField id="bl_type" value={data?.bl_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="bill_type" value={data?.bill_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="incoterms" value={data?.incoterms} options={{ isReadOnly: true }} />
          <MaskedInputField id="incoterms_remark" value={data?.incoterms_remark} options={{ isReadOnly: true }} />
          <MaskedInputField id="ams_yn" value={data?.ams_yn} options={{ isReadOnly: true }} />
          <MaskedInputField id="ams" value={data?.ams} options={{ isReadOnly: true }} />
          <MaskedInputField id="aci_yn" value={data?.aci_yn} options={{ isReadOnly: true }} />
          <MaskedInputField id="aci" value={data?.aci} options={{ isReadOnly: true }} />
          <MaskedInputField id="afr_yn" value={data?.afr_yn} options={{ isReadOnly: true }} />
          <MaskedInputField id="edi_yn" value={data?.edi_yn} options={{ isReadOnly: true }} />
          <MaskedInputField id="isf_yn" value={data?.isf_yn} options={{ isReadOnly: true }} />
          <MaskedInputField id="e_manifest_yn" value={data?.e_manifest_yn} options={{ isReadOnly: true }} />

          <div className="col-start-1 col-end-6 "><TextArea id="ship_remark" rows={6} cols={32} value={data?.ship_remark} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 col-end-6 "><TextArea id="ship_remark" rows={6} cols={32} value={data?.ship_remark} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 col-end-6 "><TextArea id="ship_remark" rows={6} cols={32} value={data?.ship_remark} options={{ isReadOnly: true }} /></div>

        </PageContent>

      </form>
    </FormProvider>
  );
});


export default BKMain