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
import Modal from "./popShpcont";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";

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
  const { mSelectedRow } = objState
  //const [data, setData] = useState<any>();

  const methods = useForm({
    defaultValues: {
    }
  });

  const {
    handleSubmit,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = methods;


  const [custcode, setCustcode] = useState<any>()
  const [incoterms, setIncoterms] = useState<any>()
  const [billtype, setBillType] = useState<any>()
  const [carriercode, setCarrierCode] = useState<any>()
  const [shp_cont, setShp_cont] = useState<any>()

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    if (loadItem) {
      log('loadItem', loadItem[0])
      setCustcode(loadItem[0])
      setIncoterms(loadItem[7])
      setBillType(loadItem[8])
      setCarrierCode(loadItem[9])
    }
  }, [loadItem])

  useEffect(() => {
    log("maindata", mainData);
    if (mainData)
      dispatch({ mSelectedRow: (mainData[0] as gridData).data[0] })
    //setData((mainmSelectedRow.[0] as gridData).data[0]);
  }, [mainData])

  const onClick = () => {
    //const selectedShipper = mSelectedRow.shipper_id
    //mSelectedRow: data 삭제
    dispatch({ crudType: crudType.CREATE, isPopUpOpen: true, isDSearch: true })
  }

  const handleMaskedInputChange = (e: any) => {
    e.preventDefault();
    const id = e.target.id;
    const val = getValues(id);
    dispatch({ mSelectedRow: { ...objState.mSelectedRow, [id]: val } })
    log('====================handleMaskedInputChange, MselectedRow', objState.mSelectedRow)

  }

  const handleTextAreaChange = (e: any) => {
    e.preventDefault();
    const id = e.target.id;
    const val = getValues(id);
    dispatch({ mSelectedRow: { ...objState.mSelectedRow, [id]: val } })
    log('====================handleMaskedInputChange, MselectedRow', objState.mSelectedRow)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Shipper</span>}>
          <div className="col-span-6">
            <PageSearch
              right={
                <>
                  <Button id={"manage"} label={"manage_con"} onClick={onClick} width="w-32" />
                </>}>
              <>
                <Modal initData={loadItem} />
                <div className={"col-span-2"}>
                  <CustomSelect
                    id="shipper_id"
                    initText="Select an Shipper"
                    listItem={custcode as gridData}
                    valueCol={["cust_code", "cust_nm"]}
                    displayCol="cust_nm"
                    gridOption={{
                      colVisible: { col: ["cust_code", "cust_nm"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    isDisplay={true}
                    defaultValue={mSelectedRow?.shipper_id}
                    inline={true}
                  />
                </div>
              </>
            </PageSearch>
          </div>
          {/* <MaskedInputField id="sales_person" value={mSelectedRow.sales_person} options={{ isReadOnly: false }} /> */}
          <ReactSelect
            id="svc_type" dataSrc={shp_cont as data}
            options={{
              keyCol: "svc_type",
              displayCol: ['svc_type', 'svc_type_nm'],
              defaultValue: mSelectedRow?.svc_type,
              isAllYn: false
            }} />
          <MaskedInputField id="shp_cont_pic_nm" value={mSelectedRow?.shp_cont_pic_nm} options={{ isReadOnly: false }} />
          <MaskedInputField id="shp_cont_email" value={mSelectedRow?.shp_cont_email} options={{ isReadOnly: false }} />
          <MaskedInputField id="shp_tel_num" value={mSelectedRow?.shp_tel_num} options={{ isReadOnly: false }} />
          <MaskedInputField id="shp_fax_num" value={mSelectedRow?.shp_fax_num} options={{ isReadOnly: false }} />

          <div className="col-start-1 col-end-6 "><TextArea id="ship_remark" rows={6} cols={32} value={mSelectedRow?.ship_remark} options={{ isReadOnly: false }} events={{ onChange: handleTextAreaChange }} /></div>

          {/* <MaskedInputField id="terminal_id" value={mSelectedRow.terminal_id} options={{ isReadOnly: false, useIcon: true }} /> */}
          <div className={"col-span-2"}>
            <CustomSelect
              id="terminal_id"
              initText='Select an terminal'
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
          </div>
          {/* <div className={"col-span-2"}><MaskedInputField id="terminal_nm" value={mSelectedRow.terminal_nm} options={{ isReadOnly: false }} /></div> */}
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
                <div className={"col-span-2"}>
                  <CustomSelect
                    id="carrier_code"
                    initText='Select an Carrier Code'
                    listItem={carriercode as gridData}
                    valueCol={["carrier_code", "carrier_nm"]}
                    displayCol="carrier_nm"
                    gridOption={{
                      colVisible: { col: ["carrier_code", "carrier_nm"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    isDisplay={true}
                    inline={true}
                  />
                </div>
                {/* <div className={"col-span-4"}>
                  <MaskedInputField id="carrier_nm" value={mSelectedRow.carrier_nm} options={{ isReadOnly: false }} />
                </div> */}
              </>
            </PageSearch>
          </div>
          {/* <MaskedInputField id="carrier_code" value={mSelectedRow.carrier_code} options={{ isReadOnly: false, useIcon:true }} />
          <div className={"col-span-4"}>
            <MaskedInputField id="carrier_nm" value={mSelectedRow.carrier_nm} options={{ isReadOnly: false }} />
          </div> */}

          <div className="flex col-start-1 col-end-6">
            <fieldset className="flex w-1/2 p-3 pb-3 space-x-1 space-y-1 border-2 border-solid dark:border-gray-800">
              <legend className="text-base font-bold text-blue-800 ">업무 담당자</legend>

              <MaskedInputField id="cr_t_pic_nm" value={mSelectedRow?.cr_t_pic_nm} options={{ isReadOnly: false, }} events={{ onChange: handleMaskedInputChange }} />
              <MaskedInputField id="cr_t_email" value={mSelectedRow?.cr_t_email} options={{ isReadOnly: false }} width="w-96" />
              <MaskedInputField id="cr_t_tel_num" value={mSelectedRow?.cr_t_tel_num} options={{ isReadOnly: false }} />
            </fieldset>
          </div>
          <div className="col-start-1 col-end-6 ">
            <fieldset className="flex w-1/2 p-3 pb-3 space-x-1 space-y-1 border-2 border-solid dark:border-gray-800">
              <legend className="text-base font-bold text-blue-800">영업 담당자</legend>
              <MaskedInputField id="cr_s_pic_nm" value={mSelectedRow?.cr_s_pic_nm} options={{ isReadOnly: false }} />
              <MaskedInputField id="cr_s_email" value={mSelectedRow?.cr_s_email} options={{ isReadOnly: false }} width="w-96" />
              <MaskedInputField id="cr_s_tel_num" value={mSelectedRow?.cr_s_tel_num} options={{ isReadOnly: false }} />
            </fieldset>
          </div>
        </PageContent>
        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">ETC</span>}>
          <MaskedInputField id="bl_type" value={mSelectedRow?.bl_type} options={{ isReadOnly: false }} events={{ onChange: handleMaskedInputChange }} />
          <ReactSelect
            id="bill_type" dataSrc={billtype as data}
            options={{
              keyCol: "billtype",
              displayCol: ['billtype', 'billtype_nm'],
              defaultValue: mSelectedRow?.bill_type,
              isAllYn: false
            }} />
          <ReactSelect
            id="incoterms" dataSrc={incoterms as data}
            options={{
              keyCol: "incoterms",
              displayCol: ['incoterms', 'incoterms_nm'],
              defaultValue: mSelectedRow?.incoterms,
              isAllYn: false
            }} />
          <MaskedInputField id="incoterms_remark" value={mSelectedRow?.incoterms_remark} options={{ isReadOnly: false }} />

          <div className="col-start-1 col-end-2 ">
            <MaskedInputField id="ams_yn" value={mSelectedRow?.ams_yn} options={{ isReadOnly: false }} />
          </div>
          <MaskedInputField id="ams" value={mSelectedRow?.ams} options={{ isReadOnly: false }} events={{ onChange: handleMaskedInputChange }} />
          <MaskedInputField id="aci_yn" value={mSelectedRow?.aci_yn} options={{ isReadOnly: false }} />
          <MaskedInputField id="aci" value={mSelectedRow?.aci} options={{ isReadOnly: false }} events={{ onChange: handleMaskedInputChange }} />
          <MaskedInputField id="afr_yn" value={mSelectedRow?.afr_yn} options={{ isReadOnly: false }} />
          <MaskedInputField id="edi_yn" value={mSelectedRow?.edi_yn} options={{ isReadOnly: false }} />
          <MaskedInputField id="isf_yn" value={mSelectedRow?.isf_yn} options={{ isReadOnly: false }} />
          <MaskedInputField id="e_manifest_yn" value={mSelectedRow?.e_manifest_yn} options={{ isReadOnly: false }} />
        </PageContent>

        <PageContent>
          <div className="col-start-1 col-end-6 "><TextArea id="remark" rows={6} cols={32} value={mSelectedRow?.remark} options={{ isReadOnly: false }} events={{ onChange: handleTextAreaChange }} /></div>
        </PageContent>

      </form>
    </FormProvider>
  );
});


export default BKMain