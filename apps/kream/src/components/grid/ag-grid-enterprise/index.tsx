"use client"

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid
import "./style.css";
// import "ag-grid-community/styles/ag-theme-quartz.css" // Optional Theme applied to the grid
import 'ag-grid-enterprise';
import { useConfigs } from "states/useConfigs";
import { Suspense, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GridOptions, Column, CellClickedEvent, CellValueChangedEvent, CutStartEvent, CutEndEvent, PasteStartEvent,
  PasteEndEvent, ValueFormatterParams, GridReadyEvent, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy,
  SizeColumnsToContentStrategy, ColumnResizedEvent, ValueParserParams, IRowNode, SelectionChangedEvent, ISelectCellEditorParams, RowClickedEvent, RowDataUpdatedEvent,
  FirstDataRenderedEvent
} from "ag-grid-community";

import { LicenseManager } from  'ag-grid-enterprise'
LicenseManager.setLicenseKey(process.env.AG_GRID_LICENSE!);

import { crudType, useAppContext } from "components/provider/contextProvider";
import { useTranslation } from 'react-i18next';

import { Skeleton } from 'components/skeleton/skeleton';

// import { SELECTED_ROW } from "./model";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { stringToFullDateString, stringToFullDate, stringToDateString } = require('@repo/kwe-lib/components/dataFormatter.js')
const { sleep } = require('@repo/kwe-lib/components/sleep');

export const ROW_TYPE = '__ROWTYPE';
export const ROW_TYPE_NEW = 'NEW';


type Props = {
  gridRef: any
  loadItem?: any | null
  listItem?: gridData
  options?: GridOption
  event?: GridEvent
}

export type gridData = {
  data?: any | null,
  fields?: any | null
}

type GridEvent = {
  onRowClicked?: (params: RowClickedEvent) => void;
  onSelectionChanged?: (params: SelectionChangedEvent) => void;
  onCellValueChanged?: (params: CellValueChangedEvent) => void;
  onCutStart?: (params: CutStartEvent) => void;
  onCutEnd?: (params: CutEndEvent) => void;
  onPasteStart?: (params: PasteStartEvent) => void;
  onPasteEnd?: (params: PasteEndEvent) => void;
  onColumnResized?: (params: ColumnResizedEvent) => void;
  onGridReady?: (params: GridReadyEvent) => void;
  onRowDataUpdated?: (params: RowDataUpdatedEvent) => void;
  onFirstDataRendered?: (params: FirstDataRenderedEvent) => void
}

export type GridOption = {
  checkbox?: string[];
  select?: any;
  colVisible?: {
    col: string[]
    visible: boolean
  },
  gridHeight?: string,
  gridWidth?: string,
  colDisable?: string[],
  minWidth?: { [key: string]: number },
  maxWidth?: { [key: string]: number },
  alignLeft?: string[],                 //기본 정렬은 가운데
  alignRight?: string[],                //dataType : number면 자동 우측 정렬
  editable?: string[];
  isEditableOnlyNewRow?: boolean,
  dataType?: { [key: string]: string };   //date, number, text, bizno
  typeOptions?: {
    [key: string]: {
      // limit?: number;                     //입력 자릿수 제한
      isAllowDecimal?: boolean             //소수점 허용 여부
      decimalLimit?: number               //소수점 자리수
    }
  }

  refRow?: boolean                     //scroll ref number
  isShowFilter?: boolean
  isShowFilterBtn?: boolean
  isMultiSelect?: boolean
  isAutoFitColData?: boolean
  isSelectRowAfterRender?: boolean
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
  log("ListGrid", props);
  
  const { t } = useTranslation();
  
  const config = useConfigs((state) => state.config);

  // const [colDefs, setColDefs] = useState<cols[]>([]);
  const [colDefs, setColDefs] = useState<any[]>([]);
  const [mainData, setMainData] = useState([{}]);

  const [gridStyle, setGridStyle] = useState({ height: "100%" });
  const { listItem, options } = props;

  const containerStyle = useMemo(() => "flex-col w-full", []);
  // const gridStyle = useMemo(() => `w-full h-[${options?.gridHeight}]`, []);
  const [isReady, setReady] = useState(false);
  const gridRef = props.gridRef;
  const { event } = props

  // const [defaultColDef, setDefaultColDef] = useState({});

  //Column Defualt 설정
  const defaultColDef = useMemo(() => {
    return {
      // flex: !!options?.flex ? options.flex : 0,
      // flex: options?.isAutoFitColData? 0 : 1,
      // minWidth: 20,
      filter: 'agTextColumnFilter',
      floatingFilter: options?.isShowFilter === undefined || options?.isShowFilter ? true : false,
      headerClass: "text-center",
      editable: true,
      // suppressMenu: true,
      // floatingFilterComponentParams: {suppressFilterButton:!options?.isShowFilterBtn ? true : false },
      suppressFloatingFilterButton: !options?.isShowFilterBtn ? true : false,
    };
  }, []);

  // let ready = false;
  //Grid Defualt 설정
  const gridOptions: GridOptions = useMemo(() => {
    return {
      rowHeight: 25,
      headerHeight: 25,
      rowSelection: options?.isMultiSelect ? 'multiple' : 'single',
      // groupIncludeTotalFooter: true,
      // rowMultiSelectWithClick: true,
      enableRangeSelection: true,
      stopEditingWhenCellsLoseFocus: true,    //cell focus 이동시 cellvalueChanged 호출 되도록
      // animateRows: true,
      // onGridReady: () => {
      //   log("onGridReady")
      //   setDefaultColDef(
      //     {
      //       // flex: !!options?.flex ? options.flex : 0,
      //       flex: options?.isAutoFitColData? 0 : 1,
      //       // minWidth: 20,
      //       filter: 'agTextColumnFilter',
      //       floatingFilter: true,      
      //       headerClass: "text-center",
      //       editable:true
      //     }
      //   );
      //   autoSizeAll(props.gridRef)
      // },
      navigateToNextCell(params) {
        const suggestedNextCell = params.nextCellPosition;

        // this is some code
        const KEY_UP = 'ArrowUp';
        const KEY_DOWN = 'ArrowDown';

        const noUpOrDownKey = params.key !== KEY_DOWN && params.key !== KEY_UP;
        log("navigateToNextCell", noUpOrDownKey, suggestedNextCell);
        if (noUpOrDownKey) {
          return suggestedNextCell;
        }

        params.api.forEachNode(node => {
          if (node.rowIndex === suggestedNextCell?.rowIndex) {
            node.setSelected(true);
          }
        });

        return suggestedNextCell;
      },
      onComponentStateChanged: () => {
        //log("onComponentStateChanged", gridRef.current.api.getRowNode(mainData.length - 1), mainData.length);

        if (options?.isSelectRowAfterRender) {
          if (gridRef.current.api.getSelectedNodes().length > 0) return;

          gridRef.current.api.forEachNode((node: IRowNode, i: number) => {
            if (i === 0) {
              node.setSelected(true);
              //log("onComponentStateChanged selected", node)
            }
          });
        };

        if (options?.refRow) {
          gridRef.current.api.ensureIndexVisible(options.refRow, 'middle');
          log('refRow__2', options.refRow)
        }
        // if () {
        //   gridRef.ensureIndexVisible(gridRef.getSelectedNodes()[0].rowIndex,null);
        // }
      },
      // onCellValueChanged: onCellValueChanged,
      // onSelectionChanged: onSelectionChanged,
      // ...props.event
    };
  }, []);

  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    // log("=====options?.isAutoFitColData", options?.isAutoFitColData);
    // if (!options?.isAutoFitColData) {
    //   return {
    //     type: 'fitGridWidth',
    //   };
    // }
    return {
      type: 'fitCellContents',
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

  //컬럼 세팅
  useEffect(() => {
    if (Array.isArray(listItem?.fields) && listItem?.fields.length > 0) {
      let cols: cols[] = [];

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
      columns.map((col: string, i) => {
        var cellOption: any = {};

        if (!options?.isAutoFitColData) {
          cellOption = {
            ...cellOption,
            flex: 1,
            // width:100
          }
        }

        //컬럼별 visible 셋팅
        let isHide: boolean = false;
        if (options?.colVisible) {
          const optVisible: boolean = !!options.colVisible["visible"];
          const optCols: string[] = options.colVisible!["col"];
          // if (optVisible) {
          isHide = optVisible;
          if (optCols.indexOf(col) > -1) {
            // log("===", col);
            isHide = !optVisible;
          }
          // }
        }

        //cell 수정 여부 셋팅
        const optEditable: string[] = options?.editable ? options?.editable : [];
        cellOption = {
          ...cellOption,
          editable: optEditable.indexOf(col) > -1
        }

        if (options?.colDisable) {
          const optDisable: string[] = options.colDisable;
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
          cellDataType: 'text',
          cellStyle: { textAlign: "center" },
        };
        if (options?.dataType) {
          const optCols: { [key: string]: string } = options.dataType;

          if (optCols[col] === 'date') {
            cellOption = {
              ...cellOption,
              // cellDataType : optCols[col],
              valueFormatter: dateFormatter,
            }
          } else if (optCols[col] === 'number') {
            const typeOpt = options.typeOptions ? options.typeOptions[col] : null;
            cellOption = {
              ...cellOption,
              cellDataType: optCols[col],
              cellStyle: { textAlign: "right" },
              valueFormatter: (params: ValueFormatterParams<any, any>) => numberFormatter(params, typeOpt),
              // valueFormatter: 
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
            log("checkbox:", col)
            cellOption = {
              ...cellOption,
              // editable:true,
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

        if (options?.maxWidth) {
          var arrCols = Object.keys(options.maxWidth);
          if (arrCols.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              maxWidth: options.maxWidth[col]
            };
          }
        }

        // cellOption = {
        //   ...cellOption,
        //   aggFunc: 'count'
        // }

        cols.push({
          field: col,
          headerName: t(col),
          hide: isHide,
          ...cellOption
        });
      });
      setColDefs(cols);
      setMainData(listItem.data.map((row: any) => {
        if (options?.checkbox) {
          options?.checkbox.map((col) => {
            if (row[col]) row[col] = row[col] === 'Y' ? true : false
          })
        }
        return {
          ...row
        }
      }));
    }
    // log("colDefs", colDefs);
  }, [listItem, t]);

  useEffect(() => {
    if (options?.gridHeight) {
      log("options?.gridHeight", options?.gridHeight)
      setGridStyle({ height: options?.gridHeight });
    }
  }, [options?.gridHeight]);

  const onGridReady = (param: GridReadyEvent) => {
    log("onGridReady");
  }

  const onSelectionChanged = (param: SelectionChangedEvent) => {
    const selectedRow = param.api.getSelectedRows()[0];
    if (options?.isEditableOnlyNewRow) {
      var copied = [...colDefs];
      copied.forEach(obj => {
        if (options.editable?.includes(obj.field)) obj['editable'] = (selectedRow[ROW_TYPE] === ROW_TYPE_NEW);
      });
      setColDefs(copied);
    }

    if (event?.onSelectionChanged) event.onSelectionChanged(param);

  }

  const onRowClicked = (param: RowClickedEvent) => {
    log("onRowClicked")
    // return {"colId": param.node.id, ...param.node.data};

    if (event?.onRowClicked) event.onRowClicked(param);
  }

  const onCellValueChanged = (param: CellValueChangedEvent) => {
    log("onCellValueChanged1", param.node.data['__changed'])
    param.node.data['__changed'] = true
    // return {"col": param.column.getColId(), "oldValue" : param.oldValue, "newValue": param.newValue};
    log("onCellValueChanged2", param.node.data['__changed'])
    if (event?.onCellValueChanged) event.onCellValueChanged(param);
  };

  const onRowDataUpdated = (param: RowDataUpdatedEvent) => {
    // updateRowCount('rowDataUpdated');
    //log('onRowDataUpdated', param);

    if (event?.onRowDataUpdated) event.onRowDataUpdated(param);

  }

  const onCutStart = (param: CutStartEvent) => {
    // updateRowCount('rowDataUpdated');
    log('onCutStart', param);

    if (event?.onCutStart) event.onCutStart(param);
  }
  const onCutEnd = (param: CutEndEvent) => {
    // updateRowCount('rowDataUpdated');
    log('onCutEnd', param);

    if (event?.onCutEnd) event.onCutEnd(param);
  }
  const onPasteStart = (param: PasteStartEvent) => {
    // updateRowCount('rowDataUpdated');
    log('onPasteStart', param);

    if (event?.onPasteStart) event.onPasteStart(param);
  }
  const onPasteEnd = (param: PasteEndEvent) => {
    // updateRowCount('rowDataUpdated');
    log('onPasteEnd', param);

    if (event?.onPasteEnd) event.onPasteEnd(param);
  }
  const onColumnResized = (param: ColumnResizedEvent) => {
    // updateRowCount('rowDataUpdated');
    log('onColumnResized', param);

    if (event?.onColumnResized) event.onColumnResized(param);
  }

  const onFirstDataRendered = (param: FirstDataRenderedEvent) => {
    log('onFirstDataRendered', param);
    if (options?.isAutoFitColData) autoSizeAll(gridRef.current);

    if (event?.onFirstDataRendered) event.onFirstDataRendered(param);
  }

  const autoSizeAll = (gridApi: any, skipHeader: boolean = false) => {

    var rowCount = gridApi?.api?.getRenderedNodes().length;
    log('autoSizeAll called!!!!!!!!', gridApi?.api?.getRenderedNodes(), rowCount);

    const allColumnIds: string[] = [];
    gridApi.api.getColumns().forEach((column: any) => {
      if (column.visible) allColumnIds.push(column.getId());
    });
    if (allColumnIds.length) gridApi.api.autoSizeColumns(allColumnIds, skipHeader);


    // gridApi.api.getColumns().forEach((column:any) => {
    //   if (column.visible)  {
    //     gridApi.api.autoSizeColumn(column.getId(), skipHeader);
    //   }
    // });

    // if (gridApi.current && !isReady) {
    //   setReady(true);
    // gridApi.current?.api.autoSizeAllColumns(skipHeader);
    // } 

  };


  return (
    <>
      <div className={containerStyle}>
        <div
          className={`${config.background === "dark" ? "ag-theme-custom-dark" : "ag-theme-custom"} w-full p-0.5`}
          style={gridStyle}
        >
          {!props.listItem ?  <Skeleton/> :
          <AgGridReact
            ref={gridRef}
            gridOptions={gridOptions}
            rowData={mainData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            // autoSizeStrategy={autoSizeStrategy}
            onGridReady={onGridReady}
            onSelectionChanged={onSelectionChanged}
            onRowClicked={onRowClicked}
            onCellValueChanged={onCellValueChanged}
            onRowDataUpdated={onRowDataUpdated}
            onCutStart={onCutStart}
            onCutEnd={onCutEnd}
            onPasteStart={onPasteStart}
            onPasteEnd={onPasteEnd}
            onColumnResized={onColumnResized}
            onFirstDataRendered={onFirstDataRendered}

          />}
        </div>
      </div>
    </>
  )
});

export const isFirstColumn = (params: { api: { getAllDisplayedColumns: () => any; }; column: any; }) => {
  var displayedColumns = params.api.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
};

export const getFirstColumn = (params: { api: { getAllDisplayedColumns: () => any; } }) => {
  var displayedColumns = params.api.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0];
  return thisIsFirstColumn.colId;
};

export const rowAdd = async (gridRef: { api: any }, initData: {} = {}) => {
  // var data = gridRef.api.getRenderedNodes();
  // log("===============", data);
  var col = getFirstColumn(gridRef);
  var rowCount = gridRef.api.getRenderedNodes().length;

  var data = {
    ...initData,
    [ROW_TYPE]: ROW_TYPE_NEW
  }
  await gridRef.api.applyTransaction({ add: [data] });
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

const numberFormatter = (params: ValueFormatterParams, options: any = null) => {
  if (options) {
    const isDecimal = options.isAllowDecimal;
    const decimalLimit = isDecimal ? (options.decimalLimit ? options.decimalLimit : 2) : 0;
    let val = (+params.value).toFixed(decimalLimit);

    if (!val) return;

    let formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formatted}`;
  } else {
    let val = params.value;

    if (!val) return;

    log("numberFormatter", val, !isNaN(val), parseFloat(val), +val);
    if (!isNaN(val) && parseFloat(val) - Math.trunc(val) === 0) val = (+val).toFixed(0);
    else val = (+val).toFixed(2);
    let formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formatted}`;
  }
  // if (isDecimal) return (+params.value).toFixed(decimalLimit).toLocaleString();
  // else return (+params.value).toLocaleString();

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