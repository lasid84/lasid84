"use client";

import { useEffect, useReducer, useMemo, useRef } from "react";
import { SP_Load, SP_GetMasterData } from "./_component/data";
import {
  reducer,
  TableContext,
} from "components/provider/contextObjectProvider";
import {
  LOAD,
  SEARCH_M,
  SEARCH_MD,
} from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form";
import { useState } from "react";
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from "./_component/gridMaster";
import { WBMenuTab } from "components/tab/tab";
import BKMainTab from "./_component/bkMainTab";
import BKMain from "./_component/bkMain";
import BKCargo from "./_component/bkCargo";
import BKCost from "./_component/bkCost";
import { useUserSettings } from "states/useUserSettings";
import BKSchedule from "./_component/bkSchedule";
import { shallow } from "zustand/shallow";
import { gridData } from "@/components/grid/ag-grid-enterprise";

const { log } = require("@repo/kwe-lib/components/logHelper");
const {
  getMenuParameters,
} = require("@repo/kwe-lib/components/menuParameterHelper.js");

export default function OCEN1001() {
  const [selectedTab, setselectedTab] = useState<string>("NM");
  const [state, dispatch] = useReducer(reducer, {
    objState: {
      searchParams: {},
      isMSearch: false,
      isMDSearch: false,
      isDSearch: false,
      isPKCSearch: false,
      isCGOSearch: false,   //Cargo
      isCSTSearch : false,  //Cost
      mSelectedRow: {},
      mSelectedCargo: {},
      tab1: [],
      MselectedTab: "Main",
      isFirstRender: true,    //화면 처음 렌더링시에만 조회버튼 클릭 되도록 하기위한 state
      trans_mode: "",
      trans_type: "",
      gridRef_m: useRef<any | null>(null),
      isShpContPopUpOpen: false,
      isCarrierContPopupOpen: false,
      isCYPopupOpen: false,
      isCYContPopupOpen:false,
      isPickupPopupOpen: false,
      mGridState: {},
      mGridStateInit: null,
    },
  });
  const { objState } = state;
  const {
    searchParams,
    mSelectedRow,
    mSelectedCargo,
    crudType,
    isMSearch,
    isShpPopUpOpen,
    MselectedTab,
    isPKCSearch,
  } = objState;

  
  
  const val = useMemo(() => {
    return {
      objState,
      searchParams,
      mSelectedRow,
      crudType,
      isMSearch,
      isPKCSearch,
      isShpPopUpOpen,
      mSelectedCargo,
      dispatch,
    };
  }, [state]);

  const { data: initData } = useGetData("", LOAD, SP_Load, {staleTime: 1000 * 60 * 60})
  const { data: mainData, refetch: mainRefetch } = useGetData({ no: objState?.MselectedTab }, SEARCH_M, SP_GetMasterData, { enabled: false })

  //사용자 정보
  const menu_param = useUserSettings((state) => state.data.currentParams,shallow);

  useEffect(() => {
    const params = getMenuParameters(menu_param);
    dispatch({
      trans_mode: params.trans_mode,
      trans_type: params.trans_type,
    });
    // log('cont_type? OCEN1000', params)
  }, [menu_param]);

  useEffect(() => {
    if (objState.isMSearch) {
      mainRefetch();
      log("mainisSearch", objState.isMSearch);
      dispatch({ isMSearch: false });
      if (initData) {
        if (objState.tab1.length < 1) {
          objState.tab1.push({ cd: "Main", cd_nm: "Main" });
        }
      }
    }
  }, [initData]);

  useEffect(() => {
    if (objState.isMSearch) {
        mainRefetch();
        dispatch({ isMSearch: false });
        //if (gridRef.current) gotoFirstRow(gridRef.current)
    }
}, [objState?.isMSearch]);

  useEffect(() => {
    if (objState.isMDSearch) {
      mainRefetch();
      log("main MDSearch", objState.isMDSearch);
      dispatch({ isMDSearch: false });
    }
  }, [objState?.isMDSearch]);

  useEffect(() => {
    log("Page : ", objState?.MselectedTab, mainData);
    if (mainData) {
      dispatch({
        [objState?.MselectedTab]: (mainData as gridData).data[MselectedTab-1], //template id와 getdata row번호가 맞지 않으면, 데이터가 바인딩 되지 않음
        bkData: (mainData as gridData).data[0], 
    });
    }
  }, [mainData])

  useEffect(() => {
    if (initData) {
      if (objState.tab1.length < 1) {
        objState.tab1.push({ cd: "Main", cd_nm: "Main" });
      }
    }
  }, [initData]);

  const handleOnClickTab = (code: any) => {
    //tab click event , 작성중인경우, update 한 경우 팝업알림(저장)
    setselectedTab(code);
  };
  const MhandleOnClickTab = (code: any) => {
    // log("MhandleOnClickTab", code)
    if (code.target.id === "Main") {
      dispatch({ MselectedTab: code.target.id });
    } else {
      let needSearch = objState[code.target.id] ? false : true;
      dispatch({
        isMDSearch: needSearch,
        MselectedTab: code.target.id,
      });
    }
  };
  const MhandleonClickICON = (code: any) => {
    // log("MhandleonClickICON", code)
    let filtered = objState.tab1.filter((element: any) => {
      return element.cd != code.target.id;
    });
    dispatch({
      tab1: filtered,
      MselectedTab: filtered[filtered.length - 1].cd,
      [code.target.id]: null
      });
  };

  return (
    <TableContext.Provider value={val}>
      <div className={`w-full h-full`}>
        <WBMenuTab
          tabList={objState.tab1}
          onClickTab={MhandleOnClickTab}
          onClickICON={MhandleonClickICON}
          MselectedTab={MselectedTab}
        />
        {/* WayBill Main List 화면 */}
        {objState.MselectedTab == "Main" ? (
          <>
            <SearchForm loadItem={initData} />
            <div className={`w-full flex-col ${MselectedTab == "Main" ? "" : "hidden"}`}>
              <div className="w-full">
                <MasterGrid initData={initData} mainData={mainData} />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Booking Note Detail 화면 상단{Tab} */}
            <BKMainTab
              loadItem={initData}
              bkData={objState[MselectedTab]}
              onClickTab={handleOnClickTab}
            />

            {/* Booking Note Detail 화면 하단(Sub) */}
            <div
              className={`w-full flex ${selectedTab == "NM" ? "" : "hidden"}`}
            >
              <BKMain loadItem={initData as []} 
                bkData={objState[MselectedTab]}
              />
            </div>

            <div
              className={`w-full flex ${selectedTab == "SK" ? "" : "hidden"}`}
            >
              <BKSchedule loadItem={initData} 
                bkData={objState[MselectedTab]} />
            </div>
            <div
              className={`w-full flex ${selectedTab == "CG" ? "" : "hidden"}`}
            >
              <BKCargo loadItem={initData} mainData={mainData} />
            </div>
            <div
              className={`w-full flex ${selectedTab == "CT" ? "" : "hidden"}`}
            >
              <BKCost loadItem={initData} mainData={mainData} />
            </div>
          </>
        )}
      </div>
    </TableContext.Provider>
  );
}
