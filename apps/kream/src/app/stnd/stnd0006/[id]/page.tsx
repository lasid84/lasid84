
'use client';

import {useEffect, useReducer, useMemo, useCallback } from "react";
import PageTitle from "components/page-title/page-title";
import { useUserSettings } from "states/useUserSettings";

import { PageState, reducer } from "components/provider/contextProvider";
import { LOAD, SEARCH, SEARCH_FINISH } from "components/provider/contextProvider";

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
    const { searchParams, selectedRow, crudType
        , isSearch, isChangeSelect, isGridClick } = state;

    const val = useMemo(() => {return { searchParams, isSearch, selectedRow, isChangeSelect, isGridClick, crudType, dispatch }}, [state]);
    
    const gridOption: GridOption = {
        colVisible: { col : ["trans_mode", "trans_type", "prod_gr_cd", "charge_code", "charge_desc", "create_date"], visible:true },
        // checkbox: ["trans_mode"],
        editable: ["trans_mode"],
        dataType: { "create_date" : "date"},
        isMultiSelect: false
    };

    return (
        <div>id씌운 stnd0006</div>
    );
}
