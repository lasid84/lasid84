'use client'

import { MutationFunction, UseMutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnyCnameRecord } from "dns";
import { useUserSettings } from "states/useUserSettings";
const { log } = require('@repo/kwe-lib/components/logHelper');
import { SP_UpdateData } from "@/app/stnd/stnd0005/_component/data";
import { usePathname } from "next/navigation";
import { shallow } from "zustand/shallow";
import { ROW_CHANGED, ROW_TYPE, ROW_TYPE_NEW } from "../grid/ag-grid-enterprise";

export const useGetData = (searchParam: any, queryNm: any, queryFn: any, option?: any) => {
  
  const user_id = useUserSettings((state) => state.data.user_id);
  const ipaddr = useUserSettings((state) => state.data.ipaddr);
  const path = usePathname() + "/";

  const params = {
    ...searchParam,
    user_id: user_id,
    ipaddr: ipaddr
  }
  const { isLoading, data, isError, refetch, remove } = useQuery([path + queryNm, {...params}], queryFn, {staleTime: 0, ...option});
  // log('useGetData', queryNm, searchParam, isLoading)
  return { data, isLoading, isError, refetch, remove }
};

export const useUpdateData = (model?: string) => {
  const queryClient = useQueryClient();
  const Update = useMutation(SP_UpdateData, {
    onSuccess: (res:any, data:any, context:any) => {
      queryClient.invalidateQueries([model])
      
      //console.log('????????????@',pageName)
      // console.log('onUpdate',res,data,context)
    },
    onMutate: async (data) => { },
    
  })
  const Create = useMutation(SP_UpdateData, {
    onSuccess: (res:any, data:any, context:any) => {
      // queryClient.invalidateQueries([`${pageName}`+'_SEARCH'])
      queryClient.invalidateQueries([model])      
    },
    onMutate: async (data) => { },
    onError: (err, data, context) => {
      console.log('PLEASE TRY AGAIN')
      return { err, data, context }
    }
  })
  return {
    Update,
    Create
  }
}

export const useUpdateData2 = (mutationFn: MutationFunction, queryKey?: string, option?:any) => {
  const user_id = useUserSettings((state) => state.data.user_id);
  const ipaddr = useUserSettings((state) => state.data.ipaddr);
  // const trans_mode = useUserSettings((state) => state.data.trans_mode);
  // const trans_type = useUserSettings((state) => state.data.trans_type);
  const terminal = useUserSettings((state) => state.data.terminal);
  const menu_seq = useUserSettings((state) => state.data.currentMenu, shallow);
  const queryClient = useQueryClient();
  const path = usePathname() + "/";

  const Update = useMutation([path + queryKey], mutationFn, {
    // ...option,
    onSuccess: (res:any, data:any, context:any) => {
      // queryClient.invalidateQueries([path + queryKey]);
      if (option?.callbacks) {
        option.callbacks.forEach((callback: () => any) => callback());
      }
      data[ROW_CHANGED] = false;
    },
    onMutate: async (data) => {
      // log("onMutate : ", queryClient, data);
      // data["trans_mode"] = trans_mode;
      // data["trans_type"] = trans_type;
      data["terminal"] = terminal;
      data["user_id"] = user_id;
      data["ipaddr"] = ipaddr;
    },
  });

  const Create = useMutation(['key'], mutationFn, {
    onSuccess: (res:any, data:any, context:any) => {
      if (option?.callbacks) {
        option.callbacks.forEach((callback: () => any) => callback());
      }
      // queryClient.invalidateQueries([path + queryKey])
      data[ROW_CHANGED] = false;
      data[ROW_TYPE] = null;
    },
    onMutate: async (data) => {
      // data["trans_mode"] = trans_mode;
      // data["trans_type"] = trans_type;
      data["terminal"] = terminal;
      data["menu_seq"] = menu_seq;
      data["user_id"] = user_id;
      data["ipaddr"] = ipaddr;
    },
    onError: (err, data, context) => {
      // console.log('PLEASE TRY AGAIN')
      // return { err, data, context }
    }
  })
  return {
    Update,
    Create
  }
}