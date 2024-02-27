'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnyCnameRecord } from "dns";
import { useUserSettings } from "states/useUserSettings";
const { log } = require('@repo/kwe-lib/components/logHelper');
import { SP_UpdateData } from "@/app/stnd/stnd0005/_component/data";
export const useGetData = (searchParam: any, queryNm: any, queryFn: any, option?: any) => {
  // log('useGetData', queryFn, searchParam)
  const user_id = useUserSettings((state) => state.data.user_id);
  const ipaddr = useUserSettings((state) => state.data.ipaddr);

  const params = {
    ...searchParam,
    user_id: user_id,
    ipaddr: ipaddr
  }
  const { isLoading, data, isError, refetch } = useQuery([queryNm, params], queryFn, { ...option });
  return { data, isLoading, isError, refetch }
};


export const useUpdateData = () => {
  const queryClient = useQueryClient();
  return useMutation(SP_UpdateData, {
    onSuccess: (res) => { 
      queryClient.invalidateQueries(["SEARCH",{"grp_cd":"ALL","user_id":"doni.lee"}])

    },
    onMutate: async (data) => { },
    onError: (err, data, context) => {
      console.log('PLEASE TRY AGAIN')
    }
  })
}

  //   const { isLoading, data, isError, refetch, remove } = useQuery([queryNm, params], queryFn, {...option});
  //   return { data, isLoading, isError, refetch, remove }
  // };
