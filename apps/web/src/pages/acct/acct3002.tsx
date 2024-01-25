import { useState, useRef, useCallback, useEffect } from "react"
import PageTitle from "shared/tmpl/page-title"
// import CodePop, { CodePopStateProps, CodePopType } from "page-parts/stnd/stnd0006-pop"
import SearchForm from "page-parts/acct/acct3002-search-row"
import CodeListGrid from "page-parts/acct/acct3002-list-gird"
import { SubmitHandler } from "react-hook-form"
import { useInvoiceStore } from "states/acct/acct3002.store";
import { ReactQuery, useCreateCode, useAcct3002Load } from "page-parts/acct/acct3002"
import { useSession } from 'next-auth/react';
import { useUserSettings } from "states/useUserSettings";


const pageProps = {
    title: "전자세금계산서전송(SmartBill)",
    transKey: "nav.acct.acct3002",
    desc: "전자세금계산서전송화면입니다",
    url: "acct3002"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "ACCOUNT", url: "/", last: false },
    { title: pageProps.title, url: pageProps.url, last: true },
]

const Acct3002: React.FC = () => {
    const { data: session } = useSession();
    //const [isCOD, setIsCOD] = useState<boolean>(true)

    // Zustand Store 사용설정
    const actions = useInvoiceStore((state) => state.actions)
    const searchParam = useInvoiceStore((state) => state.searchParam)

    //그리드 데이더
    const { data: selectResult } = ReactQuery(searchParam)
    //Load data..
    const {data : LoadData} = useAcct3002Load()

    const handleSearchSubmit: SubmitHandler<any> = useCallback((params) => {
        console.log('handleSearchSubmit', params)
        // actions.setSearchParam(params)
    }, [searchParam])
    
    return (
        <>
            {!session?.user
                ? <div className="flex">
                    {/* <div className="w-full h-full rounded-[5px] bg-white border mb-2"> */}
                    <div style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/region/incheon.webp')`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                        className="w-full h-screen z-50 rounded-[5px] bg-white border mb-2">
                        <span className="ag-overlay-loading-center">로그인해주세요</span>
                    </div>
                </div>
                : <div>
                    {/* 제목 */}
                    <PageTitle title={pageProps.title} brcmp={brcmp} />
                    <div className="flex">
                        <div className="w-full rounded-[5px] bg-white border mb-2">
                            {/* 검색 */}
                            <SearchForm onSubmit={handleSearchSubmit} loadItem={LoadData||null}/>
                        </div>
                    </div>
                    {/* 코드 리스트 */}
                    <CodeListGrid listItem={selectResult || null}/></div>
            }
        </>
    );
}

export default Acct3002;
