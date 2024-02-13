import { executFunction } from "@/services/api.services";
import { useQuery } from "@tanstack/react-query";
import { unstable_noStore } from "next/cache";

const { log } = require('@repo/kwe-lib/components/logHelper');
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosResponse } from "axios";



export const CHANGE_SEARCH_PARAM = 'CHANGE_SEARCH_PARAM';

// type reducer = {
//   state : any,
//   action : string
// }

export const SearchState = {
    searchParams: {id:"1"},
  };

export const reducer = (state:any, action:any) => {
  
  switch (action.type) {
    case CHANGE_SEARCH_PARAM:
      log("reducer", state, action);
      return {
        ...state,
        searchParams: {
          ...action
        }
      }
  }
}

export const Acct2003Load = (p:any) => {
  unstable_noStore();
  const params = {
    inparam: ["in_user_id", "in_ipaddr"],
    invalue: ['doni.lee.web', '10.33.33.96'],
    inproc: 'account.f_acct2003_load',
    isShowLoading: false
  }
  log("Acct2003Load", p);
  return executFunction(params);
}

export const useGetData = (searchParam: any) => {
  log('searchParam', searchParam)
  const { isLoading, data, isError } = useQuery(["Acct2003Load", searchParam], Acct2003Load);
  return { data, isLoading, isError }
}
