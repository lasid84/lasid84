"use client"

import PageContent from "@/shared/tmpl/page-content"
import { useMemo, useRef, useState, useEffect,useCallback } from "react";
import { GridOptions } from "ag-grid-community"
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

export interface returnData {
    numericData: any,
    textData: string,
    cursorData: string[],
}
type Props = {
    listItem: any | null
    isInitialLoading: any
    isError: any
    loadData: {
        data: returnData
    } | undefined,
}

const ListGrid: React.FC<Props> = ({ loadData, listItem, isInitialLoading, isError }) => {
    //zustand
    const actions = useStnd0005Store((state) => state.actions)
    const isPopOpen = useStnd0005Store(((state) => state.isPopOpen))
    const popType = useStnd0005Store((state) => state.popType)

    const containerStyle = useMemo(() => "flex flex-col w-full", []);
    const gridStyle = useMemo(() => "w-full h-[600px]", []);
    const [rowData, setRowData] = useState([]);

    const columns = useMemo(() => {
        //early return
        if (listItem === undefined || listItem === null || !listItem || listItem.length === 0) return [];//early return
        const firstRow = listItem.data.cursorData[0][0];
        return Object.keys(firstRow).map((key) =>
        ({
            title: key,
            field: key,
            width: 180,
            sorter: 'string',
            floatingFilter: true,
            filter: 'agTextColumnFilter',
        }));
    }, [listItem])
    const gridRef: any = useRef<any>(null);
    const gridListRef = useRef<any | null>(null);
    const gridOptions: GridOptions = {
        defaultColDef: {
            ...gridUtilDefaultColDef,
            editable: false,
            cellStyle: { textAlign: "left" }, //왼쪽 정렬
        },
        ...gridRowHeight,
        ...gridUtilDefaultOptions,
        ...gridOverLayTemplate,
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
            p?.api?.sizeColumnsToFit();
        },
        isRowSelectable: (params: any) => (params?.data?.use_yn > "Y" ? false : true),
    };

    useEffect(() => {
        console.log('isLoading', isInitialLoading)
        console.log('isError', isError)
        if (listItem) {
            setRowData(listItem.data.cursorData[0]);
            gridRef?.current?.api?.hideOverlay();
        } else {
            gridRef?.current?.api?.showLoadingOverlay();
        }
    }, [listItem]);

    // api service axios interceptors를 통해 zustand query status 관리
    // if (isInitialLoading) { return <><LoadingComponent /></> }
    //Row클릭
    const cellClickedHandler = useCallback((event: any) => {
        const columnId: string = event.column.getColId();
        console.log('클릭이벤트 데이터 확인', event.data)       
        if (columnId === "grp_cd") {
          actions.setPopData(event.data);
          actions.setPopOpen(true, PopType.UPDATE);
        }
    }, [])
    return (
        <>
            <PageContent
                right={<> <TButtonBlue label="등록" onClick={() => {
                    actions.setPopOpen(true)
                }} /></>}
            >
            </PageContent >
            <div className={containerStyle}>
                <div className={`ag-theme-custom ${gridStyle}`}>
                    <AgGridReact
                        ref={gridListRef}
                        gridOptions={gridOptions}
                        rowData={rowData}
                        columnDefs={columns}
                        onCellClicked={cellClickedHandler}
                    />
                    <Modal
                        loadData={loadData}
                        isOpen={isPopOpen}
                        popType={popType}
                        setIsOpen={actions.setPopOpen}
                    />
                </div>
            </div>
        </>
    )
}

export default ListGrid