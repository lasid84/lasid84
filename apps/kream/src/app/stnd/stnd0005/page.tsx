'use client'

import PageTitle from "../../../shared/tmpl/page-title"
import ListGrid from "./_component/list-grid"
import SearchForm from "./_component/search-form"
import { useGetData } from "./_component/stnd0005"
import { useLoadData } from "./_component/stnd0005"

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
    //load data
    const {data : loadData } = useLoadData();
    //grid data
    const { data: selectResult, isInitialLoading, isError } = useGetData()

    return (
        <>
            <PageTitle title={pageProps.title} brcmp={brcmp} />
            <SearchForm loadData={loadData} />
            <ListGrid listItem={selectResult || null} isInitialLoading={isInitialLoading} isError={isError} />
        </>
    )

}

export default Stnd0005