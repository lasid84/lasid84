
'use client';

import { useEffect, useReducer, useMemo, useCallback } from "react";
import { SP_Load } from "./_component/data";
import { PageState, reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D, SEARCH_MD } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useState } from 'react'
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import SubMenuTab, { tab, TabICON } from "components/tab/tab"
import { useSearchParams } from 'next/navigation'
import WBMain from "./_component/wbMain";
import WBSub from "./_component/wbSub";
import WBReference from "./_component/wbreferences"
import WBShipmentDetails from "./_component/wbShipmentDetails"
import WBCharges from "./_component/wbCharges"
import WBShipmentText from "./_component/wbShipmentText"
import ChargesGrid from "./_component/gridCharges";
import ShipmentDetailGrid from "./_component/gridShipDetail";

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function Ufsm0001() {

    const [tab, settab] = useState<tab[]>()
    const [selectedTab, setselectedTab] = useState<string>("NM");

    const handleOnClickTab = (code: any) => { setselectedTab(code) }
    const MhandleOnClickTab = (code: any) => {
        console.log('filtered MhandleOnClickTab', code.target.id)
        dispatch({ isMDSearch: true, MselectedTab: code.target.id, mSelectedRow: { ...mSelectedRow, waybill_no: code.target.id } })
    }
    const MhandleonClickICON = (code: any) => {
        let filtered = objState.tab1.filter((element: any) => { return element.cd != code.target.id })
        dispatch({ tab1: filtered, MselectedTab: filtered[filtered.length - 1].cd,  mSelectedRow: { ...mSelectedRow, waybill_no: filtered[filtered.length - 1].cd } })

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
            MselectedTab: 'Main'
        }
    });
    const { objState } = state;
    const { searchParams, mSelectedRow, mSelectedDetail, crudType, isMSearch, isPopUpOpen, MselectedTab } = objState;

    const val = useMemo(() => { return { objState, searchParams, mSelectedRow, crudType, isMSearch, isPopUpOpen, mSelectedDetail, dispatch } }, [state]);
    const { data: initData } = useGetData('', LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });

    useEffect(() => {
        if (objState.isMSearch) {
            // mainRefetch();
            log("mainisSearch", objState.isMSearch);
            // dispatch({isMSearch:false});
        }
    }, [objState?.isMSearch]);


    useEffect(() => {
        if (initData) {
            // log("loadItem", initData[14].data)
            // settab(initData[14].data)
            settab([{ cd: 'NM', cd_nm: 'waybill Main' },
            { cd: 'ws', cd_nm: 'waybill sub' },
            { cd: 'rf', cd_nm: 'references' },
            { cd: 'sd', cd_nm: 'shipment details' },
            { cd: 'cg', cd_nm: 'charges' },
            { cd: 'st', cd_nm: 'shipment text' },
            ])
            if (objState.tab1.length < 1) {
                objState.tab1.push({ cd: 'Main', cd_nm: 'Main' })
            }
        }
    }, [initData])


    return (
        <TableContext.Provider value={val}>
            <TabICON tabList={objState.tab1} onClickTab={MhandleOnClickTab} onClickICON={MhandleonClickICON} MselectedTab={MselectedTab} />
            {objState.MselectedTab == "Main" ? <div className={`w-full flex-col ${MselectedTab == "Main" ? "" : "hidden"}`}>
                <SearchForm loadItem={initData} />
                <MasterGrid initData={initData} />
            </div> : <>
                <SubMenuTab tabList={tab} onClickTab={handleOnClickTab} />
                <div className={`w-full flex ${selectedTab == "NM" ? "" : "hidden"}`}>
                    <WBMain loadItem={initData} />
                </div>

                <div className={`w-full flex ${selectedTab == "ws" ? "" : "hidden"}`}>
                    <WBSub loadItem={initData} />
                </div>

                <div className={`w-full flex ${selectedTab == "rf" ? "" : "hidden"}`}>
                    <WBReference loadItem={initData} />
                </div>

                <div className={`w-full flex ${selectedTab == "sd" ? "" : "hidden"}`}>
                    <WBShipmentDetails initData={initData} />
                </div>

                <div className={`w-full flex ${selectedTab == "cg" ? "" : "hidden"}`}>
                    <WBCharges initData={initData} />
                </div>

                <div className={`w-full flex ${selectedTab == "st" ? "" : "hidden"}`}>
                    <WBShipmentText initData={initData} />
                </div>
            </>}
        </TableContext.Provider>
    );
}
