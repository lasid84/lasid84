'use client'

import { useReducer, useMemo, useRef } from "react"
import { SP_Load } from "./_component/data";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { PageState, reducer } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { TableContext } from "@/components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from './_component/gridMaster'

export default function STND0001() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            mSelectedRow: {},
            isPopUpOpen: false,
            popType: null,
        }
    })
    const { objState } = state;
    const { searchParams } = objState;
    
    const val = useMemo(() => { return { dispatch, objState } }, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });

    return (
        <TableContext.Provider value={val}>
            <div className={`w-full h-full`}>
                <SearchForm loadItem={initData} />
                <div className={`w-full h-[calc(100vh-150px)]`}>
                    <Grid initData={initData} />
                </div>
            </div>
        </TableContext.Provider>

    )

}
