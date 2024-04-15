
'use client';

import { useEffect, useReducer, useMemo, useCallback } from "react";
import { SP_Load, SP_GetMasterData, SP_GetDetailData } from "./_component/data";
import { PageState, reducer, TableContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useState } from 'react'
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster';
import DetailGrid from './_component/gridDetail';
import CustomerDetail from './_component/custDetailInfo';
import Tab, { tab, TabICON } from "components/tab/tab"

import { useSearchParams } from 'next/navigation'
import WBMain from "./_component/waybillMain";
import WBSub from "./_component/waybillSub";

const { log } = require('@repo/kwe-lib/components/logHelper');


export default function ACCT9999() {

    const [tab, settab] = useState<tab[]>()
    const [selectedTab, setselectedTab] = useState<string>("NM");

    const handleOnClickTab = (code: any) => { setselectedTab(code) }
    const MhandleOnClickTab = (code: any) => {
        console.log('code', code)
        console.log('code.terget.innerText', code.target.id)
        dispatch({ MselectedTab: code.target.id })
    }
    const MhandleonClickICON = (code: any) => { objState.tab1.pop({ cd: code.target.id }) }

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
    const { data: mainData, refetch: mainRefetch } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enabled: false })


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
                // { cd: 'wi', cd_nm: 'waybill import' },
                // { cd: 'nf', cd_nm: 'notification' },
                // { cd: 'sm', cd_nm: 'summary' }
            ])
            if (objState.tab1.length < 1) {
                objState.tab1.push({cd: 'Main', cd_nm: 'Main' })
            }
        }
    }, [initData])

    useEffect(() => {
        if (objState.tab1) {
            //objState.tab1.push({ cd: 'Main', cd_nm: 'Main' })
        }
    }, [objState.tab1])

    return (
        <TableContext.Provider value={val}>
            <TabICON tabList={objState.tab1} onClickTab={MhandleOnClickTab} onClickICON={MhandleonClickICON} MselectedTab={MselectedTab} />
            {objState.MselectedTab == "Main" ? <div className={`w-full flex-col ${MselectedTab == "Main" ? "" : "hidden"}`}>
                <SearchForm loadItem={initData} />
                <MasterGrid initData={initData} />
            </div> : <>
                <Tab tabList={tab} onClickTab={handleOnClickTab} />
                <div className={`w-full flex ${selectedTab == "NM" ? "" : "hidden"}`}>
                    <WBMain loadItem={initData} mainData={mainData} />
                </div>

                <div className={`w-full flex ${selectedTab == "ws" ? "" : "hidden"}`}>
                    <WBSub loadItem={initData} mainData={mainData} />
                </div>

            </>}
            {/* <div className={`w-full flex-col ${MselectedTab == "MN" ? "" : "hidden"}`}>
                <SearchForm loadItem={initData} />
                <MasterGrid initData={initData} />
            </div> */}


            {/* <div className="w-full grid grid-cols-5 space-x-1">
                <div className="flex col-span-3">
                    <MasterGrid initData={initData} />
                </div>
                <div className="flex col-span-2">
                    <CustomerDetail loadItem={initData} />
                </div>
            </div>
            <DetailGrid initData={initData} /> */}
        </TableContext.Provider>
    );
}
