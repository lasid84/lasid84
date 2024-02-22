

import { executFunction } from "@/services/api.services";
// import { useQuery } from "@tanstack/react-query";
import { unstable_noStore } from "next/cache";
import { LOAD, SEARCH, SEARCH_FINISH, SELECTED_ROW } from "./model";

const { log } = require('@repo/kwe-lib/components/logHelper');
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosResponse } from "axios";

export const PageState = {
    searchParams: {},
    needSearch: false,
    selectedRow: {}
  };

export const reducer = (state:any, action:any) => {
  
  switch (action.type) {
    case LOAD:
      const { params } = action;
      
      // return useGetData(params);
    case SEARCH:
      return {
        ...state,
        searchParams: {
          ...state.searchParams,
          ...action.params
        },
        needSearch: true
      }
    case SEARCH_FINISH:
      return {
        ...state,
        needSearch: action.needSearch
      }
    case SELECTED_ROW:
      log("data", JSON.stringify(action.selectedRow));
      return {
        ...state,
        selectedRow:action.selectedRow
      }
  }

  return state;
}

interface cursorData {
  cursorData: {}[]
}

export const SP_Load = async (searchParam:any) => {
  // unstable_noStore();
  const {user_id, ipaddr} = searchParam;
  const params = {
    inparam: ["in_trans_mode", "in_trans_type", "in_user", "in_ipaddr"],
    invalue: ['', '', user_id, ipaddr],
    inproc: 'public.f_stnd0006_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executFunction(params);
  return result;
}

export const SP_GetData = async (searchParam: any) => {
  // console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const {trans_mode, trans_type, user_id, ipaddr } = Param;
  log("searchData:", trans_mode, trans_type);
  
  const params = {
    inparam : [
        "in_user"
      , "in_ipaddr"
      , "in_trans_mode"
      , "in_trans_type"
    ],
    invalue: [
        user_id
      , ipaddr
      , trans_mode
      , trans_type
    ],
    inproc: 'public.f_stnd0006_get_chargesetlist',
    isShowLoading: true
    }
  
    const result = await executFunction(params);
    return result![0];
}
