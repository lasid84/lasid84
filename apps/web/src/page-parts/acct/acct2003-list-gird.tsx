// import { AgGridReact } from "ag-grid-react";
import { AgGridReact } from "utils/grid";
import Link from "next/link";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageContent from "shared/tmpl/page-content";
import { GridOptions, Column, CellClickedEvent } from "ag-grid-community";
import { useInvoiceStore } from "states/acct/acct2003.store";

type Props = {
  listItem: any | null;
  children?: React.ReactNode | React.ReactElement | null;
};

const overlayLoadingTemplate = `
    <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>
`;


const CodeListGrid: React.FC<Props> = ({
  listItem,
}) => {
  //다국어  
  const { t } = useTranslation();
  z.setErrorMap(makeZodI18nMap({ t }));

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
  const gridRef: any = useRef<any>(null);
  const columns = React.useMemo(() => {
    console.log('handle empty data', listItem)
    if (listItem === undefined || !listItem || listItem.length === 0) return []; // Handle empty data   
    //if(listItem.data.cursorData.length ===1) return [] //초기값설정

    //const firstRow = listItem.data.cursorData[0][0];
    //console.log('firstRow')

    const a = [{
      headerName: t("No."),
      field: 'chk',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      valueGetter: "node.rowIndex + 1",
      width: 50,
    },
    { headerName: t("billto_code"), field: 'billto_code', width: 100, sorter: 'string' },
    { headerName: t("billto_nm"), field: 'billto_nm', width: 100, sorter: 'string' },
    { headerName: t("house_bl_no"), field: 'house_bl_no', width: 100, sorter: 'string' },
    { headerName: t("invoice_no"), field: 'invoice_no', width: 100, sorter: 'string' },
    { headerName: t("etdata"), field: 'etdata', width: 100, sorter: 'string' },
    { headerName: t("shprcnee_code"), field: 'shprcnee_code', width: 100, sorter: 'string' },
    { headerName: t("shprcnee_nm"), field: 'shprcnee_nm', width: 100, sorter: 'string' },
    { headerName: t("port"), field: 'port', width: 100, sorter: 'string' },
    { headerName: t("user_id"), field: 'user_id', width: 100, sorter: 'string' },
    { headerName: t("free_house_term"), field: 'free_house_term', width: 100, sorter: 'string' },
    { headerName: t("freight_term"), field: 'freight_term', width: 100, sorter: 'string' },
    { headerName: t("tax_no"), field: 'tax_no', width: 100, sorter: 'string' },
    { headerName: t("apply_to_sts"), field: 'apply_to_sts', width: 100, sorter: 'string' },
    { headerName: t("billing_or"), field: 'billing_or', width: 100, sorter: 'string' },
    { headerName: t("notedi_b_cnk"), field: 'notedi_b_cnk', width: 100, sorter: 'string' },
    {
      headerName: t("billing_yn"), field: 'billing_yn', width: 100, sorter: 'string'
      , cellStyle: (params: any) => {
        if (params.value === 'Y') {
          return { color: 'red', backgroundColor: 'yellow' }
        }
      }
    },
    { headerName: t("duty_10"), field: 'duty_10', width: 100, sorter: 'string' },
    { headerName: t("duty_00"), field: 'duty_00', width: 100, sorter: 'string' },
    { headerName: t("vat_amt"), field: 'vat_amt', width: 100, sorter: 'string' },
    { headerName: t("duty_no"), field: 'duty_no', width: 100, sorter: 'string' },
    { headerName: t("tot_amt"), field: 'tot_amt', width: 100, sorter: 'string' },
    { headerName: t("ccn_cnt"), field: 'ccn_cnt', width: 100, sorter: 'string' },
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
      onGridReady: (e: any) => {
        e.api.showLoadingOverlay();
        e.columnApi.resetColumnState();
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
      gridRef?.current?.api?.hideOverlay();
    }else{
      gridRef?.current?.api?.showLoadingOverlay();
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

    <>
      <PageContent
        left={
          <>

            {/* <div className="space-y-2"> */}
            <label className="space-y-1">세금계산서 No.</label>
            {/* </div> */}
            <input
              id="tax_no"
              defaultValue={taxno}
              type="text"
              className="px-4 py-1 text-s font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700"
            />

          </>
        }
        right={
          <>
            <Link href={{
              pathname: "/acct/acct1005",
              query: {
                invoice_no: targetValue.invoice_list,
                dtefrom: searchParam.fr_date,
                dtefo: searchParam.to_date,
                mode: searchParam.trans_mode,
                type: searchParam.trans_type
              }
            }}
              target="_blank" >
              <div className="px-4 py-1 text-s font-bold text-gray-500 bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700">
                {t("searchMR")}
                </div>
            </Link>
            <Link href={{
              pathname: "/acct/acct1005",
              query: {
                no: targetValue.no,
              }
            }}
              target="_blank" >
              <div className="px-4 py-1 text-s font-bold text-gray-500 bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700">
                {t("searchccn")}
                </div>
            </Link>
            <button
              onClick={createTax}
              type="button"
              className="px-4 py-1 text-s font-bold text-gray-500 uppercase bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700">
              {t("createtax")}
            </button>
            <Link href={{
              pathname: "/acct/acct3002",
              query: {
                no: targetValue.no,
              }
            }}
              target="_blank" >
              <div className="px-4 py-1 text-s font-bold text-gray-500 bg-transparent border border-gray-400 rounded hover:text-cyan-700 hover:border-blue-700">
                {t("sendtax")}</div>
            </Link>
          </>
        }
      >
        <div className={containerStyle}>
          <div className={`ag-theme-custom ${gridStyle}`}>
            <AgGridReact
              ref={gridListRef}
              gridOptions={gridOptions}
              overlayLoadingTemplate={
                `<div role="status">
                <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>`}
              defaultColDef={gridListDefaultColDef}
              rowMultiSelectWithClick={true}
              rowData={rowData}
              getRowId={getRowId}
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

export default CodeListGrid;