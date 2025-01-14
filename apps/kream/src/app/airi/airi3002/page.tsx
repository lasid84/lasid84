"use client";

import { useEffect, useReducer, useMemo, useRef } from "react";
import SearchForm from "./_component/search-form";
import MasterGrid from "./_component/gridMaster";
import { FormProvider, useForm } from "react-hook-form";
import { useCommonStore } from "./_store/store";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';

export default function AIRI3002() {

  const searchParams = useCommonStore((state) => state.searchParams);
  const { getLoad } = useCommonStore((state) => state.actions);
  const methods = useForm({
    defaultValues: {
      ...searchParams
    },
  });

  const {
    formState: { errors, isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    getLoad();
  }, [])

  return (
    <FormProvider {...methods} >
      <form className="flex space-y-1">
        <div className={`w-full h-full`}>
          <SearchForm />            
          <div className={`flex-row w-full h-[calc(100vh-150px)]`}>
            <MasterGrid />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

