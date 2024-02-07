import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "shared/tmpl/page-search-row-2";
import { TInput2, TSelect2, TCancelButton, TSubmitButton } from "tmpl/form";
import { useInvoiceStore, initSearchValue } from "states/acct/acct2003.store";
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

  // 인보이스 검색스키마
  const acct2003SearchSchema = z.object({
    trans_mode: z.coerce.string(),
    trans_type: z.coerce.string(),
    office_cd: z.coerce.string(),
    fr_date: z.coerce.string().optional(),
    to_date: z.coerce.string().optional(),
    fr_inv_date: z.coerce.string(),
    to_inv_date: z.coerce.string(),
    no: z.coerce.string(),
    cust_code: z.coerce.string(),
    issue_or: z.coerce.string(),
  })

  // acct3002검색스키마 선언
  const formSchema = acct2003SearchSchema
  // acct3002검색스키마 타입선언
  type FormType = z.infer<typeof acct2003SearchSchema>

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

  //Set select box data
  const [transmode, setTransmode] = useState([])
  const [transtype, setTranstype] = useState([])


  const actions = useInvoiceStore((state) => state.actions)
  const searchParam = useInvoiceStore((state) => state.searchParam)


  useEffect(() => {
    if (loadItem) {

      console.log('acct3002-search', loadItem.data)
      setTransmode(loadItem.data.cursorData[0])
      setTranstype(loadItem.data.cursorData[1])
    }
    // actions.setSearchParam({
    //   trans_type: gTransType,
    //   trans_mode: gTransMode,
    //   office_cd: gOfficeId
    // })


  }, [loadItem])

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
          <div className="flex flex-col w-full">
            <TInput2 id="fr_date" label={t("fr_date")} type="date">
              {errors?.fr_date?.message && (
                <ErrorMessage>{errors.fr_date.message}</ErrorMessage>
              )}
            </TInput2>
            <TInput2 id="to_date" label={t("to_date")} type="date">
              {errors?.to_date?.message && <ErrorMessage>{errors.to_date.message}</ErrorMessage>}
            </TInput2>
          </div>
          <div className="flex flex-col w-full">
            <TInput2 id="fr_inv_date" label={t("fr_inv_date")} type="date">
              {errors?.fr_inv_date?.message && (
                <ErrorMessage>{errors.fr_inv_date.message}</ErrorMessage>
              )}
            </TInput2>
            <TInput2 id="to_inv_date" label={t("to_inv_date")} type="date">
              {errors?.to_inv_date?.message && <ErrorMessage>{errors.to_inv_date.message}</ErrorMessage>}
            </TInput2>
          </div>
          <div className="flex flex-col w-full">
            <TSelect2
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

            <TSelect2
              id="trans_type"
              label={t("trans_type")}
              allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransMode}
              onChange={(e) => actions.setSearchParam({ trans_type: e.target.value })}
              options={transtype}
            />{errors?.trans_type?.message && <ErrorMessage>{errors.trans_type.message}</ErrorMessage>}
            <TSelect2
              id="office_cd"
              label={t("office_cd")}
              allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransType}
              onChange={(e) => actions.setSearchParam({ office_cd: e.target.value })}
              options={transtype}
            />
            {errors?.office_cd?.message && <ErrorMessage>{errors.office_cd.message}</ErrorMessage>}
          </div>
          <div className="flex flex-col w-full">
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
            <div className="col-span-2 row-span-2">
              <TInput2 id="cust_code" label={t("cust_code")} type="text" />
              {errors?.cust_code?.message && (
                <ErrorMessage>{errors.cust_code.message}</ErrorMessage>
              )}</div><div className="col-span-2 row-span-2">
              <TInput2 id="no" label={t("invoice_no")} type="text" />
              {errors?.no?.message && (
                <ErrorMessage>{errors.no.message}</ErrorMessage>
              )}
            </div>
          </div>

        </PageSearch>
      </form>
    </FormProvider>
    //   </div>
    // </div>
  );
}
export default SearchForm;
