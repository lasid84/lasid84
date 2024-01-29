import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "shared/tmpl/page-search";
import { TInput, TSelect, TCancelButton, TSubmitButton } from "tmpl/form";
import { useInvoiceStore, initSearchValue } from "states/acct/acct3002.store";
import { useUserSettings } from "states/useUserSettings";
//import { useCustomer, useLoadData } from "states/useCodes";
//import { MultiColumnComboBoxOverview } from "components/dropdowns/ComboSelect" 

type Props = {
  onSubmit: SubmitHandler<any>;
};

const SearchForm: React.FC<Props> = ({ onSubmit }) => {
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
    office_cd: z.coerce.string(),
    fr_inv_date: z.coerce.string(),
    to_inv_date: z.coerce.string(),
    issue_or: z.coerce.string(),
    no: z.coerce.string(),
  })

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
    defaultValues: {
      ...initSearchValue,
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

  //console.log('acct2003-search, getValues', getValues())

  //init data load
  //const { data: initdata } = useLoadData()
  //const { data: initdata2 } = useCustomer()
  //Set select box data
  const [transmode, setTransmode] = useState([])
  const [transtype, setTranstype] = useState([])
  const [office, setOffice] = useState([])
  const [custcode, setCustcode] = useState([])

  const actions = useInvoiceStore((state) => state.actions)
  const searchParam = useInvoiceStore((state) => state.searchParam)


  // useEffect(() => {
  //   if (initdata && initdata2) {
  //     setTransmode(initdata.mode)
  //     setTranstype(initdata.type)
  //     setOffice(initdata.office)
  //     setCustcode(initdata2.cust)
  //     actions.setSearchParam({
  //       trans_type: gTransType,
  //       trans_mode: gTransMode,
  //       office_cd: gOfficeId
  //     })
  //   }
  // }, [initdata, initdata2])

  useEffect(() => {
    const searchValue = { ...searchParam, }
    reset({ ...searchValue })
  }, [searchParam]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <PageSearch
          right={
            <>
              <TSubmitButton label={t("search")} />
              <TCancelButton label={t("reset")} onClick={() => {
                setFocus("trans_mode");
                reset();
              }} />
            </>
          }>
          <div>
            <TInput id="fr_date" label="기간(시작일자)" type="date">
              {errors?.fr_date?.message && (
                <ErrorMessage>{errors.fr_date.message}</ErrorMessage>
              )}
            </TInput>
            <TInput id="to_date" label="(종료일자)" type="date">
              {errors?.to_date?.message && <ErrorMessage>{errors.to_date.message}</ErrorMessage>}
            </TInput>
          </div>
          <div>
            <TSelect
              id="trans_mode"
              label={t("trans_mode")}
              allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransMode}
              onChange={(e) => actions.setSearchParam({ trans_mode: e.target.value })}
              options={transmode}
            />
            {errors?.trans_mode?.message && <ErrorMessage>{errors.trans_mode.message}</ErrorMessage>}
            <TSelect
              id="trans_type"
              label={t("trans_type")}
              allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransType}
              onChange={(e) => actions.setSearchParam({ trans_type: e.target.value })}
              options={transtype}
            /></div>
          {errors?.trans_type?.message && <ErrorMessage>{errors.trans_type.message}</ErrorMessage>}

          <div className="col-span-2">
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
            <TInput id="invoice_no" label={t("invoice_no")} type="text" />
            {errors?.invoice_no?.message && (
              <ErrorMessage>{errors.invoice_no.message}</ErrorMessage>
            )}
          </div>
          <TSelect
            id="office_cd"
            label={t("office_cd")}
            allYn={false}
            isPlaceholder={false}
            outerClassName="w-full space-y-1"
            defaultValue={gOfficeId}
            onChange={(e) => actions.setSearchParam({ office_cd: e.target.value })}
            options={office}
          />
          {errors?.office_cd?.message && <ErrorMessage>{errors.office_cd.message}</ErrorMessage>}
        </PageSearch>
      </form>
    </FormProvider>
    //   </div>
    // </div>
  );
}
export default SearchForm;
