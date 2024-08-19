'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DateInput, DatePicker } from 'components/date'
import { gridData, ROW_CHANGED } from "components/grid/ag-grid-enterprise";
import CustomSelect from "components/select/customSelect";
import PageSearch from "layouts/search-form/page-search-row";
import { useGetData } from "components/react-query/useMyQuery";
import { SEARCH_D, SEARCH_PKC } from "components/provider/contextArrayProvider";
import { SP_GetPickupContData } from "./data";
import PicupPlacePopUp from "./popPickupcont"
// import PicupPlacePopUp from "./popPickupcont"
import { Button } from "components/button";
import dayjs from "dayjs";
import { SP_GetDetailData } from "@/components/commonForm/customerPickupPlace/_component/data";
import { SP_GetCYContactData } from "@/components/commonForm/containerYardContact/_component/data";
import { SP_GetMasterData } from "@/app/ocen/ocen0004/_component/data";
import CYPlaceContPopUp from './popCyPlaceCont';

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
  const { data: cyPlaceData, refetch: cyPlaceRefetch, remove: cyPlaceRemove } = useGetData({ place_code: bkData?.cy_place_code, pickup_type: trans_mode + trans_type }, "CyPlace", SP_GetMasterData, { enable: true });
  const { data: pickupData, refetch: pickupRefetch, remove: pickupRemove } = useGetData({ cust_code: bkData?.shipper_id, pickup_type: trans_mode + trans_type }, SEARCH_PKC, SP_GetDetailData, { enable: true });
  const { data: cyPlaceContData, refetch: cyPlaceContRefetch, remove: cyPlaceContRemove } = useGetData({ place_code: bkData?.cy_place_code, cont_type: trans_mode + trans_type }, "CYContacotr", SP_GetCYContactData, { enable: true });
  // const [cyPlace, setCyPlace] = useState<any>()
  const [port, setPort] = useState<any>()


  const methods = useForm({
    defaultValues: {
      doc_close_dd: dayjs().format('YYYYMMDD')
    }
  });

  const {
    handleSubmit,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  // useEffect(() => {
  //   if (objState.isPKCSearch) {
  //     detailRefetch();
  //     dispatch({ isPKCSearch: false });
  //   }
  // }, [objState.mSelectedRow, objState.isPKCSearch]);

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    if (loadItem) {
      // log('loadItem',loadItem)
      // setCyPlace(loadItem[10])
      setPort(loadItem[18]);
    }
  }, [])

  const handleButtonClick = (e:any) => {
    switch (e.target.id) {
      case "pickup_manage":
        dispatch({ isPickupPopupOpen: true });
        break;
      case "cy_manage":
        dispatch({ isCYPopupOpen: true });
        break;
      case "cy_cont_manage":
        dispatch({ isCYContPopupOpen: true });
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
    // dispatch({[MselectedTab]: {...bkData, [id]:val, [ROW_CHANGED]: true}});    
    bkData[id] = val;
    bkData[ROW_CHANGED] = true
    dispatch({[MselectedTab]: {...bkData}});    
    log("handleCustomSelectChange", bkData)
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
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">SKD</span>}>
          {/* <div className="col-start-1 col-end-2"><MaskedInputField id="ts_port" value={bkData?.ts_port} options={{ isReadOnly: false }} /></div> */}
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
            events={{
              onSelectionChanged: handleCustomSelectChange
            }} 
          />
          <div className="col-start-2 col-end-4"><MaskedInputField id="vessel" value={bkData?.vessel} options={{ isReadOnly: false}} events={{ onChange: handleMaskedInputChange}} /></div>
          <div className="col-start-1 col-end-6"><hr></hr>  </div>
          <div className="col-start-1 col-end-2">
            {/* <MaskedInputField id="port_of_loading" value={bkData?.port_of_loading} options={{ isReadOnly: false }} /> */}
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
              events={{
                onSelectionChanged: handleCustomSelectChange
              }} 
            />
          </div>

          {/* <MaskedInputField id="port_of_unloading" value={bkData?.port_of_unloading} options={{ isReadOnly: false }} /> */}
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
              events={{
                onSelectionChanged: handleCustomSelectChange
              }} 
            />
          {/* <MaskedInputField id="final_dest_port" value={bkData?.final_dest_port} options={{ isReadOnly: false }} /> */}
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
              events={{
                onSelectionChanged: handleCustomSelectChange
              }} 
            />

          <div className="col-start-1 col-end-2"><DatePicker id="etd" value={bkData?.etd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} 
            events={{
              onChange: (e, id, date) => {
                handleCustomSelectChange(e,id,DateToString(date));
              }
            }} /></div>
          <DatePicker id="eta" value={bkData?.eta} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} 
            events={{
              onChange: (e, id, date) => {
                handleCustomSelectChange(e,id,DateToString(date));
              }
            }}/>
          <DatePicker id="final_eta" value={bkData?.final_eta} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} 
            events={{
              onChange: (e, id, date) => {
                handleCustomSelectChange(e,id,DateToString(date));
              }
            }}/>
          <div className="col-start-1 col-end-6"><hr></hr> </div>

          <div className="col-start-1 col-end-2">
            <DatePicker id="doc_close_dd" value={bkData?.doc_close_dd || getValues("doc_close_dd")} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} 
              events={{
                onChange: (e, id, date) => {
                  handleCustomSelectChange(e,id,DateToString(date));
                }
              }}/>
          </div>
          <MaskedInputField id="doc_close_tm" value={bkData?.doc_close_tm} options={{ isReadOnly: false, type: 'time' }} width='w-40' events={{ onChange: handleMaskedInputChange }} />
          <DatePicker id="cargo_close_dd" value={bkData?.cargo_close_dd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} 
            events={{
              onChange: (e, id, date) => {
                handleCustomSelectChange(e,id,DateToString(date));
              }
            }}/>
          <MaskedInputField id="cargo_close_tm" value={bkData?.cargo_close_tm} options={{ isReadOnly: false, type: 'time' }} width='w-40' events={{ onChange: handleMaskedInputChange }}/>

        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Pick up</span>}>
          <div className="col-span-8">
            <PageSearch
              right={
                <>
                  <Button id={"pickup_manage"} label={"manage_pickup"} onClick={handleButtonClick} width="w-24"   />
                  {/* <Button id={"cy_manage"} label={"manage_cy"} onClick={handleButtonClick} width="w-30"   /> */}
                  <Button id={"cy_cont_manage"} label={"manage_cont_cy"} onClick={handleButtonClick} width="w-24"/>
                  {/* <Button id={"delete"} width="w-24"   /> */}
                </>}>
              <>
                <PicupPlacePopUp callbacks={[pickupRefetch]} />
                <CYPlaceContPopUp callbacks={[cyPlaceContRefetch]} />
                <div className="col-start-1 col-end-2"> 
                  <DatePicker id="pickup_dd" value={bkData?.pickup_dd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} 
                    events={{
                      onChange: (e, id, date) => {
                        handleCustomSelectChange(e,id,DateToString(date));
                      }
                    }}/>                
                </div>
                <MaskedInputField id="pickup_tm" value={bkData?.pickup_tm} options={{ isReadOnly: false, type: 'time' }} events={{ onChange: handleMaskedInputChange }}/>
                <MaskedInputField id="transport_company" value={bkData?.transport_company} options={{ isReadOnly: false }} events={{ onChange: handleMaskedInputChange }}/>
                <div className="col-start-1 col-end-6"><br></br></div>
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
                    defaultValue={bkData?.pickup_seq}
                    isDisplay={true}
                    events={{
                      onSelectionChanged: (e, id, value) => {
                        var selectedRow = e.api.getSelectedRows()[0] as any;
                        // setCrTaskContRowData(selectedRow);
                        bkData.pickup_nm = selectedRow?.pickup_nm;
                        bkData.pickup_addr = selectedRow?.addr;
                        bkData.pickup_pic_nm = selectedRow?.pic_nm;
                        bkData.pickup_email = selectedRow?.email;
                        bkData.pickup_tel_num = selectedRow?.tel_num;
                        handleCustomSelectChange(e, id, value);
                      }
                    }}
                  />
                </div>
                <div className="col-span-3"><MaskedInputField id="pickup_addr" value={bkData?.pickup_addr} options={{ isReadOnly: true }} /> </div>
                {/* <MaskedInputField id="pickup_loc" value={bkData?.pickup_loc} options={{ isReadOnly: false }} /> */}
                <div className={"col-start-1"}><MaskedInputField id="pickup_pic_nm" value={bkData?.pickup_pic_nm} options={{ isReadOnly: true }} /></div>
                <MaskedInputField id="pickup_email" value={bkData?.pickup_email} options={{ isReadOnly: true }} />
                <MaskedInputField id="pickup_tel_num" value={bkData?.pickup_tel_num} options={{ isReadOnly: true }} />
                <div className="col-start-1 col-end-6"><br></br>  </div>
                <div className={"col-start-1 col-span-2"}>
                  <CustomSelect
                    id="cy_place_code"
                    initText='Select an Container Yard'
                    listItem={cyPlaceData as gridData}
                    valueCol={["place_code", "place_nm"]}
                    displayCol="place_nm"
                    gridOption={{
                      colVisible: { col: ["place_code", "place_nm", "area_nm", "addr"], visible: true },
                    }}
                    gridStyle={{ width: '800px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    defaultValue={bkData?.cy_place_code}
                    isDisplay={true}
                    events={{
                      onSelectionChanged: (e, id, value) => {
                        var selectedRow = e.api.getSelectedRows()[0] as any;
                        // setCrTaskContRowData(selectedRow);
                        bkData.cy_place_nm = selectedRow?.place_nm;
                        bkData.cy_area_nm = selectedRow?.area_nm;
                        bkData.cy_addr = selectedRow?.addr;
                        handleCustomSelectChange(e, id, value);
                      }}}
                  />
                </div>
                {/* <MaskedInputField id="cy_place_code_nm" value={data?.cy_place_code_nm} options={{ isReadOnly: false }} /> */}
                <MaskedInputField id="cy_place_area" value={bkData?.cy_area_nm} options={{ isReadOnly: true }} />
                <div className="col-span-2"><MaskedInputField id="cy_place_addr" value={bkData?.cy_addr} options={{ isReadOnly: true }} /></div>

                <div className="col-start-1 col-end-2">
                  {/* <MaskedInputField id="cy_cont_nm" value={bkData?.cy_cont_nm} options={{ isReadOnly: false }} /> */}
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
                    defaultValue={bkData?.cy_cont_seq}
                    isDisplay={true}
                    events={{
                      onSelectionChanged: (e, id, value) => {
                        var selectedRow = e.api.getSelectedRows()[0] as any;
                        bkData.cy_cont_pic_nm = selectedRow?.pic_nm;
                        bkData.cy_cont_email = selectedRow?.email;
                        bkData.cy_cont_tel_num = selectedRow?.tel_num;
                        bkData.cy_cont_fax_num = selectedRow?.fax_num;
                        handleCustomSelectChange(e, id, value);
                      }}}
                  />
                </div>
                
                <MaskedInputField id="cy_cont_tel_num" value={bkData?.cy_cont_tel_num} options={{ isReadOnly: true }} />
                <MaskedInputField id="cy_cont_email" value={bkData?.cy_cont_email} options={{ isReadOnly: true }} />
              </>
            </PageSearch>
          </div>
        </PageContent>

      </form>
    </FormProvider>
  );
});


export default BKSchedule