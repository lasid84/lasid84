import { useQuery } from "@tanstack/react-query"
import {AxiosResponse} from "axios"
import {ApiService} from '../../../api/service/api.service'

export interface returnData {
    cursorData: []
    numericData: number;
    textData: string;
}

export const getData = () => {
    const Param = ""
    const inparam = ["in_user", "in_ipaddr"]
    const invalue = ['doni.lee', '']
    const inproc = 'public.f_stnd0001_get_user'
    return ApiService.post<AxiosResponse>(`/api/data`, { inproc, inparam, invalue })
}

// GetData hooks
export const useGetData = () => {
    const { isInitialLoading, data, isError } = useQuery(["getData_stnd0001"], getData)
    return { isInitialLoading, data, isError } 
}


