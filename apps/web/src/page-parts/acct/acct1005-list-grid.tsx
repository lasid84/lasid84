"use client"
import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageContent from "shared/tmpl/page-content";
import { GridOptions, Column, CellClickedEvent } from "ag-grid-community";
import { useInvoiceStore } from "states/acct/acct2003.store";
import { Tab } from "./tab-list";
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


  const containerStyle = useMemo(() => "flex flex-col w-full", []);
  const gridStyle = useMemo(() => "w-full h-[450px]", []);

  const tabRef = useRef<HTMLDivElement[]>([])

  type TypeGridTab = "ALL" | "SHP" | "CSG" | "SKD" | "INV"

  const TAB_LIST = [
    { index: 0, code_name: "1.Shipper", code: 'SHP' },
    { index: 1, code_name: "2.Consignee", code: 'CSG' },
    { index: 2, code_name: "3.SKD", code: 'SKD' },
    { index: 3, code_name: "4.청구", code: 'INV' },
  ]

  const [selectedTab, setSelectedTab] = useState<TypeGridTab>("ALL");

  //탭 클릭시
  const handleOnClickTab = (code: any, idx: any) => {
    setSelectedTab(code);
    tabRef.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const gridOptions: GridOptions = useMemo(() => {
    return {
      rowHeight: 30,
      headerHeight: 25,
      rowSelection: "multiple",
      suppressRowClickSelection: true,  // 행 클릭만으로 선택되지 않도록 : true, Clipboard에 영향 미침, cell만 복사
      suppressCopyRowsToClipboard: true, // true => row 복사 대신 cell 복사
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true,
      suppressRowVirtualisation: true,
      enableRangeSelection: true,
      // Grid row번호 고정시 사용
      onSortChanged(e: any) {
        e.api.refreshCells();
      },
      onGridReady(p: any) {
        p.api.hideOverlay();
      },

    };
  }, []);

  return (
    <>
      <PageContent title={
        <Tab tabList={TAB_LIST} onClickTab={handleOnClickTab} />} >
        <div className={containerStyle}>
          <div className={`ag-theme-custom ${gridStyle}`}>
            <div ref={(el) => { tabRef.current[0] = el }}>
              <Detail />
            </div>
            <div ref={(el) => { tabRef.current[1] = el }}>
              <Detail2 />
            </div>
            <div ref={(el) => { tabRef.current[2] = el }}>
              <Detail3 />
            </div>
            <div ref={(el) => { tabRef.current[3] = el }}>
              <Detail4 />
            </div>
          </div>         
        </div>


      </PageContent>
    </>
  );
}

export default ListGrid;