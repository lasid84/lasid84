'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo, useRef } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import  {PageSearch2}  from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";
import { ROW_TYPE_NEW, rowAdd } from "@/components/grid/ag-grid-enterprise";
import { CUST_TYPE_TRANSPORT } from "../../stnd0008/_component/data";
// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

type Props = {
  // onSubmit: SubmitHandler<any>;
  // initData: any | undefined;
};

// const SearchForm = memo(({initData}:Props) => {
const SearchForm: React.FC<Props> = (props) => {
  const { dispatch, objState } = useAppContext();
  const { gridRef_m } = objState
  const gridRef = useRef<any | null>(gridRef_m);
    
  const { getValues } = useFormContext();

  useEffect(() => {
    onSearch();
  }, [])

  const onRefresh = () => { dispatch({ isMSearch: true }) }

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true, mSelectedRow: null });
  }

  const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }
  const onAdd = () => {
    dispatch({mSelectedRow:{cust_code:CUST_TYPE_TRANSPORT, use_yn:'Y', crrg_cust_yn:'Y', nation_code:"KR"}, isPopUpOpen:true, crudType:crudType.CREATE});
  }

  return (
        <PageSearch2
          right={
            <>
              <Button id={"search"} onClick={onSearch} width={`w-24`}/>
              <Button id={"interface"} onClick={onInterface} width={`w-24`} />
              {/* 운송사는 ufs에 등록 됨.. 신규로 등록 일단 막음*/}
              {/* <Button id={"add"} onClick={onAdd} width={`w-24`} /> */}
            </>
          }>
          <></>
        </PageSearch2>
  );
};

export default SearchForm