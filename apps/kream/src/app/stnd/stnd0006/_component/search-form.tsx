'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { shallow } from "zustand/shallow";
import { ReactSelect, data } from "@/components/select/react-select2";

const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined
}

type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

// export function SearchForm({searchParams, dispatch}) {
const SearchForm = memo(({ loadItem }: any) => {

  log("search-form 시작", Date.now());
  const { dispatch } = useAppContext();

  //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

  // const methods = useForm<FormType>({
  const methods = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      trans_mode: gTransMode || 'ALL',
      trans_type: gTransType || 'ALL'
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
    if (loadItem?.length) {
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
    // const params = getValues();
    // log("search-form onSubmit", params, transmode, transtype);
    // // dispatch({ type: SEARCH, params: params});
    // onSearch();
  }

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params, getValues('trans_mode'));
    dispatch({ searchParams: params, isMSearch: true });
  }

  const onNew = () => {
    const params = getValues();
    dispatch({ searchParams: params, mSelectedRow: null, crudType: crudType.CREATE, isPopUpOpen: true });
    log("onNew", params);
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <PageSearchButton
          right={
            <>
              <Button id={"search"} onClick={onSearch} />
              <Button id={"new"} onClick={onNew} />
              {/* <Button id={"reset"} onClick={() => {
                setFocus("trans_mode");
                reset();
              }} /> */}
            </>
          }>
          <ReactSelect
            id="trans_mode" label="trans_mode" dataSrc={transmode as data}
            options={{
              keyCol: "trans_mode",
              displayCol: ['trans_mode', 'name'],
              // inline:true,
              // defaultValue: {label:'A Air', value:'A'}
              defaultValue: getValues('trans_mode')
            }}
          />
          <ReactSelect
            id="trans_type" label="trans_type" dataSrc={transtype as data}
            options={{
              keyCol: "trans_type",
              displayCol: ['name'],
              // inline:true,
              defaultValue: getValues('trans_type')
            }}
          />
          <div>
          </div>
        </PageSearchButton>
      </form>
    </FormProvider>
  );
});


export default SearchForm