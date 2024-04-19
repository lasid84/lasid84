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

import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from 'components/date'
import dayjs from 'dayjs'
import CustomSelect from "components/select/customSelect";
import { Button } from 'components/button';


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

const WBMain = memo(({ loadItem }: any) => {
  // const { loadItem } = props;

  // log("search-form 시작", Date.now());
  const { dispatch, objState } = useAppContext();
  const [groupcd, setGroupcd] = useState<any>([])

  // //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

  const methods = useForm({
    defaultValues: {
      trans_mode: gTransMode || 'ALL',
      trans_type: gTransType || 'ALL',
      fr_date: dayjs().subtract(1, 'month').startOf('month').format("YYYY-MM-DD"),
      to_date: dayjs().subtract(1, 'month').endOf('month').format("YYYY-MM-DD"),
      no: '',
      cust_code: ''
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
  }, [loadItem?.length])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Generals</span>}>
          {/* <div className={"col-span-1"}>
            <ReactSelect
              id="trans_mode" label="trans_mode" dataSrc={transmode as data}
              width="10" height="8px"
              options={{
                keyCol: "trans_mode",
                displayCol: ['name'],
                inline: true,
                defaultValue: getValues('trans_mode')
              }}
            />

            <ReactSelect
              id="trans_type" label="trans_type" dataSrc={transtype as data}
              width="10" height="8px"
              options={{
                keyCol: "trans_type",
                displayCol: ['name'],
                inline: true,
                defaultValue: getValues('trans_type')
              }}
            />
          </div> */}
          <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="bol_type" value={objState.mSelectedDetail?.bol_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="service_type_code" value={objState.mSelectedDetail?.service_type_code} options={{ isReadOnly: true }} />
          <DatePicker id={"execution_date"} value={objState.mSelectedDetail?.execution_date} options={{ isReadOnly: true, textAlign: 'center', freeStyles: "underline border-1 border-slate-300" }} />
          <DatePicker id={"ic_dc_consol_date"} value={objState.mSelectedDetail?.ic_dc_consol_date} options={{ isReadOnly: true, textAlign: 'center', freeStyles: "underline border-1 border-slate-300" }} />
          {/* <MaskedInputField id="execution_date" value={objState.mSelectedDetail?.execution_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="ic_dc_consol_date" value={objState.mSelectedDetail?.ic_dc_consol_date} options={{ isReadOnly: true }} /> */}
          <MaskedInputField id="freight_terms" value={objState.mSelectedDetail?.freight_terms} options={{ isReadOnly: true }} />

          <MaskedInputField id="customer_shipment_type" value={objState.mSelectedDetail?.customer_shipment_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="movement_type" value={objState.mSelectedDetail?.movement_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="cust_shipment_type" value={objState.mSelectedDetail?.cust_shipment_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="agent_type" value={objState.mSelectedDetail?.agent_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="mwb_no" value={objState.mSelectedDetail?.mwb_no} options={{ isReadOnly: true }} />
          <MaskedInputField id="carrier_code" value={objState.mSelectedDetail?.carrier_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="freight_ppc_ind" value={objState.mSelectedDetail?.freight_ppc_ind} options={{ isReadOnly: true }} />
          <MaskedInputField id="other_ppc_ind" value={objState.mSelectedDetail?.other_ppc_ind} options={{ isReadOnly: true }} />
          <MaskedInputField id="booking_no" value={objState.mSelectedDetail?.booking_no} options={{ isReadOnly: true }} />
          <MaskedInputField id="origin_port" value={objState.mSelectedDetail?.origin_port} options={{ isReadOnly: true }} />
          <MaskedInputField id="origin_city_code" value={objState.mSelectedDetail?.origin_city_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_receipt" value={objState.mSelectedDetail?.place_of_receipt} options={{ isReadOnly: true }} />
          {/* <MaskedInputField id="export_cc_point" value={objState.mSelectedDetail?.export_cc_point} options={{ isReadOnly: true }} />
          <MaskedInputField id="customs_declaration" value={objState.mSelectedDetail?.customs_declaration} options={{ isReadOnly: true }} /> */}
          <MaskedInputField id="mpr_port_dest1" value={objState.mSelectedDetail?.mpr_port_dest1} options={{ isReadOnly: true }} />
          <MaskedInputField id="dest_city_code" value={objState.mSelectedDetail?.dest_city_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_delivery" value={objState.mSelectedDetail?.place_of_delivery} options={{ isReadOnly: true }} />
          
          <fieldset  className="underline border-1 ">
            <legend>IC Consol</legend>          <label>No.{objState.mSelectedDetail?.place_of_delivery}</label>
          </fieldset>

          {/* <div className={"col-span-2"}>
            <CustomSelect
              id="cust_code"
              // label="trans_mode"
              listItem={custcode as gridData}
              valueCol={["cust_nm"]}
              displayCol="cust_nm"
              gridOption={{
                colVisible: { col: ["cust_code", "cust_nm", "bz_reg_no"], visible: true },
              }}
              gridStyle={{ width: '600px', height: '300px' }}
              style={{ width: '1000px', height: "8px" }}
              inline={true}
            />
          </div> */}
        </PageSearch>


        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Shipper</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={objState.mSelectedDetail?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-4"}>
            <MaskedInputField id="shipper_contact_no" value={objState.mSelectedDetail?.shipper_contact_no} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-2"}>
            <MaskedInputField id="export_salesman_id" value={objState.mSelectedDetail?.export_salesman_id} options={{ isReadOnly: true }} />
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Consignee</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={objState.mSelectedDetail?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-4"}>
            <MaskedInputField id="cnee_contact_no" value={objState.mSelectedDetail?.cnee_contact_no} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-2"}>
            <MaskedInputField id="import_salesman_id" value={objState.mSelectedDetail?.import_salesman_id} options={{ isReadOnly: true }} />
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Notify</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="notify_id" value={objState.mSelectedDetail?.notify_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="notify_name" value={objState.mSelectedDetail?.notify_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="notify_address_no" value={objState.mSelectedDetail?.notify_address_no} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="notify_contact_no" value={objState.mSelectedDetail?.notify_contact_no} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Export Bill To</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="billto_id" value={objState.mSelectedDetail?.billto_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="billto_name" value={objState.mSelectedDetail?.billto_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="billto_address_no" value={objState.mSelectedDetail?.billto_address_no} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-4"}>
            <MaskedInputField id="billto_contact_no" value={objState.mSelectedDetail?.billto_contact_no} options={{ isReadOnly: true, useIcon: true }} />
          </div>
      
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Controlling Party</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={objState.mSelectedDetail?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-4"}>
            <MaskedInputField id="contact" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
          </div>
          <div className={"col-span-2"}>
            <MaskedInputField id="sales_person" value={objState.mSelectedDetail?.sales_person} options={{ isReadOnly: true, useIcon: true }} />
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Export Non-Freight Bill To</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={objState.mSelectedDetail?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

        
        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Party To Contact</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="dest_terminal_id" value={objState.mSelectedDetail?.dest_terminal_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={objState.mSelectedDetail?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

      </form>
    </FormProvider>
  );
});


export default WBMain