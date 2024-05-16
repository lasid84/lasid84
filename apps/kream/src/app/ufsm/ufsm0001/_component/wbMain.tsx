'use client'

import { useTranslation } from "react-i18next";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { SlMagnifierAdd } from "react-icons/sl";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import { useGetData } from "components/react-query/useMyQuery";
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from 'components/date'
import dayjs from 'dayjs'
import { gridData } from "components/grid/ag-grid-enterprise";
import { SP_GetMasterData } from "./data";

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
  mainData : typeloadItem;
};

const WBMain = memo(({ loadItem, mainData }: any) => {

  const { dispatch, objState } = useAppContext();
  const [data, setData] = useState<any>()
  
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

  useEffect(() => {
    if (loadItem?.length) {
      onSearch();
      // onSubmit();
      // handleSubmit(onSubmit)();
    }
  }, [loadItem?.length])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true });
  }

  useEffect(() => {
    if (mainData) {
      log('ufsm0001_mainData ', mainData)
      setData((mainData?.[0] as gridData).data[0]);
    }
  }, [mainData])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Generals</span>}>
          <MaskedInputField id="waybill_type" value={data?.waybill_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="bol_type" value={data?.bol_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="service_type_code" value={data?.service_type_code} options={{ isReadOnly: true }} />
          <DatePicker id={"execution_date"} value={data?.execution_date} options={{ isReadOnly: true, textAlign: 'center', freeStyles: "underline border-1 border-slate-300" }} />
          <DatePicker id={"ic_dc_consol_date"} value={data?.ic_dc_consol_date} options={{ isReadOnly: true, textAlign: 'center', freeStyles: "underline border-1 border-slate-300" }} />
          <MaskedInputField id="freight_terms" value={data?.freight_terms} options={{ isReadOnly: true }} />
          <MaskedInputField id="customer_shipment_type" value={data?.customer_shipment_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="movement_type" value={data?.movement_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="cust_shipment_type" value={data?.cust_shipment_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="agent_type" value={data?.agent_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="mwb_no" value={data?.mwb_no} options={{ isReadOnly: true }} />
          <MaskedInputField id="carrier_code" value={data?.carrier_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="freight_ppc_ind" value={data?.freight_ppc_ind} options={{ isReadOnly: true }} />
          <MaskedInputField id="other_ppc_ind" value={data?.other_ppc_ind} options={{ isReadOnly: true }} />
          <MaskedInputField id="booking_no" value={data?.booking_no} options={{ isReadOnly: true }} />
          <MaskedInputField id="origin_port" value={data?.origin_port} options={{ isReadOnly: true }} />
          <MaskedInputField id="origin_city_code" value={data?.origin_city_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_receipt" value={data?.place_of_receipt} options={{ isReadOnly: true }} />
          <MaskedInputField id="mpr_port_dest1" value={data?.mpr_port_dest1} options={{ isReadOnly: true }} />
          <MaskedInputField id="dest_city_code" value={data?.dest_city_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_delivery" value={data?.place_of_delivery} options={{ isReadOnly: true }} />
          <div className="flex col-start-1 col-end-6">
            <fieldset className="flex w-1/2 p-1 space-x-1 space-y-1 border-2 border-solid ">
              <legend className="text-sx">IC Consol</legend>
              <MaskedInputField id="place_of_delivery" value={data?.place_of_delivery} options={{ isReadOnly: true }} />
              <MaskedInputField id="place_of_delivery" value={data?.place_of_delivery} options={{ isReadOnly: true }} width="w-96" />
            </fieldset>
            <fieldset className="flex w-1/2 p-1 space-x-1 space-y-1 border-2 border-solid ">
              <legend className="text-sx">DC/TT Consol</legend>
              <MaskedInputField id="place_of_delivery" value={data?.place_of_delivery} options={{ isReadOnly: true }} />
              <MaskedInputField id="place_of_delivery" value={data?.place_of_delivery} options={{ isReadOnly: true }} width="w-96" />
            </fieldset>
          </div>
        </PageSearch>


        <div className="flex flex-row w-full">
          <div className="flex w-1/2">
            <PageSearch
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
            </PageSearch>
          </div>

          <div className="flex w-1/2">
            <PageSearch
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
            </PageSearch>
          </div>
        </div>

        <div className="flex flex-row w-full">
          <div className="flex w-1/2">
            <PageSearch title={<span className="px-1 py-1 text-blue-500">Notify</span>}>
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
            </PageSearch>
          </div>


          <div className="flex w-1/2">
            <PageSearch title={<span className="px-1 py-1 text-blue-500">Export Bill To</span>}>
              <div className={"col-span-2"}>
                <MaskedInputField id="billto_id" value={data?.billto_id} options={{ isReadOnly: true }} />
              </div> 
               <div className={"col-span-4"}>
                <MaskedInputField id="billto_name" value={data?.billto_name} options={{ isReadOnly: true }} />
              </div>
              <div className={"col-span-6"}>
                <MaskedInputField id="billto_address_no" value={data?.billto_address_no} options={{ isReadOnly: true, useIcon: true }} />
              </div>
              <div className={"col-span-4"}>
                <MaskedInputField id="billto_contact_no" value={data?.billto_contact_no} options={{ isReadOnly: true, useIcon: true }} />
              </div>
              <div className={"col-span-2"}><span className="ml-auto"></span></div>
            </PageSearch>
          </div>
        </div>

        <div className="flex flex-row w-full">
          <div className="flex w-1/2">
            <PageSearch title={<span className="px-1 py-1 text-blue-500">Controlling Party</span>}>
              <div className={"col-span-2"}>
                <MaskedInputField id="shipper_id" value={data?.shipper_id} options={{ isReadOnly: true }} />
              </div> 
               <div className={"col-span-4"}>
                <MaskedInputField id="shipper_name" value={data?.shipper_name} options={{ isReadOnly: true }} />
              </div>
              <div className={"col-span-6"}>
                <MaskedInputField id="shipper_address" value={data?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
              </div>
              <div className={"col-span-4"}>
                <MaskedInputField id="contact" value={data?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
              </div>
              <div className={"col-span-2"}>
                <MaskedInputField id="sales_person" value={data?.sales_person} options={{ isReadOnly: true, useIcon: true }} />
              </div>
            </PageSearch>
          </div>

          <div className="flex w-1/2">
            <PageSearch
              title={<span className="px-1 py-1 text-blue-500">Export Non-Freight Bill To</span>}>
              <div className={"col-span-2"}>
                <MaskedInputField id="shipper_id" value={data?.shipper_id} options={{ isReadOnly: true }} />
              </div> 
               <div className={"col-span-4"}>
                <MaskedInputField id="shipper_name" value={data?.shipper_name} options={{ isReadOnly: true }} />
              </div>
              <div className={"col-span-6"}>
                <MaskedInputField id="shipper_address" value={data?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />               
              </div>
              <div className={"col-span-4"}><MaskedInputField id="contact" value={data?.shipper_name} options={{ isReadOnly: true }} /></div>
              <div className={"col-span-2"}><span className="ml-auto"></span></div>
            </PageSearch>
          </div>
        </div>

        <div className="flex flex-row w-full">
          <div className="flex w-1/2">
            <PageSearch
              title={<span className="px-1 py-1 text-blue-500">Party To Contact</span>}>
              <div className={"col-span-2"}>
                <MaskedInputField id="dest_terminal_id" value={data?.dest_terminal_id} options={{ isReadOnly: true }} />
              </div> 
               <div className={"col-span-4"}>
                <MaskedInputField id="shipper_name" value={data?.shipper_name} options={{ isReadOnly: true }} />
              </div>
              <div className={"col-span-6"}>
                <MaskedInputField id="shipper_address" value={data?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
              </div>               
              <div className={"col-span-4"}> <MaskedInputField id="contact" value={data?.shipper_name} options={{ isReadOnly: true }} /></div>
              <div className={"col-span-2"}><span className="ml-auto"></span></div>
            </PageSearch>
          </div>
        </div>


      </form>
    </FormProvider>
  );
});


export default WBMain