'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';

import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DateInput, DatePicker } from 'components/date'
import { useGetData } from "components/react-query/useMyQuery";
import { SP_GetMasterData } from "./data";
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

const WBMain = memo(({ loadItem, isSelected }: any) => {

  if (!isSelected) return;
  
  const { dispatch, objState } = useAppContext();
  const [groupcd, setGroupcd] = useState<any>([])
  const [data, setData] = useState<any>();


  const methods = useForm({
    defaultValues: {
      // trans_mode: gTransMode || 'ALL',
      // trans_type: gTransType || 'ALL',
      // fr_date: dayjs().subtract(1, 'month').startOf('month').format("YYYY-MM-DD"),
      // to_date: dayjs().subtract(1, 'month').endOf('month').format("YYYY-MM-DD"),
      // no: '',
      // cust_code: ''
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

  // //Set select box data
  const [transmode, setTransmode] = useState<any>();
  const [transtype, setTranstype] = useState<any>();
  const [custcode, setCustcode] = useState<any>();

  const { data: mainData } = useGetData({mwb_no : objState?.MselectedTab}, SEARCH_MD, SP_GetMasterData, { enabled: true });

  useEffect(() => {
    if (loadItem?.length) {
      // log("=================", loadItem[0].data, loadItem[1].data)
      setTransmode(loadItem[0])
      setTranstype(loadItem[1])
      setCustcode(loadItem[8])

      onSearch();
      // onSubmit();
      // handleSubmit(onSubmit)();
    }
  }, [loadItem?.length]);

  useEffect(() => {
    log("maindata", mainData);
    if (mainData) setData((mainData as gridData)?.data[0]);
  }, [mainData])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params, objState?.mSelectedRow);
    // dispatch({ searchParams: params, isMSearch: true });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageSearch
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
          
        </PageSearch>


        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Shipper</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={data?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={data?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_addr" value={data?.shipper_addr} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-4"}>
            <MaskedInputField id="shipper_cont" value={data?.shipper_cont} options={{ isReadOnly: true, useIcon: true }} />
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Consignee</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="cnee_id" value={data?.cnee_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="cnee_name" value={data?.cnee_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="cnee_addr" value={data?.cnee_addr} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-4"}>
            <MaskedInputField id="cnee_cont" value={data?.cnee_cont} options={{ isReadOnly: true, useIcon: true }} />
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Notify</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="notify_id" value={data?.notify_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="notify_name" value={data?.notify_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="notify_address_no" value={data?.notify_address_no} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="notify_contact_no" value={data?.notify_contact_no} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Export Bill To</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="billto_id" value={data?.billto_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="billto_name" value={data?.billto_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="billto_address_no" value={data?.billto_address_no} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-4"}>
            <MaskedInputField id="billto_contact_no" value={data?.billto_contact_no} options={{ isReadOnly: true, useIcon: true }} />
          </div>
      
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Controlling Party</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={data?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
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

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Export Non-Freight Bill To</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={data?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={data?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={data?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={data?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

        
        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Party To Contact</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="dest_terminal_id" value={data?.dest_terminal_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={data?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={data?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={data?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

      </form>
    </FormProvider>
  );
});


export default WBMain