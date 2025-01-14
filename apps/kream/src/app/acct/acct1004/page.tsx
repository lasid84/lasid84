
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

import { log } from '@repo/kwe-lib-new';


export default function ACCT1004() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isDSearch: false,
            mSelectedRow: {},
            mSelectedDetail: {},
            dSelectedRow: {},
        }
    });
    const { objState } = state;
    const { searchParams, mSelectedRow, mSelectedDetail, crudType, isMSearch, isPopUpOpen } = objState;

    const val = useMemo(() => { return { objState, searchParams, mSelectedRow, crudType, isMSearch, isPopUpOpen, mSelectedDetail, dispatch } }, [state]);
    const { data: initData } = useGetData('', LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });

    return (
        <TableContext.Provider value={val}>
            <div className={`w-full h-full`}>
                <SearchForm loadItem={initData} />
                <div className="grid h-[calc(100vh-180px)] w-full gird-flow-row grid-cols-5 grid-rows-3 space-x-1">
                    <div className="col-span-3 row-span-2">
                        <MasterGrid initData={initData} />
                    </div>
                    <div className="w-full col-span-2 row-span-2">
                        <CustomerDetail loadItem={initData} />
                    </div>
                    <div className="col-span-5 grid-rows-1 row-start-3">
                        <DetailGrid initData={initData} />
                    </div>
                </div>
            </div>
        </TableContext.Provider>
    );
}
