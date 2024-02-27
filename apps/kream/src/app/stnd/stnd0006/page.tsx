
'use client';

import {useEffect, useReducer, useMemo } from "react";
import PageTitle from "components/page-title/page-title";
import { useUserSettings } from "states/useUserSettings";
import { PageState, reducer, SP_Load, SP_GetData } from "./_component/data";
import  SearchForm  from "./_component/search-form"

// import TanstackReactTable from 'components/form/test/tanStackReactTable/tanStackReactTable';
// import { FullWidthResizable } from 'components/form/test/tanStackReactTable/fullWidthResizable';
// import HeaderFilters from 'components/form/test/reactDataGrid/HeaderFilters';
import ListGrid from './_component/list-grid';
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextProvider";
// import Grid from 'components/grid/tabulator';
// import ReactDataGrid from 'components/grid/react-data-grid'
import AgGrid from 'components/grid/ag-grid-enterprise';

import { LOAD, SEARCH, SEARCH_FINISH } from "./_component/model";

import { useSearchParams } from 'next/navigation'

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function STND0006() {
    // const q = JSON.parse(query); 

    const queryParam = useSearchParams()
    const title = queryParam.get('title');
    // log(queryParam.getAll);

    const [state, dispatch] = useReducer(reducer, PageState);
    const { searchParams, needSearch, selectedRow } = state;

    const val = useMemo(() => {return { searchParams, needSearch, dispatch }}, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load);
    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH, SP_GetData, {enable:false});
    const colVisible = {col : ["trans_mode", "trans_type", "prod_gr_cd", "charge_code", "charge_desc"], visible:true}

    useEffect(() => {
        if (needSearch) {
            mainRefetch();
            dispatch({type:SEARCH_FINISH, needSearch:false});
            log("====useEffect refetch 완료", needSearch, searchParams);
        }
    }, [needSearch]);

    return (
        <TableContext.Provider value={val}>
            <PageTitle title={title!} /*brcmp={brcmp}*/ />
            <SearchForm /*onSubmit={handleSearchSubmit}*/ loadItem={initData} />
            <AgGrid listItem={mainData} colVisible={colVisible}/>
            <div>{selectedRow?.charge_code}</div>
            <div>{selectedRow?.vat_type}</div>
            <div>{selectedRow?.report_category}</div>
            <div>{selectedRow?.gl_gr1_nm}</div>
            <div>{selectedRow?.gl_gr2_nm}</div>
        </TableContext.Provider>            
    );
}
