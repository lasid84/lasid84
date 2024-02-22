"use client"

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import 'ag-grid-enterprise';

import PageContent from "@/shared/tmpl/page-content"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GridOptions, Column, CellClickedEvent } from "ag-grid-community";

import { useAppContext } from "@/components/provider/contextProvider";
import { SELECTED_ROW } from '@/app/stnd/stnd0006/_component/model';
import './styles.css';

// import { SELECTED_ROW } from "./model";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    listItem: any | null
    colVisible?: {
      col: string[]
      visible:boolean
    }
}

type cols = {
  field: string;
  hide: boolean;
  filter?:boolean;
  floatingFilter?:boolean;
}

const isFirstColumn = (params) => {
  var displayedColumns = params.api.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
};

const ListGrid: React.FC<Props> = (props) => {

    // log("======================listgrid 시작", props.listItem)

    const { dispatch } = useAppContext();

    const gridRef = useRef<any | null>(null);
    const [colDefs, setColDefs] = useState<cols[]>([]);
    const [mainData, setMainData] = useState([{}]);

    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 50,
        filter: true,
        headerCheckboxSelection: isFirstColumn,
        checkboxSelection: isFirstColumn,
      };
    }, []);

    const gridOptions: GridOptions = useMemo(() => {
        return {
          rowHeight: 25,
          headerHeight: 25,
          enableRangeSelection:true,  // enterprise
          // copyHeadersToClipboard:true,
          suppressMultiRangeSelection:true,
          rowSelection: 'multiple',
          // suppressRowClickSelection: true,  // 행 클릭만으로 선택되지 않도록 : true, Clipboard에 영향 미침, cell만 복사
          // suppressCopyRowsToClipboard: false, // true => row 복사 대신 cell 복사
          // suppressHorizontalScroll: false,
          // suppressColumnVirtualisation: true,
          // suppressRowVirtualisation: true,
          // enableRangeSelection: true,
          // // Grid row번호 고정시 사용
          // onSortChanged(e: any) {
          //   e.api.refreshCells();
          // },
          // onGridReady(p: any) {
          //   p.api.hideOverlay();
          // },
    
        };
      }, []);
    
  const containerStyle = useMemo(() => "flex flex-col w-full", []);
  const gridStyle = useMemo(() => "w-full h-[550px]", []);

  const { listItem, colVisible } = props;

  useEffect(() => {
    if (Array.isArray(listItem) && listItem.length > 0) {
      let cols:cols[] = [];
      const columns = Object.keys(listItem[0]);
      columns.map((col:string) => {

        let isHide: boolean = colVisible!["visible"];
        if (colVisible!["col"].indexOf(col) > -1) {
          isHide = !colVisible!["visible"]
        }

        cols.push({
          field:col,
          hide: isHide,
          floatingFilter: true
          
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
          <div className={containerStyle}>
              <div 
                // className={`ag-theme-quartz ${gridStyle}`}
                className={`ag-theme-quartz ${gridStyle}`}
                style={{height:500}}
              >
                  <AgGridReact
                      ref={gridRef}
                      gridOptions={gridOptions}
                      rowData={mainData}
                      columnDefs={colDefs}
                      defaultColDef={defaultColDef}
                      // rowSelection={'single'}
                      // onGridReady={onGridReady}
                      // enableRangeSelection={true}
                      onSelectionChanged={onSelectionChanged}
                  />
              </div>
          </div>
        </>
    )
}

export default ListGrid