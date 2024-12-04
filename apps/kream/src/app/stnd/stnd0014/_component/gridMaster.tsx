'use client';

import { useEffect, useCallback, useRef, memo, useState, } from "react";
import { SP_GetHolidayData, SP_SaveHoliday } from "./data";
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_CHANGED } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { Button } from "@/components/button";
import { toastSuccess } from "@/components/toast";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState = {} } = useAppContext();
    const { searchParams, isMSearch } = objState;
    
    const { data, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetHolidayData, { enabled: false, staleTime: 0 });
    const { Update: Save } = useUpdateData2(SP_SaveHoliday, "SaveHoliday");
    
    const [ mainData, setMainData ] = useState<gridData | null>(null);


    const gridOption: GridOption = {
        colVisible: { col: ["use_yn"], visible: false },
        editable: ["day_nm", "day_off", "remark"],
        gridHeight: "h-full",
        checkbox: ["day_off"],
        dataType: { "solar_dd": "date", "lunar_dd":"date",  "create_date": "date", "update_date": "date" }
        // alignLeft: ["major_category", "bill_gr1_nm"],
        // alignRight: [],

    };
    /*
        handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
    */
    const handleRowDoubleClicked = (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        // log("handleRowClicked", selectedRow);
        dispatch({ mSelectedRow: selectedRow, isPopUpOpen: true, crudType: crudType.UPDATE });
    };

    const handleRowClicked = useCallback((param: RowClickedEvent) => {

    }, []);

    const handleSelectionChanged = useCallback((param: SelectionChangedEvent) => {

    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (isMSearch) {
                const data = await mainRefetch();
                setMainData(data.data as gridData);
                dispatch({ isMSearch: false });
            }
        };

        fetchData();
    }, [isMSearch]);

    const onSave = async () => {
        var hasData = false;
        await gridRef.current.api.forEachNode((node: any) => {
            var data = node.data;
            
            if (data[ROW_CHANGED]) {
                hasData = true;
                if (gridOption?.checkbox) {
                    for (let i = 0; i < gridOption?.checkbox?.length; i++) {
                        let col = gridOption?.checkbox[i];
                        data[col] = data[col] ? 'Y' : 'N';
                    }
                }
                Save.mutateAsync(data);
            }
        });

        if (hasData) {
            toastSuccess('Success.');
            dispatch({ isMSearch: true });
        }
    }

    return (
        <>
            <div className="flex justify-end mb-1">
                <Button id="save" onClick={onSave} width="w-20" />
            </div>
            <Grid
                gridRef={gridRef}
                listItem={mainData}
                options={gridOption}
                event={{
                    onRowDoubleClicked : handleRowDoubleClicked,
                    onRowClicked: handleRowClicked,
                    onSelectionChanged: handleSelectionChanged,
                }}
            />

        </>
    );
});

export default MasterGrid;