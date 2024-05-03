
'use client';

import { useEffect, useReducer, useMemo, useCallback, memo } from "react";
import { SP_Load } from "./_component/data";
import { PageState, reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D, SEARCH_MD } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useState } from 'react'
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import SubMenuTab, { tab, WBMenuTab } from "components/tab/tab"
import { useSearchParams } from 'next/navigation'
import WBMain from "./_component/wbMain";
import WBSub from "./_component/wbSub";
import WBMainTab from "./_component/wbMainTab"
// import WBReference from "./_component/waybillReference"
// import ChargesGrid from "./_component/gridCharges";
// import ShipmentDetailGrid from "./_component/gridShipDetail";

const { log } = require('@repo/kwe-lib/components/logHelper');


function UFSM0002() {


    const [selectedTab, setselectedTab] = useState<string>("NM");

    const handleOnClickTab = (code: any) => { setselectedTab(code) }
    const MhandleOnClickTab = (code: any) => {
        if (code.target.id === 'Main') {
            log("code.target.id if", code.target.id);
            dispatch({ MselectedTab: code.target.id })
        }
        else {
            dispatch({ isMDSearch: true, MselectedTab: code.target.id, mSelectedRow: { ...mSelectedRow, mwb_no: code.target.id } })
        }
    }
    const MhandleonClickICON = (code: any) => {
        let filtered = objState.tab1.filter((element: any) => { return element.cd != code.target.id })
        dispatch({ tab1: filtered, MselectedTab: filtered[filtered.length - 1].cd, mSelectedRow: { ...mSelectedRow, waybill_no: filtered[filtered.length - 1].cd } })
    }

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            isMSearch: false,
            isDSearch: false,
            mSelectedRow: {},
            mSelectedDetail: {},
            dSelectedRow: {},
            tab1: [],
            MselectedTab: 'Main',
            isFirstRender: true
        }
    });
    const { objState } = state;
    const { searchParams, mSelectedRow, mSelectedDetail, crudType, isMSearch, isPopUpOpen, MselectedTab, isFirstRender } = objState;

    const val = useMemo(() => { return { objState, searchParams, mSelectedRow, crudType, isMSearch, isPopUpOpen, mSelectedDetail, dispatch } }, [state]);
    const { data: initData } = useGetData('', LOAD, SP_Load, { staleTime: 1000 * 60 * 60, enabled: true });

    useEffect(() => {
        if (objState.isMSearch) {
            // mainRefetch();
            log("mainisSearch", objState.isMSearch);
            // dispatch({isMSearch:false});
        }
    }, [objState?.isMSearch]);


    useEffect(() => {
        if (initData) {
            if (objState.tab1.length < 1) {
                objState.tab1.push({ cd: 'Main', cd_nm: 'Main' })
            }
        }
    }, [initData])


    return (
        <TableContext.Provider value={val}>
            <WBMenuTab tabList={objState.tab1} onClickTab={MhandleOnClickTab} onClickICON={MhandleonClickICON} MselectedTab={MselectedTab} />
            {objState.MselectedTab == "Main" ? <div className={`w-full flex-col ${MselectedTab == "Main" ? "" : "hidden"}`}>
                <SearchForm loadItem={initData} />
                <MasterGrid initData={initData} />
            </div> : <>
                <WBMainTab loadItem={initData} />
                <SubMenuTab loadItem={initData} onClickTab={handleOnClickTab} />

                <div className={`w-full flex ${selectedTab == "NM" ? "" : "hidden"}`}>
                    <WBMain loadItem={initData} isSelected={selectedTab === "NM"} />
                </div>

                <div className={`w-full flex ${selectedTab == "WS" ? "" : "hidden"}`}>
                    <WBSub loadItem={initData} isSelected={selectedTab === "ws"} />
                </div>

                {/* <div className={`w-full flex ${selectedTab == "rf" ? "" : "hidden"}`}>
                    <WBReference loadItem={initData} />
                </div>

                <div className={`w-full flex ${selectedTab == "sd" ? "" : "hidden"}`}>
                    <ShipmentDetailGrid initData={initData} />
                </div>

                <div className={`w-full flex ${selectedTab == "cg" ? "" : "hidden"}`}>
                    <ChargesGrid initData={initData} />
                </div> */}
            </>}
        </TableContext.Provider>
    );
}

export default UFSM0002;