
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
import { useUserSettings } from "@/states/useUserSettings";
import { shallow } from "zustand/shallow";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { getMenuParameters } = require('@repo/kwe-lib/components/menuParameterHelper')


export default function ACCT3001() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isDSearch: false,
            mSelectedRow: {},
            dSelectedRow: {},
            cont_type: ''
        }
    });
    const { objState } = state;
    const { searchParams, isMSearch } = objState;
    const val = useMemo(() => { return { dispatch, objState } }, [state]);

    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });
    const menu_param = useUserSettings((state) => state.data.currentParams, shallow);

    useEffect(() => {
        const params = getMenuParameters(menu_param);
        dispatch({ cont_type: params.cont_type });
        // log(params);
    }, [menu_param])

    return (
        <TableContext.Provider value={val}>
            <div className={`w-full h-full`}>
                <SearchForm initData={initData} />
                <div className="grid w-full w-full h-[calc(100vh-100px)] grid-cols-3">
                    <MasterGrid initData={initData} />
                    <div className="grid h-full col-span-2 grid-rows-2">
                        <div className="row-span-1"> <CustomerDetail /></div>
                        <div className="row-span-1"> <DetailGrid initData={initData} /></div>
                    </div>
                </div>
            </div>
        </TableContext.Provider>
    );
}
