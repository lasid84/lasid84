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

const BKSchedule = memo(({ loadItem, mainData }: any) => {

  const { dispatch, objState } = useAppContext();
  const [data, setData] = useState<any>();

  const methods = useForm({
    defaultValues: {
    }
  });

  const {
    handleSubmit,
    reset,
    setFocus,
    setValue,
    getValues,
    register,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  const [cyplace, setCyPlace] = useState<any>()

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(()=>{
    if(loadItem){
      //log('loadItem',loadItem)
      setCyPlace(loadItem[10])
    }
  })

  useEffect(() => {
    log("maindata", mainData);
    if (mainData)
      setData((mainData?.[0] as gridData).data[0]);
  }, [mainData])


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageContent
          title={<span className="px-1 py-1 text-blue-500">SKD</span>}>
          <div className="col-start-1 col-end-2"><MaskedInputField id="ts_port" value={data?.ts_port} options={{ isReadOnly: true }} /></div>
          <div className="col-start-2 col-end-4"><MaskedInputField id="vessel" value={data?.vessel} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 col-end-6"><hr></hr>  </div>
          <div className="col-start-1 col-end-2"><MaskedInputField id="port_of_loading" value={data?.port_of_loading} options={{ isReadOnly: true }} /></div>

          <MaskedInputField id="port_of_unloading" value={data?.port_of_unloading} options={{ isReadOnly: true }} />
          <MaskedInputField id="final_dest_port" value={data?.final_dest_port} options={{ isReadOnly: true }} />

          <div className="col-start-1 col-end-2"><DatePicker id="etd" value={data?.etd} options={{ isReadOnly: true, freeStyles: "border-1 border-slate-300" }} /></div>
          <DatePicker id="eta" value={data?.eta} options={{ isReadOnly: true, freeStyles: "border-1 border-slate-300" }} />
          <DatePicker id="final_eta" value={data?.final_eta} options={{ isReadOnly: true, freeStyles: "border-1 border-slate-300" }} />
          <div className="col-start-1 col-end-6"><hr></hr> </div>

          <div className="col-start-1 col-end-2">
            <DatePicker id="doc_close_dd" value={data?.doc_close_dd} options={{ isReadOnly: true, freeStyles: "border-1 border-slate-300" }} />
          </div>
          <MaskedInputField id="doc_close_tm" value={data?.doc_close_tm} options={{ isReadOnly: true }} />
          <DatePicker id="cargo_close_dd" value={data?.cargo_close_dd} options={{ isReadOnly: true, freeStyles: "border-1 border-slate-300" }} />
          <MaskedInputField id="cargo_close_tm" value={data?.cargo_close_tm} options={{ isReadOnly: true }} />

        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Pick up</span>}>
          <div className="col-span-6">
            <PageSearch
              right={
                <>
                  <Button id={"manage"} label={"manage_pickup"} width="w-15" />
                  <Button id={"manage"} label={"manage_cy"} width="w-15" />
                  <Button id={"delete"} width="w-15" />
                </>}>
              <>
                <div className="col-start-1 col-end-2">
                  <DatePicker id="pickup_dd" value={data?.pickup_dd} options={{ isReadOnly: false, freeStyles: "border-1 border-slate-300" }} />
                </div>
                <MaskedInputField id="pickup_tm" value={data?.pickup_tm} options={{ isReadOnly: false, type: 'time' }} />
                
                <MaskedInputField id="pickup_seq" value={data?.pickup_seq} options={{ isReadOnly: false }} />
                <MaskedInputField id="pickup_loc" value={data?.pickup_loc} options={{ isReadOnly: false }} />
                <div className="col-start-1 col-end-2">
                <MaskedInputField id="cy_place_code" value={data?.cy_place_code} options={{ isReadOnly: false ,useIcon:true}} />
                </div>
                <div className={"col-span-2"}>
                  <CustomSelect
                    id="cy_place_code"
                    initText='Select an Container Yard'
                    listItem={cyplace as gridData}
                    valueCol={["place_code", "place_nm,"]}
                    displayCol="place_code"
                    gridOption={{
                      colVisible: { col: ["place_code", "place_nm"], visible: true },
                    }}
                    gridStyle={{ width: '600px', height: '300px' }}
                    style={{ width: '1000px', height: "8px" }}
                    isDisplay={true}
                    inline={true}
                  />
                </div>
                {/* <MaskedInputField id="cy_place_code_nm" value={data?.cy_place_code_nm} options={{ isReadOnly: false }} /> */}
                <MaskedInputField id="cy_place_area" value={data?.cy_place_code_nm} options={{ isReadOnly: false }} />
                <div className="col-start-1 col-end-2">
                <MaskedInputField id="cy_cont_nm" value={data?.cy_cont_nm} options={{ isReadOnly: false }} />
                </div>
                <MaskedInputField id="cy_cont_tel" value={data?.cy_cont_nm} options={{ isReadOnly: false }} />
                <MaskedInputField id="cy_cont_email" value={data?.cy_cont_nm} options={{ isReadOnly: false }} />
              </>
            </PageSearch>
          </div>
        </PageContent>

      </form>
    </FormProvider>
  );
});


export default BKSchedule