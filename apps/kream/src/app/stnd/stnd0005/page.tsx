'use client'

import { useReducer, useMemo, useEffect } from "react"
import PageTitle from "components/page-title/page-title";
import { SP_Load, SP_GetData } from "./_component/data"
import { PageState, reducer } from "components/provider/contextProvider";
import { LOAD, SEARCH_M } from "components/provider/contextProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import { TableContext } from "@/components/provider/contextProvider"
import AgGrid from 'components/grid/ag-grid-enterprise';
import type { GridOption } from 'components/grid/ag-grid-enterprise';
import Modal from './_component/popup';


const { log } = require('@repo/kwe-lib/components/logHelper');


const Stnd0005: React.FC = () => {

    const [state, dispatch] = useReducer(reducer, PageState)
    const { searchParams, mSelectedRow, crudType, isMSearch, isMChangeSelect } = state;

    const val = useMemo(() => { return { searchParams, isMSearch, mSelectedRow, isMChangeSelect, crudType, dispatch } }, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });
    const { data: mainData, refetch: mainRefetch } = useGetData(searchParams, SEARCH_M, SP_GetData, { enable: false });

    const gridOption: GridOption = {
        colVisible: { col: ["grp_cd", "grp_cd_nm", "cd", "cd_nm", "cd_desc", "remark", 'cd_mgcd1'], visible: true },
        colDisable: ["grp_cd"],
        editable: ["grp_cd_nm"],
        dataType: { "create_date": "date" },
        isMultiSelect: false,
    }


    useEffect(() => {
        if (isMSearch) {
            mainRefetch();
            dispatch({isSearch:false});
        }
    }, [isMSearch]);

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