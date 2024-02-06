import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageContent from "shared/tmpl/page-content";
import { GridOptions, Column, CellClickedEvent } from "ag-grid-community";
import { useInvoiceStore } from "states/acct/acct2003.store";
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

  const searchParam = useInvoiceStore((state) => state.searchParam)
  const targetValue = useInvoiceStore((state) => state.targetValue)
  const actions = useInvoiceStore((state) => state.actions)

  const containerStyle = useMemo(() => "flex flex-col w-full", []);
  const gridStyle = useMemo(() => "w-full h-[450px]", []);
  const footStyle = useMemo(() => "w-full h-[200px]", [])
  const [rowData, setRowData] = useState([]);
  const [taxno, setTaxno] = useState('');
  const columns = React.useMemo(() => {
    console.log('handle empty data', listItem)
    if (listItem === undefined || !listItem || listItem.length === 0) return []; // Handle empty data   
    const firstRow = listItem.data.cursorData[0][0];

    const a = [{
      headerName: "No",
      field: 'chk',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      valueGetter: "node.rowIndex + 1",
      width: 50,
    },
    { field: 'billto_code', width: 100, sorter: 'string' },
    { field: 'billto_nm', width: 100, sorter: 'string' },
    { field: 'house_bl_no', width: 100, sorter: 'string' },
    { field: 'invoice_no', width: 100, sorter: 'string' },
    { field: 'etdeta', width: 100, sorter: 'string' },
    { field: 'shprcnee_code', width: 100, sorter: 'string' },
    { field: 'shprcnee_nm', width: 100, sorter: 'string' },
    { field: 'port', width: 100, sorter: 'string' },
    { field: 'user_id', width: 100, sorter: 'string' },
    { field: 'free_house_term', width: 100, sorter: 'string' },
    { field: 'freight_term', width: 100, sorter: 'string' },
    { field: 'tax_no', width: 100, sorter: 'string' },
    { field: 'apply_to_sts', width: 100, sorter: 'string' },
    { field: 'billing_or', width: 100, sorter: 'string' },
    { field: 'notedi_b_cnk', width: 100, sorter: 'string' },
    {
      field: 'billing_yn', width: 100, sorter: 'string'
      , cellStyle: (params: any) => {
        if (params.value === 'Y') {
          return { color: 'red', backgroundColor: 'yellow' }
        }
      }
    },
    { field: 'duty_10', width: 100, sorter: 'string' },
    { field: 'duty_00', width: 100, sorter: 'string' },
    { field: 'vat_amt', width: 100, sorter: 'string' },
    { field: 'duty_no', width: 100, sorter: 'string' },
    { field: 'tot_amt', width: 100, sorter: 'string' },
    { field: 'ccn_cnt', width: 100, sorter: 'string' },
    ]
    return a
    // return Object.keys(firstRow).map((key) => 
    // ({
    //   title: key,          
    //   field: key,
    //   width : 100,
    //   sorter: 'string',       
    //   }));
   

  }, [listItem]);

  




  const gridOptions: GridOptions = useMemo(() => {
    return {
      // rowHeight: 30,
      // headerHeight: 25,
      // rowSelection: "multiple",
      // suppressRowClickSelection: true,  // 행 클릭만으로 선택되지 않도록 : true, Clipboard에 영향 미침, cell만 복사
      // suppressCopyRowsToClipboard: true, // true => row 복사 대신 cell 복사
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


  const getColumnValueOfSelectedCell = (columnId: string) => {
    const selectedNodes = gridListRef.current.api.getSelectedNodes();

    if (selectedNodes.length > 0) {
      const selectedNode = selectedNodes[0];
      const columnValue = selectedNode.data[columnId];

      //eslint-disable-next-line
      console.log(`컬럼 필드 : ${columnId}, 컬럼 값 : ${columnValue}`);
      console.log(`선택된 컬럼 : ${JSON.stringify(selectedNode.data, null, 2)}`);
    }
  };

  const onGridReady = (e: any) => {
    //e.api.sizeColumnsToFit();
    e.columnApi.resetColumnState();
    e.api.hideOverlay();
  };

  //getRowID 중복인경우 ag-gird 렌더링시 중복렌더링 오류발생
  const getRowId = (params: any) => {
    return params.data.invoice_no
  };

  //Row클릭
  const cellClickedHandler = useCallback((event: any) => {
    const columnId: string = event.column.getColId();
    console.log('클릭이벤트 데이터 확인', event.data)
    setTaxno(event.data.tax_no)
    // if (columnId === "invoice_no") {
    //   actions.setPopData(event.data);
    //   actions.setPopOpen(true, PopType.UPDATE);
    // }
    // onSelectColumn(event);
  }, [])

  //Row-checkbox 클릭
  const selectionChangedHandler = useCallback((event: any) => {
    const selectedRows = gridListRef?.current?.api?.getSelectedRows()
    if (selectedRows && selectedRows.length > 0) {
      console.log('selectedRow,', selectedRows)
      let invoice_list = ''
      let no = ''
      selectedRows.map((i: any) => {
        invoice_list += i.invoice_no + ','
        no = i.house_bl_no
      })

      actions.setTargetValue({
        no: no,
        invoice_list: invoice_list
      })

      //console.log('체크', JSON.stringify(searchParam))
    }
  }, [])

  const cellvalueChangedHandler = useCallback((event: any) => {
    console.log('event', event)
  }, [])

  useEffect(() => {
    if (listItem) {
      //console.log('check listItem', listItem.data.cursorData[0])
      setRowData(listItem.data.cursorData[0]);
    }
  }, [listItem]);


  return (

    <>
      <PageContent        
        
      >
        <div className={containerStyle}>
          <div className={`ag-theme-custom ${gridStyle}`}>
            <AgGridReact
              ref={gridListRef}
              gridOptions={gridOptions}
              defaultColDef={gridListDefaultColDef}
              rowMultiSelectWithClick={true}
              rowData={rowData}
              getRowId={getRowId}
              onGridReady={onGridReady}
              columnDefs={columns}
              onCellClicked={cellClickedHandler}
              onSelectionChanged={selectionChangedHandler}
              onCellValueChanged={cellvalueChangedHandler}
              animateRows={true}
              overlayNoRowsTemplate={
                '<span class="ag-overlay-loading-center">검색된 데이터가 없습니다.</span>'
              }
            
            />
          </div>
        </div>
      </PageContent>
    </>
  );
}

export default ListGrid;