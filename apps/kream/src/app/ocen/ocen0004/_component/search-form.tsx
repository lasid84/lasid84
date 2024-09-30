'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { ErrorMessage } from "components/react-hook-form/error-message";
import  {PageSearch2}  from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useUserSettings } from "states/useUserSettings";
import { SEARCH_M, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { SP_InsertMaster, SP_UpdateMaster } from "./data";
import { toastSuccess } from "@/components/toast";
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

  const { Create } = useUpdateData2(SP_InsertMaster, SEARCH_M);
  const { Update } = useUpdateData2(SP_UpdateMaster, SEARCH_M);

  const methods = useForm({
    // resolver: zodResolver(formSchema),
    // defaultValues: {
    //   ...initSearchValue,
    // }
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

  useEffect(() => {
    onSearch();
  }, [])

  useEffect(() => {
    setRef(objState.gridRef_m);
  }, [objState.gridRef_m])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    // log("onSearch", params);
    dispatch({ isMSearch: true, mSelectedRow: null });
  }

  const onAddContainerYard = async () => {
    var temp = await rowAdd(ref.current, { area_code : "02", area_nm: '부산' })
  }

  const onSaveContainerYard = () => {
      // // dispatch({ searchParams: params, isMSearch: true, mSelectedRow: null });
      var hasData = false;
      ref.current.api.forEachNode((node: any) => {
          var data = node.data;
          if (data.__changed) {
              hasData = true;
              if (data.__ROWTYPE === ROW_TYPE_NEW) { //신규 추가
                  // log("onSaveContainerYard_NEW", data);
                  data.place_code = objState.mSelectedRow.place_code;
                  Create.mutate(data);
              } else { //수정
                  // log("onSaveContainerYard_UPD", data);
                  Update.mutate(data);
              }
          }
      });
      if (hasData) {
          // dispatch({ dSelectedRow: {...objState?.mSelectedRow} });
          toastSuccess('Success.');
      }
  }

  return (
    <FormProvider {...methods}>
      <form /*onSubmit={handleSubmit(onSubmit)}*/ className="space-y-1">
        <PageSearch2
          right={
            <>
              <Button id={"search"} onClick={onSearch} width='w-32'/>
              <Button id={"add_m"} onClick={onAddContainerYard} width='w-32'/>
              <Button id={"save_m"} onClick={onSaveContainerYard} width='w-32'/>
            </>
          }>
          <></>
        </PageSearch2>
      </form>
    </FormProvider>
  );
};

export default SearchForm