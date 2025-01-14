'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { useUserSettings } from "states/useUserSettings";
import { SP_Load, SP_GetData } from "./_component/data";
import { PageState, reducer } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextObjectProvider";
import Grid from './_component/gridMaster';
import { shallow } from "zustand/shallow";
import { FormProvider, useForm } from "react-hook-form";

import { log, error } from '@repo/kwe-lib-new';


export default function STND0006() {
    const menu_param = useUserSettings((state) => state.data.currentParams, shallow);

    const gridRef = useRef<any | null>(null);
    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            mSelectedRow: {},
            isPopUpOpen: false,
            popType: null
        }
    });
    const { objState } = state;
    const { searchParams, mSelectedRow, crudType, isMSearch
        , isPopUpOpen } = objState;

    //사용자 정보
    const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
    const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

    // const methods = useForm<FormType>({
    const methods = useForm({
    // resolver: zodResolver(formSchema),
        defaultValues: {
        trans_mode: gTransMode || 'ALL',
        trans_type: gTransType || 'ALL'
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
                    <div className={`w-full h-[calc(100vh-150px)]`}>
                        <Grid initData={initData} />
                    </div>
                </div>
            </FormProvider>
        </TableContext.Provider>
    );
}

