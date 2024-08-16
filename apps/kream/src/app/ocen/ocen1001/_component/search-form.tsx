"use client";

import React, {
  useState,
  useEffect,
} from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from "components/input";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import dayjs from "dayjs";
import { Button } from "components/button";
import  {PageSearch2}  from "layouts/search-form/page-search-row";
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: [];
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined;
}

type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

const SearchForm = ({ loadItem }: any) => {
  const { dispatch, objState } = useAppContext();

  const methods = useForm({
    defaultValues: {
    },
  });

  const {
    handleSubmit,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = methods;


  useEffect(() => {
    if (loadItem?.length) {    
      dispatch({ isFirstRender: false });
      if (objState.isFirstRender) {
        onSearch();
      }
    }
  }, [loadItem?.length]);


  const onSearch = () => {
    const params = getValues();
    dispatch({ searchParams: params, isMSearch: true});
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="flex pt-10 space-y-1">
        <PageSearch2>
          <></>
        </PageSearch2>
      </form>
    </FormProvider>
  );
};

export default SearchForm;
