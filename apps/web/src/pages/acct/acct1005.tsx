import { useCallback } from "react"
import PageTitle from "shared/tmpl/page-title"
import SearchForm from "page-parts/acct/acct1005-search-row"
import ListGrid from "page-parts/acct/acct1005-list-gird"
import { SubmitHandler } from "react-hook-form"
import { useInvoiceStore } from "states/acct/acct1005.store";
import { useGetData, useLoadData } from "page-parts/acct/acct1005"
import { useSession } from 'next-auth/react';
import { useUserSettings } from "states/useUserSettings";
import BeforeLogin from "shared/tmpl/beforelogin"


const pageProps = {
    title: "CCN조회 및 Billing관리",
    transKey: "nav.acct.acct1005",
    desc: "CCN조회 및 Billing관리",
    url: "acct1005"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "ACCOUNT", url: "/", last: false },
    { title: pageProps.title, url: pageProps.url, last: true },
]

const Acct1005: React.FC = () => {
    const { data: session } = useSession();

    // Zustand Store 사용설정
    const actions = useInvoiceStore((state) => state.actions)
    const searchParam = useInvoiceStore((state) => state.searchParam)

    const { data: selectResult } = useGetData(searchParam) //grid data
    const { data: LoadData } = useLoadData() //load data

    const handleSearchSubmit: SubmitHandler<any> = useCallback((params) => { }, [searchParam])

    return (
        <>
            {!session?.user
                ? <><BeforeLogin title={''}></BeforeLogin></>
                : <div>
                    {/* 제목 */}
                    <PageTitle title={pageProps.title} brcmp={brcmp} />

                    {/* 검색 */}
                    <SearchForm onSubmit={handleSearchSubmit} loadItem={LoadData || null} />

                    {/* 코드 리스트 */}
                    <ListGrid listItem={selectResult || null} /></div>
            }
        </>
    );
}

export default Acct1005;
