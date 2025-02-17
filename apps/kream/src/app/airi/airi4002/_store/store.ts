import { RefObject } from 'react';
import { createStore } from "@/states/createStore";
import { SP_GetTransportData, assignDTDItem, SP_GetLoad } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";

export const AmountInputOptions = {
    type: "number",
    textAlign: "right",
    limit: 9,
    isAllowDecimal: true,
    decimalLimit: 0,
    noLabel: true,
}
export const AmountInputOptions_g = {
    type: "number",
    textAlign: "right",
    limit: 9,
    isAllowDecimal: true,
    decimalLimit: 0,
}


interface StoreState {
    searchParams: Record<string, any>;
    uiData: Record <string, any>;
    mainDatas: gridData | null;
    detailDatas : gridData ;
    uploadFile_init : false
    excel_data : {}
    gridRef_Main : RefObject<{
        api: {
          getAllGridColumns: () => any[];
        };
      }>  | null,
    mainSelectedRow: Record<string, any> | null;
    popup: Record<string, any>;
}

interface StoreActions{    
        getLoad: (searchParams : Partial<StoreState>) => void;
        getTransportDatas: (params: any) => Promise<any> | undefined;
        setPopup: (popup: Partial<StoreState['popup']>) => void; 
        setState: (newState: Partial<StoreState>) => void;
        updatePopup : (popup: Partial<StoreState['popup']>) =>void;
        setMainSelectedRow : (row:any) => void;
        resetSearchParam: () => void;
        resetStore  :() => void;
        assignDTDItem : (data:SaveDataArgs)=> Promise<any>;
        updateRowData: (rowIndex: number, updatedRow: any) => void;    
}

type Store = StoreState & {
    actions : StoreActions;
}
type SaveDataArgs = {
    jsondata: string; 
    settlement_date? : string;
  };

  const initValue : StoreState = {
    searchParams: {
        fr_date: dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"),
        to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
        search_gubn : 0,
        no: '', // HWB, MWB
        settlement_user:  'ALL',
        logis_id:  'ALL',
        broker_id:  'ALL',
    },
    uiData : {
        settlement_date : dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
    },
    mainDatas: { data: {}, fields:{} },
    detailDatas : {data:{}, fields:{} },
    mainSelectedRow: null,
    excel_data :{ data: {}, fields:{} },
    uploadFile_init : false,
    gridRef_Main : null,
    popup: {
        popType : null,
        isPopupUploadOpen : false,
        isPopupOpen : false,
    },
  }

const setinitValue =  (set : any) => {    
    const actions : StoreActions = {
        getLoad: async (searchParams:any) => {
            const result = await SP_GetLoad(searchParams);
            console.log("load");
            set({ loadDatas: result });
            return result;
        },
        getTransportDatas: async (params: any) => {
            const result = await SP_GetTransportData(params);
            set({ mainDatas: result });
            return result;
        },
        setPopup: (popup: any) => {
            set((state: any) => ({             
                popup: { ...state.popup, popup } 
            }))
        },
        setState: (newState: Partial<StoreState>) => {
            set((state: StoreState) => ({
            ...state,
            ...newState,
        }))},
        updatePopup: (updates:any) =>
        set((state:any) => ({
        popup: { ...state.popup, ...updates }, // 기존 popup 상태에 updates 병합
        })),
        setMainSelectedRow: (row:any) =>{
            set((state:StoreState) => ({ ...state, mainSelectedRow: row }))
        },
        resetSearchParam: () => {
            set({ searchParams: {...initValue.searchParams}});
        },
        resetStore : () => {
            set({ ...initValue });
        },
        assignDTDItem: async (params: any) :Promise<any> => { 
            try {
                const result = await assignDTDItem(params); // API 호출 
                set((state: StoreState) => ({
                    ...state,
                    mainDatas: { ...state.mainDatas, ...params },
                }));                
                return result
            } catch (error) {
                return error;
            }            
        },
        // 특정 행 업데이트
        updateRowData: (rowIndex, updatedRow) => 
            set((state:any) => {
                const updatedData = [...state.gridData];
                updatedData[rowIndex] = { ...updatedData[rowIndex], ...updatedRow };
                return { gridData: updatedData };
            }),
    };

    return {
        ...initValue,
        actions
    } as Store;
}



export const useCommonStore = createStore<Store>(setinitValue);
