'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DateInput, DatePicker } from 'components/date'
import { gridData } from "components/grid/ag-grid-enterprise";
import { ReactSelect, data } from "@/components/select/react-select2";
import CustomSelect from "components/select/customSelect";
import Modal from "./popShpcont";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import PageSearch from "layouts/search-form/page-search-row";
import { Button } from "components/button";
import { SP_GetContData } from "./data";
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
  const { mSelectedRow, selectedobj, trans_mode, trans_type } = objState
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

  //get shipper cont data
  const { data: detailData, refetch: detailRefetch, remove: detailRemove } = useGetData({ shipper_id: mSelectedRow?.shipper_id, cont_type: trans_mode + trans_type }, "dfsdfasdf", SP_GetContData, {enable:false});

  const [custcode, setCustcode] = useState<any>()
  const [incoterms, setIncoterms] = useState<any>()
  const [billtype, setBillType] = useState<any>()
  const [carriercode, setCarrierCode] = useState<any>()
  const [shp_cont, setShp_cont] = useState<any>()
  const [salesperson, setSalesPerson] = useState<any>()
  const [terminal, setTerminal] = useState<any>()

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    if (objState.isDSearch) {
      log("mSelectedRow?.shipper_id useEffect", objState.isDSearch)
      detailRefetch();
      dispatch({ isDSearch: false });
    }
  }, [objState.mSelectedRow, objState.isDSearch]);

  useEffect(() => {
    if (mSelectedRow?.shipper_id) {
      log('mSelectedRow?.shipper_id', mSelectedRow?.shipper_id)
      dispatch({ isDSearch: true })
      // log('mSelectedRow?.shipper_id2', detailData)
      //setShp_cont(detailData)
    }
  }, [mSelectedRow?.shipper_id])

  useEffect(() => {
    if (selectedobj) {
      log('mSelectedRow?.selectedobj', selectedobj)
      dispatch({ isDSearch: true, mSelectedRow:{...mSelectedRow}, })
      // setShp_cont(detailData)
    }
  }, [selectedobj])

  useEffect(() => {
    if (loadItem) {
      // log('detailData loadItem check',loadItem)
      setCustcode(loadItem[0])
      setIncoterms(loadItem[7])
      setBillType(loadItem[8])
      setCarrierCode(loadItem[9])
      setSalesPerson(loadItem[11])
      setTerminal(loadItem[12])
    }
  }, [loadItem])

  useEffect(() => {
    if (detailData) {
      log('detailData....', detailData)
      log('detailData....2', (detailData as gridData).data)
      setShp_cont((detailData as gridData))
    }
  }, [detailData])

  useEffect(() => {
    log("maindata", mainData);
    if (mainData)
      dispatch({ mSelectedRow: (mainData[0] as gridData).data })
  }, [mainData])

  const onClick = () => {
    //const selectedShipper = mSelectedRow.shipper_id
    //mSelectedRow: data 삭제
    dispatch({ crudType: crudType.CREATE, isShpPopUpOpen: true, isDSearch: true })
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


  //custom select event props(Shipper)
  const handleCustomSelectChange = (e: any, id:string, val:string) => {
    var selectedRow = e.api.getSelectedRows()[0];
    log('mSelectedRow check', selectedRow, id, val);
    dispatch({mSelectedRow: {...objState.mSelectedRow, [id]: val}});
  }

  //custom select value 변경 시 return object 항목 별 mselectedRow value 업데이트... 이벤트필요


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Shipper</span>}>
          <div className="col-span-6">
            <PageSearch
              right={
                <>
                  <Button id={"shipper_manage"} label={"manage_con"} onClick={onClick} width="w-24" disabled={mSelectedRow?.shipper_id ? false : true} />
                </>}>
              <>
                <Modal initData={loadItem} detailData={detailData} />
                <div className={"col-span-2"}>
                  <CustomSelect
                    id="shipper_id"
                    initText="Select an Shipper"
                    listItem={custcode as gridData}
                    valueCol={["cust_code", "cust_nm", "bz_reg_no"]}
                    displayCol="cust_nm"
                    gridOption={{
                      colVisible: { col: ["cust_code", "cust_nm", "bz_reg_no"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    isDisplay={true}
                    defaultValue={mSelectedRow?.shipper_id}
                    // inline={true}
                    events={{ onSelectionChanged: handleCustomSelectChange }} 
                    // obj={selectedobj}
                  />
                </div>
                <div className={"col-span-1"}>
                  <CustomSelect
                    id="sales_person"
                    initText="Select an Salesperson"
                    listItem={salesperson as gridData}
                    valueCol={["sales_person", "name"]}
                    displayCol="name"
                    gridOption={{
                      colVisible: { col: ["sales_person", "name"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '500px', height: "8px" }}
                    isDisplay={true}
                    defaultValue={mSelectedRow?.sales_person}
                    // inline={true}
                    // obj={selectedobj}
                  />
                </div>
                {/* <MaskedInputField id="sales_person" value={mSelectedRow?.sales_person} options={{ isReadOnly: false }} /> */}
              </>
            </PageSearch>
          </div>

          {/* Shipper 담당자 */}
          <div className={"col-span-1"}>
            <CustomSelect
              id="shp_cont_pic_nm"
              initText="Select..."
              listItem={shp_cont as gridData}
              valueCol={["cust_code", "pic_nm", "email"]}
              displayCol="pic_nm"
              gridOption={{
                colVisible: { col: ["cust_code", "pic_nm", 'email'], visible: true },
              }}
              gridStyle={{ width: '600px', height: '300px' }}
              style={{ width: '1000px', height: "8px" }}
              isDisplay={true}
              defaultValue={mSelectedRow?.shp_cont_pic_nm}
              // inline={true}
            // onChange={handleCustomSelectChange}
            />
          </div>
          <MaskedInputField id="shp_cont_email" value={mSelectedRow?.shp_cont_email} options={{ isReadOnly: false}} />
          <MaskedInputField id="shp_tel_num" value={mSelectedRow?.shp_tel_num} options={{ isReadOnly: false }} />
          <MaskedInputField id="shp_fax_num" value={mSelectedRow?.shp_fax_num} options={{ isReadOnly: false }} />

          <div className="col-start-1 col-end-6"><TextArea id="shp_remark" rows={6} cols={32} value={mSelectedRow?.shp_remark} options={{ isReadOnly: false }} events={{ onChange: handleTextAreaChange }} /></div>
          <div className={"col-span-2"}>
            <CustomSelect
              id="terminal_id"
              initText='Select an terminal'
              listItem={terminal as gridData}
              valueCol={["partner_id", "partner_name", "cust_nm"]}
              displayCol="partner_name"
              gridOption={{
                colVisible: { col: ["partner_id", "partner_name", "cust_nm"], visible: true },
              }}
              gridStyle={{ width: '600px', height: '300px' }}
              style={{ width: '1000px', height: "8px" }}
              defaultValue={mSelectedRow?.terminal_id}
              isDisplay={true}
              inline={true}
            // onChange={handleCustomSelectChange}
            />
          </div>
          {/* <div className={"col-span-1"}><MaskedInputField id="terminal_nm" value={mSelectedRow.terminal_nm} options={{ isReadOnly: false }} /></div> */}
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Carrier</span>}>

          <div className="col-span-6">
            <PageSearch
              right={
                <>
                  <Button id={"manage"} label={"manage_con"} width="w-24" />
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
                    defaultValue={mSelectedRow?.carrier_code}
                    isDisplay={true}
                    inline={true}
                  />
                </div>
                {/* <div className={"col-span-2"}><MaskedInputField id="carrier_nm" value={mSelectedRow.carrier_nm} options={{ isReadOnly: false }} /></div> */}
              </>
            </PageSearch>
          </div>

          <div className="flex w-full col-start-1 col-end-4 space-x-3">
            <fieldset className="flex w-1/2 p-3 pb-3 space-x-1 space-y-1 border-2 border-solid rounded-lg dark:border-gray-800">
              <legend className="text-base font-bold text-blue-800 ">업무 담당자</legend>
              <MaskedInputField id="cr_t_pic_nm" value={mSelectedRow?.cr_t_pic_nm} options={{ isReadOnly: false, }} width="w-56" events={{ onChange: handleMaskedInputChange }} />
              <MaskedInputField id="cr_t_email" value={mSelectedRow?.cr_t_email} options={{ isReadOnly: false }} width="w-72" />
              <MaskedInputField id="cr_t_tel_num" value={mSelectedRow?.cr_t_tel_num} options={{ isReadOnly: false }} width="w-56"/>
            </fieldset>
          {/* <div className="col-start-4 col-end-6 "> */}
            <fieldset className="flex w-1/2 p-3 pb-3 space-x-1 space-y-1 border-2 border-solid rounded-lg dark:border-gray-800">
              <legend className="text-base font-bold text-blue-800">영업 담당자</legend>
              <MaskedInputField id="cr_s_pic_nm" value={mSelectedRow?.cr_s_pic_nm} options={{ isReadOnly: false }} width="w-56"/>
              <MaskedInputField id="cr_s_email" value={mSelectedRow?.cr_s_email} options={{ isReadOnly: false }} width="w-72" />
              <MaskedInputField id="cr_s_tel_num" value={mSelectedRow?.cr_s_tel_num} options={{ isReadOnly: false }} width="w-56"/>
            </fieldset>
          </div>
          {/* </div> */}
        </PageContent>
        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">ETC</span>}>
          <MaskedInputField id="bl_type" value={mSelectedRow?.bl_type} options={{ isReadOnly: false }} events={{ onChange: handleMaskedInputChange }} />
          <ReactSelect
            id="bill_type" dataSrc={billtype as data}
            options={{
              keyCol: "billtype",
              displayCol: ['billtype_nm'],
              defaultValue: mSelectedRow?.bill_type,
              isAllYn: false
            }} />
          <ReactSelect
            id="incoterms" dataSrc={incoterms as data}
            options={{
              keyCol: "incoterms",
              displayCol: ['incoterms_nm'],
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