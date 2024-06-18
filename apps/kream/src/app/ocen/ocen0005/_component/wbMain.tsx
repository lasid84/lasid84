'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {PageContent} from "layouts/search-form/page-search-row";
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

const WBMain = memo(({ loadItem, mainData }: any) => {

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
          title={<span className="px-1 py-1 text-blue-500">Generals</span>}>
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


        
        <div className="flex flex-row w-full">
          <div className="flex w-1/2">
            <PageContent
              title={<span className="px-1 py-1 text-blue-500">Shipper</span>}>
              <div className={"col-span-2"}>
                <MaskedInputField id="shipper_id" value={data?.shipper_id} options={{ isReadOnly: true }} />
              </div> <div className={"col-span-4"}>
                <MaskedInputField id="shipper_name" value={data?.shipper_name} options={{ isReadOnly: true }} />
              </div>
              <div className={"col-span-6"}>
                <MaskedInputField id="shipper_address" value={data?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
              </div>
              <div className={"col-span-4"}>
                <MaskedInputField id="shipper_contact_no" value={data?.shipper_contact_no} options={{ isReadOnly: true, useIcon: true }} />
              </div>
              <div className={"col-span-2"}>
                <MaskedInputField id="export_salesman_id" value={data?.export_salesman_id} options={{ isReadOnly: true }} />
              </div>
            </PageContent>
          </div>

          <div className="flex w-1/2">
            <PageContent
              title={<span className="px-1 py-1 text-blue-500">Consignee</span>}>
              <div className={"col-span-2"}>
                <MaskedInputField id="cnee_id" value={data?.cnee_id} options={{ isReadOnly: true }} />
              </div>  
              <div className={"col-span-4"}>
                <MaskedInputField id="cnee_name" value={data?.cnee_name} options={{ isReadOnly: true }} />
              </div>
              <div className={"col-span-6"}>
                <MaskedInputField id="cnee_address" value={data?.cnee_name} options={{ isReadOnly: true, useIcon: true }} />
              </div>
              <div className={"col-span-4"}>
                <MaskedInputField id="cnee_contact_no" value={data?.cnee_contact_no} options={{ isReadOnly: true, useIcon: true }} />
              </div>
              <div className={"col-span-2"}>
                <MaskedInputField id="import_salesman_id" value={data?.import_salesman_id} options={{ isReadOnly: true }} />
              </div>
            </PageContent>
          </div>
        </div>

        <div className="flex flex-row w-full">
          <div className="flex w-1/2">
            <PageContent title={<span className="px-1 py-1 text-blue-500">Notify</span>}>
              <div className={"col-span-2"}>
                <MaskedInputField id="notify_id" value={data?.notify_id} options={{ isReadOnly: true }} />
              </div>
              <div className={"col-span-4"}>
                <MaskedInputField id="notify_name" value={data?.notify_name} options={{ isReadOnly: true }} />
              </div>
              <div className={"col-span-6"}>
                <MaskedInputField id="notify_address_no" value={data?.notify_address_no} options={{ isReadOnly: true, useIcon: true }} />
              </div>
              <div className={"col-span-4"}>
                <MaskedInputField id="notify_contact_no" value={data?.notify_contact_no} options={{ isReadOnly: true }} />
              </div>
              <div className={"col-span-2"}><span className="ml-auto"></span></div>
            </PageContent>
          </div>        
        </div>
      </form>
    </FormProvider>
  );
});


export default WBMain