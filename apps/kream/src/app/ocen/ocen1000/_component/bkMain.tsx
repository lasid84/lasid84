'use client'

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
import { useAppContext } from "components/provider/contextObjectProvider";
import { gridData, ROW_CHANGED } from "components/grid/ag-grid-enterprise";
import { ReactSelect, data } from "@/components/select/react-select2";
import CustomSelect from "components/select/customSelect";
import ShpContPopUp from "./popShippercont";
import WabillPopUp from "./popAddWaybillNo"
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import PageSearch from "layouts/search-form/page-search-row";
import { Button } from "components/button";
import { SP_GetBkHblData, SP_GetBkTemplateData, SP_GetCarrierContData, SP_GetShipperContData } from "./data";
import { Checkbox } from "@/components/checkbox";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/date/react-datepicker";
import  HblGrid  from "components/grid/ag-grid-enterprise";
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
  const { data: bkTemplateData, refetch: bkTemplateRefetch, remove: bkTemplateRemove } = useGetData({}, "bkTemplate", SP_GetBkTemplateData, {enabled:false});

  const [ isRefreshShpCont, setRefreshShpCont ] = useState(false);
  const [ isRefreshCrCont, setRefreshCrCont ] = useState(false);

  const [custcode, setCustcode] = useState<any>()
  const [MblType, setMBLType] = useState<any>()
  const [blType, setBLType] = useState<any>()
  const [incoterms, setIncoterms] = useState<any>()
  const [billtype, setBillType] = useState<any>()
  
  const [salesperson, setSalesPerson] = useState<any>()
  const [terminal, setTerminal] = useState<any>()
  const [customsDeclation, setCustomsDeclation] = useState<any>()

  useEffect(() => {
    if (loadItem) {
      // log('detailData loadItem check', bkData);
      setCustcode(loadItem[0]);
      setBLType(loadItem[4]);
      setIncoterms(loadItem[7]);
      setBillType(loadItem[8]);
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

  /* TODO */
  const setBookingState = (id: string) => {
    const bkState = ["vocc_id", ];
  }

  const handleButtonClick = (e:any) => {
    log("handleButtonClick", e.target.id)
    switch (e.target.id) {
      case "shipper_manage":
        dispatch({ isShpContPopUpOpen: true });
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
                <><CustomSelect
                      id="template_id"
                      initText="Select a Template"
                      listItem={bkTemplateData as gridData}
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
                          await dispatch({[MselectedTab]:{...bkData, ...selectedRow}});
                        },
                      }} 
                    />
                    <div className="col-span-5"></div></>
                  : <></> } 
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
                    <MaskedInputField id="waybill_no" value={bkData?.waybill_no} options={{ isReadOnly: true}} 
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
                            dispatch({[MselectedTab]: {...bkData, shipper_id:value}});
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
                            dispatch({[MselectedTab]: {...bkData, carr_shipper_id:value}});
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
                  id="carrier_bl_type"
                  initText='Select a Carrier BL Type'
                  listItem={MblType as gridData}
                  valueCol={["carrier_bl_type", "carrier_bl_type_nm",]}
                  displayCol="carrier_bl_type_nm"
                  gridOption={{
                    colVisible: { col: ["carrier_bl_type_nm"], visible: true },
                  }}
                  gridStyle={{ width: '320px', height: '200px' }}
                  style={{ width: '500px', height: "8px" }}
                  defaultValue={bkData?.carrier_bl_type}
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