
'use client';

import {useEffect, useReducer, useMemo, useCallback } from "react";
import PageTitle from "components/page-title/page-title";
import { useUserSettings } from "states/useUserSettings";
import { SP_Load, SP_GetData } from "./_component/data";
import { PageState, reducer } from "components/provider/contextProvider";
import { LOAD, SEARCH_M } from "components/provider/contextProvider";
import  SearchForm  from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextProvider";
import AgGrid from 'components/grid/ag-grid-enterprise';
import type { GridOption } from 'components/grid/ag-grid-enterprise';
import  Modal  from './_component/popup';

import { useSearchParams } from 'next/navigation'

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function STND0006() {

    const [state, dispatch] = useReducer(reducer, PageState);
    const { searchParams, selectedRow, crudType
        , isMSearch, isChangeSelect, isGridClick } = state;

    const val = useMemo(() => {return { searchParams, isMSearch, selectedRow, isChangeSelect, isGridClick, crudType, dispatch }}, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });
    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetData, {enable:false});
    const gridOption: GridOption = {
        colVisible: { col : ["trans_mode", "trans_type", "prod_gr_cd", "charge_code", "charge_desc", "create_date"], visible:false },
        colDisable: ["trans_mode", "trans_type", "ass_transaction"],
        checkbox: ["no"],
        editable: ["trans_mode"],
        dataType: { "create_date" : "date", "vat_rt":"number"},
        isMultiSelect: false,
        isAutoFitCol: true,
        alignLeft: ["major_category", "bill_gr1_nm"],
        alignRight: [],
        // rowadd
        // rowdelete

    };

    useEffect(() => {
        if (isMSearch) {
            mainRefetch();
            dispatch({isSearch:false});
        }
    }, [isMSearch]);

    return (
        <TableContext.Provider value={val}>
            <SearchForm loadItem={initData} />
            <AgGrid
                loadItem={initData}
                listItem={mainData}
                options={gridOption}/>
            <Modal
                loadItem={initData}
            />
        </TableContext.Provider>
    );
}
