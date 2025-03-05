import { SP_GetCustChargeData, SP_GetCustDetailData, SP_GetLoad, SP_GetTransportFee, SP_SetCustDetailData, SP_SetRTFToHtml, SP_SetTransportFee } from "./data";
import { SP_InsertData as SP_InsCustCont, SP_UpdateData as SP_UpdCustCont } from "components/commonForm/customerContact/_component/data";
import { gridData, ROW_CHANGED, ROW_TYPE_NEW } from "@/components/grid/ag-grid-enterprise";
import { createStore } from "@/states/createStore";
import { useUserSettings } from "@/states/useUserSettings";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';
import { createRef } from "react";
import { RowNode } from "ag-grid-community";

// StoreState 정의
interface StoreState {
    cust_code: string | null,
    cust_mode: string | null,
    searchParams: Record<string, any>;
    loadDatas: gridData[] | null;                   /* load 프로시저 참조조 */ 
    selectedCustData: Record<string, any> | null;
    chargeTypeSeq: Record<string, any>;      // Charge항목 순서서
    custDetailData: Record<string, any>;            // t_cust_d
    dtdExtraData: Record<string, any>;              // t_cust_d_extra
    dtdChargeData: gridData | null;                 
    fhChargeData: gridData | null;
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
    getTransportFee: (params: any) => Promise<gridData>;
    setTransportFee: (params: any) => Promise<any> | null;
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
    chargeTypeSeq: [],
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
    fhExtraData: {},
    fhChargeData: null,
};


const setinitValue = (set: any, get: any) => {
    const actions: StoreActions = {
        getLoad: async () => {
            const { searchParams, selectedTab } = get();
            const result = await SP_GetLoad();
            set({
                loadDatas: result,
                chargeTypeSeq: result[7].data,
                cust_code: null,
                selectedTab: pages[0]
            });
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
            const { refDTDCustCharge, refCustCont, refAgencyCont } = gridRef; /* To Do */ //FH도 추가 예정pnpm

            type UpdateData = {
                t_cust_d: Record<string, any>;
                t_cust_d_extra: Record<string, any>[];
                // t_cust_charge: Record<string, any>[];
                t_cust_charge_rate: Record<string, any> | null;
                t_cust_cont: Record<string, any>[];
            };

            let updatedData: UpdateData = {
                t_cust_d: {},
                t_cust_d_extra: [],
                t_cust_charge_rate: [],
                t_cust_cont: []
            };

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
                            t_cust_d: { ...params },
                        };
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
                        };
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

            /* 고객, 대행사 연락처 저장 */
            const updatedCont: RowNode[] = [];

            refCustCont.current.api.forEachNode(async (node: RowNode) => {
                let data = node.data;

                for (const [col, val] of Object.entries(data)) {
                    const colInfo = refCustCont.current.api.getColumnDef(col);
                    if (colInfo?.cellEditor === 'agCheckboxCellEditor') {
                        data[col] = val ? "Y" : "N";
                    }
                }

                if (data[ROW_CHANGED]) {
                    updatedCont.push(data);
                    data[ROW_CHANGED] = false;
                }
            });
            refAgencyCont.current.api.forEachNode(async (node: RowNode) => {
                let data = node.data;

                for (const [col, val] of Object.entries(data)) {
                    const colInfo = refAgencyCont.current.api.getColumnDef(col);
                    if (colInfo?.cellEditor === 'agCheckboxCellEditor') {
                        data[col] = val ? "Y" : "N";
                    }
                }

                if (data[ROW_CHANGED]) {
                    updatedCont.push(data);
                    data[ROW_CHANGED] = false;
                }
            });

            if (updatedCont.length) {
                hasData = true;
                updatedData = {
                    ...updatedData,
                    t_cust_cont: updatedCont
                };

                refAgencyCont?.current?.api.redrawRows();
                refCustCont?.current?.api.redrawRows();
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
                };
            }

            /////db 저장 추가
            if (hasData) {
                const data = {
                    jsonData: JSON.stringify(updatedData)
                };
                const result = await SP_SetCustDetailData(data);
                await get().actions.getCustDetailDatas(params);
            }
        },
        getTransportFee: async (params: any) => {
            const result = await SP_GetTransportFee(params);
            return result[0];
        },
        setTransportFee: async (params: any) => {
            const { custDetailData, dtdExtraData, fhExtraData, dtdChargeData, gridRef, selectedCustData } = get();
            const { refDTDCustCharge, refCustCont, refAgencyCont } = gridRef; /* To Do */ //FH도 추가 예정pnpm

            const result = await SP_SetTransportFee(params);
            
        },
        resetSearchParam: () => {
            set({ searchParams: { ...initValue.searchParams } });
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
