<<<<<<< HEAD
import { useState, useRef, useCallback, useEffect, useReducer } from "react"
import PageTitle from "shared/tmpl/page-title"
import { SubmitHandler } from "react-hook-form"
import { useUserSettings } from "states/useUserSettings";

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


export default function Home() {
    
    const [state, dispatch] = useReducer(reducer, initialState);
    


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
            {/* {!session?.user
                ? <div className="w-full h-full rounded-[5px] bg-white border mb-2">
                    <div>
                        <span className="ag-overlay-loading-center">로그인 해주세요</span>
                    </div>
                </div>
                : */}
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
            {/* } */}
        </>
    );
}
=======
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
            <SearchForm />
            <ListGrid listItem={selectResult||null} isInitialLoading={isInitialLoading} isError={isError} />
        </>
    )

}

export default Stnd0001
>>>>>>> c03cfa43b16528ff44aae3f839fbf134b8811281
