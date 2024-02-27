

import { executFunction } from "@/services/api.services";
// import { useQuery } from "@tanstack/react-query";
import { unstable_noStore } from "next/cache";
import { LOAD, SEARCH, SEARCH_FINISH, SELECTED_ROW, UPDATE } from "./model";

const { log } = require('@repo/kwe-lib/components/logHelper');
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosResponse } from "axios";

export const PageState = {
  searchParams: {},
  needSearch: false,
  selectedRow: {}
};

export const reducer = (state: any, action: any) => {

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
        selectedRow: action.selectedRow
      }
    case UPDATE:
      log("selectedrow > update data", JSON.stringify(action.selectedRow));
      return {
        ...state,
        selectedRow: action.selectedRow
      }
  }

  return state;
}

interface cursorData {
  cursorData: {}[]
}

export const SP_Load = async (searchParam: any) => {
  // unstable_noStore();
  const { user_id, ipaddr } = searchParam;
  const params = {
    inparam: ["in_user", "in_ipaddr"],
    invalue: ['doni.lee', '10.33.33.96'],
    inproc: 'public.f_stnd0005_load',
    isShowLoading: false
  }
  // log("Acct2003Load", p);
  const result = await executFunction(params);
  return result;
}

export const SP_GetData = async (searchParam: any) => {
  console.log('searchParam', searchParam.queryKey[1])
  const Param = searchParam.queryKey[1]

  const { grp_cd, user_id, ipaddr } = Param;
  log("searchData:", grp_cd);

  const params = {
    inparam: [
      "in_grp_cd"
      , "in_user"
      , "in_ipaddr"
    ],
    invalue: [
      grp_cd
      , user_id
      , ipaddr
    ],
    inproc: 'public.f_stnd0005_get_codesetlist',
    isShowLoading: true
  }

  const result = await executFunction(params);
  return result![0];
}


export const SP_UpdateData = async (param: any) => {
  console.log('params', param)
  const Param = param
  const { grp_cd, cd, cd_nm, cd_desc,cd_mgcd1, cd_mgcd2, use_yn, user_id, ipaddr } = Param;
  log("searchData:", grp_cd);

  const params = {
    // t(in_grp_cd text, in_cd text, in_cd_nm text, in_cd_desc text, in_cd_mgcd1 text, in_cd_mgcd2 text, in_use_yn text, in_user_id text, in_ipaddr text, OUT n_return integer, OUT v_return text, OUT c_return1 refcursor)

    inparam: [
      "in_grp_cd"
      , "in_cd"
      , "in_cd_nm"
      , "in_cd_desc"
      , "in_cd_mgcd1"
      , "in_cd_mgcd2"
      , "in_use_yn"
      , "in_user_id"
      , "in_ipaddr"
    ],
    invalue: [
      grp_cd
      , cd
      , cd_nm
      , cd_desc
      , cd_mgcd1
      , cd_mgcd2
      , use_yn
      , ''
      , ''
    ],
    inproc: 'public.f_stnd0005_upd_codesetlist',
    isShowLoading: true
  }

  const result = await executFunction(params);
  console.log('resultafds',result)
  return result![0];
}