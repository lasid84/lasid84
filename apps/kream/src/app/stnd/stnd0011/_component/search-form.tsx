'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import  {PageSearch2}  from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";
import { ROW_TYPE_NEW } from "@/components/grid/ag-grid-enterprise";
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
  const [ref, setRef] = useState(objState.gridRef_m);

  const { getValues } = useFormContext();

  useEffect(() => {
    onSearch();
  }, [])

  useEffect(() => {
    setRef(objState.gridRef_m);
  }, [objState.gridRef_m])

  const onRefresh = () => { dispatch({ isMSearch: true }) }


  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true, mSelectedRow: null });
  }

  const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }

  const onSave = () => {
    var hasData = false;
      ref.current.api.forEachNode((node: any) => {
          var data = node.data;
          if (data.__changed) {
              hasData = true;
              if (data.__ROWTYPE === ROW_TYPE_NEW) { //신규 추가
                  // data.place_code = objState.mSelectedRow.place_code;
                  // Create.mutate(data);
              } else { //수정
                  // Update.mutate(data);
              }
          }
      });
  }

  return (
        <PageSearch2
          right={
            <>
              <Button id={"interface"} onClick={onInterface} width={`w-24`} />
              <Button id={"search"} onClick={onSearch} width={`w-24`}/>
              <Button id={"save"} onClick={onSave} width={`w-24`}/>
            </>
          }>
          <></>
        </PageSearch2>
  );
};

export default SearchForm