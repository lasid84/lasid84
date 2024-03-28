'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";

import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";
import { ReactSelect } from "components/select/react-select"
// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

type Props = {
  // onSubmit: SubmitHandler<any>;
  initData: any | undefined;
};

const SearchForm: React.FC<Props> = (props) => {
  const { initData } = props;

  // log("search-form 시작", Date.now());
  const { dispatch } = useAppContext();
  const [groupcd, setGroupcd] = useState<any>([])

  // //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

  const methods = useForm({
    defaultValues: { trans_mode: "", trans_type: "" }
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
  
  useEffect(() => {

    if (initData) {
      console.log('initdata', initData)
      
      // initData.map((arr: any, i: any) => {
      //   console.log('arr', arr)
      //   // let selectoptions: any[i] = []
      //   let selectoptions: Array<any> = new Array(25);
      //   var key = ''
      //   var label = ''
      //   var index = i
      //   console.log('selectoptions',index)
      //   arr.data.map((item: any) => {
      //     key = item[Object.keys(item)[0]];
      //     label = item[Object.keys(item)[1]];
      //     selectoptions[0].push({ value: key, label: key + " " + label });
      //   })
      //   console.log('selectoptions[indezx[',selectoptions[index])
      //   console.log('iiiiiii', selectoptions)
      // })
      setTransmode(initData[0])
      setTranstype(initData[1])
      onSearch();
    }
  }, [initData])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="space-y-1">
        <PageSearch
          right={
            <>
              <TButtonBlue label={"search"} onClick={onSearch} />
              <TButtonBlue label={"createtax"} onClick={() => { }} />
              <TCancelButton label={"searchccn"} onClick={() => { }} />
              <TCancelButton label={"modifyVAT"} onClick={() => { }} />
            </>
          }>
          {/* <ReactSelect id="trans_mode" options={transmode} inline={true} />
          <ReactSelect id="trans_type" options={transtype} inline={true} />
          <TInput2 id="fr_date" type="date" />
          <TInput2 id="to_date" type="date" />
          <ReactSelect id="cust_code" options={groupcd} inline={true} />
          <TInput2 id="invoice_no" name="bl/inv no." /> */}
        </PageSearch>
      </form>
    </FormProvider>
  );
};


export default SearchForm