'use client'

import PageTitle from "../../../shared/tmpl/page-title"
import ListGrid from "./_component/list-grid"
import SearchForm from "./_component/search-form"
import { useReducer, useMemo, useEffect } from "react"
import { PageState, reducer, SP_Load, SP_GetData } from "./_component/data"
import { TableContext } from "@/components/provider/contextProvider"
import { useSearchParams } from 'next/navigation'
import { useGetData } from "components/react-query/useMyQuery";
import { LOAD, SEARCH, SEARCH_FINISH } from "./_component/model";
import { usePathname } from "next/navigation"

const { log } = require('@repo/kwe-lib/components/logHelper');


const Stnd0005: React.FC = () => {
    const router = usePathname()
    const queryParam = useSearchParams()
    const title = queryParam.get('title')
    console.log('title?',title)

    const [state, dispatch] = useReducer(reducer, PageState)
    const { searchParams, needSearch, selectedRow } = state
    const val = useMemo(() => {
        return { searchParams, needSearch, dispatch }
    }, [state])
    const { data: initData } = useGetData([], router, SP_Load, { staleTime: 100000 });
    const { data: mainData, refetch: mainRefetch } = useGetData(searchParams, router, SP_GetData, { enable: false });
    const colVisible = { col: ["grp_cd", "grp_cd_nm", "cd", "cd_nm", "cd_desc", "remark", 'cd_mgcd1'], visible: true }


    
    useEffect(() => {
        if (needSearch) {
            mainRefetch();
            dispatch({ type: SEARCH_FINISH, needSearch: false });
            log("====useEffect refetch 완료", needSearch, searchParams);
        }
    }, [needSearch]);

    useEffect(() => {
        log("stnd0005", selectedRow);
    }, [selectedRow]);


    return (

        <TableContext.Provider value={val}>
            <PageTitle title={title!} />
            <SearchForm loadItem={initData} />
            <ListGrid  loadItem={initData} listItem={mainData} colVisible={colVisible} />
        </TableContext.Provider>

    )

}

export default Stnd0005