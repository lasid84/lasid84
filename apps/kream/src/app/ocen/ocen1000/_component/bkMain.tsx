'use client'

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
import { useAppContext } from "components/provider/contextObjectProvider";
import { gridData, ROW_CHANGED } from "components/grid/ag-grid-enterprise";
import { ReactSelect, data } from "@/components/select/react-select2";
import CustomSelect from "components/select/customSelect";
import ShpContPopUp from "./popup/popShippercont";
import WabillPopUp from "./popup/popAddWaybillNo"
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import PageSearch from "layouts/search-form/page-search-row";
import { Button } from "components/button";
import { SP_GetBkHblData, SP_GetCarrierContData, SP_GetShipperContData } from "./data";
import { Checkbox } from "@/components/checkbox";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/date/react-datepicker";
import  HblGrid  from "components/grid/ag-grid-enterprise";
import CarrierContPopUp from "./popup/popCarriercont";
import { SP_CreateTemplateData, SP_GetTemplateData } from "../../ocen1001/_component/data";
import { toastSuccess } from "@/components/toast";
const { log } = require("@repo/kwe-lib/components/logHelper");
const { DateToString } = require("@repo/kwe-lib/components/dataFormatter");

type Props = {
  // onSubmit: SubmitHandler<any>;
  loadItem: any[]
  bkData: any
};

const BKMain = ({ loadItem, bkData }: Props) => {

  const{ t } = useTranslation();
  const { dispatch, objState } = useAppContext();
  const { getValues } = useFormContext();
  const { trans_mode, trans_type, MselectedTab, isNew } = objState;
  
  //get shipper cont data
  const { data: shipperContData, refetch: shipperContRefetch, remove: shipperContRemove } = useGetData({ shipper_id: bkData?.shipper_id, cont_type: trans_mode + trans_type }, "shipper", SP_GetShipperContData, {enabled:true});
  const { data: bkBlData, refetch: bkBlRefetch, remove: bkBlRemove } = useGetData({ bk_id: bkData?.bk_id}, "bkBl", SP_GetBkHblData, {enabled:true});
  const { data: bkTemplateData, refetch: bkTemplateRefetch, remove: bkTemplateRemove } = useGetData({}, "bkTemplateData", SP_GetTemplateData, {enabled:true});
  const { data: crTaskContData, refetch: crTaskContRefetch } = useGetData({ carrier_code: bkData?.carrier_code, cont_type: 'task' }, "carrier_cont_task", SP_GetCarrierContData, {enable:true});
  const { data: crSalesContData, refetch: crSalesContRefetch} = useGetData({ carrier_code: bkData?.carrier_code, cont_type: 'sale' }, "carrier_cont_sales", SP_GetCarrierContData, {enable:true});

  const [ isRefreshShpCont, setRefreshShpCont ] = useState(false);
  const [ isRefreshCrCont, setRefreshCrCont ] = useState(false);

  const [carriercode, setCarrierCode] = useState<any>()
  const [custcode, setCustcode] = useState<any>()
  const [MblType, setMBLType] = useState<any>()
  const [blType, setBLType] = useState<any>()
  const [incoterms, setIncoterms] = useState<any>()
  const [billtype, setBillType] = useState<any>()
  
  const [salesperson, setSalesPerson] = useState<any>()
  const [terminal, setTerminal] = useState<any>()
  const [customsDeclation, setCustomsDeclation] = useState<any>()

  const { Create: CreateTemplate } = useUpdateData2(SP_CreateTemplateData);

  useEffect(() => {
    if (loadItem) {
      // log('detailData loadItem check', bkData);
      setCustcode(loadItem[0]);
      setBLType(loadItem[4]);
      setIncoterms(loadItem[7]);
      setBillType(loadItem[8]);
      setCarrierCode(loadItem[9])
      setSalesPerson(loadItem[11]);
      setTerminal(loadItem[12]);
      setCustomsDeclation(loadItem[13]);
      setMBLType(loadItem[20])
    }
  }, [loadItem])

  useEffect(() => {
      bkTemplateRefetch();    
  }, [])

  // useEffect(() => {
  //   log("==========bkData", bkData);
  // }, [bkData])

  useEffect(()=> {
    if (isRefreshShpCont && shipperContData && bkData) {
      setRefreshShpCont(false);
      let def = (shipperContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let cont_seq = def ? def.cont_seq : null;
      dispatch({[MselectedTab]:{...bkData, shipper_cont_seq:cont_seq, [ROW_CHANGED]: true}});
    } 
  }, [isRefreshShpCont, shipperContData, bkData])

  useEffect(()=> {
    if (isRefreshCrCont && bkData) {
      setRefreshCrCont(false);

     
      // if (t_cont_seq) {
        // dispatch({ bkData : { ...bkData, cr_t_cont_seq: t_cont_seq, cr_s_cont_seq: s_cont_seq}});
        dispatch({ [MselectedTab]: {...bkData, [ROW_CHANGED]: true}});
    } 
  }, [isRefreshShpCont, bkData]);

  useEffect(()=> {
    if (isRefreshCrCont && crTaskContData && crSalesContData && bkData) {
      setRefreshCrCont(false);

      let defTask = (crTaskContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let t_cont_seq = defTask ? defTask.cont_seq : null;
      let defSales = (crSalesContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let s_cont_seq = defSales ? defSales.cont_seq : null;

      log("isRefreshCrCont", t_cont_seq, s_cont_seq)
      // if (t_cont_seq) {
        // dispatch({ bkData : { ...bkData, cr_t_cont_seq: t_cont_seq, cr_s_cont_seq: s_cont_seq}});
        dispatch({ [MselectedTab]: {...bkData, cr_t_cont_seq: t_cont_seq, cr_s_cont_seq: s_cont_seq, [ROW_CHANGED]: true}});
    } 
  }, [isRefreshCrCont, bkData, crTaskContData, crSalesContData]);


  const SaveTemplateData = async () => {
    let templateData = getValues(); 
    let newData = {
      ...bkData,
      ...templateData
    }
    log("SaveTemplateData", newData)
    
    const userConfirmed = window.confirm(t('MSG_0175')|| ''); //템플릿을 저장하시겠습니까?

    if (userConfirmed) {
      CreateTemplate.mutate(newData);
    }
  }
    

  const handleButtonClick = (e:any) => {
    // log("handleButtonClick", e.target.id)
    switch (e.target.id) {
      case "shipper_manage":
        dispatch({ isShpContPopUpOpen: true });
        break;
      case "btn_save_template":
        SaveTemplateData();
        break;
      case "carrier_manage":
        dispatch({ isCarrierContPopupOpen: true });
        break;  
    }
  }

  const handleClickPopUpWaybill = () => {
    dispatch({isWaybillPopupOpen:true});
  }

  return (
    <div className="w-full">
        <PageContent
          title={<span className="px-3 py-3 text-lg font-bold text-blue-500">{t("기본정보")}</span>}>
          <div className="col-span-6">
            <PageSearch
              right={<></>}>
              <>
              { MselectedTab?.includes("NEW") ?
                <>
                <CustomSelect
                      id="template_id"
                      initText="Select a Template"
                      listItem={bkTemplateData ? (bkTemplateData as any)[0] as gridData : undefined}
                      valueCol={["template_id", "template_nm"]}
                      displayCol="template_nm"
                      gridOption={{
                        colVisible: { col: ["template_nm", "shipper_nm", "cnee_nm", "port_of_loading", "port_of_unloading"], visible: true },
                      }}
                      gridStyle={{ width: '800px', height: '300px' }}
                      style={{ width: '1000px', height: "8px" }}
                      isDisplay={true}
                      // inline={true}
                      events={{
                        onSelectionChanged: async (e, id, value) => {
                          let selectedRow = await e.api.getSelectedRows()[0];
                          const cargo = ((bkTemplateData as any)[1] as gridData).data.filter((row: any) => row.template_id === (selectedRow as any).template_id);
                          const cost = {
                            data : ((bkTemplateData as string[])[2] as gridData).data.filter((row: any) => row.template_id === (selectedRow as any).template_id),
                            fields: ((bkTemplateData as string[])[2] as gridData).fields
                          }
                          await dispatch({
                            [MselectedTab]: {
                              ...bkData, 
                              ...selectedRow, 
                              cargo: cargo,
                              cost: cost,
                              [ROW_CHANGED]:true
                            }});
                        },
                      }} 
                    />
                  <div className="col-span-5"></div>
                  </>
                  : <>
                      <MaskedInputField id="template_nm" options={{ isReadOnly: false}} value={bkData?.template_nm} /> 
                      {!bkData?.template_id && <Button id={"btn_save_template"} label={"save_template"} onClick={handleButtonClick} width="w-24"/>}
                      <div className="col-span-5"></div> 
                    </>
                  } 
                  <DatePicker
                    id="bk_dd"
                    value={bkData?.bk_dd}
                    options={{
                      inline: false,
                      textAlign: "center",
                      freeStyles: "p-1 border-1 border-slate-300",
                    }}/>
                    <MaskedInputField id="vocc_id" value={bkData?.vocc_id} options={{ isReadOnly: false}} />
                    <MaskedInputField id="mwb_no" value={bkData?.mwb_no} options={{ isReadOnly: true}} />
                    <MaskedInputField id="waybill_no" value={bkData?.waybill_no} options={{ isReadOnly: true, myPlaceholder:"Click to add"} } 
                      events={{
                        onClick: handleClickPopUpWaybill
                      }} 
                    />
                    <WabillPopUp bkData={bkData}/>
                  
                  {/* <div className="col-span-2"> */}
                    {/* <HblGrid 
                      gridRef={hblGridRef}
                      listItem={bkBlData as gridData}
                      options={{
                        colVisible:{col:["waybill_no"], visible:true},
                        isShowFilter:false,
                        isColumnHeaderVisible:false,
                      }}
                    /> */}
                  {/* </div> */}
              </>
            </PageSearch>
          </div>
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Customer Waybill</span>}>
          <div className="col-span-6">
            <PageSearch
              right={
                <>
                  {/* <Button id={"shipper_manage"} label={"manage_con"} onClick={handleButtonClick} width="w-20" disabled={bkData?.shipper_id ? false : true} /> */}
                </>}>
              <>
                <ShpContPopUp initData={loadItem} callbacks={[shipperContRefetch]} />
                <div className={"col-span-2"}>
                  <CustomSelect
                    id="shipper_id"
                    initText="Select a Shipper"
                    listItem={custcode as gridData}
                    valueCol={["cust_code"]}
                    displayCol="cust_nm"
                    gridOption={{
                      colVisible: { col: ["cust_code", "cust_nm", "bz_reg_no"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    isDisplay={true}
                    defaultValue={bkData?.shipper_id}
                    // inline={true}
                    events={{
                      onSelectionChanged: (e, id, value) => {
                        if (bkData?.shipper_id != value) {
                            setRefreshShpCont(true);
                            dispatch({[MselectedTab]: {...bkData, shipper_id:value, [ROW_CHANGED]:true}});
                            // log("onSelectionChanged", id, value);
                        }
                      },
                      onChanged: (e) => {
                        // if (!bkData) return;
                        // log("custom select onChance", e, bkData);
                        // setRefreshShpCont(true);
                      },
                     }} 
                  />
                </div>
                
                <div className={"col-span-2"}>
                <CustomSelect
                  id="cnee_id"
                  initText='Select a consinee'
                  listItem={terminal as gridData}
                  valueCol={["partner_id", "partner_name", "cust_nm"]}
                  displayCol="partner_name"
                  gridOption={{
                    colVisible: { col: ["partner_id", "partner_name", "cust_nm"], visible: true },
                  }}
                  gridStyle={{ width: '600px', height: '300px' }}
                  style={{ width: '1000px', height: "8px" }}
                  defaultValue={bkData?.cnee_id}
                  isDisplay={true}
                />
                </div>
                <div className={"col-span-1"}>
                  <CustomSelect
                    id="sales_person"
                    initText="Select a Salesperson"
                    listItem={salesperson as gridData}
                    valueCol={["sales_person", "name"]}
                    displayCol="name"
                    gridOption={{
                      colVisible: { col: ["sales_person", "name"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '500px', height: "8px" }}
                    isDisplay={true}
                    defaultValue={bkData?.sales_person}
                  />
                </div>
                
              </>

            </PageSearch>
          </div>
         
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Carrier Waybill</span>}>
          <div className="col-span-6">
            <PageSearch>
              <>
                <ShpContPopUp initData={loadItem} callbacks={[shipperContRefetch]} />
                <div className={"col-span-2"}>
                  <CustomSelect
                    id="carr_shipper_id"
                    initText="Select a Shipper"
                    listItem={custcode as gridData}
                    valueCol={["cust_code"]}
                    displayCol="cust_nm"
                    gridOption={{
                      colVisible: { col: ["cust_code", "cust_nm", "bz_reg_no"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    isDisplay={true}
                    defaultValue={bkData?.carr_shipper_id}
                    // inline={true}
                    events={{
                      onSelectionChanged: (e, id, value) => {
                        if (bkData?.carr_shipper_id != value) {
                            setRefreshShpCont(true);
                            dispatch({[MselectedTab]: {...bkData, carr_shipper_id:value, [ROW_CHANGED]:true}});
                            // log("onSelectionChanged", id, value);
                        }
                      },
                      onChanged: (e) => {
                        // if (!bkData) return;
                        // log("custom select onChance", e, bkData);
                        // setRefreshShpCont(true);
                      },
                     }} 
                  />
                </div>                       
                <div className={"col-span-2"}>
                <CustomSelect
                  id="carr_cnee_id"
                  initText='Select a consinee'
                  listItem={terminal as gridData}
                  valueCol={["partner_id", "partner_name", "cust_nm"]}
                  displayCol="partner_name"
                  gridOption={{
                    colVisible: { col: ["partner_id", "partner_name", "cust_nm"], visible: true },
                  }}
                  gridStyle={{ width: '600px', height: '300px' }}
                  style={{ width: '500px', height: "8px" }}
                  defaultValue={bkData?.carr_cnee_id}
                  isDisplay={true}
                />
              </div>
              </>

            </PageSearch>
          </div>  
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Carrier</span>}>
          <div className="col-span-8">
          <PageSearch
              right={
                <>
                  <Button id={"carrier_manage"} label={"manage_con"} width="w-24" onClick={handleButtonClick} disabled={bkData?.carrier_code ? false : true} />
                </>}>
            <CarrierContPopUp initData={loadItem} callbacks={[crTaskContRefetch, crSalesContRefetch]} />
            <div className={"col-span-2"}>
              <CustomSelect
                id="carrier_code"
                initText='Select a Carrier Code'
                listItem={carriercode as gridData}
                valueCol={["carrier_code", "carrier_nm"]}
                displayCol="carrier_nm"
                gridOption={{
                  colVisible: { col: ["carrier_code", "carrier_nm"], visible: true },
                }}
                gridStyle={{ width: '600px', height: '300px' }}
                style={{ width: '1000px', height: "8px" }}
                defaultValue={bkData?.carrier_code}
                isDisplay={true}
                events={{
                  onSelectionChanged: (e, id, value) => {
                    if (bkData?.carrier_code != value) {
                      setRefreshCrCont(true);
                      dispatch({[MselectedTab]: {...bkData, 
                        carrier_code:value,
                        cr_t_cont_seq:null, cr_t_cont_email:null, cr_t_cont_tel_num:null, 
                        cr_s_cont_seq:null, cr_s_cont_email:null, cr_s_cont_tel_num:null, 
                      }});
                      log("onSelectionChanged carrier_code", id, value);
                    }
                  },
                }}
              />
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
                      defaultValue={bkData?.cr_t_cont_seq}
                      isDisplay={true}
                      events={{
                        // onSelectionChanged: (e, id, value) => {
                        //   var selectedRow = e.api.getSelectedRows()[0] as any;
                        //   // setCrTaskContRowData(selectedRow);
                        //   bkData.cr_t_email = selectedRow.email;
                        //   bkData.cr_t_tel_num = selectedRow.tel_num;
                        //   // handleCustomSelectChange(e, id, value);
                        // }
                        onChanged(e) {
                          // log("onChanged cr_t_cont_seq", bkData?.cr_t_cont_seq)
                          if (!bkData) return;                  
                          bkData.cr_t_cont_email = e?.email;
                          bkData.cr_t_cont_tel_num = e?.tel_num;
                          dispatch({[MselectedTab]: {...bkData}});
                        },
                      }}
                    />
                    <MaskedInputField id="cr_t_email" value={bkData?.cr_t_cont_email} options={{ isReadOnly: true }} width="w-80"/>
                    <MaskedInputField id="cr_t_tel_num" value={bkData?.cr_t_cont_tel_num} options={{ isReadOnly: true }} />
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
                        style={{ width: '100px', height: "8px" }}
                        defaultValue={bkData?.cr_s_cont_seq}
                        isDisplay={true}
                        events={{
                          // onSelectionChanged: (e, id, value) => {
                          //   var selectedRow = e.api.getSelectedRows()[0] as any;
                          //   // setCrSalesContRowData(selectedRow);
                          //   bkData.cr_s_email = selectedRow.email;
                          //   bkData.cr_s_tel_num = selectedRow.tel_num;
                          //   // handleCustomSelectChange(e, id, value);
                          // }
                          onChanged(e) {
                            if (!bkData) return; 
                            bkData.cr_s_cont_email = e?.email;
                            bkData.cr_s_cont_tel_num = e?.tel_num;
                            log("cr_s_cont_seq", e)
                            dispatch({[MselectedTab]: {...bkData}});
                          }
                        }}
                      />
                  <MaskedInputField id="cr_s_email" value={bkData?.cr_s_cont_email} options={{ isReadOnly: true }} width="w-80" />
                  <MaskedInputField id="cr_s_tel_num" value={bkData?.cr_s_cont_tel_num} options={{ isReadOnly: true }} />
                </fieldset>
            </div>
          </PageSearch>
          </div>
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">ETC</span>}>
          {/* <ReactSelect
            id="cust_bl_type" dataSrc={blType as data}
            options={{
              keyCol: "bl_type",
              displayCol: ['bl_type_nm'],
              defaultValue: bkData?.bl_type,
              isAllYn: false,
              isMandatory:false
              }} 
            /> */}
            <div className={"col-span-1"}>
                <CustomSelect
                  id="carr_bl_type"
                  initText='Select a Carrier BL Type'
                  listItem={MblType as gridData}
                  valueCol={["carrier_bl_type", "carrier_bl_type_nm",]}
                  displayCol="carrier_bl_type_nm"
                  gridOption={{
                    colVisible: { col: ["carrier_bl_type_nm"], visible: true },
                  }}
                  gridStyle={{ width: '320px', height: '200px' }}
                  style={{ width: '500px', height: "8px" }}
                  defaultValue={bkData?.carr_bl_type}
                  isDisplay={true}
                />
            </div>
            <div className={"col-span-1"}>
                <CustomSelect
                  id="bl_type"
                  initText='Select a BL Type'
                  listItem={blType as gridData}
                  valueCol={["bl_type", "bl_type_nm",]}
                  displayCol="bl_type_nm"
                  gridOption={{
                    colVisible: { col: ["bl_type_nm"], visible: true },
                  }}
                  gridStyle={{ width: '320px', height: '200px' }}
                  style={{ width: '500px', height: "8px" }}
                  defaultValue={bkData?.bl_type}
                  isDisplay={true}
                />
              </div>
          {/* <ReactSelect
            id="bl_type" dataSrc={blType as data}
            options={{
              keyCol: "bl_type",
              displayCol: ['bl_type_nm'],
              defaultValue: bkData?.bl_type,
              isAllYn: false,
              isMandatory:false
              }} 
            /> */}
            <div className={"col-span-1"}>
                <CustomSelect
                  id="bill_type"
                  initText='Select a Bill Type'
                  listItem={billtype as gridData}
                  valueCol={["bill_type", "bill_type_nm",]}
                  displayCol="bill_type_nm"
                  gridOption={{
                    colVisible: { col: ["bill_type_nm"], visible: true },
                  }}
                  gridStyle={{ width: '320px', height: '200px' }}
                  style={{ width: '500px', height: "8px" }}
                  defaultValue={bkData?.bill_type}
                  isDisplay={true}
                />
              </div>
          {/* <ReactSelect
            id="bill_type" dataSrc={billtype as data}
            options={{
              keyCol: "billtype",
              displayCol: ['billtype_nm'],
              defaultValue: bkData?.bill_type,
              isAllYn: false,
              isMandatory:false
              }}
            /> */}
           <div className={"col-span-1"}>
                <CustomSelect
                  id="incoterms"
                  initText='Select a Incoterms'
                  listItem={incoterms as gridData}
                  valueCol={["incoterms", "incoterms_nm",]}
                  displayCol="incoterms_nm"
                  gridOption={{
                    colVisible: { col: ["incoterms_nm"], visible: true },
                  }}
                  gridStyle={{ width: '320px', height: '200px' }}
                  style={{ width: '500px', height: "8px" }}
                  defaultValue={bkData?.incoterms}
                  isDisplay={true}
                />
          </div>
          {/* <ReactSelect
            id="incoterms" dataSrc={incoterms as data}
            options={{
              keyCol: "incoterms",
              displayCol: ['incoterms_nm'],
              defaultValue: bkData?.incoterms,
              isAllYn: false,
              isMandatory:false
            }} 
            /> */}
          <MaskedInputField id="incoterms_remark" value={bkData?.incoterms_remark} options={{ isReadOnly: false }} />
          <ReactSelect
            id="customs_declation" dataSrc={customsDeclation as data}
            options={{
              keyCol: "customs_declation",
              displayCol: ['customs_declation', 'customs_declation_nm'],
              defaultValue: bkData?.customs_declation,
              isAllYn: false
            }}/>
        </PageContent>

        <PageContent>
          <div className="col-start-1 col-end-6 "><TextArea id="remark" rows={6} cols={32} value={bkData?.remark} options={{ isReadOnly: false }} /></div>
        </PageContent>
    </div>
  );
};


export default BKMain