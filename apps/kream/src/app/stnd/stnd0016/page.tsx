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
    const { getLoad, setState, resetStore, getCustDetailDatas } = useCommonStore((state) => state.actions);
    const methods = useForm({
        defaultValues: {
            ...state.searchParams
        },
    });

    const { 
        formState: { errors, isSubmitSuccessful },
    } = methods;
            
    useEffect(() => {
        getLoad();        
    }, []);

    useEffect(() => {
        const params = {
            cust_code: selectedCustData?.cust_code,
            cust_mode: state.trans_mode + (state.trans_type ?? '')
        }
        getCustDetailDatas(params);
    }, [selectedCustData?.cust_code]);

    useEffect(() => {
        setState({trans_mode:trans_mode, trans_type:trans_type})    
    }, [trans_mode, trans_type]);

    useHotkeys(
        "ctrl+s",
        (event) => {
            event.preventDefault();
            log("ctrl+s");
            // onSave();
        },
        { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] } // form 요소에서 단축키 활성화
        );

    return (
        <FormProvider {...methods}>
            <div className={`w-full h-full`}>
                <SearchForm mGridRef={mGridRef} focusRef={focusRef} />
                <BasicInfo ref={focusRef} />
                <DetailInfo/>
            </div>
        </FormProvider>
    );
};

