import { useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { executFunction } from "@/services/api.services";

export interface returnData {
    cursorData: []
    numericData: number;
    textData: string;
}

export const getData = async () => {
    const Param = ""
    const params = {
        inparam: ["in_user", "in_ipaddr"],
         invalue: ['doni.lee', ''],
         inproc: 'public.f_stnd0001_get_user'
    }
    const result = await executFunction(params);
    return result;
}

// GetData hooks
export const useGetData = () => {
    const { isInitialLoading, data, isError } = useQuery(["getData_stnd0001"], getData)
    return { isInitialLoading, data, isError }
}


