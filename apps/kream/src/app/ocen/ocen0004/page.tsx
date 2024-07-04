
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
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
            cont_type: '',
            gridRef_m: useRef<any | null>(null)
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
    }, [menu_param])

    return (
        <TableContext.Provider value={val}>
            <div className={`w-full h-full`}>
                <SearchForm />
                <div className="grid w-full h-[calc(100vh-100px)] grid-cols-3">
                    <MasterGrid  />
                    <div className="grid h-[calc(100vh-100px)] col-span-2 grid-rows-4">
                        <div className="row-span-1"><DetailInfo initData={initData} /></div>
                        <div className="row-span-3"><DetailGrid /></div>
                    </div>
                </div>
            </div>
        </TableContext.Provider>
    );
}
