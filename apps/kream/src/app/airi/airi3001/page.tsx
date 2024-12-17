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

export default function AIRI3001() {
  
  // const [state, dispatch] = useReducer(reducer, {
  //   objState: {
  //     searchParams: {},
  //     excel_data : {},
  //     isMSearch: false,
  //     mSelectedRow: {},
  //     gridRef_Detail : useRef<any | null>(null),
  //     isDSearch : false,
  //     popUp : {
  //       popType: null,
  //       isPopUpUploadOpen: false,
  //       isPopUpOpen: false,
  //     },
  //   },
  // });
  // const { objState } = state;
  // const { searchParams, mSelectedRow, crudType, isMSearch, gridRef_Detail } = objState;

  // const val = useMemo(() => {
  //   return {
  //     objState,
  //     searchParams,
  //     mSelectedRow,
  //     isMSearch,
  //     gridRef_Detail,
  //     dispatch,
  //   };
  // }, [state]);

  // const { data: initData } = useGetData("", LOAD, SP_Load, {staleTime: 1000 * 60 * 60,});
  // const methods = useForm({
  //   defaultValues: {
  //     fr_date: dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"),
  //     to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
  //     search_gubn: 0,
  //     no: '', // HWB, MWB
  //     state:  'ALL',
  //   },
  // });
 
  const searchParams = Store((state) => state.searchParams);
  const { data: initData } = useGetData("", LOAD, SP_Load, {staleTime: 1000 * 60 * 60,});
  
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
