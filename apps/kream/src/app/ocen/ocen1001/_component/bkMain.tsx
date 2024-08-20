'use client'

import React, { useState, useEffect, Dispatch, useContext, memo, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { gridData, ROW_CHANGED } from "components/grid/ag-grid-enterprise";
import { ReactSelect, data } from "@/components/select/react-select2";
import CustomSelect from "components/select/customSelect";
import ShpContPopUp from "./popShippercont";
import CarrierContPopUp from "./popCarriercont";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import PageSearch from "layouts/search-form/page-search-row";
import { Button } from "components/button";
import { SP_GetBkHblData, SP_GetCarrierContData, SP_GetShipperContData } from "./data";
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
  const { trans_mode, trans_type, MselectedTab } = objState;
  const hblGridRef = useRef<any | null>(null);
  
  //get shipper cont data
  const { data: shipperContData, refetch: shipperContRefetch, remove: shipperContRemove } = useGetData({ shipper_id: bkData?.shipper_id, cont_type: trans_mode + trans_type }, "shipper", SP_GetShipperContData, {enable:true});
  const { data: crTaskContData, refetch: crTaskContRefetch } = useGetData({ carrier_code: bkData?.carrier_code, cont_type: 'task' }, "carrier_cont_task", SP_GetCarrierContData, {enable:true});
  const { data: crSalesContData, refetch: crSalesContRefetch} = useGetData({ carrier_code: bkData?.carrier_code, cont_type: 'sale' }, "carrier_cont_sales", SP_GetCarrierContData, {enable:true});
  const { data: bkBlData, refetch: bkBlRefetch, remove: bkBlRemove } = useGetData({ bk_id: bkData?.bk_id}, "bkBl", SP_GetBkHblData, {enable:true});

  const [ isRefreshShpCont, setRefreshShpCont ] = useState(false);
  const [ isRefreshCrCont, setRefreshCrCont ] = useState(false);

  const [custcode, setCustcode] = useState<any>()
  const [blType, setBLType] = useState<any>()
  const [incoterms, setIncoterms] = useState<any>()
  const [billtype, setBillType] = useState<any>()
  
  const [carriercode, setCarrierCode] = useState<any>()
  const [salesperson, setSalesPerson] = useState<any>()
  const [terminal, setTerminal] = useState<any>()
  const [customsDeclation, setCustomsDeclation] = useState<any>()

  const methods = useForm({
    defaultValues: {
      // bk_dd : bkData?.bk_dd ? bkData?.bk_dd : dayjs().format('yyyymmdd')
    }
  });

  const {
    handleSubmit,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    if (loadItem) {
      log('detailData loadItem check', bkData);
      setCustcode(loadItem[0]);
      setBLType(loadItem[4]);
      setIncoterms(loadItem[7]);
      setBillType(loadItem[8]);
      setCarrierCode(loadItem[9]);
      setSalesPerson(loadItem[11]);
      setTerminal(loadItem[12]);
      setCustomsDeclation(loadItem[13]);

    }
  }, [loadItem])

  useEffect(()=> {
    if (isRefreshShpCont && bkData?.shipper_id && shipperContData) {
      setRefreshShpCont(false);

      let def = (shipperContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let cont_seq = def ? def.cont_seq : null;
      dispatch({ [MselectedTab]: {...bkData, shipper_cont_seq:cont_seq, shp_cont_email:def?.email, shp_cont_tel_num:def?.tel_num, shp_cont_fax_num:def?.fax_num}})
      // setShpContRowData(def);
      // log("shipperContData", cont_seq, def)
    } 
  }, [isRefreshShpCont, bkData?.shipper_id, shipperContData])

  useEffect(()=> {
    if (isRefreshCrCont && bkData?.carrier_code && crTaskContData && crSalesContData) {
      setRefreshCrCont(false);

      let defTask = (crTaskContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let t_cont_seq = defTask ? defTask.cont_seq : null;
      let defSales = (crSalesContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let s_cont_seq = defSales ? defSales.cont_seq : null;
      // if (t_cont_seq) {
        // dispatch({ bkData : { ...bkData, cr_t_cont_seq: t_cont_seq, cr_s_cont_seq: s_cont_seq}});
        dispatch({ 
          [MselectedTab]: {...bkData, 
            cr_t_cont_seq: t_cont_seq ? t_cont_seq : null, 
            cr_t_cont_email: defTask?.email ? defTask?.email : null,
            cr_t_cont_tel_num: defTask?.tel_num ? defTask?.tel_num : null,
            cr_s_cont_seq: s_cont_seq ? s_cont_seq : null, 
            cr_s_cont_email: defSales?.email ? defSales?.email : null,
            cr_s_cont_tel_num: defSales?.tel_num ? defSales?.tel_num : null,
            [ROW_CHANGED]: true}})
        // setCrTaskContRowData(defTask);
        // setCrSalesContRowData(defSales);
      // };
    } 
  }, [isRefreshShpCont, bkData, crTaskContData, crSalesContData])

  const handleButtonClick = (e:any) => {
    log("handleButtonClick", e.target.id)
    switch (e.target.id) {
      case "shipper_manage":
        dispatch({ isShpContPopUpOpen: true });
        break;
      case "carrier_manage":
        dispatch({ isCarrierContPopupOpen: true });
        break;
    }
  }

  const handleMaskedInputChange = (e: any) => {
    e.preventDefault();
    const id = e.target.id;
    const val = getValues(id);
    // dispatch({ bkData: { ...bkData, [id]: val } })
    dispatch({[MselectedTab]: {...bkData, [id]:val, [ROW_CHANGED]: true}})

  }

  const handleTextAreaChange = (e: any) => {
    e.preventDefault();
    const id = e.target.id;
    const val = getValues(id);
    // dispatch({ bkData: { ...bkData, [id]: val } })
    dispatch({[MselectedTab]: {...bkData, [id]:val, [ROW_CHANGED]: true}})
  }


  //custom select event props(Shipper)
  const handleCustomSelectChange = (e: any, id:string, val:string) => {
    var selectedRow;
    if (e.api) selectedRow = e.api.getSelectedRows()[0]; //react-select와 같이사용하여 if 처리
    dispatch({[MselectedTab]: {...bkData, [id]:val, [ROW_CHANGED]: true}});    
    // log("handleCustomSelectChange", bkData)
  }

  const handleCheckBoxClick = (id:string, val:any) => {
    log("handleCheckBoxClick", id, val);
    // bkData[id] = val;
    dispatch({[MselectedTab]: {...bkData, [id]:val, [ROW_CHANGED]: true}});    
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">

        <PageContent
          title={<span className="px-3 py-3 text-lg font-bold text-blue-500">{t("기본정보")}</span>}>
          <div className="col-span-6">
            <PageSearch
              right={<></>}>
              <>
                      <DatePicker
                        id="bk_dd"
                        // label="bk_dd"
                        value={bkData?.bk_dd}
                        options={{
                          inline: false,
                          textAlign: "center",
                          freeStyles: "p-1 border-1 border-slate-300",
                        }}
                        events={{
                          onChange: (e, id, date) => {
                            handleCustomSelectChange(e,id,DateToString(date));
                          }
                        }}
                      />
                    <MaskedInputField id="vocc_id" value={bkData?.vocc_id} options={{ isReadOnly: false}} events={{ onChange: handleMaskedInputChange }}/>
                    <MaskedInputField id="mwb_no" value={bkData?.mwb_no} options={{ isReadOnly: true}} events={{ onChange: handleMaskedInputChange }}/>
                    <MaskedInputField id="waybill_no" value={bkData?.waybill_no} options={{ isReadOnly: true}} events={{ onChange: handleMaskedInputChange }}/>
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
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Shipper</span>}>
          <div className="col-span-6">
            <PageSearch
              right={
                <>
                  <Button id={"shipper_manage"} label={"manage_con"} onClick={handleButtonClick} width="w-20" disabled={bkData?.shipper_id ? false : true} />
                </>}>
              <>
                <ShpContPopUp initData={loadItem} callbacks={[shipperContRefetch]} />
                <div className={"col-span-2"}>
                  <CustomSelect
                    id="shipper_id"
                    initText="Select a Shipper"
                    listItem={custcode as gridData}
                    valueCol={["cust_code", "cust_nm", "bz_reg_no"]}
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
                        // dispatch({bkData: {...bkData, shp_cont_seq: null}});
                        // dispatch({ [MselectedTab]: {...bkData, shp_cont_seq:null}})
                        // log("shipper_id", id)
                        bkData.shipper_cont_seq = null;
                        bkData.shp_cont_email = null;
                        bkData.shp_cont_tel_num = null;
                        bkData.shp_cont_fax_num = null;
                        // setShpContRowData(null);
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
                    events={{
                      onSelectionChanged: handleCustomSelectChange
                    }}
                  />
                </div>
                {/* <MaskedInputField id="sales_person" value={mSelectedRow?.sales_person} options={{ isReadOnly: false }} /> */}
              </>
            </PageSearch>
          </div>

          {/* Shipper 담당자 */}
          <div className={"col-span-1"}>
            <CustomSelect
              id="shipper_cont_seq"
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
              defaultValue={bkData?.shipper_cont_seq}
              events={{
                onSelectionChanged: (e,id,value) => {
                  var selectedRow = e.api.getSelectedRows()[0] as any;
                  // log("shipper_cont_seq", selectedRow);
                  // setShpContRowData(selectedRow);
                  // dispatch({bkData: {...bkData}})
                  bkData.shp_cont_email = selectedRow?.email;
                  bkData.shp_cont_tel_num = selectedRow?.tel_num;
                  bkData.shp_cont_fax_num = selectedRow?.fax_num;
                  handleCustomSelectChange(e, id, value);
                }
              }}
            />
          </div>
          {/* <MaskedInputField id="shp_cont_email" value={shpContRowData?.email} options={{ isReadOnly: true}} />
          <MaskedInputField id="shp_tel_num" value={shpContRowData?.tel_num} options={{ isReadOnly: true }} />
          <MaskedInputField id="shp_fax_num" value={shpContRowData?.fax_num} options={{ isReadOnly: true }} /> */}
          <MaskedInputField id="shp_cont_email" value={bkData?.shp_cont_email} options={{ isReadOnly: true}} />
          <MaskedInputField id="shp_tel_num" value={bkData?.shp_cont_tel_num} options={{ isReadOnly: true }} />
          <MaskedInputField id="shp_fax_num" value={bkData?.shp_cont_fax_num} options={{ isReadOnly: true }} />

          <div className="col-start-1 col-end-6"><TextArea id="shp_remark" rows={2} cols={32} value={bkData?.shp_remark} options={{ isReadOnly: false }} events={{ onChange: handleTextAreaChange }} /></div>
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
              gridStyle={{ width: '800px', height: '300px' }}
              style={{ width: '1000px', height: "8px" }}
              defaultValue={bkData?.cnee_id}
              isDisplay={true}
              inline={true}
              events={{
                onSelectionChanged: handleCustomSelectChange
              }}
            />
          </div>
          {/* <div className={"col-span-1"}><MaskedInputField id="terminal_nm" value={mSelectedRow.terminal_nm} options={{ isReadOnly: false }} /></div> */}
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Carrier</span>}>

          <div className="col-span-8">
            <PageSearch
              right={
                <>
                  <Button id={"carrier_manage"} label={"manage_con"} width="w-20" onClick={handleButtonClick} />
                </>}>
              <>
                <CarrierContPopUp initData={loadItem} callbacks={[crTaskContRefetch, crSalesContRefetch]} />
                <div className={"col-span-3"}>
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
                    inline={true}
                    events={{
                      onSelectionChanged: (e, id, value) => {
                        bkData.cr_t_cont_seq = null;
                        bkData.cr_t_email = null;
                        bkData.cr_t_tel_num = null;
                        bkData.cr_s_cont_seq = null;
                        bkData.cr_s_email = null;
                        bkData.cr_s_tel_num = null;
                        // dispatch({bkData:{...bkData}});
                        handleCustomSelectChange(e,id,value);
                        // setCrSalesContRowData(null);
                        // setCrTaskContRowData(null);
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
                    defaultValue={bkData?.cr_t_cont_seq}
                    isDisplay={true}
                    events={{
                      onSelectionChanged: (e, id, value) => {
                        var selectedRow = e.api.getSelectedRows()[0] as any;
                        // setCrTaskContRowData(selectedRow);
                        bkData.cr_t_email = selectedRow.email;
                        bkData.cr_t_tel_num = selectedRow.tel_num;
                        handleCustomSelectChange(e, id, value);
                      }
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
                        onSelectionChanged: (e, id, value) => {
                          var selectedRow = e.api.getSelectedRows()[0] as any;
                          // setCrSalesContRowData(selectedRow);
                          bkData.cr_s_email = selectedRow.email;
                          bkData.cr_s_tel_num = selectedRow.tel_num;
                          handleCustomSelectChange(e, id, value);
                        }
                      }}
                    />
                <MaskedInputField id="cr_s_email" value={bkData?.cr_s_cont_email} options={{ isReadOnly: true }} width="w-80" />
                <MaskedInputField id="cr_s_tel_num" value={bkData?.cr_s_cont_tel_num} options={{ isReadOnly: true }} />
              </fieldset>
          </div>
          {/* </div> */}
        </PageContent>
        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">ETC</span>}>
          {/* <MaskedInputField id="bl_type" value={bkData?.bl_type} options={{ isReadOnly: false }} events={{ onChange: handleMaskedInputChange }} /> */}
          <ReactSelect
            id="bl_type" dataSrc={blType as data}
            options={{
              keyCol: "bl_type",
              displayCol: ['bl_type_nm'],
              defaultValue: bkData?.bl_type,
              isAllYn: false
              }} 
            events={{
              onChange: handleCustomSelectChange
            }}
            />
          <ReactSelect
            id="bill_type" dataSrc={billtype as data}
            options={{
              keyCol: "billtype",
              displayCol: ['billtype_nm'],
              defaultValue: bkData?.bill_type,
              isAllYn: false
              }} 
            events={{
              onChange: handleCustomSelectChange
            }}
            />
          <ReactSelect
            id="incoterms" dataSrc={incoterms as data}
            options={{
              keyCol: "incoterms",
              displayCol: ['incoterms_nm'],
              defaultValue: bkData?.incoterms,
              isAllYn: false
            }} 
            events={{
              onChange: handleCustomSelectChange
            }}
            />
          <MaskedInputField id="incoterms_remark" value={bkData?.incoterms_remark} options={{ isReadOnly: false }} events={{onChange:handleMaskedInputChange}} />
          <div></div>
          
          <Checkbox id="ams_yn" value={bkData?.ams_yn} />
          <MaskedInputField id="ams" value={bkData?.ams} options={{ isReadOnly: false }} events={{ onChange: handleMaskedInputChange }} />
          <Checkbox id="aci_yn" value={bkData?.aci_yn}/>
          <MaskedInputField id="aci" value={bkData?.aci} options={{ isReadOnly: false }} events={{ onChange: handleMaskedInputChange }} />
          <Checkbox id="afr_yn" value={bkData?.afr_yn}/>
          {/* <Checkbox id="edi_yn" value={bkData?.edi_yn} onClick={handleCheckBoxClick}/> */}
          <ReactSelect
            id="customs_declation" dataSrc={customsDeclation as data}
            options={{
              keyCol: "customs_declation",
              displayCol: ['customs_declation', 'customs_declation_nm'],
              defaultValue: bkData?.customs_declation,
              isAllYn: false
            }} 
            events={{
              onChange: handleCustomSelectChange
            }}
            />
          <Checkbox id="isf_yn" value={bkData?.isf_yn}/>
          <Checkbox id="e_manifest_yn" value={bkData?.e_manifest_yn}/>
        </PageContent>

        <PageContent>
          <div className="col-start-1 col-end-6 "><TextArea id="remark" rows={6} cols={32} value={bkData?.remark} options={{ isReadOnly: false }} events={{ onChange: handleTextAreaChange }} /></div>
        </PageContent>

      </form>
    </FormProvider>
  );
};


export default BKMain