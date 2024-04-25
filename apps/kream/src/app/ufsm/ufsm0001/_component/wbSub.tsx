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
import MasterGrid from './gridMaster';
import DetailGird from './gridsubBooked'
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from 'components/date'
import dayjs from 'dayjs'
import CustomSelect from "components/select/customSelect";
import { Button } from 'components/button';
import { Checkbox } from "@/components/checkbox";

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

const WBSub = memo(({ loadItem }: any) => {
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

        {/* <PageSearch
          title={<span className="w-full px-1 py-1 text-blue-500">Print Control</span>}>
          <div className={"flex col-span-3 border "}>
            <div className={"col-span-1"}>
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
            </div>
            <div className={"col-span-2 item-center"}>
              <MaskedInputField id="waybill_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
              <MaskedInputField id="agent_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
            </div>
          </div>
          <div className={"flex  col-span-3 border"}>
            <div className={"col-span-1"}>

              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
              <Checkbox id="gd" name="gd" label="gd" />
            </div>
            <div className={"col-span-2"}>
              <MaskedInputField id="waybill_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
              <MaskedInputField id="agent_type" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
            </div>
          </div>
          <MaskedInputField id="issue_date" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="on_board_date" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="2nd_wt_uom" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="2nd_vol_uom" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="origin_currency" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="dest_currency" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="dest_cer" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="invoice_currency" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="invoice_cer" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="origin_port_lc_description" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_receipt" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="export_cc_point" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="dest_port_lc_description" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_delivery" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_or_his_agent_name" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="carrier_or_his_agent_name" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="product_origin_country" value={objState.searchParams?.fr_date} options={{ isReadOnly: true }} />
        </PageSearch> */}


        <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Terms</span>}>
          <fieldset className="w-full flex border-solid border-2 p-1 space-y-1 space-x-1 col-span-6">
            <legend className="text-sx">Insurance</legend>
          <MaskedInputField id="type" value={objState.mSelectedDetail?.type} options={{ isReadOnly: true }} />
          <MaskedInputField id="insured_value" value={objState.mSelectedDetail?.insured_value} options={{ isReadOnly: true }} />
          <MaskedInputField id="coverage_type" value={objState.mSelectedDetail?.coverage_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="currency" value={objState.mSelectedDetail?.currency} options={{ isReadOnly: true }} />
          <MaskedInputField id="exchange_rate" value={objState.mSelectedDetail?.exchange_rate} options={{ isReadOnly: true }} />
          <MaskedInputField id="rate" value={objState.mSelectedDetail?.rate} options={{ isReadOnly: true }} />
          </fieldset>
            <MaskedInputField id="location" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
            <MaskedInputField id="shipping_terms" value={objState.mSelectedDetail?.transport_terms_code} options={{ isReadOnly: true }} />
            <MaskedInputField id="location" value={objState.mSelectedDetail?.transport_terms_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="customs-declaration" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
          <div className="col-start-1 col-end-2"><MaskedInputField id="template_id" value={objState.mSelectedDetail?.template_id} options={{ isReadOnly: true }} /></div>
          <div className="col-start-2 col-end-3"><MaskedInputField id="template_name" value={objState.mSelectedDetail?.template_name} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 col-end-2"><MaskedInputField id="export_accounting_status" value={objState.mSelectedDetail?.export_accounting_status} options={{ isReadOnly: true }} /></div>
          <MaskedInputField id="export_confirmation_date" value={objState.mSelectedDetail?.export_confirmation_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="import_account_status" value={objState.mSelectedDetail?.import_account_status} options={{ isReadOnly: true }} />
          <MaskedInputField id="import_confirmation_date" value={objState.mSelectedDetail?.import_confirmation_date} options={{ isReadOnly: true }} />
        </PageSearch>

        <PageSearch
          title={<span className="w-full px-1 py-1 text-blue-500">Routing Summary</span>}>

          <div className="col-start-1 col-end-2"><MaskedInputField id="port_of_loading" value={objState.mSelectedDetail?.port_of_loading} options={{ isReadOnly: true }} /></div>
          <MaskedInputField id="port_of_unloading" value={objState.mSelectedDetail?.port_of_unloading} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_receipt" value={objState.mSelectedDetail?.place_of_receipt} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_delivery" value={objState.mSelectedDetail?.place_of_delivery} options={{ isReadOnly: true }} />
          <div className="col-start-1 col-end-2"><MaskedInputField id="pre_carriage_by" value={objState.mSelectedDetail?.pre_carriage_by} options={{ isReadOnly: true }} /></div>
          <MaskedInputField id="carrier" value={objState.mSelectedDetail?.carrier} options={{ isReadOnly: true }} />
          <MaskedInputField id="vessel_name" value={objState.mSelectedDetail?.vessel_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="voyage_no" value={objState.mSelectedDetail?.voyage_no} options={{ isReadOnly: true }} />
          <div className="col-span-6">
            <div>Booked Flight Information</div>
            <MasterGrid initData={loadItem} />
          </div>
          <div className="col-span-6">
            <div>Actual Flight Information</div>
            <MasterGrid initData={loadItem} />
          </div>

        </PageSearch>

        {/* <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Related ACRs</span>}>
            <div className="col-span-6">
            <MasterGrid initData={loadItem} />
          </div>
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
        </PageSearch> */}

      </form>
    </FormProvider>
  );
});


export default WBSub