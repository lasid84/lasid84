import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { RefObject } from 'react';
import { SP_GetAppleMainData, SP_GetEDIDetailData, SP_GetExcelCustomsData, SP_InsExcelCustomsData, SP_Load } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";
import { log } from "@repo/kwe-lib-new";

interface StoreState {
    searchParams: Record<string, any>;
    loadDatas: gridData[] | null;
    mainDatas: gridData | null;
    detailDatas : gridData ;
    excelDatas: gridData | null;
    uploadFile_init : false
    excel_data : {}
    gridRef_Detail : RefObject<{
        api: {
          getAllGridColumns: () => any[];
        };
      }>  | null,
    mainSelectedRow: Record<string, any> | null;
    popup: Record<string, any>;
    actions: {
        getLoad: () => Promise<any>;
        getAppleDatas: (params: any) => Promise<any> | undefined;
        getAppleDetailDatas: (params: any) => Promise<any> | undefined;
        updateAppleDatas : (params:any) => Promise<any> | undefined;
        getExcelCustomsData: (params:any) => Promise<any[]> | undefined;
        insExcelCustomsData: (params:any) => Promise<any> | undefined;
        setPopup: (popup: Partial<StoreState['popup']>) => void; 
        setState: (newState: Partial<StoreState>) => void;
        updatePopup : (popup: Partial<StoreState['popup']>) =>void;
        setMainSelectedRow : (row:any) => void;
        setDetailData: (data: any[]) => void;
        updateRowData: (rowIndex: number, updatedRow: any) => void;
    }
}

type Store = (set: any) => StoreState;

const getInitialSearchParams = () => ({
    fr_date: dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"),
    to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
    search_gubn: 0,
    no: '', // HWB, MWB
    state:  'ALL',
});

const initValue: Store = (set : any) => ({
    searchParams: getInitialSearchParams(),
    mainDatas: { data: [], fields:[] },
    loadDatas: null,
    detailDatas : {data:[], fields:[] },
    excelDatas: {data:[], fields:[] },
    mainSelectedRow: null,
    excel_data :{},
    uploadFile_init : false,
    gridRef_Detail : null,
    popup: {
        isPopupUploadOpen : false,
        isPopupDetailOpen : false,
    },
    actions: {
        getLoad: async () => {
            const result = await SP_Load();
            set({ loadDatas: result });
            return result;
        },
        getAppleDatas: async (params: any) => {
            const result = await SP_GetAppleMainData(params);
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
        getExcelCustomsData : async (params : any) => {
            const result = await SP_GetExcelCustomsData(params);
            set({ excelDatas : result[0]});
            return result;
        },
        insExcelCustomsData : async (params : any) => {
            log("insExcelCustomsData", params);
            const result = await SP_InsExcelCustomsData(params);
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
            set((state: StoreState) => ({
            ...state,
            ...newState,
        }))},
        setMainSelectedRow: (row:any) =>{
            set((state:StoreState) => ({ ...state, mainSelectedRow: row }))
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