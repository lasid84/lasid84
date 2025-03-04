import { createStore } from "@/states/createStore";
import { RefObject } from 'react';
import { SP_Load, SP_GetDTDMainData,  SP_SaveData,SP_CloseDate,SP_SaveDomesticINVDetail,SP_GetDTDDetailDatas, SP_SaveUploadData, } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";



export const sumFields = [
    "air_freight",
    "bl_handling",
    "bonded_wh",
    "customs_clearance",
    "customs_duty",
    "dispatch_fee",
    "special_handling",
    "dtd_handling",
    "trucking",
    "insurance_fee",
    "other_1",
    "other_2",
  ] as const;

  export  const profitFields = [
    "customs_tax_profit",
    "bonded_wh_profit",
    "dispatch_fee_profit",
    "customs_clearance_profit",
    "dtd_handling_profit",
    "special_handling_profit",
    "trucking_profit",
    "air_freight_profit",
    "bl_handling_profit",
    "insurance_fee_profit",
    "other_1_profit",
    "other_2_profit",
  ] as const;
  
  export const sumCostFields = [
    "air_freight_ab",
    "bl_handling_ab",
    "bonded_wh_ab",
    "customs_clearance_ab",
    "customs_duty_ab",
    "dispatch_fee_ab",
    "special_handling_ab",
    "dtd_handling_ab",
    "trucking_ab",
    "insurance_fee_ab",
    "other_1_ab",
    "other_2_ab",
  ] as const;


  export const sumVatFields = [
    // "air_freight",
    "bl_handling_vat",
    "bonded_wh_vat",
    "customs_clearance_vat",
    "customs_tax",
    "dispatch_fee_vat",
    "special_handling_vat",
    "dtd_handling_vat",
    "trucking_vat",
    "other_1_vat",
    "other_2_vat",
  ] as const;

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
    freeStyles : "!text-right",   //Font Weight (thin, extralight, ligth, normal, medium, semibold, bold ......)
    // outerClassName : 'h-8'
}
export const AmountInputOptions_g = {
    type: "number",
    textAlign: "center",
    limit: 9,
    isAllowDecimal: true,
    decimalLimit: 0,
}

export const Category = {
    RV : "RV",
    AB : "AB"
}

interface StoreState {
    searchParams: Record<string, any>;
    uiData: Record <string, any>;
    mainDatas: gridData | null;
    detailDatas : gridData ;
    closing : string;
    detailIndex : number ;
    detailRVDatas : Record<string, any> | null;
    detailABDatas : Record<string, any> | null;
    uploadFile_init : false
    excel_data : {}
    gridRef_Main : RefObject<{
        api: {
          getAllGridColumns: () => any[];
        };
      }>  | null,
    mainSelectedRow: Record<string, any> | null;
    currentRow : Record<string, any> | null;
    // detailSelectedRow: Record<string, any> | null; //detailDatas가 맞아보임.
    // detailSelectedRow_AB: Record<string, any> | null; //detailDatas가 맞아보임.   
    popup: Record<string, any>;
    loadDatas: gridData[];
    allData:any[] 
}

interface StoreActions {
        getLoad : () => Promise<any>;
        setExcelDatas : (params: any) => Promise<any> | undefined;
        updateExcelDatas : (params:any) => Promise<any> | undefined;
        getDTDDatas: (params: any) => Promise<any> | undefined;
        getDomesticDetailDatas: (params: any) => Promise<any> | undefined;   
        setUiData: (popup: Partial<StoreState['popup']>) => void; 
        setState: (newState: Partial<StoreState>) => void;
        setSearchState: (newState: Partial<StoreState>) => void;
        updatePopup : (popup: Partial<StoreState['popup']>) =>void;
        setMainSelectedRow : (row:any) => void;
        setDetailRVDatas : (row:any) => void;
        updateDetailRVField  :  (detailDatas: any, key: number, field: string, value: any)=>void;
        setDetailABDatas : (row:any) => void;
        setDetailIndex : (index:any)=>void;
        setCurrentRow : (row:any)=>void;
        saveDomesticInvData : (data:SaveDataArgs)=> Promise<any>;
        updDTDCloseDate : (data:SaveDataArgs)=> Promise<any>;
        saveDomesticINVDetailDatas : (data:SaveDataArgs)=> Promise<any>;
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
        settlement_user:  'ALL',
        logis_id:  'ALL',
        broker_id:  'ALL',
        dtd_fh:  'ALL',
    },
    closing : '2', //마감완료상태
    detailIndex : 0,
    uiData : {
        settlement_date : dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
        isCollapsed : false,
    },
    mainDatas: { data: {}, fields:{} },     //DB
    detailDatas : {data:{}, fields:{} },
    detailABDatas : null,
    detailRVDatas : null,
    allData:[],
    mainSelectedRow: null,                  //GRID
    currentRow : null,                      //GRID(invoice 참조)
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
                console.log('wayparams', params)
                const result = await SP_GetDTDMainData(params);
                set({ mainDatas: result });
                return result;
            },
            getDomesticDetailDatas: async (params: any) => {
                const result = await SP_GetDTDDetailDatas(params);
                set((state:any) => ({
                    ...state,
                    detailRVDatas: { ...result?.[0]?.data }, 
                    detailABDatas: { ...result?.[1]?.data }, 
                  }));
                return result;
            },
            setUiData: (uidata: any) => {
                set((state: any) => ({             
                    uiData: { ...state.uiData, ...uidata } 
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
            setSearchState: (newState: Partial<StoreState>) => {
                console.log('newState', newState)
                set((state: StoreState) => ({
                    searchParams : { ...state.searchParams, 
                    ...newState } 
            }))},
            setMainSelectedRow: (row:any) =>{
                set((state:StoreState) => ({ ...state, mainSelectedRow: row }))
            },
            setDetailRVDatas: (row:any) =>{
                set((state:StoreState) => ({ ...state, detailRVDatas: row }))
            },
            //특정 field업데이트
            updateDetailRVField : (detailRVDatas: any, key: number, field: string, value: any) => {
                if (!detailRVDatas[key]) {
                  return detailRVDatas;
                }               
                    const updatedData = {
                        ...detailRVDatas,
                        [key]: {
                        ...detailRVDatas[key],
                        [field]: value,
                        },
                    };
                    set((state:StoreState) => ({ ...state, detailRVDatas: updatedData }))
              },
            setDetailABDatas: (row:any) =>{
                set((state:StoreState) => ({ ...state, detailABDatas: row }))
            },
            setDetailIndex: (index:any) =>{
                set((state:StoreState) => ({ ...state, detailIndex: index }))
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
                }
            },
            updDTDCloseDate: async (params: any) :Promise<any> => { //undefined
                try {
                    const result = await SP_CloseDate(params); // API 호출
                    set((state: StoreState) => ({
                        ...state,
                        mainDatas: { ...state.mainDatas, ...params },
                    }));
                    // console.log("Data updated successfully", result);
                    return result
                } catch (error) {
                    return error;
                }            
            },
            saveDomesticInvData: async (params: any) :Promise<any> => { //ag-grid domestic invoice 저장
                try {                    
                    const result = await SP_SaveData(params); // API 호출
                    set((state: StoreState) => ({
                        ...state,
                        mainDatas: { ...state.mainDatas, ...params },
                    }));
                    // console.log("Data saved successfully", result);
                    
                    return result
                } catch (error) {
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
                    return error
                }
            },
            saveDomesticINVDetailDatas: async (params: any) :Promise<any> => { //DetailDatas 저장
                try {
                    const result = await SP_SaveDomesticINVDetail(params); // API 호출                
                    return result
                } catch (error) {
                    return error;
                }            
            },
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
