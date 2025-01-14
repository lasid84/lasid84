'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {PageContent} from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { gridData } from "components/grid/ag-grid-enterprise";

import { log, error } from '@repo/kwe-lib-new';

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

  return (
    <FormProvider {...methods}>
      <form className="w-full space-y-1">
        <PageContent
          title={<span className="flex px-1 py-1 text-blue-500">Shipment Text</span>}>
          <div className="col-start-1 col-end-2"><TextArea id="accounting_info" rows={6} cols={32}  value={data?.accounting_info} options={{ isReadOnly: true }} /></div>
          <div className="col-start-2 col-end-3"><TextArea id="body_text" rows={6} cols={32}  value={data?.body_text} options={{ isReadOnly: true }} /></div>
          <div className="col-start-3 col-end-4"><TextArea id="nature_of_goods" rows={6} cols={32}  value={data?.nature_of_goods} options={{ isReadOnly: true }} /></div>
          <div className="col-start-4 col-end-5"><TextArea id="handling_info" rows={6} cols={32}  value={data?.nature_of_goods} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 col-end-2"><TextArea id="marks_numbers" rows={6} cols={32}  value={data?.marks_numbers} options={{ isReadOnly: true }} /></div>
          <div className="col-start-2 col-end-3"><TextArea id="other_charges_info"  rows={6} cols={32} value={data?.other_charges_info} options={{ isReadOnly: true }} /></div>
          <div className="col-start-3 col-end-4"><TextArea id="other_charges_info" rows={6} cols={32} value={data?.other_charges_info} options={{ isReadOnly: true }} /></div>
        </PageContent>
      </form>
    </FormProvider>
  );
});


export default WBShipmentText