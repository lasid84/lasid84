import { SP_GetLoad, SP_GetMainData,SP_GetDetailData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import { createStore } from "@/states/createStore";
import { useUserSettings } from "@/states/useUserSettings";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';

// StoreState 정의
interface StoreState {
    searchParams: Record<string, any>;
    loadDatas: gridData[] | null;  /* 0: 거래처코드, 1: Province, 2: Loc_type */ 
    mainDatas: gridData | null;
    detailDatas: gridData | null;
    mainSelectedRow: Record<string, any> | null;
}

// StoreActions 정의
interface StoreActions {
    getLoad : () => Promise<any>;
    getMainDatas: (params: any) => Promise<any>;
    getDetailDatas: (params: any) => Promise<any>;
    resetSearchParam: () => void;
    resetStore: () => void;
    setState: (newState: Partial<StoreState>) => void;
}

// Store 타입 정의
type Store = StoreState & {
    actions: StoreActions;
};

// initValue 정의
const initValue: StoreState = {
    searchParams: {},
    loadDatas: null,
    mainDatas: null,
    detailDatas:null,
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
        getDetailDatas: async (params: any) => {
            const result = await SP_GetDetailData(params);
            log('retailDataresult',result)
            set({ detailDatas : result});
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
