'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DateInput, DatePicker } from 'components/date'
import { gridData } from "components/grid/ag-grid-enterprise";

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


  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

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
          title={<span className="px-1 py-1 text-blue-500">Pick up</span>}>
          <MaskedInputField id="mwb_type" value={data?.mwb_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="bol_type" value={data?.bol_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="service_type_code" value={data?.service_type_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="movement_type" value={data?.movement_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="customer_shipment_type" value={data?.customer_shipment_type} options={{ isReadOnly: true }} />

          <MaskedInputField id="orig_agent_id" value={data?.orig_agent_id} options={{ isReadOnly: true }} />
          <MaskedInputField id="freight_ppc_ind" value={data?.freight_ppc_ind} options={{ isReadOnly: true }} />
          <MaskedInputField id="other_ppc_ind" value={data?.other_ppc_ind} options={{ isReadOnly: true }} />
          <DatePicker id="executed_on_date" value={data?.executed_on_date} options={{ isReadOnly: true, freeStyles: "border-1 border-slate-300" }} />

          <MaskedInputField id="consol_no" value={data?.consol_no} options={{ isReadOnly: true }} />
          <MaskedInputField id="console_code" value={data?.console_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="bb_agent_id" value={data?.bb_agent_id} options={{ isReadOnly: true }} />
          <MaskedInputField id="manifest_no" value={data?.manifest_no} options={{ isReadOnly: true }} />

          <MaskedInputField id="port_of_loading" value={data?.port_of_loading} options={{ isReadOnly: true }} />
          <MaskedInputField id="port_origin" value={data?.port_origin} options={{ isReadOnly: true }} />
          {/* <MaskedInputField id="export_cc_point" value={data?.export_cc_point} options={{ isReadOnly: true }} /> */}
          <MaskedInputField id="carrier_code" value={data?.carrier_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="port_of_unloading" value={data?.port_of_unloading} options={{ isReadOnly: true }} />

          <MaskedInputField id="port_dest" value={data?.port_dest} options={{ isReadOnly: true }} />
          <MaskedInputField id="booking_num" value={data?.booking_num} options={{ isReadOnly: true }} />

        </PageContent>

      </form>
    </FormProvider>
  );
});


export default BKSchedule