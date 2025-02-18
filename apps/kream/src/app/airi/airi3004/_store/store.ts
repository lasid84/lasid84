import { SP_GetOperationListData, SP_UpdateOperationListData, SP_SetMileStoneEdiData, SP_getMilestoneInterfaceData, SP_GetOperationListLoadData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";
import { createStore } from "@/states/createStore";

// StoreState 정의
interface StoreState {
    searchParams: Record<string, any>;
    loadDatas: gridData[] | null;
    mainDatas: gridData | null;
    mainSelectedRow: Record<string, any> | null;
    popup: Record<string, any>;
}

// StoreActions 정의
interface StoreActions {
    getOperationListData: (fr_date: string, waybill_no?: string) => Promise<any>;
    setPopupOpen: (isOpen: boolean) => void;
    updateOperationListData: (params: any) => Promise<any>;
    setMilestoneEdiData: (params: any) => Promise<any>;
    getMilestoneInterfaceData: (params: any) =>Promise<any>;
}

// Store 타입 정의
type Store = StoreState & {
    actions: StoreActions;
};

// initValue 정의
const initValue: StoreState = {
    searchParams: {
        fr_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
        to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
        no: '' // HWB, MWB
    },
    loadDatas: null,
    mainDatas: null,
    mainSelectedRow: null,
    popup: {
        isOpen: false
    }
};

const setinitValue = (set: any) => {
    const actions: StoreActions = {
        getOperationListData: async (fr_date: string, waybill_no?: string) => {
            const mainData = await SP_GetOperationListData(fr_date, waybill_no);
            const loadData = await SP_GetOperationListLoadData();
            set({ mainDatas: mainData[0], loadDatas: loadData });
        },
        setPopupOpen: (isOpen: boolean) => {
            set((state: any) => ({
                popup: { ...state.popup, isOpen }
            }))
        },
        updateOperationListData: async (param: any) => {
            await SP_UpdateOperationListData(param);
        },
        setMilestoneEdiData: async (param: any) => {
            await SP_SetMileStoneEdiData(param);
        },
        getMilestoneInterfaceData: async (param: any) => {
            const result = await SP_getMilestoneInterfaceData(param);
            return result[0].data;
        }
    };

    return {
        ...initValue,
        actions,
    } as Store;
};

export const useCommonStore = createStore<Store>(setinitValue);
