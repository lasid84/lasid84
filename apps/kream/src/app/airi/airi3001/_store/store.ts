import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { RefObject } from 'react';
import { SP_GetAppleMainData, SP_GetEDIDetailData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";
import { SP_UpdateData } from "@/app/acct/acct1004/_component/data";

interface StoreState {
    searchParams: Record<string, any>;
    mainDatas: gridData | null;
    detailDatas : gridData ;
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
        getAppleDatas: (params: any) => Promise<any> | undefined;
        getAppleDetailDatas: (params: any) => Promise<any> | undefined;
        updateAppleDatas : (params:any) => Promise<any> | undefined;
        setPopup: (popup: Partial<StoreState['popup']>) => void; 
        setState: (newState: Partial<StoreState>) => void;
        updatePopup : (popup: Partial<StoreState['popup']>) =>void;
        setMainSelectedRow : (row:any) => void;
        setDetailData: (data: any[]) => void;
        updateRowData: (rowIndex: number, updatedRow: any) => void;
    }
}

type Store = (set: any) => StoreState;
const initValue: Store = (set : any) => ({
    searchParams: {
        fr_date: dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"),
        to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
        search_gubn: 0,
        no: '', // HWB, MWB
        state:  'ALL',
    },    
    mainDatas: { data: {}, fields:{} },
    detailDatas : {data:{}, fields:{} },
    mainSelectedRow: null,
    excel_data :{},
    uploadFile_init : false,
    gridRef_Detail : null,
    popup: {
        popType : null,
        isPopupUploadOpen : false,
        isPopupOpen : false,
    },
    actions: {
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