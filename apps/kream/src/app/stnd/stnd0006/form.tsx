'use client'

import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import React, { useState, useEffect, Dispatch, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { TInput2, TSelect2, TCancelButton, TSubmitButton } from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { TableContext, useAppContext } from "./page";
import { CHANGE_SEARCH_PARAM, Acct2003Load } from "./data";
import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

//import { useCustomer, useLoadData } from "states/useCodes";
//import { MultiColumnComboBoxOverview } from "components/dropdowns/ComboSelect" 

export interface returnData {
  cursorData : []
  numericData : number;
  textData : string;
}

export interface loadItem {
  data : returnData[]
}

type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem : loadItem|null;
};

// export function SearchForm({searchParams, dispatch}) {
export const SearchForm = (loadItem:any) => {

  log("SearchForm", JSON.stringify(loadItem));
  const { searchParams, dispatch } = useAppContext();

    // 다국어
    const { t } = useTranslation();
    z.setErrorMap(makeZodI18nMap({ t }));
  // 인보이스 검색스키마
  const acct3002SearchSchema = z.object({
    trans_mode: z.coerce.string(),
    trans_type: z.coerce.string(),
    fr_date: z.coerce.string().optional(),
    to_date: z.coerce.string().optional(),
    invoice_no: z.coerce.string(),
    cust_code: z.coerce.string(),
    sale_buy : z.coerce.string(),
    edi_yn: z.coerce.string(),
    job_or : z.coerce.string(),
    no: z.coerce.string(),
  })

  const [Params, setSearchParam] = useState({});

  // acct3002검색스키마 선언
  const formSchema = acct3002SearchSchema
  // acct3002검색스키마 타입선언
  type FormType = z.infer<typeof acct3002SearchSchema>

  //사용자 정보
  const gOfficeId = useUserSettings((state) => state.data.office_cd)
  const gTransMode = useUserSettings((state) => state.data.trans_mode)
  const gTransType = useUserSettings((state) => state.data.trans_type)

  const methods = useForm<FormType>({
    resolver: zodResolver(formSchema),
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

  // //Set select box data
  const [transmode, setTransmode] = useState([])
  const [transtype, setTranstype] = useState([])
  const [jobor, setJobor] = useState([])
  const [salebuy, setSalebuy] = useState([])
  const [custcode, setCustcode] = useState([])

//   const actions = useInvoiceStore((state: { actions: any; }) => state.actions)
//   const searchParam = useInvoiceStore((state: { searchParam: any; }) => state.searchParam)


  // useEffect(() => { 
  //   if(loadItem){
  //     console.log('acct3002-search' ,loadItem.data)
  //     setTransmode(loadItem.data.cursorData[0]) 
  //     setTranstype(loadItem.data.cursorData[1])
  //     setJobor(loadItem.data.cursorData[3])
  //     setSalebuy(loadItem.data.cursorData[4])
  //   }
  //     // actions.setSearchParam({
  //     //   trans_type: gTransType,
  //     //   trans_mode: gTransMode,
  //     //   office_cd: gOfficeId
  //     // })
      
    
  // }, [loadItem])

//   useEffect(() => {
//     const searchValue = { ...searchParams, }
//     reset({ ...searchValue })
//   }, [searchParams]);

useEffect(() => {
  log("Params", Params);
}, [Params]);

  const onSubmit = () => {
    log("form search의 onSubmit", dispatch)
    dispatch({ type: CHANGE_SEARCH_PARAM, id:'3'});
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <PageSearch
          right={
            <>
              <TSubmitButton label={t("search")} />
              <TCancelButton label={t("reset")}onClick={() => {
                setFocus("trans_mode");
                // reset();
              }} />
            </>
          }>
          <div>
            <TInput2 id="fr_date" label="기간(시작일자)" type="date">
              {errors?.fr_date?.message && (
                <ErrorMessage>{errors.fr_date.message}</ErrorMessage>
              )}
            </TInput2>
            <TInput2 id="to_date" label="(종료일자)" type="date">
              {errors?.to_date?.message && <ErrorMessage>{errors.to_date.message}</ErrorMessage>}
            </TInput2>
          </div>
          <div>
            <TSelect2
              id="trans_mode"
              label={t("trans_mode")}
            //   allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransMode}
              onChange={(e) => {console.log(e.target.id, e.target.value); setSearchParam({ id: e.target.value })}}
              options={transmode}
            />
            {errors?.trans_mode?.message && <ErrorMessage>{errors.trans_mode.message}</ErrorMessage>}
            <TSelect2
              id="trans_type"
              label={t("trans_type")}
            //   allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransType}
              onChange={(e) => setSearchParam({ trans_type: e.target.value })}
              options={transtype}
            />
          {errors?.trans_type?.message && <ErrorMessage>{errors.trans_type.message}</ErrorMessage>}
          </div>
          <div>
            {/* <MultiColumnComboBoxOverview
              width='1000px'
              register={register('cust_code')}
              id="cust_code"
              label="거래처"
              data={custcode}
              column={["cust_code", "cust_nm", "bz_reg_no"]}
              textfiled="cust_nm"
              rule={{}}
            /> */}
            <TInput2 id="cust_code" label={t("cust_code")} type="text" />
            {errors?.cust_code?.message && (
              <ErrorMessage>{errors.cust_code.message}</ErrorMessage>
            )}
            <TInput2 id="invoice_no" label={t("invoice_no")} type="text" />
            {errors?.invoice_no?.message && (
              <ErrorMessage>{errors.invoice_no.message}</ErrorMessage>
            )}
          </div>
          <div>
          <TSelect2
            id="job_or"
            label="작업구분"
            isPlaceholder={false}
            outerClassName="w-full"
            defaultValue={gOfficeId}
            onChange={(e) => setSearchParam({ job_or: e.target.value })}
            options={jobor}
          />
          {errors?.job_or?.message && <ErrorMessage>{errors.job_or.message}</ErrorMessage>}
          <TSelect2
            id="sale_buy"
            label="매출일반"
            isPlaceholder={false}
            outerClassName="w-full"
            defaultValue={gOfficeId}
            onChange={(e) => setSearchParam({ sale_buy: e.target.value })}
            options={salebuy}
          />
          {errors?.sale_buy?.message && <ErrorMessage>{errors.sale_buy.message}</ErrorMessage>}
          </div>
        </PageSearch>
      </form>
    </FormProvider>
  );
}


