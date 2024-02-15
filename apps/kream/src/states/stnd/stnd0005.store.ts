import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { PopType } from "utils/modal"

export interface Stnd0005Type {
    grp_cd: string | undefined,
    grp_cd_nm: string | undefined,
    cd: string | undefined,
    cd_nm: string | undefined,
    cd_desc: string | undefined,
    remark: string | undefined,
    cd_mgcd1: string | undefined,
    cd_mgcd2: string | undefined,
    use_yn: string | undefined,
}

export const initStndValue: Stnd0005Type = {
    grp_cd: '',
    grp_cd_nm: '',
    cd: '',
    cd_nm: '',
    cd_desc: '',
    remark: '',
    cd_mgcd1: '',
    cd_mgcd2: '',
    use_yn: '',
}


type Stnd0005Store = {
    isPopOpen: boolean,
    // targetValue : TargetValueType,
    popType: string;
    popData: any;
    actions: {
        // setTargetValue: (payload: Partial<TargetValueType>) => void;
        setPopOpen: (isPopOpen: boolean, popType?: string) => void;
        setPopData: (payload: Partial<Stnd0005Type>) => void;
    }
}

const stnd0005Store = (set: any) => ({
    isPopOpen: false,
    popType: PopType.CREATE,
    popData: {},
    actions: {
        setPopOpen: (isOpen: boolean, popType = PopType.CREATE) => {
            set((state: any) => {
                state.isPopOpen = isOpen;
                state.popType = popType;
                return { ...state }
            })
        },
        setPopData: (payload: Partial<Stnd0005Type>) => {
            set((state: any) => {
                return { ...state, popData: { ...payload } }
            })
        }
        // setTargetValue: (payload: Partial<TargetValueType>) => {
        //     set((state: any) => {
        //         state.targetValue = { ...state.targetValue, ...payload };
        //         return { ...state, targetValue: { ...state.targetValue } }
        //     })
        // },
    },
})

export const useStnd0004Store = create<Stnd0005Store>()(
    process.env.NODE_ENV !== "production" ? devtools(stnd0005Store) : stnd0005Store
)