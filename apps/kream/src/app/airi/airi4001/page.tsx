"use client";

import { useEffect, useReducer, useMemo, useRef } from "react";
import { SP_Load } from "./_store/data";
import {
  reducer,
  TableContext,
} from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import SearchForm from "./_component/search-form";
import MasterGrid from "./_component/gridMaster";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { Store } from "./_store/store"; //STORE 적용

const { log } = require("@repo/kwe-lib/components/logHelper");
const {
  getMenuParameters,
} = require("@repo/kwe-lib/components/menuParameterHelper.js");

export default function AIRI4001() {
  

  const searchParams = Store((state) => state.searchParams);
  const { data: initData } = useGetData("", LOAD, SP_Load, {staleTime: 1000 * 60 * 60 });
  
  const methods = useForm({
    defaultValues: {
      ...searchParams
    },
  });

  const {
    formState: { errors, isSubmitSuccessful },
  } = methods;

  return (

      <FormProvider {...methods}>
        <form className="flex space-y-1">
          <div className={`w-full h-full`}>
            <SearchForm loadItem={initData} />            
            <div className={`w-full flex-row h-[calc(100vh-150px)]`}>
              <MasterGrid initData={initData} />
            </div>
          </div>
        </form>
      </FormProvider>
  );
}
