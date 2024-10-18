'use client'

import { useTranslation } from "react-i18next";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { SlMagnifierAdd } from "react-icons/sl";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import { PageContent } from "layouts/search-form/page-search-row";
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
  data: {}
}


type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
  mainData: typeloadItem;
};

const WBShipmentText = memo(({ loadItem, mainData }: any) => {
  const { dispatch, objState } = useAppContext();

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

  const [shipmentText, setShipmentText] = useState<gridData>({});
  const [data, setData] = useState<any>();

  useEffect(() => {
    // log("maindata_shipment_text", mainData?.[0]);
    if (mainData) {
      setData((mainData?.[0] as gridData).data[0]);

    }
  }, [mainData])

  const onSearch = () => {
    const params = getValues();
    // log("onSearch_whipmenttext", params);
    // dispatch({ searchParams: params, isMSearch: true });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="space-y-1 w-full">
        <PageContent
          title={<span className="flex px-1 py-1 text-blue-500">Shipment Text</span>}>
          <div className="col-start-1 col-end-2"><MaskedInputField id="place_of_receipt" width="sm:min-w-6 md:w-full min-w-24"  value={data?.place_of_receipt} options={{ isReadOnly: true ,freeStyles: "min-w-12" }}/></div>
          <div className="col-start-2 col-end-3"><MaskedInputField id="bol_type" width="sm:min-w-6 md:w-full min-w-32" value={data?.bol_type} options={{ isReadOnly: true }} /></div>
          <div className="col-start-3 col-end-4"><MaskedInputField id="place_of_delivery" width="sm:min-w-6 md:w-full min-w-32" value={data?.place_of_delivery} options={{ isReadOnly: true }} /></div>
          <div className="col-start-4 col-end-5"><MaskedInputField id="freight_terms" width="sm:min-w-6 md:w-full min-w-32" value={data?.freight_terms} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 col-end-2"><TextArea id="marks_numbers" rows={6} cols={32}  value={data?.marks_numbers} options={{ isReadOnly: true }} /></div>
          <div className="col-start-2 col-end-4 row-span-2"><TextArea id="nature_of_goods" rows={15} cols={70}  value={data?.nature_of_goods} options={{ isReadOnly: true }} /></div>
          <div className="col-start-4 col-end-5"><TextArea id="body_text" rows={6} cols={32}  value={data?.body_text} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 row-span-1"><TextArea id="handling_info" rows={7} cols={32}  value={data?.handling_info} options={{ isReadOnly: true }} /></div>
          <div className="col-start-4 row-span-5" ><TextArea id="manifest_description" rows={7} cols={32}  value={data?.manifest_description} options={{ isReadOnly: true }} /></div>
          <div className="col-span-2 col-start-1 col-end-2"><TextArea id="accounting_information" rows={10} cols={70}  value={data?.accounting_information} options={{ isReadOnly: true }} /></div>
          <div className="col-span-2 col-start-3 col-end-4"><TextArea id="other_charges_info" rows={5} cols={70}  value={data?.other_charges_info} options={{ isReadOnly: true }} /></div>
        </PageContent>
      </form>
    </FormProvider>
  );
});


export default WBShipmentText