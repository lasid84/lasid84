
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { SP_GetMasterData, SP_GetInvoiceMasterContent } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D, SEARCH_MD } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid, { onRowClicked, onSelectionChanged } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData: any | null;
};

const MasterGrid: React.FC<Props> = ({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { searchParams, isMSearch, mSelectedRow, mSelectedDetail } = objState;

    const { data: mainData, refetch: mainRefetch } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enable: false });
    const { data: mainDetailData } = useGetData(objState?.mSelectedRow, SEARCH_MD, SP_GetInvoiceMasterContent, { enable: false });


    const gridOption: GridOption = {
        colVisible: { col: ["billto_nm_kor", "house_bl_no", "invoice_no", "invoice_sts", "billing_yn", "shipper_code", "shipper_nm", "consign_code", "consign_nm"], visible: true },
         gridHeight: "45vh",
        // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
        // checkbox: ["no"],
        // editable: ["trans_mode"],
        dataType: { "bz_reg_no": "bizno" },
        // isMultiSelect: false,
        // isAutoFitColData: false,
        // alignLeft: ["major_category", "bill_gr1_nm"],
        // alignRight: [],
    };

    const handleRowClicked = async (param: RowClickedEvent) => {
        var data = onRowClicked(param);
        log("handleRowClicked", data)
        // var invoice = data.invoice_no
        // console.log('랄랄라',invoice)
        // const result = SP_GetInvoiceMasterContent(data.invoice_no)
        // console.log('랄랄라 result?',result)

        // dispatch({ mSelectedRow: data })
        // dispatch({isDSearch:true});
    };

    const handleSelectionChanged1 = (param: SelectionChangedEvent) => {

        const row = onSelectionChanged(param)
        dispatch({})
        // console.log('랄랄라 result?',result)

        // dispatch({ mSelectedRow: result })
        // var newRow = [...selectedRow!]
        // newRow[0] = row
        // var newSearch = [
        //     ...isSearch!,
        // ]
        // newSearch[1] = true;
        log("Master handleSelectionChanged", row);
        dispatch({ isMDSearch: true, mSelectedRow: row });
        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    };

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
        }
    }, [objState?.isMSearch]);

    useEffect(() => {
        if (objState.isMDSearch) {
            //mainRefetch();
            log("maindetailisSearch", objState.isMDSearch);
            dispatch({ isMDSearch: false });
            log("mSelectedDetail", objState.mSelectedDetail)


        }
    }, [objState?.isMDSearch]);

    useEffect(() => {
        if (mainDetailData) {
            dispatch({ mSelectedDetail: mainDetailData.data[0] })
        }
    }, [mainDetailData]);

    return (
        <Grid
            gridRef={gridRef}
            loadItem={initData}
            listItem={mainData as gridData}
            options={gridOption}
            event={{
                onRowClicked: handleRowClicked,
                onSelectionChanged: handleSelectionChanged1,
            }}
        />

    );
}

export default MasterGrid;