
'use client';
import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { SP_Load, SP_GetData } from "./_component/data";
import { PageState, reducer } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextObjectProvider";
import Grid from './_component/gridMaster';
import { FormProvider, useForm } from "react-hook-form";
const { log } = require('@repo/kwe-lib/components/logHelper');

export default function STND0009() {

    const gridRef = useRef<any | null>(null);
    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            mSelectedRow: {},
            isPopUpOpen: false,
            isIFPopUpOpen: false,
            popType: null
        }
    });
    const { objState } = state;
    const { searchParams, mSelectedRow, crudType, isMSearch, isPopUpOpen } = objState;

    const methods = useForm({
        defaultValues: {
          carrier_type: 'ALL',
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
                    <SearchForm loadItem={initData} carrier_type={getValues('carrier_type')} />
                    <div className={`w-full h-[calc(100vh-150px)]`}>
                        <Grid initData={initData} />
                    </div>
                </div>
            </FormProvider>
        </TableContext.Provider >
    );
}

