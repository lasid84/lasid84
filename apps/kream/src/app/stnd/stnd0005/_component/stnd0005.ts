import { useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { ApiService } from '../../../api/service/api.service'
import { SearchParamType } from "@/states/stnd/stnd0005.store"
export interface returnData {
    cursorData: []
    numericData: number;
    textData: string;
}

export const LoadData = () => {
    const inparam = ["in_user", "in_ipaddr"]
    const invalue = ['doni.lee', '10.33.33.96']
    const inproc = 'public.f_stnd0005_load'
    return ApiService.post<AxiosResponse>(`/api/data`, { inproc, inparam, invalue })
}


export const getData = () => {
    //const Param = ""
    const inparam = ["in_grp_cd", "in_user", "in_ipaddr"]
    const invalue = ['ALL', 'doni.lee', '10.33.33.96']
    const inproc = 'public.f_stnd0005_get_codesetlist'
    return ApiService.post<AxiosResponse>(`/api/data`, { inproc, inparam, invalue })
}
export const getData1 = (obj:any) => {
    const Param = obj.queryKey[1]
    console.log('form@@@@@@@@@@@@@@@@@@@@@Schema::',Param)
    const inparam = ["in_grp_cd", "in_user", "in_ipaddr"]
    const invalue = [Param.grp_cd, 'doni.lee', '10.33.33.96']
    const inproc = 'public.f_stnd0005_get_codesetlist'
    return ApiService.post<AxiosResponse>(`/api/data`, { inproc, inparam, invalue })
}

// GetData hooks
export const useGetData = () => {
    const { isInitialLoading, data, isError } = useQuery(["getData_stnd0005"], getData)
    return { isInitialLoading, data, isError }
}

// GetData hooks
export const useGetData1 = (searchParam:SearchParamType) => {
    console.log('formSchemffa::',searchParam)
    const { isInitialLoading, data, isError } = useQuery(["getData_stnd0005",searchParam], getData1)
    return { isInitialLoading, data, isError }
}

// LoadData hooks
export const useLoadData = () => {
    const { isInitialLoading, data, isError } = useQuery(["LoadData_stnd0005"], LoadData)
    return { isInitialLoading, data, isError }
}



