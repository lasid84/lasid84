'use client'

import { useTranslation } from "react-i18next";
import React, { useState, memo, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageSearch, {PageSearchButton} from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useAppContext } from "components/provider/contextObjectProvider";
import { DatePicker } from "components/date";
import dayjs from 'dayjs'
import { downloadExcel } from "components/file-upload";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { SP_CreateIFData, SP_GetExcelFormData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";

const { log } = require("@repo/kwe-lib/components/logHelper");

const ExcelFormFileName = "Charge Upload Form.xlsx";

export interface returnData {
  cursorData : []
  numericData : number;
  textData : string;
}

export interface typeloadItem {
  data : {} | undefined
}

type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem : typeloadItem;
};

// export function SearchForm({searchParams, dispatch}) {
const SearchForm = memo(({loadItem}:any) => {

  log("search-form 시작", Date.now());
  const { dispatch, objState } = useAppContext();
  const { fr_date, to_date } = objState.searchParams;
  const { excel_data } = objState;
  
  const { data: excelFormData, refetch } = useGetData('', '', SP_GetExcelFormData, {enabled:true});
  const { Create } = useUpdateData2(SP_CreateIFData);
  
  // const methods = useForm<FormType>({
  const methods = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      fr_date: fr_date || dayjs().format("YYYYMMDD"),
      to_date: to_date || dayjs().format("YYYYMMDD"),
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

  useEffect(() => {
    const params = getValues();
    dispatch({ searchParams: params});
    onSearch();
  }, [])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    // log("onSearch", params, getValues());
    dispatch({ searchParams: params, isMSearch:true, uploadFile_init:true, excel_data:{}});
  }

  const onFormDown = () => {
    const reSearch = async () => {
      await refetch();
      // log("onFormDown", (excelFormData as gridData));
      // createExcelFile((excelFormData as gridData));
      downloadExcel(
        (excelFormData as gridData).data
      , ExcelFormFileName
      , [50, 100, 150, 50, 100, 100, 70, 100, 70, 100, 70, 100, 100, 100, 100]
      );
    }
    reSearch();
  }

  const onSave = () => {
      log("onSave", !!Object.keys(excel_data).length)
      Create.mutate({excel_data:JSON.stringify(excel_data.data)}, {
          onSuccess: (res: any) => {
              dispatch({ isMSearch: true });
          }
      });
      dispatch({excel_data: {}});
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(() => {})} className="space-y-1">
        <PageSearchButton
          right={
            <>
              <Button id={"search"} onClick={onSearch} />
              <Button id={"save"} onClick={onSave} disabled={Object.keys(excel_data).length === 0 ? true : false} />
              <Button id={"form_down"} onClick={onFormDown} />
            </>
          }>
          <DatePicker id="fr_date" value={fr_date} options={{ inline: true, textAlign: 'center', freeStyles: "p-1 border-1 border-slate-300" }} lwidth='w-20' height="h-8" />
          <DatePicker id="to_date" value={to_date} options={{ inline: true, textAlign: 'center', freeStyles: "border-1 border-slate-300" }} lwidth='w-20' height="h-8" />
        </PageSearchButton>
      </form>
    </FormProvider>
  );
});


export default SearchForm