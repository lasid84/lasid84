'use client'

import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch, {PageSearchButton} from "layouts/search-form/page-search-row";
// import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { Button } from 'components/button';
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { shallow } from "zustand/shallow";

import CustomSelect from "components/select/customSelect";
import { GridOption, gridData } from "@/components/grid/ag-grid-enterprise";
import { ReactSelect, data } from "@/components/select/react-select2";

const { log } = require("@repo/kwe-lib/components/logHelper");

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
  const { dispatch } = useAppContext();

  // 다국어
  const { t } = useTranslation();

  //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)
  
  // const methods = useForm<FormType>({
    const methods = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      trans_mode : gTransMode || 'ALL',
      trans_type : gTransType || 'ALL'
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
  const [transmode, setTransmode] = useState<any>();
  const [transtype, setTranstype] = useState<any>();

  useEffect(() => { 
    if(loadItem?.length){
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
    const params = getValues();
    log("search-form onSubmit", params, transmode, transtype);
    // dispatch({ type: SEARCH, params: params});
    onSearch();
  }

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params, getValues('trans_mode'));
    dispatch({ searchParams: params, isMSearch:true});
  }

  const onNew = () => {
    const params = getValues();
    dispatch({ searchParams: params, mSelectedRow: null, crudType:crudType.CREATE, isPopUpOpen:true});
    log("onNew", params);
  }

  const gridOption: GridOption = {
    colVisible: { col : ["trans_mode", "trans_type", "prod_gr_cd", "charge_code", "charge_desc", "create_date"], visible:false },
    colDisable: ["trans_mode", "trans_type", "ass_transaction"],
    checkbox: ["no"],
    editable: ["trans_mode"],
    dataType: { "create_date" : "date", "vat_rt":"number"},
    isMultiSelect: false,
    isAutoFitColData: true,
    alignLeft: ["major_category", "bill_gr1_nm"],
    alignRight: [],
    // rowadd
    // rowdelete

};

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <PageSearchButton
          right={
            <>
              <Button id={"search"} onClick={onSearch} />
              <Button id={"new"} onClick={onNew}/>
              {/* <Button id={"reset"} onClick={() => {
                setFocus("trans_mode");
                reset();
              }} /> */}
            </>
          }>
          <ReactSelect 
            id="trans_mode" label="trans_mode" dataSrc={transmode as data} 
            options={{
              keyCol:"trans_mode",
              displayCol:['trans_mode', 'name'],
              // inline:true,
              // defaultValue: {label:'A Air', value:'A'}
              defaultValue : getValues('trans_mode')
            }}
          />
          <ReactSelect 
            id="trans_type" label="trans_type" dataSrc={transtype as data}
            options={{
              keyCol:"trans_type",
              displayCol:['name'],
              // inline:true,
              defaultValue:getValues('trans_type')
            }}
          />
          <div>
            {/* <TSelect2
              id="trans_mode"
              label={t("trans_mode")}
            //   allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransMode}
              options={transmode}
            /> */}
            {/* {errors?.trans_mode?.message && <ErrorMessage>{errors.trans_mode.message}</ErrorMessage>} */}
            {/* <CustomSelect
              id="trans_mode"
              // label="trans_mode"
              listItem = {transmode as gridData}
              valueCol= {["trans_mode"]}
              displayCol = "name"
              gridOption = {{
                colVisible: { col : ["trans_mode", "name"], visible:true },
              }}
              // gridStyle={{width:'400px', height:'200px'}}
              // style={{width:'1000px'}}
              // isNoSelect={false}
            /> */}
            {/* <TSelect2
              id="trans_type"
              label={t("trans_type")}
            //   allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransType}
              options={transtype}
            /> */}
          {/* {errors?.trans_type?.message && <ErrorMessage>{errors.trans_type.message}</ErrorMessage>} */}
            {/* <CustomSelect
              id="trans_type"
              // label="trans_mode"
              listItem = {transtype as gridData}
              valueCol= {["trans_type"]}
              displayCol = "name"
              gridOption = {{
                colVisible: { col : ["trans_type", "name"], visible:true },
              }}
              // gridStyle={{width:'400px', height:'200px'}}
              // style={{width:'1000px'}}
              // isNoSelect={false}
            /> */}
          </div>
        </PageSearchButton>
      </form>
    </FormProvider>
  );
});


export default SearchForm