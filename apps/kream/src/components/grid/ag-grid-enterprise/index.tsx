"use client"

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "./style.css";
import 'ag-grid-enterprise';
import { useConfigs } from "states/useConfigs";
import { Suspense, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GridOptions, Column, CellClickedEvent, CellValueChangedEvent, CutStartEvent, CutEndEvent, PasteStartEvent, RowDoubleClickedEvent,
  PasteEndEvent, ValueFormatterParams, ValueSetterParams, GridReadyEvent, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy,
  SizeColumnsToContentStrategy, ColumnResizedEvent, ValueParserParams, IRowNode, SelectionChangedEvent, ISelectCellEditorParams, RowClickedEvent, RowDataUpdatedEvent,
  FirstDataRenderedEvent,
  CellKeyDownEvent,
  FullWidthCellKeyDownEvent,
  ComponentStateChangedEvent,
  ProcessDataFromClipboardParams,
  RowNode,
  GridState,
  GridPreDestroyedEvent,
  StateUpdatedEvent,
  RowClassParams,
  RowStyle,
  RowSpanParams,
  NewValueParams,
  DragStoppedEvent,
  ICellEditorParams
} from "ag-grid-community";

import { LicenseManager } from 'ag-grid-enterprise'
LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_AG_GRID_LICENSE!);

import { useTranslation } from 'react-i18next';

import { Skeleton } from 'components/skeleton/skeleton';
import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';
import { useGetData, useUpdateData2 } from '@/components/react-query/useMyQuery';
import { SP_GetPersonalColInfoData, SP_SetMyColumnInfo } from './_component/data';
import { bgColor } from './types/constant';

import { log, error, stringToFullDateString, stringToTime, sleep } from '@repo/kwe-lib-new';

import CustomSelectCellEditor from './_component/customSelectCellEditor';

export const ROW_TYPE = '__ROWTYPE';
export const ROW_INDEX = '__ROWINDEX';
export const ROW_CHANGED = '__changed';
export const ROW_HIGHLIGHTED = '__highlight';
export const ROW_TYPE_NEW = 'NEW';

type Props = {
  id: string;
  gridRef?: any
  loadItem?: any | null
  listItem?: gridData | null
  options?: GridOption
  event?: GridEvent
  customselect?: any | null
  gridState?: any
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
  onCellClicked?: (params: CellClickedEvent) => void;
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
  onGridPreDestroyed?: (params: GridPreDestroyedEvent) => void
  onStateUpdated?: (params: StateUpdatedEvent) => void
}

export type bgColor = keyof typeof bgColor;

export type GridOption = {
  checkbox?: string[];
  select?: {
    [key: string]: string[]; 
  };
  customSelectCells?: {
    [key: string]: any;
  }
  icon?: any;
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
  isEditableAllNewRow?: boolean,          // 추가 row 모든 열 editable 설정
  isEditableAll?:boolean,                 // 전체컬럼 editable 설정
  dataType?: { [key: string]: string };   //date, number, text, bizno, largetext
  typeOptions?: {
    [key: string]: {
      inputLimit?: number                  //입력 자릿수 제한
      isAllowDecimal?: boolean            //소수점 허용 여부
      decimalLimit?: number               //소수점 자리수
    }
  }
  total?: {
    [key: string]: string                 //column : 타입(count, sum, avg), prefix 같은 문구를 넣으려면 custom 형식의 옵션 추가 후 개발 필요
  }
  pinned?: { [key: string]: string },

  autoHeightCol?: string[]
  isShowFilter?: boolean
  isShowFilterBtn?: boolean
  isMultiSelect?: boolean
  isAutoFitColData?: boolean
  isSelectRowAfterRender?: boolean
  isShowRowNo?: boolean
  isNoSaveColInfo?: boolean               //개인별 컬럼너비 저장 여부
  displayCalculatedFields?: string[]      //커스터마이징 셀 display
  rowSpan?: string[]
  isColumnHeaderVisible?: boolean
  cellClass?: { [key in bgColor]: string | ((params: any) => string) }; 
  rowHeight?: number;
  isVerticalCenter?: boolean;
  rowDivide?: string;
  largetextPreWrap?: boolean;
  rowSpanByConfig?: {
    targetCol: string[];
    compareCol: { [key:string]: string[] };
    standardCol: string;
  };
  multipleCells?: {
    targetCol: string[];
    compareCol: { [key:string]: string[] };
    spliter: string;
  };
  heightColByConfig?: {
    targetList: string[];
    excludeFormula: { [key:string]: string[] };
    normalHeight: number;
    expandHeight: number; 
  };
  columnSpanByConfig?: {
    targetCol: string[];
    compareCol: { [key:string]: string[] };
  };
  changeColor?: string[];
  columnVerticalCenter?: string[];
  disableWhenRowAdd?: string[];
  selectFilter?: string[];
  isDistinguishColorWhenAddRow?: boolean;

  notManageRowChange?: boolean             // ROW_CHANGED 관리 여부(row 색 자동변경)
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
  const [mainData, setMainData] = useState<any[]>();

  const [initialState, setInitialState] = useState<GridState>();
  const [currentState, setCurrentState] = useState<GridState>();
  const [myColInfo, setColInfo] = useState<any>([]);

  const gridInfo_Refresh = useConfigs((state) => state.config.gridInfo_Refresh);
  const configActions = useConfigs((state) => state.actions);

  const [gridStyle, setGridStyle] = useState({ height: "100%" });
  const {id, listItem, options, customselect = false } = props;

  const [ personalColInfoParam, setPersonalColInfoParam ] = useState<any>(null);
  // const [ personalColInfo, setPersonalColInfo ] = useState<any>();
  
  // const path = usePathname();
  const { data: personalColInfoData, refetch: personalColInfoRefetch } = useGetData(personalColInfoParam, "PersonalColumnInfo", SP_GetPersonalColInfoData, { enabled: true });
  const { Create: setMyColInfo } = useUpdateData2(SP_SetMyColumnInfo, "MyColumnInfo");

  const containerStyle = useMemo(() => "flex-col w-full h-full", []);
  // const gridStyle = useMemo(() => `w-full h-[${options?.gridHeight}]`, []);
  const [isReady, setReady] = useState(false);
  const gridRef = props.gridRef;
  const { event } = props

  // const [defaultColDef, setDefaultColDef] = useState({});
  const customselect_style = customselect ? 'select' : ''

  const cellClassRules = {
    'changed-row': (params:any) => params.data[ROW_CHANGED],
  };

  //Column Defualt 설정
  const defaultColDef = useMemo(() => {
    // log("defaultColDef memo???????????????????");
    return {
      // flex: !!options?.flex ? options.flex : 0,
      // flex: options?.isAutoFitColData? 0 : 1,
      // minWidth: 20,
      filter: 'agTextColumnFilter',
      floatingFilter: options?.isShowFilter === undefined || options?.isShowFilter ? true : false,
      // headerClass: "text-center",
      editable: true,
      // floatingFilterComponentParams: {suppressFilterButton:!options?.isShowFilterBtn ? true : false },
      suppressFloatingFilterButton: !options?.isShowFilterBtn ? true : false,
      suppressMenu: true, //컬럼명 옆 햄버거 버튼 없앰
      resizable:true,
    };
  }, [options]);

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
    // log("calculatePinnedBottomData", columnsWithTotal, totalType)
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
      // else if (target[element] && type === "sum") target[element] = `${numberFormatter(target[element])}`;
      else if (target[element] && type === "sum") {
        target[element] = new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
          }).format(target[element]).replace(/,/g, ''); 
      }
      else if (target[element] && type === "avg" && rowCnt) target[element] = `${target[element] / rowCnt}`;
      // else if (target[element] && type === "sum" && rowCnt) target[element] = ``;

    })
    // console.log(target);
    return target;
  }

  const delay = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));

  // let ready = false;
  //Grid Defualt 설정
  // const gridOptions: GridOptions = useMemo(() => {
  const gridOptions: GridOptions = useMemo(() => {
    return {
      rowHeight: (options?.rowHeight)? options.rowHeight : 25,
      headerHeight: options?.isColumnHeaderVisible === false ? 0 : 25,
      // autoHeaderHeight:true,
      rowSelection: options?.isMultiSelect ? 'multiple' : 'single',
      // groupIncludeTotalFooter: true,
      // rowMultiSelectWithClick: true,
      suppressServerSideFullWidthLoadingRow: true,
      enableRangeSelection: true,
      stopEditingWhenCellsLoseFocus: true,    //cell focus 이동시 cellvalueChanged 호출 되도록
      suppressLastEmptyLineOnPaste: true,     //엑셀 복사 후 붙여넣기시 시 다음 row 빈칸 붙여넣기 되는 오류 처리
      suppressRowTransform:true,
      animateRows: true,
      // grandTotalRow:"bottom",
      suppressScrollOnNewData:true,
      // domLayout:"autoHeight",
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
      onComponentStateChanged: async (e: ComponentStateChangedEvent) => {
        // log("onComponentStateChanged", props.gridState, gridRef?.current, initialState);

        if (options?.isSelectRowAfterRender) {
          if (gridRef?.current.api.getSelectedNodes().length > 0) return;

          gridRef?.current.api.forEachNode((node: IRowNode, i: number) => {
            if (i === 0) {
              node.setSelected(true);
              //log("onComponentStateChanged selected", node)
            }
          });
        };

        if (event?.onComponentStateChanged) event.onComponentStateChanged(e);

        let result: any = {};

        gridRef?.current.api.getAllGridColumns().forEach((item: { [key: string]: string }) => {
          result[item.colId] = null;
        });

        let pinnedBottomData = calculatePinnedBottomData(result);

        if (pinnedBottomData && Object.keys(pinnedBottomData).length) {
          gridRef?.current.api.setPinnedBottomRowData([pinnedBottomData]);
        }

      },
      // getRowClass(params) {
      //     log("getRowClass", params, params.data, params.data.__changed);
      //     for (const [key, val] of Object.entries(params.data)) {
      //       log(key, val)
      //       if (key === ROW_CHANGED) log("!!!", val);
      //     }

      //     return params.data[ROW_CHANGED] ? 'changed-row' : '';
      // },
      rowClassRules: {
        "changed-row" : (params) => {
          // await delay(100);
          // log("rowClassRules", params, params.data, params.data[ROW_CHANGED]);
          return params.data[ROW_CHANGED];
        },
        "highlighted-row" : (params) => {
          // await delay(100);
          // log("rowClassRules", params, params.data, params.data[ROW_HIGHLIGHTED]);
          return params.data[ROW_HIGHLIGHTED] === 'Y';
        },
        "row-divide" : (params) => {
          if (options?.rowDivide?.length) {
            const col = options.rowDivide;
            const currentData = params.data[col];
            if (currentData) {
              const nextData = params.api.getDisplayedRowAtIndex(params.rowIndex + 1)?.data[col];
              if (!nextData) {
                return false;
              }
              
              return currentData !== nextData;
            }
          }

          return false;
        },
      }
    };
  }, [options]);

  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  useEffect(() => {
    if (id) {
      // log("useEffect id")
      setPersonalColInfoParam({
        // path : path,
        state: config.collapsed,
        id : id
      });
    }
  }, [id])

  useEffect(() => {
    if (gridInfo_Refresh) {
      // log("useEffect gridInfo_Refresh")
      personalColInfoRefetch();
      if (gridRef.current) autoSizeAll(gridRef.current);
      configActions.setConfig({ gridInfo_Refresh: false });
    }
    
  }, [gridInfo_Refresh])

  // const prevListItemRef = useRef<gridData | null>(null);
  // const prevTRef = useRef<typeof t>();
  // const prevPersonalColInfoDataRef = useRef<gridData | undefined>();

  //컬럼 세팅
  useEffect(() => {

    // // 이전 렌더의 값과 현재 렌더의 값을 비교
    // if (prevListItemRef.current !== listItem) {
    //   console.log('listItem이 변경되었습니다:', {
    //     from: prevListItemRef.current,
    //     to: listItem
    //   });
    // }

    // if (prevTRef.current !== t) {
    //   console.log('t가 변경되었습니다:', {
    //     from: prevTRef.current,
    //     to: t
    //   });
    // }

    // if (prevPersonalColInfoDataRef.current !== personalColInfoData) {
    //   console.log('personalColInfoData가 변경되었습니다:', {
    //     from: prevPersonalColInfoDataRef.current,
    //     to: personalColInfoData
    //   });
    // }

    if (Array.isArray(listItem?.fields) && listItem?.fields.length > 0 /*&& personalColInfoData !== undefined*/) {
      // console.log("??????", id)

      // prevListItemRef.current = listItem;
      // prevTRef.current = t;
      // prevPersonalColInfoDataRef.current = personalColInfoData as gridData | undefined;

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
      
      let columns:any = [];
      // let columns = listItem.fields.map((field) => field.name);
      let hasMyColInfo = false;
      let myColInfos: any[] = [];
      if (id && (personalColInfoData as gridData)?.data.length) {
        const colInfo = (personalColInfoData as gridData).data;

        columns = colInfo.map((row:any) => {
          myColInfos.push(row);
          return row.col_nm
        });
        columns = columns.concat(listItem.fields.filter((field) => !columns.includes(field.name)).map((field => field.name)));
        setColInfo(myColInfos);
      } else {
        columns = listItem.fields.map((field) => field.name);
        setColInfo([]);
      };
          
      const dataType = listItem.fields.map((field) => field.format);
      if (!columns.includes(ROW_INDEX)) columns = [ROW_INDEX].concat(columns);

      // log("grid column setting", columns, myColInfos, personalColInfoData)
      
      columns.map((col: string, i:number) => {
      // for (let i = 0; i < columns.length; i++) {
        // const col = columns[i];

        let cellOption: any = {
          tooltipField: col,
        };

        if (col === ROW_INDEX) {
          cellOption = {
            // minWidth: 30,
            // maxWidth: 70,
            width: myColInfos[i]?.col_width ? Number(myColInfos[i]?.col_width) : 60,
            cellStyle: options?.isVerticalCenter ? { display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", height: "100%"}: { textAlign: "center" },
            aggFunc: "count",
            editable: false
          }
          
          if (options?.pinned) {
            var arrCols = Object.keys(options.pinned);
            if (arrCols.indexOf(col) > -1) {
              cellOption = {
                ...cellOption,
                pinned: options.pinned[col]
              };
            }
          }

          cols.push({
            field: col,
            headerName: t(col),
            hide: options?.isShowRowNo === false ? true : false,
            ...cellOption
          });
          return;
        }

        if (!options?.isAutoFitColData && myColInfos.length === 0) {
          cellOption = {
            ...cellOption,
            flex: 1,
            // width:100
          }
        } else {
          cellOption = {
            ...cellOption,
            flex: 0,
            // width:200
          }
        }

        cellOption = {
          ...cellOption,
          width: Number(myColInfos[i]?.col_width) || 100
        }

        //컬럼별 visible 셋팅
        let isHide: boolean = false;
        // if (col == 'test3') log("colvisible", )
        if (myColInfos.length > 0) {
          if (myColInfos[i]) isHide = (myColInfos[i]?.visible || false) === true ? false : true;
        } else if (options?.colVisible) {
          const optVisible: boolean = !!options.colVisible["visible"];
          const optCols: string[] = options.colVisible!["col"];
          // if (optVisible) {
          isHide = optVisible;
          if (optCols.indexOf(col) > -1) {
            isHide = !optVisible;
          }
          // }
        }

        //cell 수정 여부 셋팅
        const optEditable: string[] = options?.editable ? options?.editable : [];
        cellOption = {
          ...cellOption,
          editable: options?.isEditableAll ? options?.isEditableAll : optEditable.indexOf(col) > -1
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

        if (options?.typeOptions && options.typeOptions[col]) {
          if (options.typeOptions[col].inputLimit)
            cellOption = {
              ...cellOption,
              cellEditorParams: { maxLength: options.typeOptions[col].inputLimit }
            }
        }

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
          } else if (optCols[col] === 'largetext') {
            cellOption = {
              ...cellOption,
              cellEditor: 'agLargeTextCellEditor',
              cellEditorPopup: true,
            }
            if (options?.largetextPreWrap) {
              cellOption = {
                ...cellOption,
                cellStyle: {
                  whiteSpace: "pre-wrap"
                }
              }
            }
          } else if (/^date_digits_\d+$/.test(optCols[col])) {
            const digitsNumber = optCols[col].match(/^date_digits_(\d+)$/);
            cellOption = {
              ...cellOption,
              valueFormatter: dateFormatter,
              valueSetter: (params: any) => dateDigitsSetter(params, digitsNumber![1])
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

        // displayCalculatedFields custom
        if (options?.displayCalculatedFields) {
          if (options.displayCalculatedFields.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              cellRenderer : (params:any) =>{
                const mainValue = Number(params.data[col]) || 0;
                const vatValue = Number(params.data[col + '_vat']) || 0;
                let val = (+mainValue + vatValue).toFixed(0);
                let formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return formatted
              },  
              valueGetter: (params:any) => params.data[col],
              valueSetter: (params:any) => {
                params.data[col] = Number(params.newValue) || 0;
                return true;
              },
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

        // CustomeSelect setting.
        if (options?.customSelectCells) {
          const arrCols = Object.keys(options.customSelectCells);
          if (arrCols.includes(col)) {
            cellOption = {
              ...cellOption,
              cellEditor: CustomSelectCellEditor,
              cellEditorParams: {
                values: options.customSelectCells[col],
              },
            }
          }
        }

        //icon 셋팅
        if (options?.icon) {
          var arrCols = Object.keys(options.icon);
          if (arrCols.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              cellRenderer : options.icon[col],
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
        //컬럼고정
        if (options?.pinned) {
          var arrCols = Object.keys(options.pinned);
          if (arrCols.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              pinned: options.pinned[col]
            };
          }
        }

        // 조건부 텍스트 색상 변경
        if (options?.changeColor) {
          const arrCols = options.changeColor;
          if (arrCols.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              cellClassRules: {
                ...cellOption.cellClassRules,
                "cell-verify-success": (params:any) => {
                  if (params.node.data[col.concat("_flag")] === "Y") {
                    return true;
                  }

                  return false;
                },
                "cell-verify-fail": (params:any) => {
                  if (params.node.data[col.concat("_flag")] === "N") {
                    return true;
                  }

                  return false;
                }
              }
            }
          }
        }

        // grid 수직 가운데 정렬 설정
        if (options?.isVerticalCenter) {
          cellOption = {
            ...cellOption,
            cellStyle: {
              ...cellOption.cellStyle,
              display: "flex",
              justifyContent: "center",
              alignItems: 'center'
            }
          }
        }

        // 컬럼별 수직 설정
        if (options?.columnVerticalCenter) {
          const columns = options.columnVerticalCenter;
          if (columns.includes(col)) {
            cellOption = {
              ...cellOption,
              cellStyle: {
                ...cellOption.cellStyle,
                display: "flex",
                justifyContent: "center",
                alignItems: 'center'
              }
            }
          }
        }

        //rowSpanByConfig
        if (options?.rowSpanByConfig) {
          const targetCols = options.rowSpanByConfig.targetCol;
          if (targetCols.includes(col)) {
            cellOption = {
              ...cellOption,
              rowSpan: getRowSpanByConfig,
              cellRenderer: rowSpanByConfigRenderer,
              onCellValueChanged: rowSpanByConfigValueChanged,
              cellDataType: false,
              cellClassRules: {
                ...cellOption.cellClassRules,
                "show-cell": "value !== undefined",
                "row-span-default": (params: any) => {
                  const api = gridRef.current.api;

                  if (api.getDisplayedRowCount()-1 === params.node.rowIndex || params.node.rowIndex === 0) {
                    return false;
                  }

                  if (params.value === "" || params.value === undefined) {
                    return false;
                  }

                  const currentRowNode = api.getRowNode(params.node.rowIndex);
                  const nextRowNode = api.getRowNode(params.node.rowIndex+1);
                  
                  const standardCol = options.rowSpanByConfig?.standardCol;
                  if (standardCol) {
                    if (currentRowNode.data[standardCol] === nextRowNode.data[standardCol]) {
                      return true;
                    }
                  }
                  return false;
                }
              }
            }
          }
        }

        //체크박스 셋팅
        if (options?.checkbox) {
          if (options.checkbox.indexOf(col) > -1) {
            //  log("checkbox:", col)
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

        //multipleCells
        if (options?.multipleCells) {
          const targetCols = options.multipleCells.targetCol;
          if (targetCols.includes(col)) {
            cellOption = {
              ...cellOption,
              cellRenderer: multipleCellsRenderer,
              cellClassRules: {
                "show-cell": "value !== undefined",
              }
            }
          }
        }

        //cell스타일지정
        if (options?.cellClass) {
          const arrCols = Object.keys(options.cellClass);
          if (arrCols.indexOf(col) > -1) {    
            const classOrFunction = options.cellClass[col];

            cellOption = {
              ...cellOption,
              cellStyle: ((prevCellStyle) => (params: any) => {
                let originStyle = {};
                if (typeof classOrFunction === "function") {
                  ///함수 타입인 경우, 동적으로 스타일 반환
                  const dynamicClass = classOrFunction(params);

                  const colorStyles = {
                    backgroundColor: bgColor[dynamicClass]?.backgroundColor || null,
                    color: bgColor[dynamicClass]?.color || null
                  };

                  originStyle = {...originStyle, ...colorStyles};

                  return { ...originStyle, ...(typeof prevCellStyle === "function" ? prevCellStyle(params) : prevCellStyle) };
                }
              })(cellOption.cellStyle),
            };
          }
        }

        //rowSpan
        if (options?.rowSpan?.length) {
          var arrCols = options.rowSpan;
          if (arrCols.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              cellRenderer: cellRenderer,
              rowSpan: getRowSpan,
              cellClassRules: {
                "show-cell": "value !== undefined",
              },
              cellDataType: false
            };
          }          
        }

        if (options?.autoHeightCol?.length) {
          var arrCols = options.autoHeightCol;
          if (arrCols.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              autoHeight: true,
              wrapText:true,
            }
         }
        }

        // columnSpanByConfig
        if (options?.columnSpanByConfig) {
          const targetCols = options.columnSpanByConfig.targetCol;
          if (targetCols.includes(col)) {
            cellOption = {
              ...cellOption,
              colSpan: (params: any) => {
                for (const [key, value] of Object.entries(options?.columnSpanByConfig?.compareCol!)) {
                  if (value.includes(params.data[key])) {
                    return 2;
                  }
                }

                return 1;
              }
            }
          }
        }

        // selectFilter
        if (options?.selectFilter) {
          const arrCols = options.selectFilter;
          if (arrCols.includes(col)) {
            cellOption = {
              ...cellOption,
              filter: "agSetColumnFilter"
            }
          }
        }

        //isDistinguishColorWhenAddRow
        if (options?.isDistinguishColorWhenAddRow) {
          const disableCols = options.disableWhenRowAdd;
          if (disableCols?.includes(col)) {
            cellOption = {
              ...cellOption,
              cellStyle: ((prevCellStyle) => (params: any) => {
                let newStyle = {
                  backgroundColor: (params.data.__ROWTYPE !== "NEW")? '' : '#CDCDCD'
                }
                
                return { ...newStyle, ...(typeof prevCellStyle === "function" ? prevCellStyle(params) : prevCellStyle) };
              })(cellOption.cellStyle)
            }
          }
        }

        cols.push({
          field: col,
          headerName: t(col),
          hide: isHide,
          ...cellOption
        });

      });
      // };
      setColDefs(cols);
      setMainData(listItem.data.map((row: any, i: number) => {
        if (options?.checkbox) {
          options?.checkbox.map((col) => {
            if (row[col]) row[col] = (row[col] === 'Y' || row[col] === true) ? true : false
          })
        }
        return {
          [ROW_INDEX]: i + 1,
          ...row,
        }
      }));
      
      // personalColInfoRefetch();
      
      // if (gridRef.current && props.gridState) {
        
      //   const savedState = props.gridState.columnSizing?.columnSizingModel; 
      //   gridRef.current.api?.applyColumnState({ state: savedState });
      // }
      // log("final cols", cols)
    }
          
  }, [listItem, t, personalColInfoData]);

  useEffect(() => {
    if (options?.gridHeight) {
      // log("options?.gridHeight", options?.gridHeight)
      setGridStyle({ height: options?.gridHeight });
    }
  }, [options?.gridHeight]);

  useEffect(() => {
    if (props.gridState && gridRef.current) {
      setInitialState(props.gridState);
      log("1", props.gridState.columnSizing)
      if (props.gridState.columnSizing?.columnSizingModel ) {
        const savedState = props.gridState.columnSizing?.columnSizingModel; 
        // log("2. savedState - ", savedState, gridRef.current.api?.getColumnState());
        gridRef.current.api?.applyColumnState({ state: savedState });
      }
    }
  }, [props.gridState, gridRef?.current])

  const onGridReady = (param: GridReadyEvent) => {
    /**
     * @dev
     * 페이지 별 rowHeight를 다르게 설정하기 위한 gridOption.
     */
    const option = options?.heightColByConfig;
    if (option) {
      const columnApi = gridRef.current.api;
      columnApi.setGridOption("getRowHeight", (params: any) => {
          if (option) {
            const target = option.targetList;
            const displayColumnList = gridRef.current.columnApi.getAllDisplayedColumns();
            if (displayColumnList.some((value: any) => target.includes(value.colId))) {
              
              let isExclude = false;
              for (const [key, value] of Object.entries(option.excludeFormula)) {
                if (value.includes(params.data[key])) {
                  isExclude = true;
                }
              }

              if (!isExclude) {
                return option.expandHeight;
              }
            }
          }
          
          return option.normalHeight;
      });
      columnApi.resetRowHeights();
    }

    if (event?.onGridReady) event.onGridReady(param);

  }

  const onSelectionChanged = (param: SelectionChangedEvent) => {
    // log("onSelectionChanged")
    // const selectedRow = {...param.api.getSelectedRows()[0], [ROW_INDEX]: param.api.getSelectedNodes()[0].rowIndex};
    const selectedRow = param.api.getSelectedRows()[0];
    let copied = [...colDefs];
    if (options?.isEditableOnlyNewRow) {
      copied.forEach(obj => {
        if (options.editable?.includes(obj.field)) obj['editable'] = (selectedRow[ROW_TYPE] === ROW_TYPE_NEW);
      });

      setColDefs(copied);
    }

    // currentRow = selectedRow[ROW_INDEX];
    if (event?.onSelectionChanged) event.onSelectionChanged(param);

  }

  const onRowClicked = (param: RowClickedEvent) => {
    // log("onRowClicked")
    // return {"colId": param.node.id, ...param.node.data};

    if (event?.onRowClicked) event.onRowClicked(param);
  }


  const onRowDoubleClicked = (param: RowDoubleClickedEvent) => {
    // log("onRowDoubleClicked")
    if (event?.onRowDoubleClicked) event.onRowDoubleClicked(param);
  }


  const onCellValueChanged = async (param: CellValueChangedEvent) => {
    // log("onCellValueChanged")
    var rowNode = param.node;
    // rowNode.data[ROW_CHANGED] = true;
    if (!options?.notManageRowChange && param.oldValue != param.newValue) {
      // log("onCellValueChanged", param, param.oldValue, param.newValue, param.oldValue !== param.newValue);
      await rowNode.setData({...rowNode.data, [ROW_CHANGED]:true});
    }
    
    // setRowChange(param.node);

    // const rowElement = document.querySelector(`[row-index="${rowNode.rowIndex}"]`) as HTMLElement;
    // log("setRowChange", rowElement, rowNode.rowIndex)
    // if (rowElement) {
    //   rowElement.classList.add('changed-row');
    // }

    if (event?.onCellValueChanged) event.onCellValueChanged(param);

  };

  const onCellClicked = (param: CellClickedEvent) => {
    if (event?.onCellClicked) event.onCellClicked(param);
  }

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
    // log('onPasteStart', param);

    if (event?.onPasteStart) event.onPasteStart(param);
  }
  const onPasteEnd = (param: PasteEndEvent) => {
    // updateRowCount('rowDataUpdated');
    // log('onPasteEnd', param);

    if (event?.onPasteEnd) event.onPasteEnd(param);
  }
  const onColumnResized = (param: ColumnResizedEvent) => {
    // updateRowCount('rowDataUpdated');
    // log('onColumnResized', param);

    if (event?.onColumnResized) event.onColumnResized(param);
  }

  const onFirstDataRendered = (param: FirstDataRenderedEvent) => {
    if (options?.isAutoFitColData && myColInfo.length === 0 /*&& (personalColInfoData as gridData)?.data.length === 0*/) {
      autoSizeAll(gridRef.current);
      // log('onFirstDataRendered', param, (personalColInfoData as gridData)?.data.length);
    }

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
    (params: ProcessDataFromClipboardParams):string[][] | null => {
      // log("processDataFromClipboard1", params);
      // const data = [...params.data];

      const lastIndex = params.api!.getDisplayedRowCount() - 1;
      const focusedCell = params.api!.getFocusedCell();
      const focusedCellIndex = params.api.getColumnDefs()?.findIndex((row:any)=> row.field === focusedCell?.column.getColId())
      const focusedIndex = focusedCell!.rowIndex;

      const numberCols = params.api.getColumnDefs()?.filter((row:any, i) => i >= focusedCellIndex! && !row.hide)
                              .map((row:any) => row.cellDataType === 'number');
      
      const data = params.data.map((row) => row.map((col,i) => numberCols![i] ? col.replace(/,/g,'') : col));
      const emptyLastRow = data[data.length - 1][0] === "" && data[data.length - 1].length === 1;
      if (emptyLastRow) {
        data.splice(data.length - 1, 1);
      }
      
      if (focusedIndex + data.length - 1 > lastIndex) {
        const resultLastIndex = focusedIndex + (data.length - 1);
        const numRowsToAdd = resultLastIndex - lastIndex;
        const rowsToAdd: any[] = [];
        for (let i = 1; i <= numRowsToAdd; i++) {
          const row = data.slice(i, i + 1)[0];
          // Create row object
          const rowObject: any = {
            use_yn: options?.checkbox?.includes("use_yn") ? true : 'Y'
          };
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
        // log("processDataFromClipboard", rowsToAdd)
        // for (const row of rowsToAdd) {
        //   rowAdd(gridRef.current, row);
        // }

        rowAdd(gridRef.current, rowsToAdd);
      }
      return data;
    },
    [],
  );

  const autoSizeAll = (gridApi: any, skipHeader: boolean = false) => {
    
    if (id !== undefined) return;

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

  const onCellDoubleClicked = (param:any) => {
    log("onCellDoubleClicked", param)
  }

  const onGridPreDestroyed = (params: GridPreDestroyedEvent) => {
      const { state } = params;
      // log("Grid state on destroy (can be persisted)", state, gridRef.current?.api.getColumnState());
      // setInitialState(state);
      setInitialState(state);

      if (event?.onGridPreDestroyed) event.onGridPreDestroyed(params);
      
  };

  const onStateUpdated = useCallback(
    (params: StateUpdatedEvent) => {
      // log("State updated3", params.state, params.state.scroll);
      // setCurrentState(params.state);
      setInitialState(params.state);
      if (event?.onStateUpdated) event.onStateUpdated(params);
  },[]);

  function getRowStyle(params: RowClassParams<any, any>): RowStyle | undefined {
    // log("getRowStyle")
    if (params.data[ROW_CHANGED]) {
      return { backgroundColor: 'lightyellow' };
    }
    // return undefined;
  }

  const onDrageStopped = async (param: DragStoppedEvent) => {

    if (!id) return;

    if (options?.isNoSaveColInfo) return;

    let colNm: any[] = [];
    let colWidth: any[] = [];
    let colVisible: any[] = [];
    gridRef.current.api.getColumnState().forEach((column: any) => {
      // log("onDrageStopped", column)
      colNm.push(column.colId);
      colWidth.push(column.width);
      colVisible.push(!column.hide);
    });
    let params = {
      // path : path,
      state: config.collapsed,
      id : id,
      col_nm: colNm.join(','),
      col_width: colWidth.join(','),
      col_visible: colVisible.join(',')
    }
    // log("onDrage", params, gridRef.current.api.getColumnState());
    await setMyColInfo.mutateAsync(params)
                  .then(async () => await personalColInfoRefetch());

  }

  const getRowSpan = (param: RowSpanParams): number => {
    
    const rowIndex = param.node?.rowIndex || 0;
    const colId = param.column.getId();
    const currentValue = param.data[colId];
    let span = 1;
    
    var totalRow = gridRef.current.api.getDisplayedRowCount()
    
    if(!totalRow) return 1;

    // 다음 행의 셀 값이 현재 셀 값과 같다면 span을 증가시킴
    for (let i = rowIndex + 1; i < totalRow; i++) {
      let rowNode = gridRef.current.api.getRowNode(i);
      if (rowNode.data[colId] === currentValue) {
        span++;
      }
      else break;
    }

    // let rowNode = gridRef.current.api.getRowNode(rowIndex - 1);
    // // 이전 행의 셀 값이 현재 셀 값과 같다면 0으로 설정
    // if (rowIndex > 0 && rowNode.data[colId] === currentValue) {
    //   return 0;
    // }
    // log("getRowSpan", param, rowIndex, colId, currentValue, totalRow, span)
    return span;
  };

  const rowSpanByConfigValueChanged = (param: NewValueParams) => {
    const option = options?.rowSpanByConfig;
    if (option) {
      const newValue = param.newValue;
      const changedColumn = param.column.getId();
      const standardCol = option.standardCol;

      if (param.data[standardCol] === '' || param.data[standardCol] === undefined) {
        return;
      }

      const rowIndex = param.node?.rowIndex || 0;
      const totalRow = gridRef.current.api.getDisplayedRowCount();

      const currentRowNode = gridRef.current.api.getRowNode(rowIndex);
      for (let i=rowIndex+1; i<totalRow; i++) {
        const nextRowNode = gridRef.current.api.getRowNode(i);
        if (nextRowNode.data[standardCol] === currentRowNode.data[standardCol]) {
          nextRowNode.setDataValue(changedColumn, newValue);
        } else {
          break;
        }
      }
    }
  }

  const getRowSpanByConfig = (param: RowSpanParams): number => {
    const option = options?.rowSpanByConfig;
    if (option) {
      for (const [key, value] of Object.entries(option.compareCol)) {
        if (value.includes("all") || value.includes(param.data[key])) {
          const rowIndex = param.node?.rowIndex || 0;
          let currentValue = param.data[option.standardCol];
          if (!currentValue || currentValue === "") {
            return 1;
          }
          let span = 1;
          
          const totalRow = gridRef.current.api.getDisplayedRowCount();
          
          if(!totalRow) {
            return 1;
          }

          for (let i=rowIndex+1; i<totalRow; i++) {
            let previousRowNode;
            if (rowIndex === 0) {
              previousRowNode = gridRef.current.api.getRowNode(i-1); // currentValue
            } else {
              previousRowNode = gridRef.current.api.getRowNode(i-2);
            }
            const nextRowNode = gridRef.current.api.getRowNode(i);
            if ((rowIndex === 0) || (previousRowNode.data[option.standardCol] !== currentValue && nextRowNode.data[option.standardCol] === currentValue)) {
              for (let j=rowIndex+1; j<totalRow; j++) {
                const rowNode = gridRef.current.api.getRowNode(j);
                if (rowNode.data[option.standardCol] === currentValue) {
                  span++;
                } else {
                  break;
                }
              }
              return span;              
            } else {
              return 0;
            }
          }
        }
      }
    }
    return 1;
  };

  const cellRenderer = (params: CustomCellRendererProps) => {

    if (params.node.rowIndex === null || params.node.rowIndex === undefined || params.node.rowIndex < 0 || !params.column) return;

    if (params.node.rowIndex !== 0) {
      let rowNode = gridRef.current.api.getRowNode(params.node.rowIndex - 1);

      if (params.value === rowNode.data[params.column.getId()]) {
          return;
      }
    }
    return (
      <div style={{ position: 'relative', zIndex: 'auto' }}>
            <div className="show-name">{params.value}</div>
            {/* <div className="presenter-name">{params.value.presenter}</div> */}
      </div>
    );
  };

  const rowSpanByConfigRenderer = (params: CustomCellRendererProps) => {
    if (params.node.rowIndex === null || params.node.rowIndex === undefined || params.node.rowIndex < 0 || !params.column) 
      return;

    const rowData = params.data;

    if (options?.rowSpanByConfig) {
      for (const [key, value] of Object.entries(options?.rowSpanByConfig?.compareCol)) {
        if (value.includes("all") || value.includes(rowData[key])) {
          const standardCol = options.rowSpanByConfig.standardCol;
          if (params.node.rowIndex !== 0) {
            let rowNode = gridRef.current.api.getRowNode(params.node.rowIndex - 1);
            if (params.data[standardCol] === rowNode.data[standardCol]) {
              return;
            }
          }
        }
      }
    }

    return (
      <div style={{ zIndex: 'auto' }}>
        <div className="show-name">{(params.valueFormatted)? params.valueFormatted : params.value}</div>
      </div>
    );
  };

  const multipleCellsRenderer = (params: CustomCellRendererProps) => {
    if (params.node.rowIndex === null || params.node.rowIndex === undefined || params.node.rowIndex < 0 || !params.column) return;

    const rowData = params.data;

    const option = options?.multipleCells
    if (option) {
      for (const [key,value] of Object.entries(option.compareCol)) {
        if (value.includes(rowData[key])) {
          if (params.node.rowIndex !== 0) {
            return (
              <>
                <div style={{ display:'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <div className="show-name">{params.value.split(option.spliter)[0]}</div>
                </div>
                <div style={{ display:'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <div className="show-name">{params.value.split(option.spliter)[1]}</div>
                </div>
              </>
            )
          }
        }
      }
    }

    return (
      <div style={{ position: 'relative', zIndex: 'auto' }}>
        <div className="show-name">{(params.valueFormatted)? params.valueFormatted : params.value}</div>
      </div>
    );
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
              // suppressRowClickSelection={true}
              processDataFromClipboard={processDataFromClipboard}
              initialState={initialState}
              
              onGridPreDestroyed={onGridPreDestroyed}
              // onColumnMoved={(e) => log("onColumnMoved", e)}
              onDragStopped={onDrageStopped}
              onCellClicked={onCellClicked}
              // onStateUpdated={onStateUpdated}

              //↓ 이것들 적용하면 클릭,더블클릭등 이벤트가 발생 안함 - stephen
              // getRowStyle={getRowStyle}
              // getRowClass={getRowClass}
              // rowClassRules={rowClassRules}
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

export const rowAdd = async (
  gridRef: {props: any; api: any },
  initData: [] | {},

) => {

  await gridRef.api.setFilterModel(null);
  await gridRef.api.clearRangeSelection();
  var col = getFirstColumn(gridRef);
  var datas = [];

  let rows = Array.isArray(initData) ? initData : [initData];

  // log("rowAdd rows : ", rows)
  let rowCount = 0;
  for (const row of rows) {
    rowCount = await gridRef.api.getDisplayedRowCount();
    // let renderedRow = await gridRef.api.getRenderedNodes().length;
    

    var data = {
      [col]: '',
      ...row,
      [ROW_INDEX]: rowCount + 1,
      [ROW_TYPE]: ROW_TYPE_NEW,
      [ROW_CHANGED]: true
    };

    await gridRef.api.applyTransaction({ add: [data] });
    await gridRef.api.setFocusedCell(rowCount, col);
    // await gridRef.api.startEditingCell({
    //   rowIndex: rowCount,
    //   colkey: col
    // });

    if (gridRef.api) {
      var rowNode = gridRef.api.getRowNode(rowCount);
      await rowNode.setSelected(true);
      // setRowChange(rowNode);
    }


    // log('rowAdd', rowCount, col, data);
    datas.push(data);
    await gridRef.api.ensureIndexVisible(rowCount, 'bottom');
  }

  //이렇게까지 해야하나
  setTimeout(async ([rowCount, col]) => await gridRef.api.setFocusedCell(rowCount, col), 200, [rowCount, col]);

  return datas
};

const dateFormatter = (params: ValueFormatterParams) => {
  return stringToFullDateString(params.value, '-');
  // return stringToDateString(params.value, '-');
}

const dateDigitsSetter = (params: ValueSetterParams, digitsNumber: string) => {
  const field = params.column.getColDef().field;
  if (!params.newValue || !field) {
    return false;
  }

  const digits = Number(digitsNumber);
  if (!digits || isNaN(digits)) {
    return false;
  }
  
  let onlyNumerical = params.newValue.replace(/\D/g, "");
  if (onlyNumerical === "") {
    return false;
  } else if (onlyNumerical.length > digits) {
    onlyNumerical = onlyNumerical.substring(0, digits);
  } else if (onlyNumerical.length < digits) {
    onlyNumerical = onlyNumerical.padEnd(digits, "0");
  }

  params.data[field] = onlyNumerical;

  return true;
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

    // log("numberFormatter", val, !isNaN(val), parseFloat(val), +val);
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
  return params.newValue === 'Y' ? true : false;
}

export const JsonToGridData = (arrDataJson:any[], header:string[],headerLine=1) => {
  const data: gridData = {
    "data":[],
    "fields":[]
  };

  // for (ls

  data.data = arrDataJson;
  data.fields = header.map(v => {
    let obj = {"name":v};
    return obj
  });
  log("JsonToGridData", data);
  return data;
}

export const getGridState = (gridRef: {props: any; api: any }) => {
  if (gridRef?.api) {
    return gridRef.api.getState();
  }
  return null;
}

export const gotoFirstRow = (gridRef: {props: any; api: any }) => {
  if (gridRef?.api && gridRef?.api.ensureIndexVisible) gridRef.api.ensureIndexVisible(0,'top');
}

const setRowChange = async (rowNode: IRowNode) => {
    // 특정 행에 클래스 추가
    if (rowNode) {
      const rowElement = document.querySelector(`[row-index="${rowNode.rowIndex}"]`) as HTMLElement;
      // log("setRowChange", rowElement, rowNode.rowIndex)
      if (rowElement) {
        rowElement.classList.add('changed-row');
      }
    }
}

export default ListGrid;