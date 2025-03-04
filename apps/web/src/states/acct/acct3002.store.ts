import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import moment from "moment";



export interface SearchParamType {
    trans_mode: string | undefined,
    trans_type: string | undefined,
    no : string | undefined,
    fr_date: string | undefined,
    to_date: string | undefined,
    cust_code: string | undefined,
    sale_buy:string | undefined,
    issue_or: string | undefined,
    edi_yn : string | undefined,
    job_or :string | undefined,
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
    fr_date: start_date,
    to_date: end_date,
    cust_code: '', //거래처나 계산서번호 둘중 하나는 필수값 입니다.
    issue_or: 'COD',
    no : '',
    edi_yn : '',
    job_or :'',
    sale_buy:'1',
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
        cust_code: '',
        no : '',
        user_id : '',
        job_or :'',
        sale_buy:'',
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