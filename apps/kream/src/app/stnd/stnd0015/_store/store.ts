import { SP_GetLoad, SP_GetMainData, SP_SetMainData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import { createStore } from "@/states/createStore";
import { useUserSettings } from "@/states/useUserSettings";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';

// StoreState 정의
interface StoreState {
    searchParams: Record<string, any>;
    loadDatas: gridData[] | null;  /* 0: 거래처코드, 1: Province, 2: Loc_type */ 
    mainDatas: gridData | null;
    mainSelectedRow: Record<string, any> | null;
}

// StoreActions 정의
interface StoreActions {
    getLoad: () => Promise<any[]> | undefined;
    getMainDatas: (params: any) => Promise<any>;
    setMainDatas: (params: any) => Promise<any>;
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
    
    // log("trans_mode, trans_type", currentParams, trans_mode, trans_type)

    return {
        search_cust_code: null,
        // trans_mode: trans_mode,
        // trans_type: trans_type,
        // 임시조치 - stephen
        trans_mode: 'A',
        trans_type: 'I',
    }
};

// initValue 정의
const initValue: StoreState = {
    searchParams: getInitialSearchParams(),
    loadDatas: null,
    mainDatas: null,
    mainSelectedRow: null,
};


const setinitValue = (set: any, get: any) => {
    const actions: StoreActions = {
        getLoad: async () => {
            const result = await SP_GetLoad();
            set({ loadDatas: result });
            return result;
        },
        getMainDatas: async (params: any) => {
            const result = await SP_GetMainData(params);
            set({ mainDatas: result});
            return result;
        },
        setMainDatas: async (params: any) => {
            const result = await SP_SetMainData(params);
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
