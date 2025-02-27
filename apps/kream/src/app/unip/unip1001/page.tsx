"use client";

import { useEffect, useReducer, useMemo, useRef } from "react";
import { SP_Load, SP_GetCustomsData } from "./_component/data";
import {
  reducer,
  TableContext,
} from "components/provider/contextObjectProvider";
import {
  LOAD,
  SEARCH_M,
} from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import SearchForm from "./_component/search-form";
import MasterGrid from "./_component/gridMaster";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";

import { log, error } from '@repo/kwe-lib-new';

export default function UNIP1001() {

  const [state, dispatch] = useReducer(reducer, {
    objState: {
      searchParams: {},
      isMSearch: false,
    },
  });
  const { objState } = state;
  const {
    searchParams,
    mSelectedRow,
    isMSearch,
  } = objState;

  const val = useMemo(() => {
    return {
      objState,
      searchParams,
      mSelectedRow,
      isMSearch,
      dispatch,
    };
  }, [state]);

  const { data: initData } = useGetData("", LOAD, SP_Load, {
    staleTime: 1000 * 60 * 60,
  });

  // const methods = useForm<FormType>({
  const methods = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      blyy: dayjs().year().toString(),
      blno: '',
      search_gubn: '0'
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

  return (
    <TableContext.Provider value={val}>
      <FormProvider {...methods}>
      <form className="flex space-y-1">
          <div className={`w-full h-full`}>
              <SearchForm loadItem={initData} />
              <div className={`w-full h-[calc(100vh-150px)]`}>
                  <MasterGrid initData={initData} />
              </div>
          </div>
        </form>
      </FormProvider>      
    </TableContext.Provider>
  );
}
