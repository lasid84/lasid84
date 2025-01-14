
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetTransPortData } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageMGrid } from "layouts/grid/grid";
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import PopUpCust from '@/app/stnd/stnd0008/_component/popup'

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    initData?: any | null;
};

const MasterGrid: React.FC<Props> = ({initData}) => {

    const { dispatch, objState } = useAppContext();
    const { searchParams } = objState;
    const [gridRef, setGridRef] = useState(objState.gridRef_m);

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetTransPortData, { enabled: false });
    const gridOption: GridOption = {
        colVisible: { col : ["cust_nm_chi","corp_reg_no","area_cd","cust_nm_abbr","city_nm","post_no1","post_no2","addr3","bz_kind_cd","home_page_addr","bz_type", "sale_cust_yn", "prch_cust_yn", 
            "gen_cust_yn", "cal_except_yn", "vendor_id", "crrg_cust_yn"], visible:false },
        gridHeight: "h-full",
        colDisable: ["cust_code"],
        checkbox: ["use_yn", "crrg_cust_yn"],
        dataType: { "bz_reg_no": "bizno" },
        // isMultiSelect: false,
        isAutoFitColData: true,
        isSelectRowAfterRender: true
        // alignLeft: ["major_category", "bill_gr1_nm"],
        // alignRight: [],
    };

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            dispatch({ isMSearch: false });
        }
    }, [objState?.isMSearch]);

    const handleRowClicked = (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
    };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = param.api.getSelectedRows()[0];
        dispatch({ mSelectedRow: selectedRow });
    };

    const handleRowDoubleClicked = useCallback((param: RowClickedEvent) => {
        // var data = onRowClicked(param);
        var selectedRow = {"colId": param.node.id, ...param.node.data}
        dispatch({mSelectedRow:selectedRow, isPopUpOpen:true, crudType:crudType.UPDATE});
      }, []);

    // useEffect(() => {
    //     setGridRef(objState.gridRef_m);
    // },[objState.gridRef_m])

    const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }

    return (
        <PageMGrid>
            <Grid
                id="gridMaster"
                gridRef={gridRef}
                listItem={mainData as gridData}
                options={gridOption}
                // domLayout="autoHeight"
                event={{
                    onRowClicked: handleRowClicked,
                    onSelectionChanged: handleSelectionChanged,
                    onRowDoubleClicked: handleRowDoubleClicked
                }}
            />
            <PopUpCust loadItem={initData} callbacks={[mainRefetch]}/>
        </PageMGrid>
    );
}

export default MasterGrid;