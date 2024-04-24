'use client'

import React, { useState, useEffect, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField } from 'components/input';
import GridRoute from './gridRoute';
import { SEARCH_MD, useAppContext } from "components/provider/contextObjectProvider";
import { useGetData } from "@/components/react-query/useMyQuery";
import { SP_GetWBSubData } from "./data"
import { gridData } from "@/components/grid/ag-grid-enterprise";

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
  const [bookedData, setBookedData] = useState<gridData>({});
  const [actualData, setActualData] = useState<gridData>({});

  const methods = useForm({
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

  const { data: subData } = useGetData({mwb_no : objState?.MselectedTab}, "WBSub", SP_GetWBSubData, { enabled: true });

  useEffect(() => {
    log("subData", subData);
    if (subData) {
      setBookedData((subData as Array<{}>)[0]);
      setActualData((subData as Array<{}>)[1]);
    }
  }, [subData])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    // dispatch({ searchParams: params, isMSearch: true });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">

        {/* <PageSearch
          title={<span className="px-1 py-1 text-blue-500">Terms</span>}>
             <MaskedInputField id="transport_terms_code" value={objState.mSelectedDetail?.transport_terms_code} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
             <MaskedInputField id="waybill_type" value={objState.mSelectedDetail?.waybill_type} options={{ isReadOnly: true }} />
        </PageSearch> */}

        <PageSearch
          title={<span className="w-full px-1 py-1 text-blue-500">Routing</span>}>

          {/* <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_id" value={objState.searchParams?.shipper_id} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_name" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="shipper_address" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} />
          <MaskedInputField id="contact" value={objState.searchParams?.shipper_name} options={{ isReadOnly: true }} /> */}
          <div className="col-span-6">
            <div>Booked Flight Information</div>
            <GridRoute loadData={bookedData} />
          </div>
          <div className="col-span-6">
            <div>Actual Flight Information</div>
            <GridRoute loadData={actualData} />
          </div>

        </PageSearch>

      </form>
    </FormProvider>
  );
});


export default WBSub