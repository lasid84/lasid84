// import { SP_GetAppleMainData, SP_GetLoad, SP_SaveAirTracker } from "./data";
// import { gridData } from "@/components/grid/ag-grid-enterprise";
// import dayjs from "dayjs";
// import { createStore } from "@/states/createStore";

// interface StoreState {
//     searchParams: Record<string, any>;
//     loadDatas: gridData[] | null;
//     mainDatas: gridData | null;
//     mainSelectedRow: Record<string, any> | null;
//     popup: Record<string, any>;
    
// }

// interface StoreActions {
//     actions: {
//         getLoad: () => Promise<any> | undefined;
//         getAppleDatas: (params: any) => Promise<any> | undefined;
//         insAirTracker: (params: any) => Promise<any> | undefined;
//         resetStore: () => void;
//         // setPopup: (popup: Partial<StoreState['popup']>) => void; 
//         setState: (newState: Partial<StoreState>) => void;
        
//     }
// }

// type Store = (set: any) => (StoreState & StoreActions);
// // type Store = (set: any) => StoreState & {
// //     actions: StoreActions;
// // };

// const initValue: StoreState = {
//     searchParams: {
//         fr_date: dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"),
//         to_date: dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
//         search_gubn: 0,
//         no: '', // HWB, MWB
//         state:  'ALL',
//     },
//     loadDatas: null,
//     mainDatas: null,
//     mainSelectedRow: null,
//     popup: {},
// }

// const setinitValue: Store = (set : any) => ({
//     ...initValue,
//     actions: {
//         getLoad: async () => {
//             const result = await SP_GetLoad();
//             set({ loadDatas: result });
//             return result;
//         },
//         getAppleDatas: async (params: any) => {
//             const result = await SP_GetAppleMainData(params);
//             set({ mainDatas: result });
//             return result;
//         },
//         insAirTracker: async (params: any) => {
//             const result = await SP_SaveAirTracker(params);
//             // set({ mainDatas: result });
//             return result;
//         },
//         resetStore: async () => {
//             set((state: any) => ({
//                 ...initValue,
//                 actions: state.actions,
//             }));
//         },
//         // setPopup: (popup: any) => set((state: any) => ({ 
//         //     popup: { ...state.popup, ...popup } 
//         // })),
//         setState: (newState: Partial<StoreState>) => set((state: StoreState) => ({
//             ...state,
//             ...newState,
//         })),
//     },
// })

// export const useCommonStore = createStore<StoreState & StoreActions>(setinitValue);


import { SP_GetAppleMainData, SP_GetLoad, SP_SaveAirTracker } from "./data";
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
    getLoad: () => Promise<any[]> | undefined;
    getAppleDatas: (params: any) => Promise<any>;
    insAirTracker: (params: any) => Promise<void>;
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
        fr_date: dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"),
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

// setinitValue 함수에서 actions의 타입을 StoreActions로 정확히 맞추기
const setinitValue = (set: any) => {
    // actions 객체 생성
    const actions: StoreActions = {
        getLoad: async () => {
            const result = await SP_GetLoad();
            set({ loadDatas: result });
            return result;
        },
        getAppleDatas: async (params: any) => {
            const result = await SP_GetAppleMainData(params);
            set({ mainDatas: result });
            return result;
        },
        insAirTracker: async (params: any) => {
            const result = await SP_SaveAirTracker(params);
            // 상태 업데이트는 필요 시 추가
            // set({ mainDatas: result });
            return result;
        },
        resetStore: () => {
            set({ ...initValue });
        },
        setState: (newState: Partial<StoreState>) => set((state: StoreState) => ({
            ...state,
            ...newState,
        })),
    };

    // actions 객체가 StoreActions 타입에 맞는지 체크하고, Store 반환
    return {
        ...initValue,
        actions, // actions는 이제 StoreActions 타입에 맞게 설정됨
    } as Store;
};

export const useCommonStore = createStore<Store>(setinitValue);
