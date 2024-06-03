'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
// import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { Button,ICONButton } from 'components/button';
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { shallow } from "zustand/shallow";

import CustomSelect from "components/select/customSelect";
import { GridOption, gridData } from "@/components/grid/ag-grid-enterprise";
import { ReactSelect, data } from "@/components/select/react-select2";

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

// export function SearchForm({searchParams, dispatch}) {
const SearchForm = memo(({ loadItem }: any) => {

  log("search-form 시작", Date.now());
  const { dispatch } = useAppContext();

  const methods = useForm({
    defaultValues: {
      carrier_type: 'ALL',
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
  const [carriertype, setCarrierType] = useState<any>()

  useEffect(() => {
    if (loadItem?.length) {
      setCarrierType(loadItem[0])
      onSearch();

    }
  }, [loadItem?.length])


  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    dispatch({ searchParams: params, isMSearch: true });
  }

  const onNew = () => {
    const params = getValues();
    dispatch({ searchParams: params, mSelectedRow: null, crudType: crudType.CREATE, isPopUpOpen: true });
    log("onNew", params);    
  }

  const onRefresh = () => { dispatch({ isMSearch: true }) }

  return (
    <FormProvider {...methods}>
      <form className="space-y-1">
        <PageSearchButton
          right={
            <>
              <Button id={"search"} onClick={onSearch} />
              <Button id={"refresh"} onClick={onRefresh} />
            </>
          }>
          <ReactSelect
            id="carrier_type" label="carrier_type" dataSrc={carriertype as data}
            options={{
              keyCol: "carrier_type",
              displayCol: ['carrier_type', 'type_detail'],
              defaultValue: getValues('carrier_type')
            }}
          />
        </PageSearchButton>
      </form>
    </FormProvider>
  );
});


export default SearchForm