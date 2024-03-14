
'use client';

import {useEffect, useReducer, useMemo, useCallback } from "react";
import { SP_Load, SP_GetMasterData, SP_GetDetailData } from "./_component/data";
import { PageState, reducer } from "components/provider/contextProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextProvider";
import  SearchForm  from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextProvider";
import MasterGrid from './_component/gridMaster';
import DetailGrid from './_component/gridDetail';
import CustomerDetail from './_component/custDetailInfo';
import type { GridOption } from 'components/grid/ag-grid-enterprise';

import { useSearchParams } from 'next/navigation'

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function ACCT3001() {

    const [state, dispatch] = useReducer(reducer, PageState);
    const { searchParams, mSelectedRow, dSelectedRow, crudType
        , isMSearch } = state;

    const val = useMemo(() => {return { searchParams, isMSearch, mSelectedRow, dSelectedRow, crudType, dispatch }}, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });
    
    return (
        <TableContext.Provider value={val}>
            <SearchForm initData={initData} />
            <div className="grid w-full grid-cols-3">
                <MasterGrid initData={initData}/>
                <div className="col-span-2">
                    <CustomerDetail/>
                    <DetailGrid initData={initData}/>
                </div>
            </div>
        </TableContext.Provider>
    );
}
