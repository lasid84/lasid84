import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageContent from "shared/tmpl/page-content";
import { GridOptions, Column, CellClickedEvent } from "ag-grid-community";
import { useInvoiceStore } from "states/acct/acct3002.store";
type Props = {
  listItem: any | null;
};

const CodeListGrid: React.FC<Props> = ({
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

  const [targetedRow, setTargetedRow] = useState<any>('')
  const [targetedRow2, setTargetedRow2] = useState<any>('')
  const searchParam = useInvoiceStore((state) => state.searchParam)


  const containerStyle = useMemo(() => "flex flex-col w-full", []);
  const gridStyle = useMemo(() => "w-full h-[450px]", []);
  const footStyle = useMemo(() => "w-full h-[200px]", [])
  const [rowData, setRowData] = useState([]);
  const [taxno, setTaxno] = useState('');
  const columns = React.useMemo(() => {
    console.log('handle empty data', listItem)
    if (listItem === undefined || !listItem || listItem.length === 0) return []; // Handle empty data   
    //if(listItem.data.cursorData.length ===1) return [] //초기값설정
    const firstRow = listItem.data.cursorData[0][0];
    //console.log('firstRow')

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

  }, [listItem]);




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
    e.api.sizeColumnsToFit();
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
      setTargetedRow(invoice_list)
      setTargetedRow2(no)
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

  const createTax = useCallback(
    async (e: any) => {
      const selectedRows = gridListRef?.current?.api?.getSelectedRows()
      if (selectedRows && selectedRows.length > 0) {
        let invoice_list = ''
        selectedRows.map((i: any) => { invoice_list += i.invoice_no + ',' })
        console.log('체크', JSON.stringify(searchParam))
        const params = { ...searchParam, no: invoice_list }
        const result = await createBillMute(params)
        if (result.data.cursorData[0].length > 0) {
          let listToUpdate: any[] = [];
          console.log('create결과', result.data.cursorData[0])
          result.data.cursorData[0].map((udata: any) => {
            listToUpdate = selectedRows.map((data: any) => {
              data.tax_no = udata.tax_no
              data.billing_yn = udata.billing_yn
              data.chk = 'N'
              return data
            })
          })
          console.log('listToupdate', listToUpdate)
          const res = gridListRef?.current?.api?.applyTransaction({
            update: listToUpdate
          })
        }
        // gridListRef?.current?.api.forEachNode(node => {
        //   if (selectedRows.some(selected => selected.id === node.data.id)) {
        //     console.log()
        //     node.setSelected(false);
        //   }
        // })
      }
    }, [gridListRef]
  )

  // const sendTax = useCallback()

  return (
    //w-full rounded-[5px] bg-white border
    // <div className="flex flex-row w-full h-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
    <>
      <PageContent
      right={
        <button
        onClick={createTax}
        type="button"
        className="px-4 py-1 text-s font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700">
        계산서 생성
      </button>
      }
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
          {/* grid내부 비고 */}
          <div className="w-full space-y-1">
            <label className="px-2 text-xs space-y-1">비고(BL)</label>
            <input
              id="tax_no"
              type="text"
              className="w-8/12 px-4 px-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700"
            />
          </div>
        </div>
      </PageContent>
      <PageContent>
        <div className={containerStyle}>
          <div className={`ag-theme-custom ${footStyle}`}>
            <div className="space-y-1">
              <div className="flex flex-row items-start">
                <label className="px-2 space-y-1">개별</label>
                <div className='w-9/12 flex flex-col '>
                  <input
                    id="tax_no"
                    type="text"
                    className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                  />
                </div>
              </div>
              <div className="flex flex-row items-start">
                <label className="px-2 space-y-1">전체</label>
                <div className='w-9/12 flex flex-col '>
                  <input
                    id="tax_no"
                    type="text"
                    className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                  />
                </div>
                <button className="px-4 py-1 text-xs font-bold text-gray-500 bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700">계좌입력</button>
              </div>
            </div>
            <div className="flex flex-row items-start">
              <div className='px-1 py-1 w-full flex flex-col '>
                <div className='w-8/12 flex flex-row justify-start '>
                  <label className="px-2 space-y-3">[발송]</label>
                  <div className="flex flex-col items-start" >
                    <div style={{ width: "300px" }} className="flex flex-row items-start">
                      <label className="w-full space-y-1">사용자명</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                    <div style={{ width: "300px" }} className="flex flex-row items-start">
                      <label className="w-full space-y-1">부서</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                    <div style={{ width: "300px" }} className="flex flex-row items-start">
                      <label className="w-full space-y-1">전화번호</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                    <div style={{ width: "300px" }} className="flex flex-row items-start">
                      <label className="w-full space-y-1">이메일</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                    <div style={{ width: "300px" }} className="flex flex-row items-start">
                      <label className="w-full space-y-1">스마트빌ID</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                  </div>
                  <label className="px-2 space-y-3">[수신]</label>
                  <div className="flex flex-col items-start" >
                    <div style={{ width: "300px" }} className="flex flex-row items-start">
                      <label className="w-full space-y-1">사용자명</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                    <div style={{ width: "300px" }} className="flex flex-row items-start">
                      <label className="w-full space-y-1">사무소</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                    <div style={{ width: "300px" }} className="flex flex-row items-start">
                      <label className="w-full space-y-1">이메일</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                    <div style={{ width: "300px" }} className="flex flex-row items-start">
                      <label className="w-full space-y-1">전화번호</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                    <div style={{ width: "300px" }} className="flex flex-row items-start" >
                      <label className="w-full space-y-1">사업장</label>
                      <div className='w-full flex flex-col '>
                        <input
                          id="tax_no"
                          type="text"
                          className="px-4 py-1 text-xs font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700 space-y-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start" >
                    <Link href={{
                      pathname: "/acct/acct3002",
                      query: {
                        no: targetedRow2,
                      }
                    }}
                      target="_blank" >
                      <div className="px-4 py-1 text-xs font-bold text-gray-500 bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700">담당자 편집</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}

export default CodeListGrid;