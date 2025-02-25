import { SP_GetCustChargeData, SP_GetCustDetailData, SP_GetLoad, SP_SetCustDetailData, SP_SetRTFToHtml } from "./data";
import { gridData, ROW_CHANGED } from "@/components/grid/ag-grid-enterprise";
import { createStore } from "@/states/createStore";
import { useUserSettings } from "@/states/useUserSettings";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';
import { createRef } from "react";

// StoreState 정의
interface StoreState {
    cust_mode: string | null,
    searchParams: Record<string, any>;
    loadDatas: gridData[] | null;  /* 0: 거래처코드, 1: Province, 2: Loc_type */ 
    selectedCustData: Record<string, any> | null;
    custDetailData: Record<string, any>;
    dtdChargeData: gridData | null;
    dtdChargeRateData: Record<string, any> | null;
    fhChargeData: gridData | null;
    fhChargeRateData: Record<string, any> | null;
    selectedTab: string;
    selectedCharge: string | null;
    gridRef: {
        refCustCont: any
        refAgencyCont: any
        refDTDCustCharge: any
        refFHCustCharge: any
    }
}

// StoreActions 정의
interface StoreActions {
    getLoad: () => Promise<any[]> | undefined;
    getCustDetailDatas: (params: any) => Promise<any>;
    setCustDetailDatas: (params: any) => Promise<any> | null;
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
    cust_mode: null,
    searchParams: {},
    loadDatas: null,
    selectedTab: 'NM',
    selectedCustData: null,
    custDetailData: {},
    selectedCharge: null,
    gridRef: {
        refCustCont: createRef(),
        refAgencyCont: createRef(),
        refDTDCustCharge: createRef(),
        refFHCustCharge: createRef()
    },
    dtdChargeData: null,
    dtdChargeRateData: {},
    fhChargeData: null,
    fhChargeRateData: {}
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
            
            let convertedDTDData: any = {};
            for (const row of result[2]?.data) {
                let data: { [key: string]: any } = {};
                let col = ''
                for (const [key, val] of Object.entries(row)) {
                    if (key === 'data_key') {
                        col = val as string;
                    } else {
                        data[key] = val as string;
                    }
                }

                convertedDTDData[col] = data;
            }

            let convertedFHData:any = {};
            for (const row of result[4]?.data) {
                let data: { [key: string]: any } = {};
                let col = ''
                for (const [key, val] of Object.entries(row)) {
                    if (key === 'data_key') {
                        col = val as string;
                    } else {
                        data[key] = val;
                    }
                }

                convertedFHData[col] = data;
            }
            log("convertedDTDData", convertedDTDData);
            set({ 
                custDetailData: result[0]?.data[0],
                dtdChargeData: result[1],
                dtdChargeRateData: convertedDTDData,
                fhChargeData: result[3],
                fhChargeRateData: convertedFHData,
            });
            return result;
        },
        setCustDetailDatas: async (params: any) => {
            const { custDetailData, dtdChargeRateData, gridRef, selectedCustData } = get();
            const { refDTDCustCharge } = gridRef; /* To Do */ //FH도 추가 예정
                
            type UpdateData = {
                t_cust_d: Record<string, any>;
                // t_cust_charge: Record<string, any>[];
                t_cust_charge_rate: Record<string, any> | null;
            }
            
            let hasData = false;
        
            /* 데이터 변경 체크 */
            if (params) {
                for (const [key, val] of Object.entries(custDetailData)) {
                    if ((params[key] || '') !== (val as string).trim()) {
                        hasData = true;
                        log("hasData!", key, val, params[key]);
                        break;
                    }
                }
            }
            log("updatedData1", hasData, params);
            if (!hasData && dtdChargeRateData?.[ROW_CHANGED]) hasData = true;
        
            const updatedData: UpdateData = {
                t_cust_d: {...params},
                t_cust_charge_rate: dtdChargeRateData
            };
        
            log("updatedData2", hasData, JSON.stringify(updatedData));
            /////db 저장 추가
            if (hasData) {
                const params = {
                    jsonData: JSON.stringify(updatedData)
                }
                const result = await SP_SetCustDetailData(params);
                // return result;
                set({selectedCustData: {...selectedCustData}})
            }
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
