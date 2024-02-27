"use client"

import PageContent from "@/shared/tmpl/page-content"
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { GridOptions } from "ag-grid-community"
import { toastSuccess } from "@/page-parts/tmpl/toast";
import { AgGridReact } from "ag-grid-react"
import {
  gridRowHeight,
  gridUtilDefaultColDef,
  gridUtilDefaultOptions,
  gridOverLayTemplate
} from "utils/grid";
import { TButtonBlue } from "@/page-parts/tmpl/form/button"
import { useStnd0005Store } from "@/states/stnd/stnd0005.store";
import Modal from "./popup"
import { PopType } from "@/utils/modal";
import { useAppContext } from "@/components/provider/contextProvider";
import { SELECTED_ROW } from "./model";

const { log } = require('@repo/kwe-lib/components/logHelper');

export interface returnData {
  numericData: any,
  textData: string,
  cursorData: string[],
}
type Props = {
  loadItem: any | null
  listItem: any | null
  colVisible?: {
    col: string[]
    visible: boolean
  }
}

type cols = {
  field: string;
  hide: boolean;
  filter?: boolean;
  floatingFilter?: boolean;
}

const ListGrid: React.FC<Props> = (props) => {
  // log("======================listgrid 시작", props.listItem)

  const { dispatch } = useAppContext();
  const { loadItem } = props;

  const gridRef = useRef<any | null>(null);
  const [colDefs, setColDefs] = useState<cols[]>([]);
  const [mainData, setMainData] = useState([{}]);
  const [selectedData, setSelectedData] = useState({})

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sorter: 'string',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
    };
  }, []);

  const gridOptions: GridOptions = useMemo(() => {
    return {
      rowHeight: 25,
      headerHeight: 25,
      enableRangeSelection: true,  // enterprise
      // copyHeadersToClipboard:true,
      suppressMultiRangeSelection: true,
      rowSelection: 'multiple',
    };
  }, []);

  const containerStyle = useMemo(() => "flex flex-col w-full", []);
  const gridStyle = useMemo(() => "w-full h-[550px]", []);
  const [isOpen, setIsOpen] = useState(false)
  const [popType, setPopType] = useState(PopType.CREATE)

  const { listItem, colVisible } = props;

  useEffect(() => {
    if (Array.isArray(listItem) && listItem.length > 0) {
      let cols: cols[] = [];
      const columns = Object.keys(listItem[0]);
      columns.map((col: string) => {

        let isHide: boolean = colVisible!["visible"];
        if (colVisible!["col"].indexOf(col) > -1) {
          isHide = !colVisible!["visible"]
        }

        cols.push({
          field: col,
          hide: isHide,
          floatingFilter: true

        });
      });
      setColDefs(cols);
      setMainData(listItem);
    }
    // log("colDefs", colDefs);
  }, [listItem]);

  //onSelectionChanged
  const onCellClickedHandler = useCallback(() => {
    const selectedRow = gridRef.current.api.getSelectedRows()[0];
    log(selectedRow);
    dispatch({ type: SELECTED_ROW, selectedRow: selectedRow });
    setIsOpen(true)
    setPopType(PopType.UPDATE)
    setSelectedData(selectedRow)
  }, []);

  return (
    <>
      <PageContent
        right={<> <TButtonBlue label="등록" onClick={() => {
          setIsOpen(true)
          setSelectedData('')
          setPopType(PopType.CREATE)
          //actions.setPopOpen(true)
        }} /></>}
      >
      </PageContent >
      <div className={containerStyle}>
        <div className={`ag-theme-custom ${gridStyle}`}>
          <AgGridReact
            ref={gridRef}
            gridOptions={gridOptions}
            rowData={mainData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            //onSelectionChanged={onSelectionChanged}
            onCellClicked={onCellClickedHandler}

          />
          <Modal
            loadItem={loadItem}
            selectedData={selectedData}
            popType={popType}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
    </>
  )
}

export default ListGrid