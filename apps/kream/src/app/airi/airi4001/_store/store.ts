import { createStore } from "@/states/createStore";
import { RefObject } from 'react';
import { SP_Load, SP_GetDTDMainData,  SP_SaveData,SP_SaveDTDDetail, SP_SaveUploadData,SP_GetDTDDetailData, SP_GetDTDDetailData2 } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";

export const AmountInputOptions = {
    type: "number",
    textAlign: "right",
    limit: 9,
    isAllowDecimal: true,
    decimalLimit: 0,
    noLabel: true,
    disableSpacing : true,
    fontSize: 'base',        //Font Size (xs, sm, base, lg, xl, 2xl......)
    fontWeight: 'bold',   
    // freeStyles : 'max-w-32',   //Font Weight (thin, extralight, ligth, normal, medium, semibold, bold ......)
    // outerClassName : 'h-8'
}
export const AmountInputOptions_g = {
    type: "number",
    textAlign: "center",
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
    currentRow : Record<string, any> | null;
    detailSelectedRow: Record<string, any> | null; //detailDatas가 맞아보임.
    detailSelectedRow_AB: Record<string, any> | null; //detailDatas가 맞아보임.   
    popup: Record<string, any>;
    loadDatas: gridData[];
    allData:any[] 
}

interface StoreActions {
        getLoad : () => Promise<any>;
        setExcelDatas : (params: any) => Promise<any> | undefined;
        updateExcelDatas : (params:any) => Promise<any> | undefined;
        getDTDDatas: (params: any) => Promise<any> | undefined;
        getDTDDetailDatas: (params: any) => Promise<any> | undefined;   
        setPopup: (popup: Partial<StoreState['popup']>) => void; 
        setState: (newState: Partial<StoreState>) => void;
        updatePopup : (popup: Partial<StoreState['popup']>) =>void;
        setMainSelectedRow : (row:any) => void;
        setDetailSelectedRow : (row:any) => void;
        setDetailSelectedRow_AB : (row:any) => void;
        setCurrentRow : (row:any)=>void;
        setDetailData: (data: any[]) => void;
        saveDTDData : (data:SaveDataArgs)=> Promise<any>;
        saveDTDDetailData : (data:SaveDataArgs)=> Promise<any>;
        saveUploadData : (data:SaveDataArgs)=>void;
        updateData : (data:SaveDataArgs) =>void;
        updateRowData: (rowIndex: number, updatedRow: any) => void;    
}

type Store = StoreState & {
    actions : StoreActions;
}
type SaveDataArgs = {
    jsondata: string; 
    settlement_date? : string;
  };
const initValue: StoreState = {
    searchParams: {
        fr_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
        to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
        no: '', // HWB, 
        state:  'ALL',
    },
    uiData : {
        settlement_date : dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
    },
    mainDatas: { data: {}, fields:{} },     //DB
    detailDatas : {data:{}, fields:{} },
    allData:[],
    mainSelectedRow: null,                  //GRID
    currentRow : null,                      //GRID(invoice 참조)
    detailSelectedRow: null,
    detailSelectedRow_AB: null,
    excel_data :{ data: {}, fields:{} },
    uploadFile_init : false,
    gridRef_Main : null,
    popup: {
        popType : null,
        isPopupUploadOpen : false,
        isPopupOpen : false,
    },   
    loadDatas:[]
}

const setinitValue = (set:any) => {
    const actions : StoreActions = {
            getLoad: async () => {
                const result = await SP_Load();
                set({ loadDatas: result });
                return result;
            },
            setExcelDatas: async (uploadData: any) => {
                set({excel_data: uploadData})           
                return uploadData;
            },
            updateExcelDatas: async (uploadData: any) => {
                set({excel_data: uploadData})
                return uploadData;
            },
            getDTDDatas: async (params: any) => {
                const result = await SP_GetDTDMainData(params);
                set({ mainDatas: result });
                return result;
            },
            getDTDDetailDatas: async (params: any) => {
                const result = await SP_GetDTDDetailData2(params);
                // console.log('result.data[0]',result?.data[0])
                //console.log('result.data[0]', result?.[0]?.data?.[0], result?.[1]?.data?.[0]);
                set((state:any) => ({
                    ...state,
                    detailSelectedRow: { ...result?.[0]?.data?.[0] }, // 새 객체로 할당
                    detailSelectedRow_AB: { ...result?.[1]?.data?.[0] }, // 새 객체로 할당
                    // detailDatas : result
                  }));
                return result;
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
            setDetailSelectedRow: (row:any) =>{
                set((state:StoreState) => ({ ...state, detailSelectedRow: row }))
            },
            setDetailSelectedRow_AB: (row:any) =>{
                set((state:StoreState) => ({ ...state, detailSelectedRow_AB: row }))
            },
            setCurrentRow: (row:any) =>{
                set((state:StoreState) => ({ ...state, currentRow: row }))
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
            saveDTDData: async (params: any) :Promise<any> => { //undefined
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
            saveDTDDetailData: async (params: any) :Promise<any> => { //undefined
                try {
                    console.log("curDAta", params);
                    const result = await SP_SaveDTDDetail(params); // API 호출
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
            // updateMainSelectedRow : (row:any)=>{
            //     set((state:StoreState) => ({ ...state, mainSelectedRow: row }))
            // },
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
        

    };

    return {
        ...initValue,
        actions 
    } as Store;
}

export const useCommonStore = createStore<Store>(setinitValue);
