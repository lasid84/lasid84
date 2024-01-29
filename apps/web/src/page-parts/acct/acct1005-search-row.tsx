import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "shared/tmpl/page-search";
import { useRouter } from "next/router";
import { TInput2, TSelect2, TCancelButton, TSubmitButton, TTextarea } from "tmpl/form";
import { useInvoiceStore, initSearchValue } from "states/acct/acct1005.store";
import { useUserSettings } from "states/useUserSettings";


//import { useCustomer, useLoadData } from "states/useCodes";
//import { MultiColumnComboBoxOverview } from "components/dropdowns/ComboSelect" 

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export interface loadItem {
  data: returnData[]
}

type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: loadItem | null;
};

const SearchForm: React.FC<Props> = ({ onSubmit, loadItem }) => {
    // 다국어
    const { t } = useTranslation();
    z.setErrorMap(makeZodI18nMap({ t }));
  
  const router = useRouter()
  // 인보이스 검색스키마
  const acct1005SearchSchema = z.object({

    no: z.coerce.string(),

  })

  // acct3002검색스키마 선언
  const formSchema = acct1005SearchSchema
  // acct3002검색스키마 타입선언
  type FormType = z.infer<typeof acct1005SearchSchema>

  const methods = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no: ''
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

  const actions = useInvoiceStore((state) => state.actions)
  const searchParam = useInvoiceStore((state) => state.searchParam)
  const no = JSON.stringify(router.query.no).replace(/\"/gi, "")
  searchParam.no = no


  useEffect(() => {
    if (loadItem) {
      console.log('acct1005 load data', loadItem.data)
    }
  }, [loadItem])

  // useEffect(() => {
  //   const searchValue = { ...searchParam, }
  //   reset({ ...searchValue })
  // }, [searchParam]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <PageSearch
          right={
            <>
              <TSubmitButton label={t("search")} />
              <TCancelButton label={"초기화"} onClick={() => {
                reset();
              }} />
            </>
          }>

          <div className="col-span-4 row-span-4">
            <TTextarea id='no' label='BL/Invoice No.' />
          </div>
          <div className="col-span-2 row-span-2">
            <TInput2 id="cust_code" label={t("거래처")} type="text" readOnly />
            {errors?.cust_code?.message && (
              <ErrorMessage>{errors.cust_code.message}</ErrorMessage>
            )}
          </div>
          {/* <div className={`col-span-2 row-span-2 ${true ? "" : "hidden"}`}>
            <TTextarea id='no' label='BL/Invoice No.' />
            <TTextarea id='no' label='BL/Invoice No.' />
          </div> */}

        </PageSearch>
      </form>
    </FormProvider>
  );
}
export default SearchForm;
