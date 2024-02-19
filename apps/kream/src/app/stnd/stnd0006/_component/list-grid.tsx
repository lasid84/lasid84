"use client"

import PageContent from "@/shared/tmpl/page-content"
import { useEffect, useMemo, useState } from "react";
import {AgGridReact} from "ag-grid-react"
import { GridOptions, Column, CellClickedEvent } from "ag-grid-community";
import { TableContext, useAppContext } from "../page";
import { BsCloudDrizzleFill } from "react-icons/bs";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    listItem: any | null
    colVisible: {
      col: string[]
      visible:boolean
    }
}

type cols = {
  field: string;
  hide: boolean;
}

const ListGrid: React.FC<Props> = (props) => {

    // log("======================listgrid 시작", props.listItem)
    const [colDefs, setColDefs] = useState<cols[]>([]);
    const [mainData, setMainData] = useState([{}]);

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
  const gridStyle = useMemo(() => "w-full h-[550px]", []);

  const { listItem, colVisible } = props;

  useEffect(() => {
    if (Array.isArray(listItem) && listItem.length > 0) {
      let cols:any[] = [];
      const columns = Object.keys(listItem[0]);
      columns.map((col:string) => {

        let isHide: boolean = colVisible["visible"];
        if (colVisible["col"].indexOf(col) > -1) {
          isHide = !colVisible["visible"]
        }

        cols.push({
          field:col,
          hide: isHide
        });
      });      
      setColDefs(cols);
      setMainData(listItem);
    }
    // log("colDefs", colDefs);
  }, [listItem]);
  
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
                       rowData={mainData}
                       columnDefs={colDefs}
                    />
                </div>
            </div>
        </>
    )
}

export default ListGrid