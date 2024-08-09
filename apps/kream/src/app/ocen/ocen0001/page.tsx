
'use client';

import { useEffect, useReducer, useMemo, useCallback } from "react";
import { SP_Load, SP_GetMasterData, SP_GetDetailData } from "./_component/data";
import { PageState, reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
// import DetailGrid from './_component/gridDetail';
import ContactGrid from 'components/commonForm/carrierContact';
import DetailInfo from './_component/DetailInfo';

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function OCEN0001() {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isDSearch: false,
            isIFPopUpOpen: false,
            mSelectedRow: {},
            dSelectedRow: {},
        }
    });
    const { objState } = state;
    const { searchParams, isMSearch } = objState;
    const val = useMemo(() => { return { dispatch, objState } }, [state]);

      return (
        <TableContext.Provider value={val}>
            <div className={`w-full h-full`}>
                <SearchForm  />
                <div className="grid w-full h-[calc(100vh-100px)] grid-cols-3">
                    <MasterGrid  />
                    <div className="grid h-full col-span-2 grid-rows-5">
                        <div className="row-span-1"><DetailInfo /></div>
                        <div className="row-span-2"><ContactGrid params={{carrier_code: objState.mSelectedRow?.carrier_code, cont_type:"task"}} /></div>
                        <div className="row-span-2"><ContactGrid params={{carrier_code: objState.mSelectedRow?.carrier_code, cont_type:"sale"}} /></div>

                    </div>
                </div>
            </div>
        </TableContext.Provider>
    );
}
