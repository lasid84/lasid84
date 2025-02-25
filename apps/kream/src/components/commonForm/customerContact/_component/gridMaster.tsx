
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState, forwardRef } from "react";
import { SP_GetDetailData, SP_InsertData, SP_UpdateData } from "./data";
import { PageState, State, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { CellValueChangedEvent, IRowNode, RowClickedEvent, RowNode, SelectionChangedEvent } from "ag-grid-community";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    id?: string
    initData?: any | null
    params: {
        cust_code: string
        cont_type: string | null
    }
    isAgency?: boolean
};

const GridMaster = forwardRef<any, Props>(({id= 'gridMaster', initData, params, isAgency}, ref) => {

    const { dispatch, objState } = useAppContext();
    const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data, refetch, remove } = useGetData({...params, isAgency:isAgency}, SEARCH_D, SP_GetDetailData);

    useEffect(() => {
        let arrDept = [];
        if (initData) {
            arrDept = initData[0]?.data.map((row: any) => row['user_dept'])
        }
        // log(initData[0].data)
        const gridOption: GridOption = {
            colVisible: { col: ["cust_code", "cont_seq", "cont_type"], visible: false },
            // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
            gridHeight: "h-full",
            checkbox: ["use_yn", "def"],
            select: { "user_dept": arrDept },
            minWidth: { "email": 200 },
            // editable: ["pic_nm", "email", "cust_office", "tel_num", "fax_num", "user_dept", "bz_plc_cd", "use_yn", "def"],
            isEditableAll: true,
            dataType: { "create_date": "date", "vat_rt": "number", "bz_reg_no": "bizno" },
            // isMultiSelect: false,
            isAutoFitColData: false,
            // alignLeft: ["major_category", "bill_gr1_nm"],
            // alignRight: [],
        };

        setGridOptions(gridOption);
        
    }, [initData])

    useEffect(() => {
        remove();
        refetch();
    }, []);

    useEffect(() => {
        if (objState.isDSearch) {
            refetch();
          dispatch({ isDSearch: false });
        }
      }, [objState.isDSearch]);

    const handleCellValueChanged = (param: CellValueChangedEvent) => {
        log("handleCellValueChanged");
        (ref as React.MutableRefObject<any>)?.current?.api.forEachNode((node: IRowNode, i: number) => {
            if (!param.node.data.def) return;
            if (node.id === param.node.id) return;

            if (node.data.def === true) {
                node.setDataValue('def', false);
            }
        })
    };

    return (
        <>
            <Grid
                id={id}
                gridRef={ref}
                listItem={data as gridData}
                options={gridOptions}
                event={{
                    onCellValueChanged: handleCellValueChanged,
                }}
            />
        </>

    );
})

export default GridMaster;