import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import moment from "moment";



export interface SearchParamType {
    trans_mode: string | undefined,
    trans_type: string | undefined,
    office_cd: string | undefined,
    fr_date: string | undefined,
    to_date: string | undefined,
    fr_inv_date: string | undefined,
    to_inv_date: string | undefined,
    invoice_no: string | undefined,
    cust_code: string | undefined,
    issue_or: string | undefined,
    no : string | undefined,
    use_yn : string | undefined,
    house_bl_no : string | undefined,
    billing_or : string | undefined,
}

const { start_date, end_date } = getInitDate();

export function getInitDate() {
    const currentDate = moment();
    const startDate = currentDate.clone().subtract(30, "days").format("YYYY-MM-DD");
    return {
        end_date: currentDate.format("YYYY-MM-DD") || 'yyyy-mm-dd',
        start_date: startDate || 'yyyy-mm-dd',
    };
}


export const initSearchValue: SearchParamType = {
    trans_mode: 'ALL',
    trans_type: 'ALL',
    office_cd: 'ALL',
    fr_date: start_date,
    to_date: end_date,
    fr_inv_date: '',
    to_inv_date: '',
    invoice_no: '',
    cust_code: '',
    issue_or: 'COD',
    no : '',
    use_yn : '',
    house_bl_no  :'',
    billing_or  :'',
}


export const initInvoiceCheckValue = {
    selectedTranType: '',
    selectedTranMode: '',
    selectedFrdate: moment().format("YYYY-MM-DD"),
    selectedTodate: moment().format("YYYY-MM-DD"),
    //invoice_no :'',    
    userInfo: {
        selected_code: '',
    },
    popUpData: {
        isSkuOpen: false,
    },
    searchParam: {
        trans_mode: '',
        trans_type: '',
        fr_date: moment().format("YYYY-MM-DD"),
        to_date: moment().format("YYYY-MM-DD"),
        fr_inv_date: '',
        to_inv_date: '',
        invoice_no: '',
        cust_code: '',
        no : '',
        user_id : '',
    },
}

type InvoiceCheckStore = {
    searchParam: SearchParamType,
    actions: {
        setSearchParam: (payload: Partial<SearchParamType>) => void;
        //setUserInfo: (payload: Partial<InvoiceCheckUserInfo>) => void;
        //setPopUpData: (payload: Partial<InvoiceCheckPopUpType>) => void;
        setInit: () => void;
        // setInitWithOutUserInfo: () => void;        
    }
}



const invoiceStore = ((set: any) => ({
    searchParam: initSearchValue,
    actions: {
        setSearchParam: (payload: Partial<SearchParamType>) => {
            set((state: any) => {
                state.searchParam = { ...state.searchParam, ...payload };
                return { ...state, searchParam: { ...state.searchParam } };
            });
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