'use client'

import { useQuery } from "@tanstack/react-query";
import { useUserSettings } from "states/useUserSettings";
const { log } = require('@repo/kwe-lib/components/logHelper');

export const useGetData = (searchParam: any, queryNm:any, queryFn: any, option?: any) => {
    // log('useGetData', queryFn, searchParam)
    const user_id = useUserSettings((state) => state.data.user_id);
    const ipaddr = useUserSettings((state) => state.data.ipaddr);

    const params = {
      ...searchParam,
      user_id: user_id,
      ipaddr: ipaddr
    }

    const { isLoading, data, isError, refetch, remove } = useQuery([queryNm, params], queryFn, {...option});
    return { data, isLoading, isError, refetch, remove }
  };