"use client"

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid
// import 'ag-grid-enterprise';

import PageContent from "@/shared/tmpl/page-content"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GridOptions, Column, CellClickedEvent, CellValueChangedEvent, CutStartEvent, CutEndEvent, PasteStartEvent, PasteEndEvent, ValueFormatterParams, GridReadyEvent, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy, SizeColumnsToContentStrategy, ColumnResizedEvent, ValueParserParams, IRowNode, SelectionChangedEvent, ISelectCellEditorParams, RowClickedEvent } from "ag-grid-community";

import { crudType, useAppContext } from "components/provider/contextProvider";
import { useTranslation } from 'react-i18next';

// import { SELECTED_ROW } from "./model";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { stringToFullDateString, stringToFullDate, stringToDateString } = require('@repo/kwe-lib/components/dataFormatter.js')
const { sleep } = require('@repo/kwe-lib/components/sleep');

type Props = {
    gridRef: any
    loadItem?: any | null
    listItem?: gridData
    options?: GridOption
    event?: GridEvent
}

export type gridData = {
    data? : any | null,
    fields? : any | null
}

type GridEvent = {
  onRowClicked?: (params: RowClickedEvent) => void;
  onSelectionChanged?: (params:SelectionChangedEvent) => void;
  onCellValueChanged?: (params: CellValueChangedEvent) => void;
  onCutStart?: (params: CutStartEvent) => void;
  onCutEnd?: (params: CutEndEvent) => void;
  onPasteStart?: (params: PasteStartEvent) => void;
  onPasteEnd?: (params: PasteEndEvent) => void;
  onColumnResized?: (params: ColumnResizedEvent) => void;
}

export type GridOption = {
    checkbox?: string[];
    select?: any;
    colVisible?: {
      col: string[]
      visible:boolean
    },
    colDisable?: string[],
    minWidth?:  {[key: string]: number},
    alignLeft?: string[],                 //기본 정렬은 가운데
    alignRight?: string[],                //dataType : number면 자동 우측 정렬
    editable?: string[];
    dataType?: {[key: string]: string}; //date, number, text, bizno
    isMultiSelect?: boolean
    isAutoFitColData?: boolean
};

type cols = {
  field: string;
  headerName?: string;
  hide?: boolean;
  // editable?: boolean;
  // valueFormatter?: any;
  // cellDataType?: string;  
  // headerCheckboxSelection?: boolean;
  // checkboxSelection?: boolean;
  // valueGetter?: string;
  // floatingFilter?: boolean
}


const ListGrid: React.FC<Props> = memo((props) => {

    const { t } = useTranslation();

    const [colDefs, setColDefs] = useState<cols[]>([]);
    const [mainData, setMainData] = useState([{}]);

    const containerStyle = useMemo(() => "flex flex-col w-full py-2", []);
    const gridStyle = useMemo(() => "w-full h-[65vh]", []);

    const [ready, setReady] = useState(false);
    const { listItem, options } = props;

    //Column Defualt 설정
    const defaultColDef = useMemo(() => {
      return {
        // flex: !!options?.flex ? options.flex : 0,
        // minWidth: 20,
        filter: 'agTextColumnFilter',
        floatingFilter: true,      
        headerClass: "text-center",
        editable:true
      };
    }, []);

    // let ready = false;
    //Grid Defualt 설정
    const gridOptions: GridOptions = useMemo(() => {
        return {
          rowHeight: 25,
          headerHeight: 25,
          // enableRangeSelection:true,  // enterprise
          // copyHeadersToClipboard:true,
          // suppressMultiRangeSelection:true,
          rowSelection: options?.isMultiSelect ? 'multiple' : 'single',
          // groupIncludeTotalFooter: true,
          stopEditingWhenCellsLoseFocus: true,    //cell focus 이동시 cellvalueChanged 호출 되도록
          // autoSizeStrategy: {
          //   type: 'fitCellContents',
          //   defaultMinWidth: 20,
          //   // columnLimits: [
          //   //     {
          //   //         colId: 'country',
          //   //         minWidth: 900
          //   //     }
          //   // ]
          // },
          onComponentStateChanged: () => {
              // log("onRowDataUpdated", ready);
              if (options?.isAutoFitColData) {
                // setReady(true);
                autoSizeAll();
              }
              props.gridRef.current.api.forEachNode((node:IRowNode, i:number) => {
                if (i === 0) {
                  node.setSelected(true);
                }
              })
              // props.gridRef.current.api.refreshCells();
          }, 
          onCellValueChanged: onCellValueChanged,
          ...props.event
        };
      }, []);

      // const onGridReady = useCallback((params: GridReadyEvent) => {
      //   log("onGridReady", listItem?.data);
      //   setMainData(
      //       listItem?.data.map((rowData: any) => {
      //           // const dateParts = rowData.date.split('/');
      //           log("rowData", rowData.use_yn);
      //           return {
      //             ...rowData,
      //             create_date: stringToFullDate(rowData.date),
      //             // dateObject: new Date(
      //             //   parseInt(dateParts[2]),
      //             //   parseInt(dateParts[1]) - 1,
      //             //   parseInt(dateParts[0])
      //             // ),
      //             // countryObject: {
      //             //   name: rowData.country,
      //             // },
      //             // hasGold: rowData.gold > 0,
      //           };
      //         })
      //       )
      // }, [listItem?.data]);

  // async function wait() {
  //   await sleep(1000);
  //   log("sleep");
  //   autoSizeAll(false);
  // }

  // useEffect(() => {
  //   if (ready) {      
  //     wait();
  //   }
  // }, [ready])
  
  //컬럼 세팅
  useEffect(() => {
    if (Array.isArray(listItem?.fields) && listItem?.fields.length > 0) {
      let cols:cols[] = [];
      let dataFormatter = {};
      
      // let ischkNo = false;
      // if (options?.checkbox) {
      //   ischkNo = (options?.checkbox?.indexOf('no') | 0) > -1 ? true : false;
      // };
      // //컬럼 셋팅
      // cols.push({
      //     field:'no',
      //     headerName: 'No',
      //     valueGetter: 'node.rowIndex + 1',
      //     floatingFilter: false,
      //     ...{
      //       cellDataType : 'text',
      //       cellStyle: { textAlign: "center" },
      //       headerCheckboxSelection: options?.isMultiSelect ? true : false,
      //       checkboxSelection: ischkNo,
      //     }
      // });

      // const columns = Object.keys(listItem[0]);

      //Field {
      // name: 'cust_code',
      // tableID: 88746,
      // columnID: 1,
      // dataTypeID: 25,
      // dataTypeSize: -1,
      // dataTypeModifier: -1,
      // format: 'text'
      // }
      const columns = listItem.fields.map((field) => field.name);
      const dataType = listItem.fields.map((field) => field.format);
      // log("===================????", columns)
      columns.map((col:string, i) => {
        var cellOption:any = {};

        if (!options?.isAutoFitColData) {
          cellOption = {
            ...cellOption,
            flex: 1
          }
        }

        //컬럼별 visible 셋팅
        let isHide: boolean = false;
        if (options?.colVisible) {
          const optVisible:boolean = !!options.colVisible["visible"];
          const optCols:string[] = options.colVisible!["col"];
          // if (optVisible) {
            isHide = optVisible;
            if (optCols.indexOf(col) > -1) {
              // log("===", col);
              isHide = !optVisible;
            }
          // }
        }

        //cell 수정 여부 셋팅
        if (options?.editable) {
          const optEditable:string[] = options.editable;
          if (optEditable.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              editable: true
            }
          }          
        };

        if (options?.colDisable) {
          const optDisable:string[] = options.colDisable;
          if (optDisable.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              editable: false,
              // cellClass: 'rag-gray'
              cellStyle: {
                // you can use either came case or dashes, the grid converts to whats needed
                // backgroundColor: '#aaffaa', // light green
                backgroundColor: '#d3d3d3', // lightGray
              },
            }
          }     
        }

        //cell 데이터 타입 셋팅(기본:text)
        cellOption = {
            ...cellOption,
            cellDataType : 'text',
            cellStyle: { textAlign: "center" },
        };
        if (options?.dataType) {
          const optCols:{[key: string]: string} = options.dataType;
          
          if (optCols[col] === 'date') {            
            cellOption = {
              ...cellOption,
              // cellDataType : optCols[col],
              valueFormatter: dateFormatter,
            }
          } else if (optCols[col] === 'number') {
            cellOption = {
              ...cellOption,
              cellDataType : optCols[col],
              cellStyle: { textAlign: "right" },
              valueFormatter: numberFormatter,
            }
          } else if (optCols[col] === 'bizno') {
            cellOption = {
              ...cellOption,
              valueFormatter: bizNoFormatter,
            }
          }
        };

        //데이터 정렬
        if (options?.alignLeft) {
          const optAlignLeft = options.alignLeft;
          if (optAlignLeft.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              cellStyle: { textAlign: "left" },
           };
          }
        }
        if (options?.alignRight) {
          const optAlignRight = options.alignRight;
          if (optAlignRight.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              cellStyle: { textAlign: "right" },
           };
          }
        }       

        //체크박스 셋팅
        if (options?.checkbox) {
          if (options.checkbox.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              editable:true,
              headerCheckboxSelection: options?.isMultiSelect ? true : false,
              // checkboxSelection: true,
              valueParser: checkBoxParser,
              valueFormatter: checkBoxFormatter,
              cellDataType: 'boolean',
              cellRenderer: 'agCheckboxCellRenderer',
              cellEditor: 'agCheckboxCellEditor',
            }
          }
        }

        //Select 셋팅
        if (options?.select) {
          var arrCols = Object.keys(options.select);
          if (arrCols.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              cellEditor: 'agSelectCellEditor',
              cellEditorParams: {
                values: options.select[col],
              } as ISelectCellEditorParams,
            }
          }
        }

        if (options?.minWidth) {
          var arrCols = Object.keys(options.minWidth);
          if (arrCols.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              minWidth: options.minWidth[col]
            };
          }
        }

        // cellOption = {
        //   ...cellOption,
        //   aggFunc: 'count'
        // }
        
        cols.push({
          field:col,
          headerName:t(col),
          hide: isHide,
          ...cellOption
        });
      });      
      setColDefs(cols);
      setMainData(listItem.data.map((row:any)=> {
        if (options?.checkbox) {
          options?.checkbox.map((col) => row[col] = row[col] === 'Y' ? true : false )
        }
        return {
          ...row
        }
      }));
    }
    // log("colDefs", colDefs);
  }, [listItem, t]);
  
  const autoSizeAll = (skipHeader: boolean = false) => {

    // gridRef.current.api.sizeColumnToFit();

    log('autoSizeAll called!!!!!!!!');
    const allColumnIds: string[] = [];
    props.gridRef.current?.api.getColumns().forEach((column:any) => {
      allColumnIds.push(column.getId());
    });
    props.gridRef.current?.api.autoSizeColumns(allColumnIds, skipHeader);
  };

    return (
        <>
          <div className={containerStyle}>
              <div 
                // className={`ag-theme-quartz ${gridStyle}`}
                className={`ag-theme-custom ${gridStyle}`}
                // style={{height:500}}
              >
                  <AgGridReact
                      ref={props.gridRef}
                      gridOptions={gridOptions}
                      // onGridReady={onGridReady}
                      rowData={mainData}
                      columnDefs={colDefs}
                      defaultColDef={defaultColDef}
                      // editType={'fullRow'}
                      // onCellValueChanged={onCellValueChanged}
                  />
              </div>
          </div>
        </>
    )
});

export const onRowClicked = (param:RowClickedEvent) => {
    return {"colId": param.node.id, ...param.node.data};
}

export const onSelectionChanged = (param:SelectionChangedEvent) => {
  // log("onSelectionChanged", param)
  // const selectedRow = gridRef.current.api.getSelectedRows()[0]; 
  return param.api.getSelectedRows()[0];
}

export const onCellValueChanged = (param:CellValueChangedEvent) => {
  param.node.data['__changed'] = true
  return {"col": param.column.getColId(), "oldValue" : param.oldValue, "newValue": param.newValue};
};

export const isFirstColumn = (params: { api: { getAllDisplayedColumns: () => any; }; column: any; }) => {
  var displayedColumns = params.api.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
};

export const getFirstColumn = (params: { api: { getAllDisplayedColumns: () => any; }}) => {
  var displayedColumns = params.api.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0];
  return thisIsFirstColumn.colId;
};

export const onGridRowAdd = async (gridRef: {api:any}) => {
  // var data = gridRef.api.getRenderedNodes();
  // log("===============", data);
  var col = getFirstColumn(gridRef);
  var rowCount = gridRef.api.getRenderedNodes().length;
  await gridRef.api.applyTransaction({add:[{}]});
  gridRef.api.setFocusedCell(rowCount, col);
  gridRef.api.startEditingCell({
      rowIndex: rowCount,
      colkey: col
  });
};

const dateFormatter = (params: ValueFormatterParams) => {
  return stringToFullDateString(params.value, '-');
  // return stringToDateString(params.value, '-');
}

const numberFormatter = (params: ValueFormatterParams) => {
  return Math.floor(+params.value).toLocaleString();
}

const checkBoxFormatter = (params: ValueFormatterParams) => {
  // log("checkBoxFormatter", params, params.value === 'Y' ? true : false)
  return params.value === 'Y' ? true : false;
}

const bizNoFormatter = (params: ValueFormatterParams) => {
  // log("bizNoFormatter", params)
  return params.value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
}

function checkBoxParser(params: ValueParserParams) {
  // log("checkBoxParser", params)
  return params.newValue === 'Y' ? true : false;
}





export default ListGrid;