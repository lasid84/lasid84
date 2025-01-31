import { SP_GetOperationListData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";
import { createStore } from "@/states/createStore";
import { toastError } from "components/toast";
import { t } from "i18next";
import { useUserSettings } from "@/states/useUserSettings";

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
    },
};


const setinitValue = (set: any) => {
    const actions: StoreActions = {
        getOperationListData: async (fr_date: string, waybill_no?: string) => {
            const result = await SP_GetOperationListData(fr_date, waybill_no);
            set({ mainDatas: result[0] });
            return result[0];
        },
        setPopupOpen: (isOpen: boolean) => {
            set((state: any) => ({
                popup: { ...state.popup, isOpen }
            }))
        }
    };

    return {
        ...initValue,
        actions,
    } as Store;
};

export const useCommonStore = createStore<Store>(setinitValue);
