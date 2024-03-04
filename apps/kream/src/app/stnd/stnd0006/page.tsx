
'use client';

import {useEffect, useReducer, useMemo } from "react";
import PageTitle from "components/page-title/page-title";
import { useUserSettings } from "states/useUserSettings";
import { SP_Load, SP_GetData } from "./_component/data";
import { PageState, SET_ISSELECT, reducer } from "components/provider/contextProvider";
import { LOAD, SEARCH, SEARCH_FINISH } from "components/provider/contextProvider";
import  SearchForm  from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextProvider";
import AgGrid from 'components/grid/ag-grid-enterprise';
import type { GridOption } from 'components/grid/ag-grid-enterprise';

import { useSearchParams } from 'next/navigation'

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function STND0006() {
    // const q = JSON.parse(query); 

    const queryParam = useSearchParams()
    const title = queryParam.get('title');
    // log(queryParam.getAll);

    const [state, dispatch] = useReducer(reducer, PageState);
    const { searchParams, needSearch, selectedRow, isChangeSelect } = state;

    const val = useMemo(() => {return { searchParams, needSearch, selectedRow, isChangeSelect, dispatch }}, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load);
    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH, SP_GetData, {enable:false});
    const gridOption: GridOption = {
        colVisible: { col : ["trans_mode", "trans_type", "prod_gr_cd", "charge_code", "charge_desc", "create_date"], visible:true },
        checkbox: ["trans_mode"],
        editable: ["trans_mode"],
        dataType: { "create_date" : "date"},
        isMultiSelect: false
    }

    useEffect(() => {
        // log("====useEffect refetch 시작", needSearch, searchParams);
        if (needSearch) {
            mainRefetch();
            dispatch({type:SEARCH_FINISH, needSearch:false});
            // log("====useEffect refetch 완료", needSearch, searchParams);
        }
    }, [needSearch]);

    useEffect(() => {
        log("isChangeSelect : ", isChangeSelect);
        // dispatch({type:SET_ISSELECT})
    }, [isChangeSelect]);

    return (
        <TableContext.Provider value={val}>
            <PageTitle title={title!} /*brcmp={brcmp}*/ />
            <SearchForm loadItem={initData} />
            <AgGrid loadItem={initData} listItem={mainData} options={gridOption}/>
            <div>{selectedRow?.charge_code}</div>
            <div>{selectedRow?.vat_type}</div>
            <div>{selectedRow?.report_category}</div>
            <div>{selectedRow?.gl_gr1_nm}</div>
            <div>{selectedRow?.gl_gr2_nm}</div>
        </TableContext.Provider>            
    );
}
