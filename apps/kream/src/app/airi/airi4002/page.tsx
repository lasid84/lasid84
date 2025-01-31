"use client"

import { useEffect } from "react";
import SearchForm from "./_component/search-form";
import MasterGrid from "./_component/gridMaster";
import { FormProvider, useForm } from "react-hook-form";
import { useCommonStore } from "./_store/store";


export default function AIRI4002() {
  
  const searchParams = useCommonStore((state) => state.searchParams);
  const { getLoad } = useCommonStore((state) => state.actions);
  const methods = useForm({
    defaultValues: {
      ...searchParams
    },
  });


  return (
      <FormProvider {...methods}>
        <form className="flex space-y-1">
          <div className={`w-full h-full`}>
            <SearchForm/>            
            <div className={`w-full flex-row h-[calc(100vh-150px)]`}>
              <MasterGrid/>
            </div>
          </div>
        </form>
      </FormProvider>
  );
}
