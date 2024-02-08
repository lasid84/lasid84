"use client"

import PageContent from "@/shared/tmpl/page-content"
import { useMemo, useRef, useState, useEffect } from "react";
import { GridOptions } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import {
    gridRowHeight,
    gridUtilDefaultColDef,
    gridUtilDefaultOptions,
    gridOverLayTemplate
} from "utils/grid";
import { TButtonBlue } from "@/page-parts/tmpl/form/button"
import { useStnd0004Store } from "@/states/stnd/stnd0004.store"
import Modal from "./popup";

type Props = {
    listItem: any | null
}
const ListGrid: React.FC<Props> = ({ listItem }) => {

        //zustand
        const actions = useStnd0004Store((state) => state.actions)
        const isPopOpen = useStnd0004Store((state) => state.isPopOpen)
        const popType = useStnd0004Store((state) => state.popType);
    

    const containerStyle = useMemo(() => "flex flex-col w-full", []);
    const gridStyle = useMemo(() => "w-full h-[450px]", []);
    const [rowData, setRowData] = useState([]);
    const columns = useMemo(() => {
        if (listItem === undefined || !listItem || listItem.length === 0) return [];//early return
        const firstRow = listItem.data.cursorData[0][0];
        return Object.keys(firstRow).map((key) =>
        ({
            title: key,
            field: key,
            width: 100,
            sorter: 'string',
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
        if (listItem) {            
            setRowData(listItem.data.cursorData[0]);
            gridRef?.current?.api?.hideOverlay();
        } else {
            gridRef?.current?.api?.showLoadingOverlay();
        }
    }, [listItem]);


    return (
        <>
            <PageContent
                right={<> <TButtonBlue label="등록" onClick={() => {
                    actions.setPopOpen(true)
                }} /></>}
            >
            </PageContent>
            <div className={containerStyle}>
                <div className={`ag-theme-custom ${gridStyle}`}>
                    <AgGridReact
                        ref={gridListRef}
                        gridOptions={gridOptions}
                        rowData={rowData}
                        columnDefs={columns}
                    />
                    <Modal
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