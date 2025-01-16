"use client";

import { SP_Load } from "./_store/data";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import SearchForm from "./_component/search-form";
import MasterGrid from "./_component/gridMaster";
import { FormProvider, useForm } from "react-hook-form";
import { Store } from "./_store/store"; //STORE 적용

import { log, getMenuParameters } from '@repo/kwe-lib-new';
import { useEffect } from "react";

export default function AIRI3001() {
 
  const searchParams = Store((state) => state.searchParams);
  const { getLoad } = Store((state) => state.actions);
  
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
  }, []);

  return (

      <FormProvider {...methods}>
        <form className="flex space-y-1">
          <div className={`w-full h-full`}>
            <SearchForm />            
            <div className={`w-full flex-row h-[calc(100vh-150px)]`}>
              <MasterGrid />
            </div>
          </div>
        </form>
      </FormProvider>
  );
}
