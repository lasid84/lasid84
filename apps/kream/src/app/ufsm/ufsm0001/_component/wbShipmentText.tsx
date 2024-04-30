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
import { MaskedInputField, Input, TextArea } from 'components/input';
import { useGetData } from "components/react-query/useMyQuery";
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from 'components/date'
import dayjs from 'dayjs'
import CustomSelect from "components/select/customSelect";
import { Button } from 'components/button';
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

const WBShipmentText = memo(({ loadItem }: any) => {
  // const { loadItem } = props;

  // log("search-form 시작", Date.now());
  const { dispatch, objState } = useAppContext();
  const [groupcd, setGroupcd] = useState<any>([])

  // //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

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
  const [data, setData] = useState<any>();

  const { data: mainData } = useGetData({wb_no : objState?.MselectedTab}, SEARCH_MD, SP_GetMasterData, { enabled: true });


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
  useEffect(() => {
    log("maindata", mainData);
    if (mainData) setData((mainData as gridData)?.data[0]);
  }, [mainData])

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
          title={<span className="flex px-1 py-1 text-blue-500">Shipment Text</span>}>

          <div className="col-start-1 col-end-2"><MaskedInputField id="place_of_receipt" value={data?.place_of_receipt} options={{ isReadOnly: true }} /></div>
          <div className="col-start-2 col-end-3"><MaskedInputField id="bol_type" value={data?.bol_type} options={{ isReadOnly: true }} /></div>
          <div className="col-start-3 col-end-4"><MaskedInputField id="place_of_delivery" value={data?.place_of_delivery} options={{ isReadOnly: true }} /></div>
          <div className="col-start-4 col-end-5"><MaskedInputField id="freight_terms" value={data?.freight_terms} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 col-end-2 "><TextArea id="marks_numbers" rows={6} cols={42} value={data?.marks_numbers} options={{ isReadOnly: true }} /></div>
          <div className="col-start-2 col-end-4 row-span-2"><TextArea id="nature_of_goods" rows={15} cols={92} value={data?.nature_of_goods} options={{ isReadOnly: true }} /></div>
          <div className="col-start-4 col-end-5 "><TextArea id="body_text" rows={6} cols={42} value={data?.body_text} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 row-span-1 "><TextArea id="handling_info" rows={7} cols={42} value={data?.handling_info} options={{ isReadOnly: true }} /></div>
          <div className="col-start-4 row-span-5" ><TextArea id="manifest_description" rows={7} cols={42} value={data?.manifest_description} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 col-end-2 col-span-2"><TextArea id="accounting_information" rows={5} cols={92} value={data?.accounting_information} options={{ isReadOnly: true }} /></div>
          <div className="col-start-3 col-end-4 col-span-2"><TextArea id="other_charges_info" rows={5} cols={92} value={data?.other_charges_info} options={{ isReadOnly: true }} /></div>

        </PageSearch>


      </form>
    </FormProvider>
  );
});


export default WBShipmentText