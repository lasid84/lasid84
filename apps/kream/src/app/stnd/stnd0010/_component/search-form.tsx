'use client'


import React, { useState, useEffect, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import Modal from "./popupInterface";

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

const SearchForm = memo(({ loadItem }: any) => {

  log("search-form 시작", Date.now());
  const { dispatch } = useAppContext();

  const methods = useForm({
    defaultValues: {
      trans_mode: 'ALL',
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
  const [transmode, setTransmode] = useState<any>()

  useEffect(() => {
    if (loadItem?.length) {
      setTransmode(loadItem[0])
      onSearch();
    }
  }, [loadItem?.length])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    dispatch({ searchParams: params, isMSearch: true });
  }

  const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }

  const onRefresh = () => { dispatch({ isMSearch: true }) }

  return (
    <>
      <FormProvider {...methods}>
        <form className="space-y-1">
          <PageSearchButton
            right={
              <>
                <Button id={"search"} onClick={onSearch} width="w-32"/>
                <Button id={"interface"} onClick={onInterface} width="w-32"/>
              </>
            }>

            <ReactSelect
              id="trans_mode" label="trans_mode" dataSrc={transmode as data}
              options={{
                keyCol: "trans_mode",
                displayCol: ['trans_mode', 'trans_detail'],
                defaultValue: getValues('trans_mode')
              }}
            />
          </PageSearchButton>
        </form>
      </FormProvider>
      <Modal loadItem={loadItem} />
    </>
  );
});


export default SearchForm