import { SP_GetCustChargeData, SP_GetCustDetailData, SP_GetLoad, SP_SetCustDetailData, SP_SetRTFToHtml } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import { createStore } from "@/states/createStore";
import { useUserSettings } from "@/states/useUserSettings";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';
import { createRef } from "react";

// StoreState 정의
interface StoreState {
    trans_mode: string | null,
    trans_type: string | null,
    searchParams: Record<string, any>;
    loadDatas: gridData[] | null;  /* 0: 거래처코드, 1: Province, 2: Loc_type */ 
    custChargeDatas: gridData | null;
    selectedCustData: Record<string, any> | null;
    custDetailData: Record<string, any>;
    selectedTab: string;
    selectedCharge: string | null;
    gridRef: {
        refCustCont: any
        refAgencyCont: any
    }
}

// StoreActions 정의
interface StoreActions {
    getLoad: () => Promise<any[]> | undefined;
    getCustDetailDatas: (params: any) => Promise<any>;
    setCustDetailDatas: (params: any) => Promise<any> | null;
    getCustChargeDatas: (params: any) => Promise<any>;
    setFTFToHtml: (params: any) => Promise<any>;
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
    trans_mode: null,
    trans_type: null,
    searchParams: {},
    loadDatas: null,
    selectedTab: 'NM',
    custChargeDatas: null,
    selectedCustData: null,
    custDetailData: {},
    selectedCharge: null,
    gridRef: {
        refCustCont: createRef(),
        refAgencyCont: createRef(),
    }
};


const setinitValue = (set: any, get: any) => {
    const actions: StoreActions = {
        getLoad: async () => {
            const { searchParams } = get();
            const result = await SP_GetLoad();
            set({ loadDatas: result, selectedCustData: null });
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
        setFTFToHtml: async (params: any) => {
            const result = await SP_SetRTFToHtml(params);
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
