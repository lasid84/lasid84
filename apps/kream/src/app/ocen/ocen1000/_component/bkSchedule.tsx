'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DateInput, DatePicker } from 'components/date'
import { gridData } from "components/grid/ag-grid-enterprise";
import CustomSelect from "components/select/customSelect";
import PageSearch from "layouts/search-form/page-search-row";
import { useGetData } from "components/react-query/useMyQuery";
import { SEARCH_D, SEARCH_PKC } from "components/provider/contextArrayProvider";
import { SP_GetPickupContData } from "./data";
import Modal from "./popPickupcont"
import { Button } from "components/button";
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

const BKSchedule = memo(({ loadItem, bkData }: any) => {

  const { dispatch, objState } = useAppContext()
  const [data, setData] = useState<any>()
  const { MselectedTab, popType, trans_mode, trans_type } = objState


  const methods = useForm({
    defaultValues: {
    }
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (objState.isPKCSearch) {
      log("mSelectedRow?.shipper_id useEffect", objState.isPKCSearch)
      detailRefetch();
      dispatch({ isPKCSearch: false });
    }
  }, [objState.mSelectedRow, objState.isPKCSearch]);

  //SEARCH_PKC | get Pickup cont data detailData
  const { data: pickupContData, refetch: detailRefetch, remove: detailRemove } = useGetData({ shipper_id: bkData?.shipper_id, cont_type: trans_mode + trans_type }, SEARCH_PKC, SP_GetPickupContData, { enable: true });
  const [cyplace, setCyPlace] = useState<any>()

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    if (loadItem) {
      //log('loadItem',loadItem)
      setCyPlace(loadItem[10])
    }
  })

  const onClick = () => {
    dispatch({ crudType: crudType.CREATE, isPickupPopupOpen: true, isPKCSearch: true })
  }


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">SKD</span>}>
          <div className="col-start-1 col-end-2"><MaskedInputField id="ts_port" value={bkData?.ts_port} options={{ isReadOnly: false }} /></div>
          <div className="col-start-2 col-end-4"><MaskedInputField id="vessel" value={bkData?.vessel} options={{ isReadOnly: false }} /></div>
          <div className="col-start-1 col-end-6"><hr></hr>  </div>
          <div className="col-start-1 col-end-2"><MaskedInputField id="port_of_loading" value={bkData?.port_of_loading} options={{ isReadOnly: false }} /></div>

          <MaskedInputField id="port_of_unloading" value={bkData?.port_of_unloading} options={{ isReadOnly: false }} />
          <MaskedInputField id="final_dest_port" value={bkData?.final_dest_port} options={{ isReadOnly: false }} />

          <div className="col-start-1 col-end-2"><DatePicker id="etd" value={bkData?.etd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} /></div>
          <DatePicker id="eta" value={bkData?.eta} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />
          <DatePicker id="final_eta" value={bkData?.final_eta} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />
          <div className="col-start-1 col-end-6"><hr></hr> </div>

          <div className="col-start-1 col-end-2">
            <DatePicker id="doc_close_dd" value={bkData?.doc_close_dd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />
          </div>
          <MaskedInputField id="doc_close_tm" value={bkData?.doc_close_tm} options={{ isReadOnly: false, type: 'time' }} width='w-40' />
          <DatePicker id="cargo_close_dd" value={bkData?.cargo_close_dd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />
          <MaskedInputField id="cargo_close_tm" value={bkData?.cargo_close_tm} options={{ isReadOnly: false, type: 'time' }} width='w-40' />

        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Pick up</span>}>
          <div className="col-span-6">
            <PageSearch
              right={
                <>
                  <Button id={"manage"} label={"manage_pickup"} onClick={onClick} width="w-24"   />
                  <Button id={"manage"} label={"manage_cy"} width="w-24"   />
                  <Button id={"delete"} width="w-24"   />
                </>}>
              <>
                <Modal initData={loadItem} detailData={pickupContData} />
                <div className="col-start-1 col-end-2"> <DatePicker id="pickup_dd" value={bkData?.pickup_dd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />                </div>
                <MaskedInputField id="pickup_tm" value={bkData?.pickup_tm} options={{ isReadOnly: false, type: 'time' }} />
                <div className="col-start-1 col-end-6"><br></br></div>
                <div className={"col-start-1 col-span-2"}>
                  <CustomSelect
                    id="pickup_seq"
                    initText='Select an Pickup Boundary'
                    listItem={cyplace as gridData}
                    valueCol={["pickup_seq", "place_nm,"]}
                    displayCol="pickup_seq"
                    gridOption={{
                      colVisible: { col: ["place_code", "place_nm"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    defaultValue={bkData?.cy_place_code}
                    isDisplay={true}
                    // inline={true}
                  />
                </div>
                <MaskedInputField id="pickup_addr" value={bkData?.pickup_seq} options={{ isReadOnly: false }} /> 
                <MaskedInputField id="pickup_loc" value={bkData?.pickup_loc} options={{ isReadOnly: false }} />
                <div className={"col-start-1"}><MaskedInputField id="pickup_pic_nm" value={bkData?.pickup_loc} options={{ isReadOnly: false }} /></div>
                <MaskedInputField id="pickup_email" value={bkData?.pickup_loc} options={{ isReadOnly: false }} />
                <MaskedInputField id="pickup_tel_num" value={bkData?.pickup_loc} options={{ isReadOnly: false }} />
                <div className="col-start-1 col-end-6"><br></br>  </div>
                <div className={"col-start-1 col-span-2"}>
                  <CustomSelect
                    id="cy_place_code"
                    initText='Select an Container Yard'
                    listItem={cyplace as gridData}
                    valueCol={["place_code", "place_nm,"]}
                    displayCol="place_nm"
                    gridOption={{
                      colVisible: { col: ["place_code", "place_nm"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    defaultValue={bkData?.cy_place_code}
                    isDisplay={true}
                    // inline={true}
                  />
                </div>
                {/* <MaskedInputField id="cy_place_code_nm" value={data?.cy_place_code_nm} options={{ isReadOnly: false }} /> */}
                <MaskedInputField id="cy_place_area" value={bkData?.cy_place_code_nm} options={{ isReadOnly: false }} />
                <div className="col-start-1 col-end-2">
                  <MaskedInputField id="cy_cont_nm" value={bkData?.cy_cont_nm} options={{ isReadOnly: false }} />
                </div>
                <MaskedInputField id="cy_cont_addr" value={bkData?.cy_cont_nm} options={{ isReadOnly: false }} />
                <MaskedInputField id="cy_cont_tel" value={bkData?.cy_cont_nm} options={{ isReadOnly: false }} />
                <MaskedInputField id="cy_cont_email" value={bkData?.cy_cont_nm} options={{ isReadOnly: false }} />
              </>
            </PageSearch>
          </div>
        </PageContent>

      </form>
    </FormProvider>
  );
});


export default BKSchedule