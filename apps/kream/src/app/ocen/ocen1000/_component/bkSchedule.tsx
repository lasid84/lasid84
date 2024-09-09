'use client'

import React, { useState, useEffect, Dispatch, useContext, memo, useCallback } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DateInput, DatePicker } from 'components/date'
import { gridData, ROW_CHANGED } from "components/grid/ag-grid-enterprise";
import CustomSelect from "components/select/customSelect";
import PageSearch from "layouts/search-form/page-search-row";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { SEARCH_D, SEARCH_PKC } from "components/provider/contextArrayProvider";
import { SP_GetPickupContData, SP_GetCarrierContData, SP_SendEmail } from "./data";
import { SP_GetTransPortData } from "@/app/stnd/stnd0012/_component/data";
import PicupPlacePopUp from "./popPickupcont"
import TransportEmailRcvPopup from "./popEmailRcvList"
import TransportEmailSendPopup from "./popEmailSend"
import CarrierContPopUp from "./popCarriercont";
import { Button } from "components/button";
import dayjs from "dayjs";
import { SP_GetDetailData } from "@/components/commonForm/customerPickupPlace/_component/data";
import { SP_GetCYContactData } from "@/components/commonForm/containerYardContact/_component/data";
import { SP_GetMasterData } from "@/app/ocen/ocen0004/_component/data";
import CYPlaceContPopUp from './popCyPlaceCont';
import { TRANPOSRT_EMAIL_LIST_OE } from "@/components/commonForm/mailReceiver/_component/data";

// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");
const { DateToString } = require("@repo/kwe-lib/components/dataFormatter");

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

const BKSchedule = memo(({ loadItem, bkData }: any) => {

  const { dispatch, objState } = useAppContext()
  const { MselectedTab, trans_mode, trans_type } = objState

  //SEARCH_PKC | get Pickup cont data detailData
  const { data: pickupData, refetch: pickupRefetch } = useGetData({ cust_code: bkData?.shipper_id, pickup_type: trans_mode + trans_type }, SEARCH_PKC, SP_GetDetailData, { enable: true });
  const { data: cyPlaceData, refetch: cyPlaceRefetch } = useGetData({ trans_mode:trans_mode, trans_type: trans_type }, "CyPlace", SP_GetMasterData, { enable: true });
  const { data: cyPlaceContData, refetch: cyPlaceContRefetch } = useGetData({ place_code: bkData?.cy_place_code, cont_type: trans_mode + trans_type }, "CYContacotr", SP_GetCYContactData, { enable: true });
  const { data: crTaskContData, refetch: crTaskContRefetch } = useGetData({ carrier_code: bkData?.carrier_code, cont_type: 'task' }, "carrier_cont_task", SP_GetCarrierContData, {enable:true});
  const { data: crSalesContData, refetch: crSalesContRefetch} = useGetData({ carrier_code: bkData?.carrier_code, cont_type: 'sale' }, "carrier_cont_sales", SP_GetCarrierContData, {enable:true});
  const { data: transportCompData, refetch: transportCompRefetch } = useGetData({ trans_mode:trans_mode, trans_type: trans_type }, "TransportCompany", SP_GetTransPortData, { enable: true });

  const { Create: sendEmail } = useUpdateData2(SP_SendEmail, '');
  
  // const [cyPlace, setCyPlace] = useState<any>()
  const [carriercode, setCarrierCode] = useState<any>()
  const [port, setPort] = useState<any>()
  const [ isRefreshCyCont, setRefreshCyCont ] = useState(false)
  const { getValues } = useFormContext()

  useEffect(() => {
    if (loadItem) {
      setCarrierCode(loadItem[9])
      setPort(loadItem[18])
    }
  }, [])

  useEffect(() => {
    log("cyPlaceData", bkData);
  }, [cyPlaceData])

  useEffect(()=> {
    if (isRefreshCyCont && cyPlaceContData && crTaskContData && crSalesContData && bkData) {
      setRefreshCyCont(false);

      let defTask = (crTaskContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let t_cont_seq = defTask ? defTask.cont_seq : null;
      let defSales = (crSalesContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      let s_cont_seq = defSales ? defSales.cont_seq : null;
      let def = (cyPlaceContData as gridData).data.filter((row:any) => row['def'] === 'Y')[0];
      dispatch({ [MselectedTab]: {...bkData, cr_t_cont_seq: t_cont_seq, cr_s_cont_seq: s_cont_seq, cy_cont_seq:def?.cont_seq}})
    } 
  }, [isRefreshCyCont, cyPlaceContData, bkData])

  const handleButtonClick = (e:any) => {
    switch (e.target.id) {
      case "btn_pickup_manage":
        dispatch({ isPickupPopupOpen: true });
        break;
      case "cy_manage":
        dispatch({ isCYPopupOpen: true });
        break;
      case "btn_cy_cont_manage":
        dispatch({ isCYContPopupOpen: true });
        break;
      case "carrier_manage":
          dispatch({ isCarrierContPopupOpen: true });
        break;  
      case "btn_transport_email":
          dispatch({ isMailRcvPopupOpen: true });
        break;  
      case "btn_transport_send_email":
          //sendTransPortEmail();
          dispatch({ isMailSendPopupOpen : true })
        break;
    }
  }

  const sendTransPortEmail = useCallback(async () => {
    log("sendTransPortEmail", bkData)
    await sendEmail.mutateAsync({...bkData, pgm_code: TRANPOSRT_EMAIL_LIST_OE + bkData?.transport_company}, {
      onSuccess(data, variables, context) {
      },
    })
    .catch(() => {});
  }, []);
    
  
  return (
    <div className="w-full">
        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">SKD</span>}>
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
                        // if (bkData?.carrier_code != value) {
                        //   setRefreshCrCont(true);
                        //   dispatch({[MselectedTab]: {...bkData, carrier_code:value }});
                        //   log("onSelectionChanged carrier_code", id, value);
                        // }
                      },
                    }}
                  />
                </div>
        
        
          <div className="col-start-3 col-end-5"><MaskedInputField id="vessel" value={bkData?.vessel} options={{ isReadOnly: false}} /></div>
          <div className="col-start-1 col-end-6"> <hr></hr>  </div>
          <div className="col-start-1 col-end-2">
            <CustomSelect 
              id="port_of_loading"
              initText="Select a Port"
              listItem={port as gridData}
              valueCol={["port_code", "port_nm"]}
              displayCol="port_nm"
              gridOption={{
                colVisible: { col: ["port_code", "port_nm"], visible: true },
              }}
              defaultValue={bkData?.port_of_loading}
              isDisplay={true}
            />
          </div>

          <CustomSelect 
              id="port_of_unloading"
              initText="Select a Port"
              listItem={port as gridData}
              valueCol={["port_code", "port_nm"]}
              displayCol="port_nm"
              gridOption={{
                colVisible: { col: ["port_code", "port_nm"], visible: true },
              }}
              defaultValue={bkData?.port_of_unloading}
              isDisplay={true}
            />
          <CustomSelect 
            id="ts_port"
            initText="Select a T/S Port"
            listItem={port as gridData}
            valueCol={["port_code", "port_nm"]}
            displayCol="port_nm"
            gridOption={{
              colVisible: { col: ["port_code", "port_nm"], visible: true },
            }}
            defaultValue={bkData?.ts_port}
            isDisplay={true}
          />
          <CustomSelect 
              id="final_dest_port"
              initText="Select a Port"
              listItem={port as gridData}
              valueCol={["port_code", "port_nm"]}
              displayCol="port_nm"
              gridOption={{
                colVisible: { col: ["port_code", "port_nm"], visible: true },
              }}
              defaultValue={bkData?.final_dest_port}
              isDisplay={true}
            />

          <div className="col-start-1 col-end-2"><DatePicker id="etd" value={bkData?.etd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} /></div>
          <DatePicker id="eta" value={bkData?.eta} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />
          <DatePicker id="final_eta" value={bkData?.final_eta} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />
          <div className="col-start-1 col-end-6"><hr></hr> </div>

          <div className="col-start-1 col-end-2">
            <DatePicker id="doc_close_dd" value={bkData?.doc_close_dd || getValues("doc_close_dd")} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />
          </div>
          <MaskedInputField id="doc_close_tm" value={bkData?.doc_close_tm} options={{ isReadOnly: false, type: 'time' }} width='w-40' />
          <DatePicker id="cargo_close_dd" value={bkData?.cargo_close_dd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />
          <MaskedInputField id="cargo_close_tm" value={bkData?.cargo_close_tm} options={{ isReadOnly: false, type: 'time' }} width='w-40' />
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Pick up</span>}>
          <div className="col-span-8">
            <PageSearch
              right={
                <>
                  <Button id={"btn_pickup_manage"} label={"manage_pickup"} onClick={handleButtonClick} width="w-24" disabled={bkData?.shipper_id ? false : true} />
                  {/* <Button id={"cy_manage"} label={"manage_cy"} onClick={handleButtonClick} width="w-30"   /> */}
                  <Button id={"btn_cy_cont_manage"} label={"manage_cont_cy"} onClick={handleButtonClick} width="w-24"/>

                </>}>
              <>
                <PicupPlacePopUp callbacks={[pickupRefetch]} />
                <CYPlaceContPopUp callbacks={[cyPlaceContRefetch]} />
                <TransportEmailRcvPopup cust_code={bkData?.transport_company} cust_nm={bkData?.transport_company_nm}/>
                <TransportEmailSendPopup cust_code={bkData?.transport_company} cust_nm={bkData?.transport_company_nm}/>
                <div className="col-start-1 col-end-2"> 
                  <DatePicker id="pickup_dd" value={bkData?.pickup_dd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />                
                </div>
                <MaskedInputField id="pickup_tm" value={bkData?.pickup_tm} options={{ isReadOnly: false, type: 'time' }} />
                {/* <MaskedInputField id="transport_company" value={bkData?.transport_company} options={{ isReadOnly: false }} /> */}
                <CustomSelect
                    id="transport_company"
                    listItem={transportCompData as gridData}
                    valueCol={["cust_code"]}
                    displayCol="cust_nm"
                    gridOption={{
                      colVisible: { col: ["cust_code", "cust_nm", "bz_reg_no"], visible: true },
                    }}
                    gridStyle={{ width: '800px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    defaultValue={bkData?.transport_company}
                    isDisplay={true}
                    events={{
                      onSelectionChanged(e, id, value) {
                        if (!bkData) return;
                        log("transport_company onChange", bkData, id, value)
                        var selectedRow = e.api.getSelectedRows()[0];
                        // bkData.transport_company_nm = selectedRow.cust_nm;
                        
                        if (bkData?.transport_company != value) {
                          dispatch({[MselectedTab]: {...bkData, transport_company:value}});
                          // log("onSelectionChanged", id, value);
                        }
                      },
                    }}
                  />
                <div className="flex w-full pt-3">                  
                  <Button id={"btn_transport_email"} label="mail_rcvlist" width="w-24" onClick={handleButtonClick} disabled={bkData?.transport_company ? false : true}/>
                  <Button id={"btn_transport_send_email"} label="send_email" width="w-24" onClick={handleButtonClick} disabled={bkData?.transport_company ? false : true}/>
                </div>
                {/* <div className="col-start-1 col-end-6"><br></br></div> */}
                <div className={"col-start-1 col-span-2"}>
                  <CustomSelect
                    id="pickup_seq"
                    label="pickup_load"
                    initText='Select a Pickup Place'
                    listItem={pickupData as gridData}
                    valueCol={["pickup_seq", "pickup_nm", "pic_nm"]}
                    displayCol="pickup_nm"
                    gridOption={{
                      colVisible: { col: ["pickup_nm", "pic_nm", "addr", "tel_num"], visible: true },
                    }}
                    gridStyle={{ width: '800px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    // defaultValue={bkData?.pickup_seq}
                    defaultValue={bkData?.pickup_seq}
                    isDisplay={true}
                    events={{
                      onChanged: (e) => {
                        // log("pickup_seq onChange", e, bkData)
                        if (!bkData) return;
                        bkData.pickup_nm = !e ? null : e.pickup_nm;
                        bkData.pickup_addr = !e ? null : e.addr;
                        bkData.pickup_pic_nm = !e ? null : e.pic_nm;
                        bkData.pickup_email = !e ? null : e.email;
                        bkData.pickup_tel_num = !e ? null : e.tel_num;
                        bkData.pickup_remark = !e ? null : e.remark;
                        dispatch({[MselectedTab]: {...bkData}});
                      },
                    }}
                  />
                </div>
                <div className="col-span-3"><MaskedInputField id="pickup_addr" value={bkData?.pickup_addr} options={{ isReadOnly: true }} /> </div>
                {/* <MaskedInputField id="pickup_loc" value={bkData?.pickup_loc} options={{ isReadOnly: false }} /> */}
                <div className={"col-start-1"}><MaskedInputField id="pickup_pic_nm" value={bkData?.pickup_pic_nm} options={{ isReadOnly: true }} /></div>
                <MaskedInputField id="pickup_email" value={bkData?.pickup_email} options={{ isReadOnly: true }} />
                <MaskedInputField id="pickup_tel_num" value={bkData?.pickup_tel_num} options={{ isReadOnly: true }} />
                <div className="col-start-1 col-end-6 "><TextArea id="pickup_remark" rows={3} cols={32} value={bkData?.pickup_remark} options={{ isReadOnly: true }} /></div>

                {/* <div className={"col-start-1 col-span-2"}> */}
                  <CustomSelect
                    id="cy_place_code"
                    initText='Select an Container Yard'
                    listItem={cyPlaceData as gridData}
                    valueCol={["place_code", "place_nm"]}
                    displayCol="place_code"
                    gridOption={{
                      colVisible: { col: ["place_code", "place_nm", "area_nm", "addr"], visible: true },
                    }}
                    gridStyle={{ width: '800px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    defaultValue={bkData?.cy_place_code}
                    isDisplay={true}
                    events={{
                      onSelectionChanged: (e, id, value) => {
                        if (bkData?.cy_place_code != value) {
                          var selectedRow = e.api.getSelectedRows()[0] as any;
                          setRefreshCyCont(true);
                          dispatch({[MselectedTab]: {...bkData, 
                            cy_place_code: value, 
                            cy_place_nm: selectedRow?.place_nm,
                            cy_area_nm: selectedRow?.area_nm,
                            cy_addr: selectedRow?.addr
                          }});
                      }
                      }}}
                  />
                {/* </div> */}
                <MaskedInputField id="cy_place_nm" value={bkData?.cy_place_nm} options={{ isReadOnly: true }} />
                <MaskedInputField id="cy_place_area" value={bkData?.cy_area_nm} options={{ isReadOnly: true }} />
                <div className="col-span-2"><MaskedInputField id="cy_place_addr" value={bkData?.cy_addr} options={{ isReadOnly: true }} /></div>

                <div className="col-start-1 col-end-2">
                  <CustomSelect
                    id="cy_cont_seq"
                    initText='Select an option'
                    listItem={cyPlaceContData as gridData}
                    valueCol={["cont_seq", "pic_nm", "email", "tel_num", "fax_num"]}
                    displayCol="pic_nm"
                    gridOption={{
                      colVisible: { col: ["pic_nm", "email", "tel_num", "fax_num"], visible: true },
                    }}
                    gridStyle={{ width: '800px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    // defaultValue={bkData?.cy_cont_seq}
                    defaultValue={bkData?.cy_cont_seq}
                    isDisplay={true}
                    // events={{
                    //   onSelectionChanged: (e, id, value) => {
                    //     var selectedRow = e.api.getSelectedRows()[0] as any;
                    //     bkData.cy_cont_pic_nm = selectedRow?.pic_nm;
                    //     bkData.cy_cont_email = selectedRow?.email;
                    //     bkData.cy_cont_tel_num = selectedRow?.tel_num;
                    //     bkData.cy_cont_fax_num = selectedRow?.fax_num;
                    //     handleCustomSelectChange(e, id, value);
                    //   }
                      events={{
                        onChanged: (e) => {
                          if (!bkData) return;
                          bkData.cy_cont_pic_nm = e?.pic_nm;
                          bkData.cy_cont_email = e?.email;
                          bkData.cy_cont_tel_num = e?.tel_num;
                          bkData.cy_cont_fax_num = e?.fax_num;
                          dispatch({[MselectedTab]: {...bkData}});
                        },
                      }}
                  />
                </div>
                
                <MaskedInputField id="cy_cont_tel_num" value={bkData?.cy_cont_tel_num} options={{ isReadOnly: true }} />
                <MaskedInputField id="cy_cont_email" value={bkData?.cy_cont_email} options={{ isReadOnly: true }} />
              </>
            </PageSearch>
          </div>
          <div className="col-start-1 col-end-6"> <hr></hr>  </div>
        </PageContent>
      </div>
  );
});


export default BKSchedule