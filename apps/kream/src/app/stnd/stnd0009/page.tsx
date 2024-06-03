
'use client';
import {useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { SP_Load, SP_GetData } from "./_component/data";
import { PageState, reducer } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import  SearchForm  from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextObjectProvider";
import Grid from './_component/gridMaster';
const { log } = require('@repo/kwe-lib/components/logHelper');

export default function STND0009() {

    const gridRef = useRef<any | null>(null);
    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams:{}, 
            isMSearch: false,
            mSelectedRow: {},
            isPopUpOpen: false,
            popType: null
        }
    });
    const { objState } = state;
    const { searchParams, mSelectedRow, crudType, isMSearch, isPopUpOpen } = objState;

    const val = useMemo(() => {return { objState, dispatch }}, [state]);
    const { data: initData } = useGetData('', LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });
    
    return (
        <TableContext.Provider value={val}>
            <SearchForm loadItem={initData} />
            <Grid initData={initData}/>
        </TableContext.Provider>
    );
}

