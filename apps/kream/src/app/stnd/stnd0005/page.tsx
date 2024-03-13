'use client'

import { useReducer, useMemo, useEffect } from "react"
import PageTitle from "components/page-title/page-title";
import { SP_Load, SP_GetData } from "./_component/data"
import { PageState, reducer } from "components/provider/contextProvider";
import { LOAD, SEARCH, SEARCH_FINISH } from "components/provider/contextProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextProvider"
import AgGrid from 'components/grid/ag-grid-enterprise';
import type { GridOption } from 'components/grid/ag-grid-enterprise';
import Modal from './_component/popup';


const { log } = require('@repo/kwe-lib/components/logHelper');


const Stnd0005: React.FC = () => {

    const [state, dispatch] = useReducer(reducer, PageState)
    const { searchParams, selectedRow, crudType
        , isSearch, isChangeSelect, isGridClick } = state;

    const val = useMemo(() => { return { searchParams, isSearch, selectedRow, isChangeSelect, isGridClick, crudType, dispatch } }, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });
    const { data: mainData, refetch: mainRefetch } = useGetData(searchParams, SEARCH, SP_GetData, { enable: false });

    const gridOption: GridOption = {
        colVisible: { col: ["grp_cd", "grp_cd_nm", "cd", "cd_nm", "cd_desc", "remark", 'cd_mgcd1'], visible: true },
        colDisable: ["grp_cd"],
        editable: ["grp_cd_nm"],
        dataType: { "create_date": "date" },
        isMultiSelect: false,
    }


    useEffect(() => {
        if (isSearch) {
            mainRefetch();
            dispatch({ type: SEARCH_FINISH, isSearch: false });
        }
    }, [isSearch]);

    return (

        <TableContext.Provider value={val}>
            <PageTitle />
            <SearchForm loadItem={initData} />
            <AgGrid
                loadItem={initData}
                listItem={mainData}
                options={gridOption} />
            <Modal
                loadItem={initData} />
        </TableContext.Provider>

    )

}

export default Stnd0005