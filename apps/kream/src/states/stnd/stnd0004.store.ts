import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { PopType } from "utils/modal"

export interface Stnd0004Type {
    code: string | undefined,
    kor: string | undefined,
    eng: string | undefined,
    jpn: string | undefined,
    remark: string | undefined,
}

export const initStndValue: Stnd0004Type = {
    code: '',
    kor: '',
    eng: '',
    jpn: '',
    remark: '',
}


type Stnd0004Store = {
    isPopOpen: boolean,
    // targetValue : TargetValueType,
    popType: string;
    popData: any;
    actions: {
        // setTargetValue: (payload: Partial<TargetValueType>) => void;
        setPopOpen: (isPopOpen: boolean, popType?: string) => void;
        setPopData: (payload: Partial<Stnd0004Type>) => void;
    }
}

const stnd0004Store = (set: any) => ({
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
        setPopData: (payload: Partial<Stnd0004Type>) => {
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

export const useStnd0004Store = create<Stnd0004Store>()(
    process.env.NODE_ENV !== "production" ? devtools(stnd0004Store) : stnd0004Store
)