import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import moment from "moment";

const { start_date, end_date } = getInitDate();

export function getInitDate() {
    const currentDate = moment();
    const startDate = currentDate.clone().subtract(30, "days").format("YYYY-MM-DD");
    return {
        end_date: currentDate.format("YYYY-MM-DD") || 'yyyy-mm-dd',
        start_date: startDate || 'yyyy-mm-dd',
    };
}
export interface SearchParamType {
    no : string | undefined,
}
 
export interface TargetValueType {
    no : string | undefined,
    invoice_list : string | undefined,
}

export const initTargetValue : TargetValueType = {
    no : '',
    invoice_list : '',
}

export const initSearchValue: SearchParamType = {
    no : '',
}


export const initInvoiceCheckValue = {
    userInfo: {
        selected_code: '',
    },
    popUpData: {
        isSkuOpen: false,
    },
    searchParam: {
        no : '',
    },
}

type InvoiceCheckStore = {
    searchParam: SearchParamType,
    targetValue : TargetValueType,
    actions: {
        setSearchParam: (payload: Partial<SearchParamType>) => void;
        setTargetValue: (payload: Partial<TargetValueType>) => void;
        //setPopUpData: (payload: Partial<InvoiceCheckPopUpType>) => void;
        setInit: () => void;
        // setInitWithOutUserInfo: () => void;        
    }
}

const invoiceStore = ((set: any) => ({
    targetValue : initTargetValue,
    searchParam: initSearchValue,
    actions: {
        setSearchParam: (payload: Partial<SearchParamType>) => {
            set((state: any) => {
                state.searchParam = { ...state.searchParam, ...payload };
                return { ...state, searchParam: { ...state.searchParam } };
            });
        },
        setTargetValue : (payload : Partial<TargetValueType>)=> {
            set((state :any)=>{
                state.targetValue = {...state.targetValue, ...payload};
                return {...state, targetValue : {...state.targetValue}}
            })
        },
        // setUserInfo: (payload: Partial<InvoiceCheckUserInfo>) => {
        //     set((state: any) => {
        //         state.userOptions = { ...state.userOptions, ...payload }
        //         return { ...state, userOptions: { ...state.userOptions } }
        //     })
        // },
        // setPopUpData: (payload: Partial<InvoiceCheckPopUpType>) => {
        //     set((state: any) => {
        //         state.invoiceCheckStore.popUpData = { ...state.invoiceCheckStore.popUpData, ...payload }
        //         return { ...state, invoiceCheckStore: { ...state.invoiceCheckStore } }
        //     })
        // },
        setInit: () => {
            set((state: any) => {
                return { ...state, invoiceCheckStore: { ...initInvoiceCheckValue } }
            })
        },
    }
}))

export const useInvoiceStore = create<InvoiceCheckStore>()(
    process.env.NODE_ENV !== "production" ? devtools(invoiceStore) : invoiceStore
)