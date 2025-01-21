import { SP_GetAppleMainData, SP_GetLoad, SP_SaveAirTracker, SP_SaveP5S1, SP_SetAppleMainData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";
import { createStore } from "@/states/createStore";
import { toastError } from "components/toast";
import { t } from "i18next";
import { callUnipass } from "@/services/api/apiClient";
import { useUserSettings } from "@/states/useUserSettings";
import { DataRoutes } from "@/services/api.constants";
import { log } from "@repo/kwe-lib-new";

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
    insExcelData: (params: any) => Promise<any[] | undefined>;
    getUnipassData: (params: any) => Promise<void>;
    resetSearchParam: () => void;
    resetStore: () => void;
    setState: (newState: Partial<StoreState>) => void;
}

// Store 타입 정의
type Store = StoreState & {
    actions: StoreActions;
};

const getInitialSearchParams = () => ({
    fr_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
    to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
    search_gubn: '0',
    no: '', // HWB, MWB
    state: 'ALL',
});

// initValue 정의
const initValue: StoreState = {
    searchParams: getInitialSearchParams(),
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

            return result;
        },
        getUnipassData: async (params: {blyy:string, blno:string}) => {
            
            //1000개 BL로 쪼개서 unipass 호출
            const arrBLNo = params.blno.split(" ");
            const groupedArray = arrBLNo.reduce<string[]>((acc, curr, index) => {
                if (index % 1000 === 0) {
                  acc.push(curr); // 새로운 그룹 시작
                } else {
                  acc[acc.length - 1] += ` ${curr}`; // 현재 그룹에 추가
                }
                return acc;
              }, []);            
            
            groupedArray.forEach(async blno => {
                const body = {
                    blYy:params.blyy,
                    hblNo:blno,
                    user_id: useUserSettings.getState().data.user_id
                  }
                  
                  let result = await callUnipass(DataRoutes.URI.GET_CARG_CSCL_PRGS_INFO_QRY, body);
                  
                  if (result.status !== 200) {
                    toastError(result);
                  }
            });
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
