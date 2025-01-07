import { SP_GetGridSettingLoad, SP_GetPersonalColInfoData, SP_SetGridInfoData } from "./data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import dayjs from "dayjs";
import { createStore } from "@/states/createStore";

// StoreState 정의
interface StoreState {
    loadDatas: gridData[] | null;
    mainDatas: gridData | null;
    selectedID: string | null;
    currentPath: string;
    isPopupGridSettingOpen: boolean;
}

// StoreActions 정의
interface StoreActions {
    getLoad: (path: string) => Promise<any[]> | undefined;  // 화면 Load 데이터
    getGridSettingDatas: () => void;                        // 유저별 그리드 설정 데이터 조회
    setGridInfo: (params: any) => void;                     // 그리드 설정 데이터 수정
    setSelectedGridID: (id: string) => void;                // CustomSelect 선택 데이터(그리드 ID)
    setGridSettingPopUp: (isOpen: boolean) => void;         // 팝업 여부
    setState: (newState: Partial<StoreState>) => void;
}

// Store 타입 정의
type Store = StoreState & {
    actions: StoreActions;
};

// initValue 정의
const initValue: StoreState = {
    loadDatas: null,
    mainDatas: null,
    selectedID: 'gridMaster',
    currentPath: '',
    isPopupGridSettingOpen: false,    
};


const setinitValue = (set: any, get: any) => {
    const actions: StoreActions = {
        getLoad: async (path) => {
            const param = {
                path : path,
            }
            const result = await SP_GetGridSettingLoad(param);
            set({ currentPath: path, loadDatas: result });
            return result;
        },
        getGridSettingDatas: async () => {
            const currentState = get();
            const params = {
                path: currentState.currentPath,
                id: currentState.selectedID
            }
            const result = await SP_GetPersonalColInfoData(params);
            set({ mainDatas: result });
        },
        setGridInfo: async (params) => {
            const currentState = get();
            params = {
                ...params,
                path: currentState.currentPath,
                id: currentState.selectedID
            }
            const result = await SP_SetGridInfoData(params);
        },
        setSelectedGridID: (id) => {
            set({selectedID: id});
        },
        setGridSettingPopUp: (isOpen: boolean) => {
            set({ isPopupGridSettingOpen: isOpen });
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
