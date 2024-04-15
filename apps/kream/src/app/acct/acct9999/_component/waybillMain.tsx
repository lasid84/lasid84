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

const WBMain = memo(({ loadItem, mainData }: any) => {
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
          <MaskedInputField id="waybill_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="agent_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="service_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="execution_date" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="console_date" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="freight_terms" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="charge_terms" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="cust_shipment_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="movement_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipping_terms" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="origin_port" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="origin_city" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_receipt" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="export_cc_point" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="customs_declaration" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="dest_port" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="dest_city" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_delivery" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="import_cc_point" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="security_status" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />

          <MaskedInputField id="carrier_waybill_no" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="carrier" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="contact_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="salesperson" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="free_house_terms" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="mhwb_no" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="cs_person_id" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="class_a_agnet" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />


          {/* <div className={"col-span-1"}>
            <DatePicker id="fr_date" value={objState.searchParams?.fr_date} options={{ inline: true, textAlign: 'center', freeStyles: "p-1 underline border-1 border-slate-300" }} height="h-8" />

            <DatePicker id="to_date" value={objState.searchParams?.to_date} options={{ inline: true, textAlign: 'center', freeStyles: "underline border-1 border-slate-300" }} height="h-8" />
          </div> */}
          
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
            <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Consignee</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Notify</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Export Bill To</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Controlling Party</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Export Non-Freight Bill To</span>}>
          <div className={"col-span-2"}>
            <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          </div>  <div className={"col-span-4"}>
            <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-6"}>
            <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true, useIcon: true }} />
            <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          </div>
          <div className={"col-span-4"}>
          </div>
        </PageSearch>

      </form>
    </FormProvider>
  );
});


export default WBMain