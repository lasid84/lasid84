import { useState, useRef, useCallback, useEffect } from "react"
import PageTitle from "shared/tmpl/page-title"
import { SubmitHandler } from "react-hook-form"
import SearchForm from "page-parts/acct/acct3002-search-row"
import CodeListGrid from "page-parts/acct/acct2003-list-gird"
import { useInvoiceStore } from "states/acct/acct2003.store";
import { useGetData, useLoadData } from "page-parts/acct/acct2003"
import { useUserSettings } from "states/useUserSettings";
import { useSession } from 'next-auth/react';

const pageProps = {
    title: "세금계산서생성(COD)",
    transKey: "nav.acct.acct2003",
    desc: "세금계산서생성화면입니다",
    url: "acct2003"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "작성중", url: "/", last: false },
    { title: pageProps.transKey, url: pageProps.url, last: true },
]


const Acct2003: React.FC = () => {
    const { data: session } = useSession();
    const [isCOD, setIsCOD] = useState<boolean>(true)
    // Zustand Store 사용설정
    const actions = useInvoiceStore((state) => state.actions)
    const searchParam = useInvoiceStore((state) => state.searchParam)

    //Load data..
    const { data: LoadData } = useLoadData()

     

    //grid data
    const { data: selectResult } = useGetData(searchParam)

    const handleSearchSubmit: SubmitHandler<any> = useCallback((params) => {
        console.log('handleSearchSubmit', params)
        actions.setSearchParam(params)
    }, [searchParam])

    return (
        <>
             <div>
                    {/* 제목 */}
                    <PageTitle title={pageProps.title} brcmp={brcmp} />
                    <div className="flex">
                        <div className="w-full rounded-[5px] bg-white border mb-2">
                            {/* 검색 */}
                            <SearchForm onSubmit={handleSearchSubmit} loadItem={LoadData||null} />
                        </div>
                        {/* grid data와 결합하는 side component */}
                        <div className="w-2/12 rounded-[5px] bg-white border mb-2 space-y-2">
                            <div className="px-4 py-2 space-y-1">
                                <div className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                    계산서일
                                </div>
                                <input
                                    name="name"
                                    type="date"
                                    className="w-full px-4 py-1 font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded text-s hover:text-cyan-700 hover:border-blue-700"
                                />
                                {isCOD
                                    ? <></>
                                    : <><div className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                        취합구분
                                    </div>
                                        <input
                                            name="name"
                                            type="date"
                                            className="w-full px-4 py-1 font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded text-s hover:text-cyan-700 hover:border-blue-700"
                                        />
                                        <div className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                            발행처
                                        </div>
                                        <input
                                            name="name"
                                            type="date"
                                            className="w-full px-4 py-1 font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded text-s hover:text-cyan-700 hover:border-blue-700"
                                        /></>
                                }

                            </div>
                        </div>
                    </div>
                    {/* 코드 리스트 */}
                    <CodeListGrid listItem={selectResult || null} /></div>
            
        </>
    );
}

export default Acct2003;
