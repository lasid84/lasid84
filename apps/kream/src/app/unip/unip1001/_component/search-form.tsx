'use client'

import React, { useState, useEffect, Dispatch, useContext, memo, useTransition, KeyboardEvent } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { shallow } from "zustand/shallow";
import { ReactSelect, data } from "@/components/select/react-select2";
import dayjs from "dayjs";
import { MaskedInputField } from "components/input";
import { toastError } from "@/components/toast";
import { useTranslation } from "react-i18next";

const { log } = require("@repo/kwe-lib/components/logHelper");

export interface typeloadItem {
  data: {} | undefined
}
type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

// export function SearchForm({searchParams, dispatch}) {
const SearchForm = memo(({ loadItem }: any) => {

  const { t } = useTranslation();
  const { dispatch, objState } = useAppContext();
  const { searchParams } = objState;

  // const methods = useForm<FormType>({
  const methods = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      blyy: dayjs().year().toString(),
      blno: ''
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

  useEffect(() => {
    const params = getValues();
    dispatch({ searchParams: params, isMSearch: true });
  }, [])

  const onSearch = () => {
    const params = getValues();
    if (!params.blyy || !params.blno) {
      toastError(t("MSG_0173"));
      setFocus("blno", { shouldSelect: true });
      return;
    }
    dispatch({ searchParams: params, isMSearch: true });
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      onSearch();
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="flex space-y-1">
        <PageSearchButton
          right={
            <>
              <Button id={"search"} onClick={onSearch} width='w-32'/>
            </>
          }>
          <MaskedInputField id="blyy" label="blyy" value={getValues("blyy")} options={{ textAlign: 'center', inline: true, noLabel: false }} width="w-20" height='h-8' />
          <div className={"col-span-4"}>
          <MaskedInputField id="blno" label="house_bl_no" value={searchParams.blno} options={{ textAlign: 'center', inline: true, noLabel: false }} height='h-8' 
            events={{
              onKeyDown: handleKeyDown
            }}
          />
          </div>
        </PageSearchButton>
      </form>
    </FormProvider>
  );
});


export default SearchForm