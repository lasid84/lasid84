"use client"

import PageContent from "@/shared/tmpl/page-content"
import { useMemo, useState } from "react";
import {AgGridReact} from "ag-grid-react"
import { GridOptions, Column, CellClickedEvent } from "ag-grid-community";

type Props = {
    listItem: any | null
}

const ListGrid: React.FC<Props> = (props) => {

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
    
  const containerStyle = useMemo(() => "flex flex-col w-full", []);
  const gridStyle = useMemo(() => "w-full h-[450px]", []);

  const { listItem } = props;

  const [colDefs, setColDefs] = useState([
    { field: "user_id" },
    { field: "ipaddr" },
  ]);

    return (
        <>
            <PageContent
                right={<>이벤트 버튼</>}
            >
                <></>
            </PageContent>
            <div className={containerStyle}>
                <div className={`ag-theme-custom ${gridStyle}`}>
                    <AgGridReact
                        gridOptions={gridOptions}
                       rowData={listItem}
                       columnDefs={colDefs}
                    />
                </div>
            </div>
        </>
    )
}

export default ListGrid