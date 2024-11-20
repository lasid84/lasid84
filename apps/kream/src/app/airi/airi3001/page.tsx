"use client";

import { useEffect, useReducer, useMemo, useRef } from "react";
import { SP_Load } from "./_component/data";
import {
  reducer,
  TableContext,
} from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { useState } from "react";
import { useGetData } from "components/react-query/useMyQuery";
import SearchForm from "./_component/search-form";
import MasterGrid from "./_component/gridMaster";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { Button } from "@/components/button";

const { log } = require("@repo/kwe-lib/components/logHelper");
const {
  getMenuParameters,
} = require("@repo/kwe-lib/components/menuParameterHelper.js");

export default function AIRI3001() {
  const [state, dispatch] = useReducer(reducer, {
    objState: {
      searchParams: {},
      isMSearch: false,
      mSelectedRow: {},
      isPopUpOpen: false,
      isIFPopUpOpen: false,
      popType: null
    },
  });
  const { objState } = state;
  const { searchParams, mSelectedRow, crudType, isMSearch, isPopUpOpen } = objState;

  const val = useMemo(() => {
    return {
      objState,
      searchParams,
      mSelectedRow,
      isMSearch,
      dispatch,
    };
  }, [state]);

  const { data: initData } = useGetData("", LOAD, SP_Load, {staleTime: 1000 * 60 * 60,});
  const methods = useForm({
    defaultValues: {
      fr_date: dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"),
      to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
      search_gubn: 0,
      no: '', // HWB, MWB
      state:  'ALL',
    },
  });

  const {
    formState: { errors, isSubmitSuccessful },
  } = methods;

  return (
    <TableContext.Provider value={val}>
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
    </TableContext.Provider>
  );
}
