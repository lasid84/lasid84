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
  GridOptions, Column, CellClickedEvent, CellValueChangedEvent, CutStartEvent, CutEndEvent, PasteStartEvent, RowDoubleClickedEvent,
  PasteEndEvent, ValueFormatterParams, GridReadyEvent, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy,
  SizeColumnsToContentStrategy, ColumnResizedEvent, ValueParserParams, IRowNode, SelectionChangedEvent, ISelectCellEditorParams, RowClickedEvent, RowDataUpdatedEvent,
  FirstDataRenderedEvent,
  CellKeyDownEvent,
  FullWidthCellKeyDownEvent,
  ComponentStateChangedEvent,
  ProcessDataFromClipboardParams,
  RowNode
} from "ag-grid-community";

import { LicenseManager } from 'ag-grid-enterprise'
LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_AG_GRID_LICENSE!);

import { crudType, useAppContext } from "components/provider/contextProvider";
import { useTranslation } from 'react-i18next';

import { Skeleton } from 'components/skeleton/skeleton';
import { StringValidation } from 'zod';

// import { SELECTED_ROW } from "./model";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { stringToFullDateString, stringToFullDate, stringToDateString, stringToTime } = require('@repo/kwe-lib/components/dataFormatter.js')
const { sleep } = require('@repo/kwe-lib/components/sleep');

export const ROW_TYPE = '__ROWTYPE';
export const ROW_INDEX = '__ROWINDEX';
export const ROW_CHANGED = '__changed'
export const ROW_TYPE_NEW = 'NEW';



type Props = {
  gridRef: any
  loadItem?: any | null
  listItem?: gridData
  options?: GridOption
  event?: GridEvent
  customselect?: any | null
}

export type gridData = {
  data?: any | null,
  fields?: any | null
}

type GridEvent = {
  onRowClicked?: (params: RowClickedEvent) => void;
  onRowDoubleClicked ? : (params: RowDoubleClickedEvent) => void;
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
  onCellKeyDown?: (params: CellKeyDownEvent | FullWidthCellKeyDownEvent) => void
  onComponentStateChanged?: (params: ComponentStateChangedEvent) => void
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
  alignLeft?: string[],                   //기본 정렬은 가운데
  alignRight?: string[],                  //dataType : number면 자동 우측 정렬
  editable?: string[];
  isEditableOnlyNewRow?: boolean,
  dataType?: { [key: string]: string };   //date, number, text, bizno
  typeOptions?: {
    [key: string]: {
      // limit?: number;                  //입력 자릿수 제한
      isAllowDecimal?: boolean            //소수점 허용 여부
      decimalLimit?: number               //소수점 자리수
    }
  }
  total?: {
    [key: string]: string                 //column : 타입(count, sum, avg), prefix 같은 문구를 넣으려면 custom 형식의 옵션 추가 후 개발 필요
  }
  refRow?: boolean                        //scroll ref number
  isShowFilter?: boolean
  isShowFilterBtn?: boolean
  isMultiSelect?: boolean
  isAutoFitColData?: boolean
  isSelectRowAfterRender?: boolean
  isShowRowNo?: boolean
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
  // log("ListGrid", props);

  const { t } = useTranslation();

  const config = useConfigs((state) => state.config);

  // const [colDefs, setColDefs] = useState<cols[]>([]);
  const [colDefs, setColDefs] = useState<any[]>([]);
  const [mainData, setMainData] = useState([{}]);

  const [gridStyle, setGridStyle] = useState({ height: "100%" });
  const { listItem, options, customselect = false } = props;

  const containerStyle = useMemo(() => "flex-col w-full h-full", []);
  // const gridStyle = useMemo(() => `w-full h-[${options?.gridHeight}]`, []);
  const [isReady, setReady] = useState(false);
  const gridRef = props.gridRef;
  const { event } = props

  // const [defaultColDef, setDefaultColDef] = useState({});
  const customselect_style = customselect ? 'select' : ''

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

  const calculatePinnedBottomData = (target: any) => {
    //**list of columns fo aggregation**
    if (!options?.total) return;
    if (!Object.keys(options?.total as Object).length) return;
    let columnsWithTotal: string[] = [];
    let totalType: string[] = [];
    for (const [key, val] of Object.entries(options?.total as Object)) {
      columnsWithTotal.push(key);
      totalType.push(val);
    }
    log("calculatePinnedBottomData", columnsWithTotal, totalType)
    columnsWithTotal.forEach((element, i) => {
      let type = totalType[i];
      let rowCnt = 0;
      gridRef.current.api.forEachNodeAfterFilter((rowNode: RowNode) => {
        if (rowNode.data[element]) {
          switch (type) {
            case "sum":
              target[element] += Number(rowNode.data[element]);
              break;
            case "count":
              target[element] = Number(target[element] || 0) + 1;
              break;
            case "avg":
              target[element] += Number(rowNode.data[element]);
              rowCnt++;
              break;
          }
        }
      });
      if (target[element] && type === "count") target[element] = `${target[element].toString()}${t("ea")}`;
      // else if (target[element] && type === "sum") target[element] = `${numberFormatter(target[element].toString())}`;
      else if (target[element] && type === "avg" && rowCnt) target[element] = `${target[element] / rowCnt}`;

    })
    //console.log(target);
    return target;
  }

  // let ready = false;
  //Grid Defualt 설정
  const gridOptions: GridOptions = useMemo(() => {
    return {
      rowHeight: 25,
      headerHeight: 25,
      rowSelection: options?.isMultiSelect ? 'multiple' : 'single',
      // groupIncludeTotalFooter: true,
      // rowMultiSelectWithClick: true,
      suppressServerSideFullWidthLoadingRow: true,
      enableRangeSelection: true,
      stopEditingWhenCellsLoseFocus: true,    //cell focus 이동시 cellvalueChanged 호출 되도록
      suppressLastEmptyLineOnPaste: true,     //엑셀 복사 후 붙여넣기시 시 다음 row 빈칸 붙여넣기 되는 오류 처리
      animateRows: true,
      // grandTotalRow:"bottom",
      navigateToNextCell(params) {
        const suggestedNextCell = params.nextCellPosition;

        // this is some code
        const KEY_UP = 'ArrowUp';
        const KEY_DOWN = 'ArrowDown';

        const noUpOrDownKey = params.key !== KEY_DOWN && params.key !== KEY_UP;
        // log("navigateToNextCell", noUpOrDownKey, suggestedNextCell);
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
      onComponentStateChanged: (e: ComponentStateChangedEvent) => {
        // log("onComponentStateChanged", gridRef.current.api, gridRef.current.columnApi);

        if (options?.isSelectRowAfterRender) {
          if (gridRef?.current.api.getSelectedNodes().length > 0) return;

          gridRef?.current.api.forEachNode((node: IRowNode, i: number) => {
            if (i === 0) {
              node.setSelected(true);
              //log("onComponentStateChanged selected", node)
            }
          });
        };

        if (options?.refRow) {
          gridRef?.current.api.ensureIndexVisible(options.refRow, 'middle');
          // log('refRow__2', options.refRow)
        }
        // if () {
        //   gridRef.ensureIndexVisible(gridRef.getSelectedNodes()[0].rowIndex,null);
        // }

        if (event?.onComponentStateChanged) event.onComponentStateChanged(e);

        // gridRef.current!.api.setGridOption("suppressStickyTotalRow", 'group');
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
      let columns = listItem.fields.map((field) => field.name);
      const dataType = listItem.fields.map((field) => field.format);
      // log("===================????", columns)
      columns = [ROW_INDEX].concat(columns)
      columns.map((col: string, i) => {

        var cellOption: any = {};

        if (col === ROW_INDEX) {
          cellOption = {
            minWidth: 30,
            maxWidth: 70,
            cellStyle: { textAlign: "center" },
            aggFunc: "count"
          }
          cols.push({
            field: col,
            headerName: t(col),
            hide: options?.isShowRowNo === false ? true : false,
            ...cellOption
          });
          return;
        }

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
          } else if (optCols[col] === 'time') {
            cellOption = {
              ...cellOption,
              // cellDataType : optCols[col],
              valueFormatter: timeFormatter,
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
      setMainData(listItem.data.map((row: any, i: number) => {
        if (options?.checkbox) {
          options?.checkbox.map((col) => {
            if (row[col]) row[col] = row[col] === 'Y' ? true : false
          })
        }
        return {
          [ROW_INDEX]: i + 1,
          ...row,
        }
      }));
    }
    // log("colDefs", colDefs);
  }, [listItem, t]);

  useEffect(() => {
    if (options?.gridHeight) {
      // log("options?.gridHeight", options?.gridHeight)
      setGridStyle({ height: options?.gridHeight });
    }
  }, [options?.gridHeight]);

  const onGridReady = (param: GridReadyEvent) => {
    // log("onGridReady");

    let result: any = {};

    gridRef.current.columnApi.getAllGridColumns().forEach((item: { [key: string]: string }) => {
      result[item.colId] = null;
    });

    let pinnedBottomData = calculatePinnedBottomData(result);
    log("============onGridReady", pinnedBottomData)

    if (pinnedBottomData && Object.keys(pinnedBottomData).length) {
      gridRef.current.api.setPinnedBottomRowData([pinnedBottomData]);
    }

    if (event?.onGridReady) event.onGridReady(param);
  }

  const onSelectionChanged = (param: SelectionChangedEvent) => {
    // const selectedRow = {...param.api.getSelectedRows()[0], [ROW_INDEX]: param.api.getSelectedNodes()[0].rowIndex};
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
    // log("onRowClicked")
    // return {"colId": param.node.id, ...param.node.data};

    if (event?.onRowClicked) event.onRowClicked(param);
  }


  const onRowDoubleClicked = (param: RowDoubleClickedEvent) => {
    // log("onRowClicked")
    // return {"colId": param.node.id, ...param.node.data};

    if (event?.onRowDoubleClicked) event.onRowDoubleClicked(param);
  }


  const onCellValueChanged = (param: CellValueChangedEvent) => {
    // log("onCellValueChanged1", param.node.data['__changed'])
    param.node.data[ROW_CHANGED] = true
    // return {"col": param.column.getColId(), "oldValue" : param.oldValue, "newValue": param.newValue};
    // log("onCellValueChanged2", param.node.data['__changed'])
    if (event?.onCellValueChanged) event.onCellValueChanged(param);
  };

  const onRowDataUpdated = (param: RowDataUpdatedEvent) => {
    // updateRowCount('rowDataUpdated');
    //log('onRowDataUpdated', param);

    if (event?.onRowDataUpdated) event.onRowDataUpdated(param);

  }

  const onCutStart = (param: CutStartEvent) => {
    // updateRowCount('rowDataUpdated');
    // log('onCutStart', param);

    if (event?.onCutStart) event.onCutStart(param);
  }
  const onCutEnd = (param: CutEndEvent) => {
    // updateRowCount('rowDataUpdated');
    // log('onCutEnd', param);

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
    // log('onColumnResized', param);

    if (event?.onColumnResized) event.onColumnResized(param);
  }

  const onFirstDataRendered = (param: FirstDataRenderedEvent) => {
    // log('onFirstDataRendered', param);
    if (options?.isAutoFitColData) autoSizeAll(gridRef.current);

    if (event?.onFirstDataRendered) event.onFirstDataRendered(param);
  }

  const onCellKeyDown = (param: CellKeyDownEvent) => {
    // log("onCellKeyDown", param);
    if (!param.event) {
      return;
    }

    if (event?.onCellKeyDown) event.onCellKeyDown(param);
  }

  //복사붙여넣기시 자동으로 rowAdd
  const processDataFromClipboard = useCallback(
    (params: ProcessDataFromClipboardParams): string[][] | null => {
      const data = [...params.data];
      const emptyLastRow =
        data[data.length - 1][0] === "" && data[data.length - 1].length === 1;
      if (emptyLastRow) {
        data.splice(data.length - 1, 1);
      }
      const lastIndex = params.api!.getDisplayedRowCount() - 1;
      const focusedCell = params.api!.getFocusedCell();
      const focusedIndex = focusedCell!.rowIndex;
      if (focusedIndex + data.length - 1 > lastIndex) {
        const resultLastIndex = focusedIndex + (data.length - 1);
        const numRowsToAdd = resultLastIndex - lastIndex;
        const rowsToAdd: any[] = [];
        for (let i = 0; i < numRowsToAdd; i++) {
          const index = data.length - 1;
          const row = data.slice(index, index + 1)[0];
          // Create row object
          const rowObject: any = {};
          let currentColumn: any = focusedCell!.column;
          row.forEach((item) => {
            if (!currentColumn) {
              return;
            }
            rowObject[currentColumn.colDef.field] = item;
            currentColumn = params.api!.getDisplayedColAfter(currentColumn);
          });
          rowsToAdd.push(rowObject);
        }
        // params.api!.applyTransaction({ add: rowsToAdd });
        log("processDataFromClipboard", rowsToAdd)
        for (const row of rowsToAdd) {
          rowAdd(gridRef.current, row);
        }
      }
      return data;
    },
    [],
  );

  const autoSizeAll = (gridApi: any, skipHeader: boolean = false) => {

    var rowCount = gridApi?.api?.getRenderedNodes().length;
    // log('autoSizeAll called!!!!!!!!', gridApi?.api?.getRenderedNodes(), rowCount);

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
          className={`${config.background === "dark" ? "ag-theme-custom-dark" : "ag-theme-custom"}${customselect_style} w-full p-0.5`}
          style={gridStyle}
        >
          {!props.listItem ? <Skeleton /> :
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
              onRowDoubleClicked={onRowDoubleClicked}
              onCellValueChanged={onCellValueChanged}
              onRowDataUpdated={onRowDataUpdated}
              onCutStart={onCutStart}
              onCutEnd={onCutEnd}
              onPasteStart={onPasteStart}
              onPasteEnd={onPasteEnd}
              onColumnResized={onColumnResized}
              onFirstDataRendered={onFirstDataRendered}
              onCellKeyDown={onCellKeyDown}
              processDataFromClipboard={processDataFromClipboard}
            />
          }
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
  //2024.06.26 첫번째컬럼에 __ROWINDEX 추가로 실제 첫번째 컬럼은 두번째 컬럼임
  var thisIsFirstColumn = displayedColumns[1];
  return thisIsFirstColumn.colId;
};

export const rowAdd = async (gridRef: { api: any }, initData: {} = {}) => {
  // var data = gridRef.api.getRenderedNodes();
  // log("===============", data);
  var col = getFirstColumn(gridRef);
  var rowCount = gridRef.api.getRenderedNodes().length;

  var data = {
    [col]: '',
    ...initData,
    use_yn: true,
    [ROW_INDEX]: rowCount + 1,
    [ROW_TYPE]: ROW_TYPE_NEW,
    [ROW_CHANGED]: true
  }
  log('rowAdd', col, data)
  await gridRef.api.applyTransaction({ add: [data] });
  await gridRef.api.setFocusedCell(rowCount, col);
  await gridRef.api.startEditingCell({
    rowIndex: rowCount,
    colkey: col
  });

  await gridRef.api.getRowNode(rowCount.toString()).setSelected(true);

  return {
    rowIndex: rowCount,
    colkey: col
  }
};

const dateFormatter = (params: ValueFormatterParams) => {
  return stringToFullDateString(params.value, '-');
  // return stringToDateString(params.value, '-');
}

const timeFormatter = (params: ValueFormatterParams) => {
  return stringToTime(params.value);
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
  if (!params.value) return;
  return params.value === 'Y' ? true : false;
}

const bizNoFormatter = (params: ValueFormatterParams) => {
  // log("bizNoFormatter", params)
  if (!params.value) return;
  return params.value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
}

function checkBoxParser(params: ValueParserParams) {
  // log("checkBoxParser", params)
  return params.newValue === 'Y' ? true : false;
}





export default ListGrid;