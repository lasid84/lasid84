
'use client';

import { useState, useRef, useCallback, useEffect, useReducer, createContext, useMemo, Dispatch, useContext } from "react";
import PageTitle from "components/page-title/page-title";
import { SubmitHandler } from "react-hook-form";
import { useUserSettings } from "states/useUserSettings";
import { SearchState, reducer, useGetData } from "./data";
import { SearchForm } from "./form"
// import SearchForm from "./_component/search-form"
// import { useGetData } from "./test";

import TanstackReactTable from '@/components/form/test/tanStackReactTable/tanStackReactTable';
import FullWidthResizable from 'components/form/test/tanStackReactTable/fullWidthResizable';
import HeaderFilters from 'components/form/test/reactDataGrid/HeaderFilters';
import ListGrid from './_component/list-grid';

const { log } = require('@repo/kwe-lib/components/logHelper');

const pageProps = {
    title: "차지코드관리",
    transKey: "nav.stnd.stnd0006",
    desc: "차지코드관리",
    url: "stnd0004"
}

//탐색경로 설정
const brcmp = [
    { title: "Home", url: "/", last: false },
    { title: "작성중", url: "/", last: false },
    { title: pageProps.transKey, url: pageProps.url, last: true },
]

type State = {
    searchParams: {}
    dispatch: any
  };

export const TableContext = createContext<State>({
    searchParams: {},
    dispatch: () => {},
  });


export function useAppContext() {
    return useContext(TableContext);
}

export default function Home() {
    // const searchState = SearchState;
    const [state, dispatch] = useReducer(reducer, SearchState);
    const { searchParams } = state;

    const val = useMemo(() => {return { searchParams, dispatch }}, [state]);
    
    useEffect(() => {
        log("==========", state.searchParams, searchParams);
    }, [state.searchParams]);


    //Load data..
    // const { data: LoadData } = useLoadData()

    const params = {
        user_id: 'stephen',
        ipaddr: '1.1.1.1'
      };
    const { data: LoadData } = useGetData(params);
     
    let arr = []
    arr.push(params);
    arr.push(params);
    //grid data
    // const { data: selectResult } = useGetData(searchParam)

    // const handleSearchSubmit: SubmitHandler<any> = useCallback((params) => {
    //     console.log('handleSearchSubmit', params)
    //     actions.setSearchParam(params)
    // }, [searchParam])

    return (
        <TableContext.Provider value={val}>
            <PageTitle title={pageProps.title} brcmp={brcmp} />
            <SearchForm /*onSubmit={handleSearchSubmit}*/ loadItem={LoadData} />
            {/* <TanstackReactTable/> */}
            {/* <HeaderFilters direction="rtl" /> */}
            {/* <ListGrid listItem={arr}/> */}
            <FullWidthResizable/>
        </TableContext.Provider>
           
                //  <div>
                    
                //     <div className="flex">
                //         <div className="w-full rounded-[5px] bg-white border mb-2">
                //             {/* 검색 */}
                //             <SearchForm onSubmit={handleSearchSubmit} loadItem={LoadData||null} />
                //         </div>
                //         {/* grid data와 결합하는 side component */}
                //         <div className="w-2/12 rounded-[5px] bg-white border mb-2 space-y-2">
                //             <div className="px-4 py-2 space-y-1">
                //                 <div className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                //                     계산서일
                //                 </div>
                //                 <input
                //                     name="name"
                //                     type="date"
                //                     className="w-full px-4 py-1 font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded text-s hover:text-cyan-700 hover:border-blue-700"
                //                 />
                //                 {isCOD
                //                     ? <></>
                //                     : <><div className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                //                         취합구분
                //                     </div>
                //                         <input
                //                             name="name"
                //                             type="date"
                //                             className="w-full px-4 py-1 font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded text-s hover:text-cyan-700 hover:border-blue-700"
                //                         />
                //                         <div className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                //                             발행처
                //                         </div>
                //                         <input
                //                             name="name"
                //                             type="date"
                //                             className="w-full px-4 py-1 font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded text-s hover:text-cyan-700 hover:border-blue-700"
                //                         /></>
                //                 }

                //             </div>
                //         </div>
                //     </div>
                //     {/* 코드 리스트 */}
                //     <CodeListGrid listItem={selectResult || null} /></div>
            
    );
}
