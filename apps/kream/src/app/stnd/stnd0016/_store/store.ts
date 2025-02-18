import { SP_GetCustChargeData, SP_GetCustDetailData, SP_GetLoad, SP_SetCustDetailData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import { createStore } from "@/states/createStore";
import { useUserSettings } from "@/states/useUserSettings";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';

// StoreState 정의
interface StoreState {
    searchParams: Record<string, any>;
    loadDatas: gridData[] | null;  /* 0: 거래처코드, 1: Province, 2: Loc_type */ 
    custChargeDatas: gridData | null;
    selectedCustData: Record<string, any> | null;
    custDetailData: Record<string, any>;
    selectedTab: string;
    selectedCharge: string | null;
}

// StoreActions 정의
interface StoreActions {
    getLoad: () => Promise<any[]> | undefined;
    getCustDetailDatas: (params: any) => Promise<any>;
    setCustDetailDatas: (params: any) => Promise<any> | null;
    getCustChargeDatas: (params: any) => Promise<any>;
    resetSearchParam: () => void;
    resetStore: () => void;
    setState: (newState: Partial<StoreState>) => void;
}

// Store 타입 정의
type Store = StoreState & {
    actions: StoreActions;
};

const getInitialSearchParams = () => {
    // const { currentParams } = useUserSettings.getState().data;
    // const { trans_mode, trans_type} = getMenuParameters(currentParams);
    
    return {
        search_cust_code: null,
    }
};

// initValue 정의
const initValue: StoreState = {
    searchParams: getInitialSearchParams(),
    loadDatas: null,
    selectedTab: 'NM',
    custChargeDatas: null,
    selectedCustData: null,
    custDetailData: {},
    selectedCharge: null
};


const setinitValue = (set: any, get: any) => {
    const actions: StoreActions = {
        getLoad: async () => {
            const { searchParams } = get();
            const result = await SP_GetLoad();
            set({ loadDatas: result, searchParams: {...searchParams, ...initValue.searchParams}, selectedCustData: null,});
            return result;
        },
        getCustDetailDatas: async (params: any) => {
            const result = await SP_GetCustDetailData(params);
            set({ custDetailData: result[0].data[0] });
            return result;
        },
        setCustDetailDatas: async (params: any) => {
            const result = await SP_SetCustDetailData(params);
            return result;
        },
        getCustChargeDatas: async (params: any) => {
            const result = await SP_GetCustChargeData(params);
            set({ custChargeDatas: result[0]});
            return result;
        },
        resetSearchParam: () => {
            set({ searchParams: {...initValue.searchParams}});
        },
        resetStore: () => {
            set({ ...initValue });
        },
        setState: (newState: Partial<StoreState>) => set((state: StoreState) => ({
            ...state,
            ...newState,
        })),
    };

    return {
        ...initValue,
        actions,
    } as Store;
};

export const useCommonStore = createStore<Store>(setinitValue);
