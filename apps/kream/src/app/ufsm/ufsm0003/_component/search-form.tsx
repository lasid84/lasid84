'use client'

import React, { useState, memo, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import PageSearch, {PageSearchButton} from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useAppContext } from "components/provider/contextObjectProvider";
import { DatePicker } from "components/date";
import { downloadExcel } from "components/file-upload";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { SP_CreateIFData, SP_GetExcelFormData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import RadioGroup from "@/components/radio/RadioGroup";
import Radio from "@/components/radio";
import { toastError } from "@/components/toast";

import { log, error } from '@repo/kwe-lib-new';

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

  const { dispatch, objState } = useAppContext();
  const { excel_data } = objState;
  
  const { data: excelFormData, refetch } = useGetData('', '', SP_GetExcelFormData, {enabled:true});
  const { Create } = useUpdateData2(SP_CreateIFData);
  
  const { register, getValues, setValue } = useFormContext();

  useEffect(() => {
    const params = getValues();
    dispatch({ searchParams: params});
    onSearch();
  }, [])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
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
    const params = getValues();
    log("params", params, excel_data, !excel_data.data.some((obj:any) => obj["Billto ID"]) , !excel_data.data.some((obj:any) => obj["Invoice Date"]));

    if (Number(params.upload_gubn) > 0) {
      if (!excel_data.data.some((obj:any) => obj["Billto ID"]) || !excel_data.data.some((obj:any) => obj["Invoice Date"])) {
        toastError("인보이스 발행 경우 Invoice Date, BillTo Id는 필수입니다.");
        return;
      }
    }

    Create.mutate({...params, excel_data:JSON.stringify(excel_data.data)}, {
        onSuccess: (res: any) => {
            dispatch({ isMSearch: true });
        }
    });
    dispatch({excel_data: {data:{}, fields:{}}});
  }

  return (
    
        <PageSearchButton
          right={
            <>
              <Button id={"search"} onClick={onSearch} />
              <Button id={"save"} onClick={onSave} disabled={Object.keys(excel_data).length === 0 ? true : false} />
              <Button id={"form_down"} onClick={onFormDown}  />
            </>
          }>

          <div className={"col-span-2 border"}>
            <RadioGroup label="gubn" >
              <Radio id="upload_gubn" value="2" label="invoicing_confirm" defaultChecked/>
              <Radio id="upload_gubn" value="1" label="invoicing" />
              <Radio id="upload_gubn" value="0" label="charge_upload" />
            </RadioGroup>
          </div>
          <DatePicker id="fr_date" value={getValues("fr_date")} options={{ inline: true, textAlign: 'center', freeStyles: "p-1 border-1 border-slate-300" }} lwidth='w-20' height="h-8" />
          <DatePicker id="to_date" value={getValues("to_date")} options={{ inline: true, textAlign: 'center', freeStyles: "border-1 border-slate-300" }} lwidth='w-20' height="h-8" />

        </PageSearchButton>
      
  );
});


export default SearchForm