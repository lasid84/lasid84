// QueryClient 인스턴스를 전역으로 관리하는 파일 생성
// import { executFunction } from '@/services/api.services'
import { useUserSettings } from '@/states/useUserSettings';
// import { usePathname } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query'
import { executeKREAMFunction, executeTMSFunction } from '@/services/api/apiClient';
import { log } from '@repo/kwe-lib-new';


export const queryClient = async (key: string, Params: any, options: any = {}): Promise<any[]> => {  
    // const path = usePathname() + "/";
    const { user_id, ipaddr } = useUserSettings.getState().data;
    const { schema = 'kream'} = options
    
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 0, // 0분 ->  데이터가 신선하다고 간주되는 시간. 이 시간 동안은 재요청을 하지 않음
                cacheTime: 1000 * 60 * 0, // 0분 -> 데이터가 캐시에 남아 있는 시간. 이 시간 동안 사용되지 않으면 캐시에서 제거됨.
                ...options
            },
        },
    })
  
    const param = {
        ...Params,
        user_id: user_id,
        ipaddr: ipaddr
    }    
    // QueryKey 생성
    const queryKey = [key, param];

    try {
        // 캐시된 데이터 확인
        const cachedData = queryClient.getQueryData<any[]>(queryKey)
        if (cachedData) {
            return cachedData
        }

        const data = await queryClient.fetchQuery<any>({
            queryKey,
            queryFn: async () => {
                const result = schema == 'kream' 
                        ? await executeKREAMFunction(param) : await executeTMSFunction(param)
                return result
            },
        });

        return data || [];

    } catch (error) {
        console.error('Error fetching apple data:', error)
        throw error
    }
}
