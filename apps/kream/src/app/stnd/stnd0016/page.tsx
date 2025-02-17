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


export default function STND0016() {
    const mGridRef = useRef<AgGridReact>(null);
    const focusRef = useRef(null);

    const searchParams = useCommonStore((state) => state.searchParams);
    const selectedCustData = useCommonStore((state) => state.selectedCustData);
    const { getLoad, setState, resetStore, getCustDetailDatas } = useCommonStore((state) => state.actions);
    const methods = useForm({
        defaultValues: {
            ...searchParams
        },
    });

    const { 
        formState: { errors, isSubmitSuccessful },
    } = methods;
            
    useEffect(() => {
        resetStore();
        getLoad();        
    }, []);

    useEffect(() => {
        getCustDetailDatas(searchParams);
    }, [selectedCustData?.cust_code]);

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

