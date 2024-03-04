"use client"

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid
// import 'ag-grid-enterprise';

import PageContent from "@/shared/tmpl/page-content"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GridOptions, Column, CellClickedEvent, CellValueChangedEvent, CutStartEvent, CutEndEvent, PasteStartEvent, PasteEndEvent, ValueFormatterParams, GridReadyEvent } from "ag-grid-community";

import { useAppContext } from "@/components/provider/contextProvider";
import { SELECTED_ROW } from '@/app/stnd/stnd0006/_component/model';
import './styles.css';
import { useTranslation } from 'react-i18next';

// import { SELECTED_ROW } from "./model";

const { log } = require('@repo/kwe-lib/components/logHelper');
const { stringToFullDateString, stringToFullDate, stringToDateString } = require('@repo/kwe-lib/components/dataFormatter.js')

type Props = {
    loadItem?: any | null
    listItem: any | null
    options?: GridOption
}

export type GridOption = {
    checkbox?: string[];
    colVisible?: {
      col: string[]
      visible:boolean
    }
    editable?: string[];
    dataType?: {[index: string]: string}; //date, number, text
    isMultiSelect?: boolean
};

type cols = {
  field: string;
  hide: boolean;
  editable: boolean;
  valueFormatter?: any;
  cellDataType: string;  
  headerCheckboxSelection: boolean;
  checkboxSelection: boolean;
}

const isFirstColumn = (params: { api: { getAllDisplayedColumns: () => any; }; column: any; }) => {
  var displayedColumns = params.api.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
};

const dateFormatter = (params: ValueFormatterParams) => {
  return stringToFullDateString(params.value, '-');
  // return stringToDateString(params.value, '-');
}

const numberFormatter = (params: ValueFormatterParams) => {
  return Math.floor(+params.value).toLocaleString();
}

const ListGrid: React.FC<Props> = (props) => {

    const { dispatch } = useAppContext();
    const { t } = useTranslation();

    const gridRef = useRef<any | null>(null);
    const [colDefs, setColDefs] = useState<cols[]>([]);
    const [mainData, setMainData] = useState([{}]);

    const containerStyle = useMemo(() => "flex flex-col w-full", []);
    const gridStyle = useMemo(() => "w-full h-[550px]", []);

    const { listItem, options } = props;

    // log("===========", dateFormatter('20240228102032'))

    const defaultColDef = useMemo(() => {
      return {
        // flex: 1,
        minWidth: 50,
        filter: 'agTextColumnFilter',
        floatingFilter: true,        
        // headerCheckboxSelection: checkbox ? isFirstColumn : false,
        // checkboxSelection: checkbox ? isFirstColumn : false,
      };
    }, []);

    const gridOptions: GridOptions = useMemo(() => {
        return {
          rowHeight: 25,
          headerHeight: 25,
          enableRangeSelection:true,  // enterprise
          // copyHeadersToClipboard:true,
          suppressMultiRangeSelection:true,
          rowSelection: options?.isMultiSelect ? 'multiple' : 'single',
          autoSizeStrategy: {
            type: 'fitCellContents',
            defaultMinWidth: 50,
            // columnLimits: [
            //     {
            //         colId: 'country',
            //         minWidth: 900
            //     }
            // ]
        },    
        };
      }, []);

      // const onGridReady = useCallback((params: GridReadyEvent) => {
      //   setMainData(
      //       listItem?.map((rowData: any) => {
      //           const dateParts = rowData.date.split('/');
      //           log("rowData", rowData.create_date);
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
      // }, []);
  
  useEffect(() => {
    if (Array.isArray(listItem) && listItem.length > 0) {
      // log('===listitem', listItem);
      let cols:cols[] = [];
      const columns = Object.keys(listItem[0]);
      columns.map((col:string) => {

        let isHide: boolean = false;
        if (options?.colVisible) {
          const optVisible:boolean = !!options.colVisible["visible"];
          const optCols:string[] = options.colVisible!["col"];
          if (optVisible) {
            isHide = optVisible;
            if (optCols.indexOf(col) > -1) {
              // log("===", col);
              isHide = !optVisible;
            }
          }
        }

        let isEditable = false;
        if (options?.editable) {
          const optCols:string[] = options.editable;
          if (optCols.indexOf(col) > -1) {
            isEditable = true;
          }          
        };

        var cellOption:any = {
            cellDataType : 'text'
        };
        if (options?.dataType) {
          const optCols:{[key: string]: string} = options.dataType;
          
          if (optCols[col] === 'date') {            
            cellOption = {
              // cellDataType : optCols[col],
              valueFormatter: dateFormatter,
            }
          } else if (optCols[col] === 'number') {
            cellOption = {
              cellDataType : optCols[col],
              valueFormatter: numberFormatter,
            }
          }
        };

        if (options?.checkbox) {
          if (options.checkbox.indexOf(col) > -1) {
            cellOption = {
              ...cellOption,
              headerCheckboxSelection: true,
              checkboxSelection: true
            }
          }
        }
        
        cols.push({
          field:col,
          hide: isHide,
          editable: isEditable,
          ...cellOption
        });
      });      
      setColDefs(cols);
      setMainData(listItem);
    }
    // log("colDefs", colDefs);
  }, [listItem]);

  const onSelectionChanged = useCallback(() => {
    const selectedRow = gridRef.current.api.getSelectedRows()[0];
    log(selectedRow);
    // setSelectedRow(selectedRow);    
    dispatch({type:SELECTED_ROW, selectedRow:selectedRow});
    // document.querySelector('#selectedRows').innerHTML =
    //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
  }, []);

  const onCellValueChanged = useCallback((params: CellValueChangedEvent) => {
    log('Callback onCellValueChanged:', params);
  }, []);

  const onCutStart = useCallback((params: CutStartEvent) => {
    log('Callback onCutStart:', params);
  }, []);

  const onCutEnd = useCallback((params: CutEndEvent) => {
    log('Callback onCutEnd:', params);
  }, []);

  const onPasteStart = useCallback((params: PasteStartEvent) => {
    log('Callback onPasteStart:', params);
  }, []);

  const onPasteEnd = useCallback((params: PasteEndEvent) => {
    log('Callback onPasteEnd:', params);
  }, []);
  
    return (
        <>
          <div className={containerStyle}>
              <div 
                // className={`ag-theme-quartz ${gridStyle}`}
                className={`ag-theme-custom ${gridStyle}`}
                // style={{height:500}}
              >
                  <AgGridReact
                      ref={gridRef}
                      gridOptions={gridOptions}
                      rowData={mainData}
                      columnDefs={colDefs}
                      defaultColDef={defaultColDef}
                      // rowSelection={'single'}
                      // onGridReady={onGridReady}
                      // enableRangeSelection={true}
                      onSelectionChanged={onSelectionChanged}
                      onCellValueChanged={onCellValueChanged}
                      onCutStart={onCutStart}
                      onCutEnd={onCutEnd}
                      onPasteStart={onPasteStart}
                      onPasteEnd={onPasteEnd}
                  />
              </div>
          </div>
        </>
    )
}

export default ListGrid