'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnyCnameRecord } from "dns";
import { useUserSettings } from "states/useUserSettings";
const { log } = require('@repo/kwe-lib/components/logHelper');
import { SP_UpdateData, SP_CreateData } from "@/app/stnd/stnd0005/_component/data";

export const useGetData = (searchParam: any, queryNm: any, queryFn: any, option?: any) => {
   log('useGetData', searchParam)
  const user_id = useUserSettings((state) => state.data.user_id);
  const ipaddr = useUserSettings((state) => state.data.ipaddr);

  const params = {
    ...searchParam,
    user_id: user_id,
    ipaddr: ipaddr
  }
  const { isLoading, data, isError, refetch, remove } = useQuery([queryNm, params], queryFn, { ...option });
  return { data, isLoading, isError, refetch, remove }
};

export const useUpdateData = (model?: string) => {
  const queryClient = useQueryClient();
  const Update = useMutation(SP_UpdateData, {
    onSuccess: (res:any, data:any, context:any) => {
      queryClient.invalidateQueries([model])
      //console.log('????????????@',pageName)
      console.log('onUpdate',res,data,context)
    },
    onMutate: async (data) => { },
    
  })
  const Create = useMutation(SP_CreateData, {
    onSuccess: (res:any, data:any, context:any) => {
      // queryClient.invalidateQueries([`${pageName}`+'_SEARCH'])
      queryClient.invalidateQueries([model])      
      console.log('onCreate',res,data,context)
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