const { log } = require('@repo/kwe-lib/components/logHelper');
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CHANGE_SEARCH_PARAM, Acct2003Load } from "./data";

export const useGetData = (searchParam: any) => {
    log('searchParam', searchParam)
    const { isLoading, data, isError } = useQuery(["Acct2003Load", searchParam], Acct2003Load);
    return { data, isLoading, isError }
  }