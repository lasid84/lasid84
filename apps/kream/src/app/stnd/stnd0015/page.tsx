'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, memo, RefObject } from "react";
import SearchForm from "./_component/search-form"
import Grid from './_component/gridMaster';
import { FormProvider, useForm } from "react-hook-form";
import { useCommonStore } from "./_store/store";
import DetailInfo from "./_component/DetailInfo";
import { AgGridReact } from "ag-grid-react";

import { log, error } from '@repo/kwe-lib-new';


export default memo(function STND0015() {
    const mGridRef = useRef<AgGridReact>(null);
    const focusRef = useRef(null);

    const searchParams = useCommonStore((state) => state.searchParams);
    const { getLoad, setState } = useCommonStore((state) => state.actions);
    const methods = useForm({
    defaultValues: {
        ...searchParams
    },
    });

    const { 
        formState: { errors, isSubmitSuccessful },
    } = methods;
            
    useEffect(() => {
        getLoad();        
    }, [])

    return (
        <FormProvider {...methods}>
            <div className={`w-full h-full`}>
                <SearchForm mGridRef={mGridRef} focusRef={focusRef} />
                <div className="grid w-full h-[calc(100vh-150px)] grid-cols-5">
                    <div className="col-span-2">
                        <Grid ref={mGridRef} />
                    </div>
                    <div className="col-span-3">
                        <DetailInfo ref={focusRef} />
                    </div>
                </div>
            </div>
        </FormProvider>
    );
});

