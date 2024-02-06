import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageContent from "shared/tmpl/page-content";
import { GridOptions, Column, CellClickedEvent } from "ag-grid-community";
import { useInvoiceStore } from "states/acct/acct2003.store";
import {Tab} from "./tab-list";
import Detail from "page-parts/acct/acct1005-detail"
import Detail2 from "page-parts/acct/acct1005-detail2"
import Detail3 from "page-parts/acct/acct1005-detail3"
import Detail4 from "page-parts/acct/acct1005-detail4"



type Props = {
  listItem: any | null;
  children?: React.ReactNode | React.ReactElement | null;
};

const ListGrid: React.FC<Props> = ({
  listItem,
}) => {
  const gridListRef = useRef<any | null>(null);
  const gridListDefaultColDef = {
    sortable: true,
    resizable: true,
    suppressMenu: false, //메뉴 안보이게
    headerClass: "text-center",
    enableColResize: false,
  };

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [rowData, setRowData] = useState([]);

  const containerStyle = useMemo(() => "flex flex-col w-full", []);
  const gridStyle = useMemo(() => "w-full h-[450px]", []);

  const tabRef = useRef<any>([])


  type TypeGridTab = "ALL" | "SHP" | "CSG" | "SKD" | "INV"

  const TAB_LIST = [
    { index: 0, code_name: "1.Shipper", code : 'SHP' },
    { index: 1, code_name: "2.Consignee", code : 'CSG' },
    { index: 2, code_name: "3.SKD", code : 'SKD' },
    { index: 3, code_name: "4.청구", code : 'INV' },
  ]

    // Tab Index : 상단(기본정보, 추가정보, 비고), 하단(전체보기, 번들)
    const [selectedTab, setSelectedTab] = useState<TypeGridTab>("ALL");
    const [checkState, setCheckState] = useState<string>("NON");

    
  //탭 클릭시
  const handleOnClickTab = (code: any) => {
    setSelectedTab(code);
  };
  useEffect(() => {
    if (listItem) {
      //console.log('check listItem', listItem.data.cursorData[0])
      setRowData(listItem.data.cursorData[0]);
    }
  }, [listItem]);


  return (

    <>
      <PageContent title={
      <Tab  tabList={TAB_LIST} onClickTab={handleOnClickTab} />} >

        <div className={containerStyle}>
          <div className={`ag-theme-custom ${gridStyle}`}>

            <Detail ref={el => (tabRef.current[0]=el)}/>    
            <Detail2 ref={el => (tabRef.current[1]=el)}/>           
            <Detail3 ref={el => (tabRef.current[2]=el)}/>    
            <Detail4 ref={el => (tabRef.current[3]=el)}/>    
          </div>
        </div>
      </PageContent>
    </>
  );
}

export default ListGrid;