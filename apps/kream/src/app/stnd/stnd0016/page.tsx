'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, memo, RefObject } from "react";
import SearchForm from "./_component/search-form"
import { FormProvider, useForm } from "react-hook-form";
import { useCommonStore } from "./_store/store";
import BasicInfo from "./_component/BasicInfo";
import { AgGridReact } from "ag-grid-react";

import { log, error } from '@repo/kwe-lib-new';
import DetailInfo from "./_component/DetailInfo";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
    trans_mode:string;
    trans_type:string;
};

export default function STND0016(props:Props) {
    const mGridRef = useRef<AgGridReact>(null);
    const focusRef = useRef(null);
    const { trans_mode, trans_type } = props;

    const state = useCommonStore((state) => state);
    const selectedCustData = useCommonStore((state) => state.selectedCustData);
    const { getLoad, setState, resetStore, getCustDetailDatas, setCustDetailDatas } = useCommonStore((state) => state.actions);
    const methods = useForm({
        defaultValues: {
            ...state.searchParams,
            cust_mode: trans_mode + trans_type
        },
    });

    const { 
        formState: { errors, isSubmitSuccessful },
        getValues
    } = methods;
            
    useEffect(() => {
        getLoad();        
    }, []);

    useEffect(() => {
        setState({cust_mode:trans_mode + trans_type})    
    }, [trans_mode, trans_type]);

    useEffect(() => {
        const params = {
            cust_code: selectedCustData?.cust_code,
            cust_mode: state.cust_mode
        }
        getCustDetailDatas(params);
        log("selectedCustData?.cust_code", selectedCustData)
    }, [selectedCustData?.cust_code]);

    useHotkeys(
        "ctrl+s",
        (event) => {
            event.preventDefault();
            
            if (!selectedCustData?.cust_code) return;
            
            const params = getValues();
            setCustDetailDatas(params);
        },
        { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] } // form 요소에서 단축키 활성화
    );

    return (
        <FormProvider {...methods}>
            <div className={`flex flex-col max-h-[calc(100vh)]`}>
                <SearchForm/>
                <BasicInfo ref={focusRef} />
                <DetailInfo/>
            </div>
        </FormProvider>
    );
};

