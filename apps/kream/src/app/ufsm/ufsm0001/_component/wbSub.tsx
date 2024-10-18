'use client'
import React, { useState, useEffect, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField } from 'components/input';
import GridRoute from './gridRoute';
import { useAppContext } from "components/provider/contextObjectProvider";
import dayjs from 'dayjs'
import { gridData } from "components/grid/ag-grid-enterprise";

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

const WBSub = memo(({ loadItem, mainData }: any) => {
  const { dispatch } = useAppContext();

  // //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

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

  //Set select box data
  const [data, setData] = useState<any>();
  const [bookedData, setBookedData] = useState<gridData>({});
  const [actualData, setActualData] = useState<gridData>({});

  useEffect(() => {
    if (mainData) {
      // log("mainData_ufsm0001_wbSub", mainData[1].data)
      setData((mainData?.[0] as gridData).data[0])
      setBookedData((mainData?.[1] as gridData))
      setActualData((mainData?.[2] as gridData))
    }
  }, [mainData])

  const onSearch = () => {
    //const params = getValues();
    //dispatch({ searchParams: params, isMSearch: true });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="space-y-1 w-full">
        <PageContent
          title={<span className="px-1 py-1 text-blue-500">Terms</span>}>
          <fieldset className="flex col-span-6 p-1 m-1 space-x-1 space-y-1 w-full border-2 border-solid dark:border-gray-800">
            <legend className="text-sx">Insurance</legend>
          <MaskedInputField id="type" value={data?.type} options={{ isReadOnly: true }} />
          <MaskedInputField id="insured_value" value={data?.insured_value} options={{ isReadOnly: true }} />
          <MaskedInputField id="coverage_type" value={data?.coverage_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="currency" value={data?.currency} options={{ isReadOnly: true }} />
          <MaskedInputField id="exchange_rate" value={data?.exchange_rate} options={{ isReadOnly: true }} />
          <MaskedInputField id="rate" value={data?.rate} options={{ isReadOnly: true }} />
          </fieldset>
            <MaskedInputField id="location" value={data?.waybill_type} options={{ isReadOnly: true }} />
            <MaskedInputField id="shipping_terms" value={data?.transport_terms_code} options={{ isReadOnly: true }} />
            <MaskedInputField id="location" value={data?.transport_terms_code} options={{ isReadOnly: true }} />
          <MaskedInputField id="customs-declaration" value={data?.waybill_type} options={{ isReadOnly: true }} />
          <div className="col-start-1 col-end-2"><MaskedInputField id="template_id" value={data?.template_id} options={{ isReadOnly: true }} /></div>
          <div className="col-start-2 col-end-3"><MaskedInputField id="template_name" value={data?.template_name} options={{ isReadOnly: true }} /></div>
          <div className="col-start-1 col-end-2"><MaskedInputField id="export_accounting_status" value={data?.export_accounting_status} options={{ isReadOnly: true }} /></div>
          <MaskedInputField id="export_confirmation_date" value={data?.export_confirmation_date} options={{ isReadOnly: true }} />
          <MaskedInputField id="import_account_status" value={data?.import_account_status} options={{ isReadOnly: true }} />
          <MaskedInputField id="import_confirmation_date" value={data?.import_confirmation_date} options={{ isReadOnly: true }} />
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 w-full text-blue-500">Routing Summary</span>}>

          <div className="col-start-1 col-end-2"><MaskedInputField id="port_of_loading" value={data?.port_of_loading} options={{ isReadOnly: true }} /></div>
          <MaskedInputField id="port_of_unloading" value={data?.port_of_unloading} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_receipt" value={data?.place_of_receipt} options={{ isReadOnly: true }} />
          <MaskedInputField id="place_of_delivery" value={data?.place_of_delivery} options={{ isReadOnly: true }} />
          <div className="col-start-1 col-end-2"><MaskedInputField id="pre_carriage_by" value={data?.pre_carriage_by} options={{ isReadOnly: true }} /></div>
          <MaskedInputField id="carrier" value={data?.carrier} options={{ isReadOnly: true }} />
          <MaskedInputField id="vessel_name" value={data?.vessel_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="voyage_no" value={data?.voyage_no} options={{ isReadOnly: true }} />
          <div className="col-span-6">
            <div>Booked Flight Information</div>
            <GridRoute loadData={bookedData} />
          </div>
          <div className="col-span-6">
            <div>Actual Flight Information</div>
            <GridRoute loadData={actualData} />
          </div>
        </PageContent>
      </form>
    </FormProvider>
  );
});


export default WBSub