"use client"


import PageContent from "@/shared/tmpl/page-content"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {AgGridReact} from "ag-grid-react"
import { GridOptions, Column, CellClickedEvent } from "ag-grid-community";
import { useAppContext } from "@/components/provider/contextProvider";
import { BsCloudDrizzleFill } from "react-icons/bs";
import { SELECTED_ROW } from "./model";

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

    const { dispatch } = useAppContext();

    const gridRef = useRef<any | null>(null);
    const [colDefs, setColDefs] = useState<cols[]>([]);
    const [mainData, setMainData] = useState([{}]);

    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 100,
      };
    }, []);

    const gridOptions: GridOptions = useMemo(() => {
        return {
          rowHeight: 30,
          headerHeight: 25,
          rowSelection: "single",
          // suppressRowClickSelection: true,  // 행 클릭만으로 선택되지 않도록 : true, Clipboard에 영향 미침, cell만 복사
          // suppressCopyRowsToClipboard: false, // true => row 복사 대신 cell 복사
          // suppressHorizontalScroll: false,
          // suppressColumnVirtualisation: true,
          // suppressRowVirtualisation: true,
          // enableRangeSelection: true,
          // // Grid row번호 고정시 사용
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

  const onSelectionChanged = useCallback(() => {
    const selectedRow = gridRef.current.api.getSelectedRows()[0];
    log(selectedRow);
    // setSelectedRow(selectedRow);    
    dispatch({type:SELECTED_ROW, selectedRow:selectedRow});
    // document.querySelector('#selectedRows').innerHTML =
    //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
  }, []);
  
    return (
        <>
        <br></br>
        <div className="text-lg font-bold text-3xl">
          Ag-grid
          <br></br>
          장점 : 기본으로 사용할만한듯
          <br></br>
          단점 : 기본이상 커스텀 안될듯... 유료 구매 필요
          </div>
            <PageContent
                right={<>이벤트 버튼</>}
            >
                <></>
            </PageContent>
            <div className={containerStyle}>
                <div className={`ag-theme-quartz ${gridStyle}`}>
                    <AgGridReact
                       ref={gridRef}
                       gridOptions={gridOptions}
                       rowData={mainData}
                       columnDefs={colDefs}
                       defaultColDef={defaultColDef}
                        rowSelection={'single'}
                        // onGridReady={onGridReady}
                        onSelectionChanged={onSelectionChanged}
                    />
                </div>
            </div>
        </>
    )
}

export default ListGrid