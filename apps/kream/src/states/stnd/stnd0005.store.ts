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

export const initSearchParam: SearchParamType = {
    grp_cd: 'ALL',
}

export interface SearchParamType  {
    grp_cd : string | undefined,
}

type Stnd0005Store = {
    searchParam : SearchParamType,
    isPopOpen: boolean,
    popType: string;
    popData: any;
    actions: {
        setSearchParam:  (payload: Partial<SearchParamType>) => void;
        setPopOpen: (isPopOpen: boolean, popType?: string) => void;
        setPopData: (payload: Partial<Stnd0005Type>) => void;
    }
}

const stnd0005Store = (set: any) => ({
    searchParam: initSearchParam,
    isPopOpen: false,
    popType: PopType.CREATE,
    popData: {},
    actions: {
        setSearchParam: (payload: Partial<SearchParamType>) => {
            set((state: any) => {
                state.searchParam = { ...state.searchParam, ...payload };
                return { ...state, searchParam: { ...state.searchParam } };
            });
        },
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
    },
})

export const useStnd0005Store = create<Stnd0005Store>()(
    process.env.NODE_ENV !== "production" ? stnd0005Store : stnd0005Store
)