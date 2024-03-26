'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";
import { ReactSelect} from "components/select/react-select"
// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData : []
  numericData : number;
  textData : string;
}

type Props = {
  // onSubmit: SubmitHandler<any>;
  initData : any | undefined;
};

const SearchForm = memo(({initData}:Props) => {

  // log("search-form 시작", Date.now());
  const { dispatch } = useAppContext();
  const [groupcd, setGroupcd] = useState<any>([])
  let selectoptions: any[] = []
  // //사용자 정보
  // const gTransMode = useUserSettings((state) => state.data.trans_mode)
  // const gTransType = useUserSettings((state) => state.data.trans_type)

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
    if (initData) {
        initData[0].data.map((item: any) => {
            var key = item[Object.keys(item)[0]];
            var label = item[Object.keys(item)[1]];
            selectoptions.push({ value: key, label: key + " " + label });
        })
        setGroupcd(selectoptions)
        onSearch();
    }
}, [initData])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({searchParams: params, isMSearch:true});
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="space-y-1">
        <PageSearch
          right={
            <>
              <TButtonBlue label={"search"} onClick={onSearch} />
              {/* <TButtonBlue label={t("new")} onClick={() => { } } /> */}
              {/* <TCancelButton label={t("reset")} onClick={() => { } } /> */}
            </>
          }>
            <ReactSelect id="grp_cd" name="grp" options={groupcd} inline={true}/>
            <ReactSelect id="grp_cd" name="grp" options={groupcd} inline={true}/>
             <TInput2 id="grp_cd" label="grp_cd" type="date"/>   
             <TInput2 id="grp_cd" label="grp_cd" type="date"/>   
             <ReactSelect id="grp_cd" name="grp" options={groupcd} inline={true}/>
             <TInput2 id="grp_cd" label="grp_cd"  />   
        </PageSearch>
      </form>
    </FormProvider>
  );
});


export default SearchForm