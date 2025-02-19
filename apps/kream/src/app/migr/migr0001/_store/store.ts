import { SP_GetLoad, SP_SetRTFToHtml } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';
import { createStore } from "@/states/createStore";

// StoreState 정의
interface StoreState {
    loadDatas: gridData[] | null;  /* 0: 거래처코드, 1: Province, 2: Loc_type */ 
}

// StoreActions 정의
interface StoreActions {
    getLoad: () => Promise<any[]> | undefined;
    setFTFToHtml: (params: any) => Promise<any>;
    resetStore: () => void;
    setState: (newState: Partial<StoreState>) => void;
}

// Store 타입 정의
type Store = StoreState & {
    actions: StoreActions;
};

// initValue 정의
const initValue: StoreState = {
    loadDatas: null
};


const setinitValue = (set: any, get: any) => {
    const actions: StoreActions = {
        getLoad: async () => {
            const { searchParams } = get();
            const result = await SP_GetLoad();
            set({ loadDatas: result, selectedCustData: null });
            return result;
        },
        setFTFToHtml: async (params: any) => {
            const result = await SP_SetRTFToHtml(params);
            return result;
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
