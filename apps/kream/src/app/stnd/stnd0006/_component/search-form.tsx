'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";

import { log, error } from '@repo/kwe-lib-new';

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

  const { dispatch } = useAppContext();
  const { getValues } = useFormContext();

  // //Set select box data
  const [transmode, setTransmode] = useState<any>();
  const [transtype, setTranstype] = useState<any>();

  useEffect(() => {
    if (loadItem?.length) {
      // log("=================", loadItem[0].data, loadItem[1].data)
      setTransmode(loadItem[0])
      setTranstype(loadItem[1])

      onSearch();
      // onSubmit();
      // handleSubmit(onSubmit)();
    }
  }, [loadItem?.length])

  // const onSubmit = (data: any, event: React.BaseSyntheticEvent<object, any, any>) => {
  const onSubmit = () => {
    // const params = getValues();
    // log("search-form onSubmit", params, transmode, transtype);
    // // dispatch({ type: SEARCH, params: params});
    // onSearch();
  }

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    dispatch({ searchParams: params, isMSearch: true });
  }

  const onNew = () => {
    const params = getValues();
    dispatch({ searchParams: params, mSelectedRow: null, crudType: crudType.CREATE, isPopUpOpen: true });
  }
  return (
      <PageSearchButton
        right={
          <>
            <Button id={"search"} onClick={onSearch} width='w-32'/>
            <Button id={"new"} onClick={onNew} width='w-32'/>
            {/* <Button id={"reset"} onClick={() => {
              setFocus("trans_mode");
              reset();
            }} /> */}
          </>
        }>
        <ReactSelect
          id="trans_mode" label="trans_mode" dataSrc={transmode as data}
          options={{
            keyCol: "trans_mode",
            displayCol: ['trans_mode', 'name'],
            // inline:true,
            // defaultValue: {label:'A Air', value:'A'}
            defaultValue: getValues('trans_mode')
          }}
        />
        <ReactSelect
          id="trans_type" label="trans_type" dataSrc={transtype as data}
          options={{
            keyCol: "trans_type",
            displayCol: ['name'],
            // inline:true,
            defaultValue: getValues('trans_type')
          }}
        />
        <div>
        </div>
      </PageSearchButton>
  );
});


export default SearchForm