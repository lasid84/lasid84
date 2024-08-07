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
import { useState } from "react";
import { useGetData } from "components/react-query/useMyQuery";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import SearchForm from "./_component/search-form";
import MasterGrid from "./_component/gridMaster";

const { log } = require("@repo/kwe-lib/components/logHelper");
const {
  getMenuParameters,
} = require("@repo/kwe-lib/components/menuParameterHelper.js");

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

  // //사용자 정보
  // const menu_param = useUserSettings(
  //   (state) => state.data.currentParams,
  //   shallow
  // );

  // useEffect(() => {
  //   const params = getMenuParameters(menu_param);
  //   dispatch({
  //     cont_type: params.cont_type,
  //     trans_mode: params.trans_mode,
  //     trans_type: params.trans_type,
  //   });
  //   // log('cont_type? OCEN1000', params)
  // }, [menu_param]);


  return (
    <TableContext.Provider value={val}>
      <div className={`w-full h-full`}>
          <SearchForm loadItem={initData} />
          <div className={`w-full h-[calc(100vh-150px)]`}>
              <MasterGrid initData={initData} />
          </div>
      </div>
    </TableContext.Provider>
  );
}
