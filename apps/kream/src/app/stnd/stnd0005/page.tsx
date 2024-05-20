'use client'

import { useReducer, useMemo, useRef } from "react"
import { SP_Load, SP_GetData } from "./_component/data";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { PageState, reducer } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { TableContext } from "@/components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from './_component/gridMaster'

export default function STND0005() {

    const gridRef = useRef<any | null>(null);
    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            mSelectedRow: {},
            isPopupOpen: false,
            crudType: {}
        }
    })
    const { objState } = state;
    const { searchParams } = objState;
    const val = useMemo(() => { return { dispatch, objState }}, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });

    return (
        <TableContext.Provider value={val}>
            <SearchForm loadItem={initData} />
            <Grid initData={initData} />
        </TableContext.Provider>

    )

}
