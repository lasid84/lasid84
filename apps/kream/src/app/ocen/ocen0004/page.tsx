
'use client';

import { useEffect, useReducer, useMemo, useCallback } from "react";
import { SP_Load } from "./_component/data";
import { reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import DetailGrid from './_component/gridDetail';
import DetailInfo from './_component/DetailInfo';
import { shallow } from "zustand/shallow";
import { useUserSettings } from "@/states/useUserSettings";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { getMenuParameters } = require('@repo/kwe-lib/components/menuParameterHelper.js');


export default function OCEN0004() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isDSearch: false,
            mSelectedRow: {},
            dSelectedRow: {},
            trans_type: '',
            trans_mode: ''
        }
    });
    const { objState } = state;
    const { searchParams, isMSearch } = objState;
    const val = useMemo(() => { return { dispatch, objState } }, [state]);
    
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });
    const menu_param = useUserSettings((state) => state.data.currentParams, shallow);

    useEffect(() => {
        const params = getMenuParameters(menu_param);
        dispatch({ trans_type: params.trans_type, trans_mode: params.trans_mode });
        log(params);
    }, [menu_param])

    return (
        <TableContext.Provider value={val}>
            <div className={`w-full h-full`}>
                <SearchForm initData={initData} />
                <div className="grid w-full h-[calc(100vh-100px)] grid-cols-3">
                    <MasterGrid initData={initData} />
                    <div className="grid h-[calc(100vh-100px)] col-span-2 grid-rows-4">
                        <div className="row-span-1"><DetailInfo /></div>
                        <div className="row-span-3"><DetailGrid initData={initData} /></div>
                    </div>
                </div>
            </div>
        </TableContext.Provider>
    );
}
