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
import { SP_GetShipperContData, SP_GetCarrierContData } from "./data";
import { ComponentStateChangedEvent } from "ag-grid-community";
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
  const { data: shipperContData, refetch: detailRefetch, remove: detailRemove } = useGetData({ shipper_id: mSelectedRow?.shipper_id, cont_type: trans_mode + trans_type }, "shipper", SP_GetShipperContData, {enable:false});
  const { data: crTaskContData } = useGetData({ carrier_code: mSelectedRow?.carrier_code, cont_type: 'task' }, "carrier_cont_task", SP_GetCarrierContData, {enable:true});
  const { data: crSalesContData} = useGetData({ carrier_code: mSelectedRow?.carrier_code, cont_type: 'sale' }, "carrier_cont_sales", SP_GetCarrierContData, {enable:true});

  const [shpContRowData, setShpContRowData] = useState<any>();
  const [crTaskContRowData, setCrTaskContRowData] = useState<any>();
  const [crSalesContRowData, setCrSalesContRowData] = useState<any>();

  const [ isRefreshShpCont, setRefreshShpCont ] = useState(false);
  const [ isRefreshCrCont, setRefreshCrCont ] = useState(false);

  const [custcode, setCustcode] = useState<any>()
  const [incoterms, setIncoterms] = useState<any>()
  const [billtype, setBillType] = useState<any>()
  const [carriercode, setCarrierCode] = useState<any>()
  const [salesperson, setSalesPerson] = useState<any>()
  const [terminal, setTerminal] = useState<any>()

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    if (objState.isDSearch) {
      detailRefetch();
      dispatch({ isDSearch: false });
    }
  }, [objState.mSelectedRow, objState.isDSearch]);

  useEffect(() => {
    if (mSelectedRow?.shipper_id) {
      dispatch({ isDSearch: true })
      // log('mSelectedRow?.shipper_id2', detailData)
      //setShp_cont(detailData)
    }
  }, [mSelectedRow?.shipper_id])

  useEffect(() => {
    if (selectedobj) {
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
    if (mainData)
      dispatch({ mSelectedRow: (mainData[0] as gridData).data })
  }, [mainData])

  useEffect(()=> {
    if (isRefreshShpCont && mSelectedRow?.shipper_id && shipperContData) {
      setRefreshShpCont(false);

      let def = (shipperContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let cont_seq = def ? def.cont_seq : null;
      // if (cont_seq) {
        dispatch({ mSelectedRow : { ...mSelectedRow, shp_cont_seq: cont_seq}});
        setShpContRowData(def);
      // }
      log("shipperContData", cont_seq, def)
    }
  }, [isRefreshShpCont, shipperContData])

  useEffect(()=> {
    if (isRefreshCrCont && mSelectedRow?.carrier_code && crTaskContData && crSalesContData) {
      setRefreshCrCont(false);

      let defTask = (crTaskContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let t_cont_seq = defTask ? defTask.cont_seq : null;
      let defSales = (crSalesContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let s_cont_seq = defSales ? defSales.cont_seq : null;
      // if (t_cont_seq) {
        dispatch({ mSelectedRow : { ...mSelectedRow, cr_t_cont_seq: t_cont_seq, cr_s_cont_seq: s_cont_seq}});
        setCrTaskContRowData(defTask);
        setCrSalesContRowData(defSales);
      // };
    }
  }, [isRefreshShpCont, crTaskContData, crSalesContData])

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

  }

  const handleTextAreaChange = (e: any) => {
    e.preventDefault();
    const id = e.target.id;
    const val = getValues(id);
    dispatch({ mSelectedRow: { ...objState.mSelectedRow, [id]: val } })
  }


  //custom select event props(Shipper)
  const handleCustomSelectChange = (e: any, id:string, val:string) => {
    var selectedRow = e.api.getSelectedRows()[0];
    dispatch({mSelectedRow: {...mSelectedRow, [id]: val}});
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
                <Modal initData={loadItem} detailData={shipperContData} />
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
                    events={{
                      onSelectionChanged: (e, id, value) => {
                        dispatch({mSelectedRow: {shp_cont_seq: null}});
                        setShpContRowData(null);
                        handleCustomSelectChange(e,id,value);
                        setRefreshShpCont(true);
                      },
                     }} 
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
              id="shp_cont_seq"
              initText="Select..."
              label="shp_cont_pic_nm"
              listItem={shipperContData as gridData}
              valueCol={["cont_seq", "pic_nm", "email", "tel_num", "fax_num"]}
              displayCol="pic_nm"
              gridOption={{
                colVisible: { col: ["pic_nm", "email", "tel_num", "fax_num"], visible: true },
              }}
              gridStyle={{ width: '800px', height: '300px' }}
              style={{ width: '1000px', height: "8px" }}
              isDisplay={true}
              defaultValue={mSelectedRow?.shp_cont_seq}
              events={{
                onSelectionChanged: async (e,id,value) => {
                  // var selectedRow = (await (shipperContData as gridData).data.filter((row:any) => row["cont_seq"] === value)[0]) || {};
                  var selectedRow = e.api.getSelectedRows()[0];
                  setShpContRowData(selectedRow);
                  handleCustomSelectChange(e, id, value);
                }
              }}
            />
          </div>
          <MaskedInputField id="shp_cont_email" value={shpContRowData?.email} options={{ isReadOnly: true}} />
          <MaskedInputField id="shp_tel_num" value={shpContRowData?.tel_num} options={{ isReadOnly: true }} />
          <MaskedInputField id="shp_fax_num" value={shpContRowData?.fax_num} options={{ isReadOnly: true }} />

          <div className="col-start-1 col-end-6"><TextArea id="shp_remark" rows={6} cols={32} value={mSelectedRow?.shp_remark} options={{ isReadOnly: false }} events={{ onChange: handleTextAreaChange }} /></div>
          <div className={"col-span-2"}>
            <CustomSelect
              id="cnee_id"
              initText='Select an consinee'
              listItem={terminal as gridData}
              valueCol={["cust_code", "cust_nm"]}
              displayCol="cust_nm"
              gridOption={{
                colVisible: { col: ["cust_code", "cust_nm"], visible: true },
              }}
              gridStyle={{ width: '600px', height: '300px' }}
              style={{ width: '1000px', height: "8px" }}
              defaultValue={mSelectedRow?.cnee_id}
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
                  <Button id={"carrier_manage"} label={"manage_con"} width="w-15" />
                </>}>
              <>
                <div className={"col-span-3"}>
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
                    events={{
                      onSelectionChanged(e, id, value) {
                        dispatch({
                          mSelectedRow: 
                          { ...mSelectedRow,
                            cr_t_cont_seq: null, 
                            cr_s_cont_seq:null
                          }});
                        handleCustomSelectChange(e,id,value);
                        setCrSalesContRowData(null);
                        setCrTaskContRowData(null);
                        setRefreshCrCont(true);
                      },
                    }}
                  />
                </div>
                {/* <div className={"col-span-2"}><MaskedInputField id="carrier_nm" value={mSelectedRow.carrier_nm} options={{ isReadOnly: false }} /></div> */}
              </>
            </PageSearch>
          </div>

          <div className="flex col-start-1 col-end-6">
              <fieldset className="flex w-1/2 p-3 pb-2 space-x-1 space-y-1 border-2 border-solid dark:border-gray-800">
                <legend className="text-base font-bold text-blue-800 ">업무 담당자</legend>
                {/* <MaskedInputField id="cr_t_pic_nm" value={mSelectedRow?.cr_t_pic_nm} options={{ isReadOnly: false, }} events={{ onChange: handleMaskedInputChange }} /> */}
                <CustomSelect
                    id="cr_t_cont_seq"
                    // initText='Select an '
                    listItem={crTaskContData as gridData}
                    valueCol={["cont_seq", "pic_nm", "email", "tel_num"]}
                    displayCol="pic_nm"
                    gridOption={{
                      colVisible: { col: ["pic_nm", "email", "tel_num"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '500px', height: "8px" }}
                    defaultValue={mSelectedRow?.cr_t_cont_seq}
                    isDisplay={true}
                    events={{
                      onSelectionChanged(e, id, value) {
                        var selectedRow = e.api.getSelectedRows()[0];
                        setCrTaskContRowData(selectedRow);
                        handleCustomSelectChange(e, id, value);
                      }
                    }}
                  />
                <MaskedInputField id="cr_t_email" value={crTaskContRowData?.email} options={{ isReadOnly: true }} width="w-40" />
                <MaskedInputField id="cr_t_tel_num" value={crTaskContRowData?.tel_num} options={{ isReadOnly: true }} />
              </fieldset>
              <fieldset className="flex w-1/2 p-3 pb-2 ml-2 space-x-1 space-y-1 border-2 border-solid dark:border-gray-800">
                <legend className="text-base font-bold text-blue-800">영업 담당자</legend>
                {/* <MaskedInputField id="cr_s_pic_nm" value={mSelectedRow?.cr_s_pic_nm} options={{ isReadOnly: false }} /> */}
                <CustomSelect
                    id="cr_s_cont_seq"
                    // initText='Select an '
                    listItem={crSalesContData as gridData}
                    valueCol={["cont_seq", "pic_nm", "email", "tel_num"]}
                    displayCol="pic_nm"
                    gridOption={{
                      colVisible: { col: ["pic_nm", "email", "tel_num"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '500px', height: "8px" }}
                    defaultValue={mSelectedRow?.cr_s_cont_seq}
                    isDisplay={true}
                    events={{
                      onSelectionChanged(e, id, value) {
                        var selectedRow = e.api.getSelectedRows()[0];
                        setCrSalesContRowData(selectedRow);
                        handleCustomSelectChange(e, id, value);
                      }
                    }}
                  />
                <MaskedInputField id="cr_s_email" value={crSalesContRowData?.email} options={{ isReadOnly: true }} width="w-40" />
                <MaskedInputField id="cr_s_tel_num" value={crSalesContRowData?.tel_num} options={{ isReadOnly: true }} />
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