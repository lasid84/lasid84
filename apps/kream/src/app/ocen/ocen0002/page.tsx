
'use client';

import { useEffect, useReducer, useMemo, useCallback } from "react";
import { SP_Load, SP_GetMasterData, SP_GetDetailData } from "./_component/data";
import { PageState, reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import CustCont from 'components/commonForm/customerContact';
import DetailInfo from './_component/DetailInfo';
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";

import { log, error, getMenuParameters } from '@repo/kwe-lib-new';


export default function OCEN0002() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isDSearch: false,
            isIFPopUpOpen: false,
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
        dispatch({ cont_type:(params as {cont_type: string}).cont_type });
    }, [menu_param])

    return (
        <TableContext.Provider value={val}>
            <div className={`w-full h-full`}>
                <SearchForm  />
                <div className="grid w-full h-[calc(100vh-100px)] grid-cols-3">
                    <MasterGrid  />
                    <div className="grid h-[calc(100vh-100px)] col-span-2 grid-rows-2 ">
                        <div className="row-span-1"><DetailInfo /></div>
                        <div className="row-span-1">
                            <CustCont 
                            initData={initData} 
                            params={{ cust_code: objState.mSelectedRow?.cust_code, cont_type: objState.cont_type}} />
                        </div>
                    </div>
                </div>
            </div>
        </TableContext.Provider>
    );
}
