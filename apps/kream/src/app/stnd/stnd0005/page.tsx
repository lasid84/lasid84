'use client'

import PageTitle from "../../../shared/tmpl/page-title"
import ListGrid from "./_component/list-grid"
import SearchForm from "./_component/search-form"
import { useLoadData } from "./_component/stnd0005"
import { SubmitHandler } from "react-hook-form"
import { useCallback } from "react"
import { FormType, formSchema } from "./_component/search-form"
import { useGetData } from "./_component/stnd0005"
import { useStnd0005Store } from "@/states/stnd/stnd0005.store"
import { useGetData1 } from "./_component/stnd0005"

const pageProps = {
    title: "종합코드관리",
    transKey: "nav.stnd.stnd0005",
    desc: "종합코드관리",
    url: "stnd0005"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "STND", url: "/", last: false },
    { title: pageProps.title, url: pageProps.url, last: true },
]


const Stnd0005: React.FC = () => {
    const searchParam = useStnd0005Store((state) => state.searchParam)
    const actions = useStnd0005Store((state) => state.actions)
    //load data
    const { data: loadData } = useLoadData();
    //grid data
    const { data: selectResult, isInitialLoading, isError } = useGetData1(searchParam)


    const handleFormSubmit: SubmitHandler<FormType> = useCallback((searchParam) => {
        console.log('handleFormSubmit::', searchParam)
        actions.setSearchParam(searchParam)
    }, [searchParam])


    return (
        <>
            <PageTitle title={pageProps.title} brcmp={brcmp} />
            <SearchForm loadData={loadData} handleFormSubmit={handleFormSubmit} />
            <ListGrid loadData={loadData} listItem={selectResult || null} isInitialLoading={isInitialLoading} isError={isError} />
        </>
    )

}

export default Stnd0005