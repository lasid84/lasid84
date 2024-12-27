import { SP_GetAppleMainData, SP_GetLoad, SP_SaveAirTracker, SP_SaveP5S1, SP_SetAppleMainData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";
import { createStore } from "@/states/createStore";
import { toastError } from "components/toast";
import { t } from "i18next";

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
    getLoad: () => Promise<any[]> | undefined;
    getAppleDatas: (params: any) => Promise<any>;
    setAppleDatas: (params: any) => Promise<any>;
    insExcelData: (params: any) => Promise<void>;
    resetSearchParam: () => void;
    resetStore: () => void;
    setState: (newState: Partial<StoreState>) => void;
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
        search_gubn: 0,
        no: '', // HWB, MWB
        state: 'ALL',
    },
    loadDatas: null,
    mainDatas: null,
    mainSelectedRow: null,
    popup: {},
};


const setinitValue = (set: any) => {
    const actions: StoreActions = {
        getLoad: async () => {
            const result = await SP_GetLoad();
            set({ loadDatas: result });
            return result;
        },
        getAppleDatas: async (params: any) => {
            const result = await SP_GetAppleMainData(params);
            set({ mainDatas: result, searchParams:params });
            return result;
        },
        setAppleDatas: async (params: any) => {
            const result = await SP_SetAppleMainData(params);
            // set({ mainDatas: result, searchParams:params });
            // return result;
        },
        insExcelData: async (params: any) => {
            let result;

            if (params.file.name.toLowerCase().includes("p5s1")) {
                result = await SP_SaveP5S1(params);
            } else if (params.file.name.toLowerCase().includes("air tracker")) {
                result = await SP_SaveAirTracker(params);
            } else {
                toastError(t("MSG_0190")); //KWE Daily Air Tracker와 P5S1 파일만 업로드하세요
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
