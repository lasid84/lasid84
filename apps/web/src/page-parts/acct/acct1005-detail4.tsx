'use client'
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "shared/tmpl/page-search";
import { useRouter } from "next/router";
import { TInput, TInputWithButton, TSelect, TCancelButton, TTextarea, TTextarea2, } from "tmpl/form";
import { useInvoiceStore, initSearchValue } from "states/acct/acct1005.store";
import { useUserSettings } from "states/useUserSettings";
import PageContentUp from "shared/tmpl/page-content-up";


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
  tabRef : HTMLDivElement;
};

const Detail: React.FC<Props> = ({ onSubmit, loadItem, tabRef }) => {
  //다국어  
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
  // const no = JSON.stringify(router.query.no).replace(/\"/gi, "")
  // searchParam.no = no
 

  return (
    <>
      <div className="space-y-2">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} >
            <PageContentUp
              left={
                <>
                  <p> 4. 청구</p>
                </>
              }
            >

              <div ref={tabRef}
                className={`gap-2 
                          sm:grid sm:grid-cols-3 
                          md:grid md:grid-cols-5 
                          lg:grid lg:grid-cols-7 
                          xl:grid xl:grid-cols-9
                          2xl:grid 2xl:grid-cols-10`}>
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInputWithButton id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <div className="col-span-2 row-span-2">
                  <TTextarea
                    label="주소"
                    id="addr1"
                    height="h-24"
                    readOnly={false}
                  />
                </div>
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
                <TInput id="cust_code" label={t("cust_code")} type="text" readOnly />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <TTextarea
                  label="비고"
                  id="vigo"
                  width="w-full"
                  rows={2}
                  readOnly={false}
                />
                <TTextarea
                  label="비고"
                  id="vigo"
                  width="w-full"
                  rows={2}
                  readOnly={false}
                />
              </div>

            </PageContentUp>

          </form>
        </FormProvider>
      </div>
    </>
  );
}
export default Detail;
