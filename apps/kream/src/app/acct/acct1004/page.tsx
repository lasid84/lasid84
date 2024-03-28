
'use client';

import { useEffect, useReducer, useMemo, useCallback } from "react";
import { SP_Load, SP_GetMasterData, SP_GetDetailData } from "./_component/data";
import { PageState, reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import DetailGrid from './_component/gridDetail';
import CustomerDetail from './_component/custDetailInfo';

import { useSearchParams } from 'next/navigation'

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function ACCT1004() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isDSearch: false,
            mSelectedRow: {},
            dSelectedRow: {},
        }
    });
    const { objState } = state;
    const { searchParams, isMSearch } = objState;
    const val = useMemo(() => { return { dispatch, objState } }, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });

    return (
        <TableContext.Provider value={val}>
            <SearchForm initData={initData} />
            <div className="w-full grid grid-cols-3">
                <div className="flex col-span-2">
                    <MasterGrid initData={initData} />
                </div>
                <div className="flex col-span-1">
                    <CustomerDetail />
                </div>
            </div>
            <DetailGrid initData={initData} />
        </TableContext.Provider>
    );
}
