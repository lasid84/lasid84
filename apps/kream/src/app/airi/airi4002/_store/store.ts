import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { RefObject } from 'react';
import { SP_GetTransportData, SP_GetEDIDetailData, SP_SaveData, SP_SaveUploadData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";
import { SP_UpdateData } from "@/app/acct/acct1004/_component/data";


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
    actions: {
        setExcelDatas : (params: any) => Promise<any> | undefined;
        getTransportDatas: (params: any) => Promise<any> | undefined;
        getAppleDetailDatas: (params: any) => Promise<any> | undefined;
        updateAppleDatas : (params:any) => Promise<any> | undefined;
        setPopup: (popup: Partial<StoreState['popup']>) => void; 
        setState: (newState: Partial<StoreState>) => void;
        updatePopup : (popup: Partial<StoreState['popup']>) =>void;
        setMainSelectedRow : (row:any) => void;
        setDetailData: (data: any[]) => void;
        saveData : (data:SaveDataArgs)=> Promise<any>;
        saveUploadData : (data:SaveDataArgs)=>void;
        updateData : (data:SaveDataArgs) =>void;
        updateRowData: (rowIndex: number, updatedRow: any) => void;
    }
}

type Store = (set: any) => StoreState;
type SaveDataArgs = {
    jsondata: string; 
    settlement_date? : string;
  };
const initValue: Store = (set : any) => ({
    searchParams: {
        fr_date: dayjs().subtract(5, "days").startOf("days").format("YYYYMMDD"),
        to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
        search_gubn : 0,
        no: '', // HWB, MWB
        state:  'ALL',
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
    actions: {
        setExcelDatas: async (uploadData: any) => {
            console.log('__________________params1111',uploadData)
            set({excel_data: uploadData})           
            return uploadData;
        },
        updateExcelDatas: async (uploadData: any) => {
            console.log('__________________params',uploadData)
            set({excel_data: uploadData})
            return uploadData;
        },
        getTransportDatas: async (params: any) => {
            const result = await SP_GetTransportData(params);
            set({ mainDatas: result });
            return result;
        },
        getAppleDetailDatas : async (params : any) => {
            const result = await SP_GetEDIDetailData(params);
            set({ detailDatas: result });
            return result;
        },
        updateAppleDatas : async (params:any) => {
            console.log('updateAppleDatas params', params)
        },
        setPopup: (popup: any) => {
            set((state: any) => ({             
                popup: { ...state.popup, popup } 
            }))
        },
        updatePopup: (updates:any) =>
            set((state:any) => ({
            popup: { ...state.popup, ...updates }, // 기존 popup 상태에 updates 병합
        })),
        setState: (newState: Partial<StoreState>) => {
            console.log('newState', newState)
            set((state: StoreState) => ({
            ...state,
            ...newState,
        }))},
        setMainSelectedRow: (row:any) =>{
            set((state:StoreState) => ({ ...state, mainSelectedRow: row }))
        },
        saveUploadData: async (params: any) => {
            try {
                const result = await SP_SaveUploadData(params); // API 호출
                set((state: StoreState) => ({
                    ...state,
                    mainDatas: { ...state.mainDatas, ...params },
                }));
                console.log("Data saved successfully", result);
                return result
            } catch (error) {
                console.error("Error saving data:", error);
            }
        },
        saveData: async (params: any) :Promise<any> => { //undefined
            try {
                console.log("", params);
                const result = await SP_SaveData(params); // API 호출
                set((state: StoreState) => ({
                    ...state,
                    mainDatas: { ...state.mainDatas, ...params },
                }));
                console.log("Data saved successfully", result);
                
                return result
            } catch (error) {
                console.error("Error saving data:", error);
                return error;
            }            
        },
        updateData : async (params : any ) => {
            try {
                const result = await SP_SaveData(params); // API 호출
                set((state: StoreState) => ({
                    ...state,
                    mainDatas: { ...state.mainDatas, ...params },
                }));
                console.log("Data saved successfully", result);
            } catch (error) {
                console.error("Error saving data:", error);
            }
        },
        updateMainSelectedRow : (row:any)=>{
            set((state:StoreState) => ({ ...state, mainSelectedRow: row }))
        },
        // 상태 업데이트
        setDetailData: (data: any[]) => set(() => 
            ({detailDatas: data})        
        ),
        // 특정 행 업데이트
        updateRowData: (rowIndex, updatedRow) => 
            set((state:any) => {
                const updatedData = [...state.gridData];
                updatedData[rowIndex] = { ...updatedData[rowIndex], ...updatedRow };
                return { gridData: updatedData };
            }),
    },
})

export const Store = create<StoreState>()(
    process.env.NODE_ENV !== "production" ? devtools(initValue) : initValue
)