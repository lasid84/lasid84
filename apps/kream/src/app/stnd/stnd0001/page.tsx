'use client'

import PageTitle from "../../../shared/tmpl/page-title"
import ListGrid from "./_component/list-grid"
import SearchForm from "./_component/search-form"
import { useGetData } from "./_component/stnd0001"


const pageProps = {
    title: "사용자 기준정보",
    transKey: "nav.stnd.stnd0001",
    desc: "사용자 기준정보",
    url: "stnd0001"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "STND", url: "/", last: false },
    { title: pageProps.title, url: pageProps.url, last: true },
]


const Stnd0001: React.FC = () => {

    //grid data
    const { data: selectResult, isInitialLoading, isError } = useGetData()
    return (
        <>
            <PageTitle title={pageProps.title} brcmp={brcmp} />
            {/* <SearchForm /> */}
            <ListGrid listItem={selectResult || null} isInitialLoading={isInitialLoading} isError={isError} />
        </>
    )

}

export default Stnd0001
