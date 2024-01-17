import React, {useState, useRef, useCallback, useMemo, useEffect} from "react";
import {AgGridReact} from "ag-grid-react"; // the AG Grid React Component
import {
  ColDef,
  ColGroupDef,
  Grid,
  GridOptions,
  GridReadyEvent,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import {trackGridRowData, useTrackStore} from "states/useTrack";

// export interface IOlympicData {
//   athlete: string;
//   age: number;
//   country: string;
//   year: number;
//   date: string;
//   sport: string;
//   gold: number;
//   silver: number;
//   bronze: number;
//   total: number;
// }

// type columnDefs = {
//   field: string;
//   filter?: boolean;
// };

type Props = {
  gridData: trackGridRowData[];
};

const AgGridTable: React.FC<Props> = ({gridData}) => {
  const containerStyle = useMemo(() => "h-96 my-4", []);
  const gridStyle = useMemo(() => "h-96", []);
  const [rowData, setRowData] = useState<trackGridRowData[] | null>(null);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "title",
      headerName: "제목",
      minWidth: 170,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {field: "stars", minWidth: 100, headerName: "별점"},
    {field: "description", headerName: "설명"},
    {field: "category", minWidth: 100, headerName: "카테고리"},
    {field: "img", headerName: "이미지"},
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      sortable: true,
      filter: true,
      resizable: true,
    };
  }, []);

  // store
  const {gridViewData} = useTrackStore((state) => state.track);

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      setRowData(gridData);
    },
    [gridData]
  );

  useEffect(() => {
    // eslint-disable-next-line
    // console.log("gridViewData", gridViewData);

    if (gridViewData) setRowData(gridViewData);
  }, [gridViewData]);

  return (
    <div className={containerStyle}>
      <div className={`ag-theme-alpine ${gridStyle}`}>
        <AgGridReact<trackGridRowData>
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection={"multiple"}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}></AgGridReact>
      </div>
    </div>
  );
};

export default AgGridTable;
