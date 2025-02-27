import { SP_GetCustChargeData, SP_GetCustDetailData, SP_GetLoad, SP_SetCustDetailData, SP_SetRTFToHtml } from "./data";
import { gridData, ROW_CHANGED } from "@/components/grid/ag-grid-enterprise";
import { createStore } from "@/states/createStore";
import { useUserSettings } from "@/states/useUserSettings";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';
import { createRef } from "react";

// StoreState 정의
interface StoreState {
    cust_code: string | null,
    cust_mode: string | null,
    searchParams: Record<string, any>;
    loadDatas: gridData[] | null;                   /* load 프로시저 참조조 */ 
    selectedCustData: Record<string, any> | null;
    custDetailData: Record<string, any>;            // t_cust_d
    dtdExtraData: Record<string, any>;              // t_cust_d_extra
    dtdChargeData: gridData | null;                 
    // dtdChargeRateData: Record<string, any> | null;  // t_cust_charge_rate
    fhChargeData: gridData | null;
    fhChargeRateData: Record<string, any> | null;   // t_cust_charge_rate
    fhExtraData: Record<string, any>;               // t_cust_d_extra
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

export const pages = ['MAIN_PAGE','DTD_PAGE','FH_PAGE','RATE_PAGE'];

// initValue 정의
const initValue: StoreState = {
    cust_code: null,
    cust_mode: null,
    searchParams: {},
    loadDatas: null,
    selectedTab: pages[0],
    selectedCustData: null,
    custDetailData: {},
    selectedCharge: null,
    gridRef: {
        refCustCont: createRef(),
        refAgencyCont: createRef(),
        refDTDCustCharge: createRef(),
        refFHCustCharge: createRef()
    },
    dtdExtraData: {},
    dtdChargeData: null,
    // dtdChargeRateData: {},
    fhExtraData: {},
    fhChargeData: null,
    fhChargeRateData: {}
};


const setinitValue = (set: any, get: any) => {
    const actions: StoreActions = {
        getLoad: async () => {
            const { searchParams } = get();
            const result = await SP_GetLoad();
            set({ loadDatas: result, selectedCustCode: null, selectedTab: pages[0] });
            return result;
        },
        getCustDetailDatas: async (params: any) => {
            const result = await SP_GetCustDetailData(params);
            
            // let convertedDTDData: any = {};
            // for (const row of result[2]?.data) {
            //     let data: { [key: string]: any } = {};
            //     let col = ''
            //     for (const [key, val] of Object.entries(row)) {
            //         if (key === 'data_key') {
            //             col = val as string;
            //         } else {
            //             data[key] = val as string;
            //         }
            //     }

            //     convertedDTDData[col] = data;
            // }

            // let convertedFHData:any = {};
            // for (const row of result[4]?.data) {
            //     let data: { [key: string]: any } = {};
            //     let col = ''
            //     for (const [key, val] of Object.entries(row)) {
            //         if (key === 'data_key') {
            //             col = val as string;
            //         } else {
            //             data[key] = val;
            //         }
            //     }

            //     convertedFHData[col] = data;
            // }
            // log("result", result)
            set({ 
                selectedCustData: result[5].data[0],
                custDetailData: result[0]?.data[0] || {},
                dtdExtraData: result[6]?.data[0] || {},
                dtdChargeData: result[1],
                // dtdChargeRateData: convertedDTDData,
                fhExtraData: result[7]?.data[0] || {},
                fhChargeData: result[3],
                // fhChargeRateData: convertedFHData,
            });
            return result;
        },
        setCustDetailDatas: async (params: any) => {
            const { custDetailData, dtdExtraData, fhExtraData, dtdChargeData, gridRef, selectedCustData } = get();
            const { refDTDCustCharge } = gridRef; /* To Do */ //FH도 추가 예정pnpm
                
            type UpdateData = {
                t_cust_d: Record<string, any>;
                t_cust_d_extra: Record<string, any>[];
                // t_cust_charge: Record<string, any>[];
                t_cust_charge_rate: Record<string, any> | null;
            }

            let updatedData: UpdateData = {
                t_cust_d: {},
                t_cust_d_extra: [],
                t_cust_charge_rate: []
            }
            
            let hasData = false;
        
            /* 데이터 변경 체크 */
            if (params) {
                for (const [key, val] of Object.entries(custDetailData)) {
                    // log("custDetailData", key, val, params);
                    if (params[key] !== undefined && params[key] && (params[key] || '').trim() !== (val as string).trim()) {
                        hasData = true;
                        // log("hasData!", key, val, params[key]);
                        updatedData = {
                            ...updatedData,
                            t_cust_d: {...params},
                        }
                        break;
                    }
                }
                
                for (const [key, val] of Object.entries(dtdExtraData)) {
                    // log('dtd',params, key, val)
                    if (params[key] !== undefined && (params[key] || '').trim() !== (val as string || '').trim()) {
                        hasData = true;
                        // log("hasData!", key, val, params[key]);
                        updatedData.t_cust_d_extra.push(dtdExtraData);
                        updatedData = {
                            ...updatedData,
                            t_cust_d_extra: updatedData.t_cust_d_extra,
                        }
                        break;
                    }
                }

                /* FH 추가시 중복되는 컬럼명 해결 필요 */
                // for (const [key, val] of Object.entries(fhExtraData)) {
                //     // log('fh',params, key, val)
                //     if (params[key] && (params[key] || '').trim() !== (val as string || '').trim()) {
                //         hasData = true;
                //         log("hasData!", key, val, params[key]);
                //         updatedData.t_cust_d_extra.push(fhExtraData);
                //         updatedData = {
                //             ...updatedData,
                //             t_cust_d_extra: updatedData.t_cust_d_extra,
                //         }
                //         break;
                //     }
                // }
            }
            
            /* Grid의 변경 값을 store(dtdChargeData)에 반영 */
            const saveCols = ['ab_charge', 'ab_vendor_id', 'rv_charge', 'rv_vendor_id'];
            await refDTDCustCharge.current.api.forEachNode(async (node: any) => {
                const data = node.data;

                if (data[ROW_CHANGED]) {
                    const charge_type = data['charge_type'];
                    
                    for (const row of dtdChargeData.data) {
                        if (row['charge_type'] === charge_type) {
                            saveCols.forEach(col => row[col] = data[col]);
                            row[ROW_CHANGED] = true;
                            break;
                        }
                    }
                }
            });
            
            const updatedChargeData: Record<string, any>[] = [];
            for (const row of dtdChargeData.data) {
                if (row[ROW_CHANGED]) {
                    updatedChargeData.push(row);
                }
            }

            if (updatedChargeData.length) {
                hasData = true;
                updatedData = {
                    ...updatedData,
                    t_cust_charge_rate: updatedChargeData
                }
            }
    
            /////db 저장 추가
            if (hasData) {
                const data = {
                    jsonData: JSON.stringify(updatedData)
                }
                // log("hasData ", updatedData, data);
                const result = await SP_SetCustDetailData(data);
                await get().actions.getCustDetailDatas(params);
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
