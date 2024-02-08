import { useQuery } from "@tanstack/react-query"
import axios, { AxiosResponse } from "axios"


export interface returnData {
    cursorData: []
    numericData: number;
    textData: string;
}

export const getData = () => {
    const Param = ""
    const inparam = ["in_user", "in_ipaddr"]
    const invalue = ['doni.lee', '']
    const inproc = 'public.f_stnd0004_get_languagesetlist'
    return ApiService.post<AxiosResponse>(`/api/data`, { inproc, inparam, invalue })
}

// GetData hooks
export const useGetData = () => {
    const { isLoading, data, isError } = useQuery(["getData_stnd0004"], getData)
    return { isLoading, data, isError }
}


// 기본 API 서비스
export const ApiService = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});
