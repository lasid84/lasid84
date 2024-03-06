
'use client';

import {useEffect, useReducer, useMemo, useCallback } from "react";
import PageTitle from "components/page-title/page-title";
import { useUserSettings } from "states/useUserSettings";
import { SP_Load, SP_GetData } from "./_component/data";
import { PageState, reducer } from "components/provider/contextProvider";
import { LOAD, SEARCH, SEARCH_FINISH } from "components/provider/contextProvider";
import  SearchForm  from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextProvider";
import AgGrid from 'components/grid/ag-grid-enterprise';
import type { GridOption } from 'components/grid/ag-grid-enterprise';
import  Modal  from './_component/popup';

import { useSearchParams } from 'next/navigation'

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function STND0006() {
    // const q = JSON.parse(query); 

    const queryParam = useSearchParams()
    const title = queryParam.get('title');
    // log(queryParam.getAll);

    const [state, dispatch] = useReducer(reducer, PageState);
    const { searchParams, selectedRow, crudType
        , isSearch, isChangeSelect, isGridClick } = state;

    const val = useMemo(() => {return { searchParams, isSearch, selectedRow, isChangeSelect, isGridClick, crudType, dispatch }}, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 600 });
    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH, SP_GetData, {enable:false});
    const gridOption: GridOption = {
        colVisible: { col : ["trans_mode", "trans_type", "prod_gr_cd", "charge_code", "charge_desc", "create_date"], visible:true },
        // checkbox: ["trans_mode"],
        editable: ["trans_mode"],
        dataType: { "create_date" : "date"},
        isMultiSelect: false
    };

    useEffect(() => {
        // log("====useEffect refetch 시작", needSearch, searchParams);
        if (isSearch) {
            mainRefetch();
            dispatch({type:SEARCH_FINISH, isSearch:false});
            // log("====useEffect refetch 완료", needSearch, searchParams);
        }
    }, [isSearch]);

    // useEffect(() => {
    //     log("isChangeSelect : ", isChangeSelect);
    //     log("isChangeSelect", selectedRow);
    //     // dispatch({type:SET_ISSELECT})
    // }, [isChangeSelect]);

    return (
        <TableContext.Provider value={val}>
            <PageTitle title={title!} /*brcmp={brcmp}*/ />
            <SearchForm loadItem={initData} />
            <AgGrid loadItem={initData} listItem={mainData} options={gridOption}/>
            <Modal
            loadItem={initData}
            // selectedData={selectedRow}
            // popType={crudType}
            // isOpen={isGridClick as boolean}
            />
        </TableContext.Provider>            
    );
}
