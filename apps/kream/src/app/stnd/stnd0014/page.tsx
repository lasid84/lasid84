'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { useUserSettings } from "states/useUserSettings";
import { SP_Load } from "./_component/data";
import { PageState, reducer } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextObjectProvider";
import Grid from './_component/gridMaster';
import { shallow } from "zustand/shallow";
import { FormProvider, useForm } from "react-hook-form";

import { log, error, DateToString } from '@repo/kwe-lib-new';


export default function STND0014() {
    const menu_param = useUserSettings((state) => state.data.currentParams, shallow);

    const gridRef = useRef<any | null>(null);
    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
        }
    });
    const { objState } = state;

    // const methods = useForm<FormType>({
    const methods = useForm({
    // resolver: zodResolver(formSchema),
        defaultValues: {
            year: DateToString(),
            type: "Y"
        }
    });
    
    const {
        handleSubmit,
        reset,
        setFocus,
        setValue,
        getValues,
        register,
        formState: { errors, isSubmitSuccessful },
    } = methods;

    const val = useMemo(() => { return { objState, dispatch } }, [state]);
    const { data: initData } = useGetData('', LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });

    return (
        <TableContext.Provider value={val}>
            <FormProvider {...methods}>
                <div className={`w-full h-full`}>
                    <SearchForm loadItem={initData} />
                    <div className={`w-full h-[calc(100vh-190px)]`}>
                        <Grid initData={initData} />
                    </div>
                </div>
            </FormProvider>
        </TableContext.Provider>
    );
}

