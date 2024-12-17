
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { SP_GetMasterData, SP_GetInvoiceMasterContent } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D, SEARCH_MD } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData: any | null;
};

const MasterGrid: React.FC<Props> = ({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();

    const { data: mainData, refetch: mainRefetch } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enabled: false });
    const { data: mainDetailData } = useGetData(objState?.mSelectedRow, SEARCH_MD, SP_GetInvoiceMasterContent, { enabled: true });


    const gridOption: GridOption = {
        colVisible: { col: ["billto_nm_kor", "house_bl_no", "invoice_no", "invoice_sts", "billing_yn", /*"shipper_code", "shipper_nm", "consign_code", "consign_nm"*/], visible: true },
        gridHeight: "h-full",
        minWidth: {"invoice_no": 150,  "house_bl_no": 120, "billto_nm_kor":200},
        maxWidth: {"billing_yn": 100},
        dataType: { "bz_reg_no": "bizno" },
        isAutoFitColData: false,
        isSelectRowAfterRender:true
    };

    const handleRowClicked = async (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        // log("handleRowClicked", selectedRow)
        // var data = onRowClicked(param);
        // log("handleRowClicked", data)

    };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = param.api.getSelectedRows()[0];
        // const row = onSelectionChanged(param)
        // log("handleSelectionChanged", selectedRow)
        // dispatch({})

        // log("Master handleSelectionChanged", row);
        dispatch({ isMDSearch: true, mSelectedRow: selectedRow });
    };

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            // log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
        }
    }, [objState?.isMSearch]);

    useEffect(() => {
        if (objState.isMDSearch) {
            //mainRefetch();
            // log("maindetailisSearch", objState.isMDSearch);
            dispatch({ isMDSearch: false });
            // log("mSelectedDetail", objState.mSelectedDetail)
        }
    }, [objState?.isMDSearch]);

    useEffect(() => {
        if (mainDetailData) {
            dispatch({ mSelectedDetail: (mainDetailData as gridData).data[0]})
        }
    }, [mainDetailData]);

    return (
        <Grid
            id="master"
            gridRef={gridRef}
            loadItem={initData}
            listItem={mainData as gridData}
            options={gridOption}
            event={{
                onRowClicked: handleRowClicked,
                onSelectionChanged: handleSelectionChanged,
            }}
        />

    );
}

export default MasterGrid;