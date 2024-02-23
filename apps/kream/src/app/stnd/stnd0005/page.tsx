'use client'

import PageTitle from "../../../shared/tmpl/page-title"
import ListGrid from "./_component/list-grid"
import SearchForm from "./_component/search-form"
import { useLoadData } from "./_component/stnd0005"
import { SubmitHandler } from "react-hook-form"
import { useCallback, useReducer,useMemo, useEffect } from "react"
import { FormType, formSchema } from "./_component/search-form"
// import { useGetData } from "./_component/stnd0005"
import { useStnd0005Store } from "@/states/stnd/stnd0005.store"
// import { useGetData1 } from "./_component/stnd0005"
//
import { PageState, reducer, SP_Load, SP_GetData } from "./_component/data"
import { TableContext } from "@/components/provider/contextProvider"
import { useSearchParams } from 'next/navigation'
import { useGetData } from "components/react-query/useMyQuery";
import { LOAD, SEARCH, SEARCH_FINISH } from "./_component/model";

const { log } = require('@repo/kwe-lib/components/logHelper');


const Stnd0005: React.FC = () => {
    const queryParam = useSearchParams()
    const title = queryParam.get('title')

    const [state, dispatch] = useReducer(reducer, PageState)
    const { searchParams, needSearch, selectedRow } = state
    const val = useMemo(()=> {
        return {searchParams, needSearch, dispatch}
    },[state])
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load);
    const { data: mainData, refetch: mainRefetch } = useGetData(searchParams, SEARCH, SP_GetData, {enable:false});
    const colVisible = {col : ["grp_cd","grp_cd_nm","cd","cd_nm","cd_desc","remark",'cd_mgcd1'], visible:true}


    useEffect(() => {
        if (needSearch) {
            mainRefetch();
            dispatch({type:SEARCH_FINISH, needSearch:false});
            log("====useEffect refetch 완료", needSearch, searchParams);
        }
    }, [needSearch]);

    useEffect(() => {
        log("stnd0006",selectedRow);
    }, [selectedRow]);


    return (

        <TableContext.Provider value={val}>
            <PageTitle title={title!} />
            <SearchForm loadItem={initData}/>
            <ListGrid listItem={mainData} colVisible={colVisible}/>
            {/* <SearchForm loadData={loadData} handleFormSubmit={handleFormSubmit} />
            <ListGrid loadData={loadData} listItem={selectResult || null} isInitialLoading={isInitialLoading} isError={isError} /> */}
        </TableContext.Provider>

    )

}

export default Stnd0005