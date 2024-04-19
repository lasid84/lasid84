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
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
        </PageSearch>

        <PageSearch
          title={<span className="w-full px-1 py-1 text-blue-500">Routing Summary</span>}>

          <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
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