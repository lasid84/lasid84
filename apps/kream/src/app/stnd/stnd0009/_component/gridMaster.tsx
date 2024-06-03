
'use client';

import {useEffect, useCallback, useRef, memo, } from "react";
import { SP_GetData } from "./data";
import {  crudType, useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import Modal from "./popup";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData? : any | null;
  };

const MasterGrid: React.FC<Props> = memo(({ initData }) => {    

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState = {} } = useAppContext();
    const { searchParams, isMSearch } = objState;

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetData, {enabled:false});
    const gridOption: GridOption = {
        colVisible: { col : ["carrier_code", "carrier_type", "carrier_prefix", "alternate_carrier_code", "carrier_nm", "tel_num","url","partner_id","remark","default_address_no",
        "default_contact_no","conference_ind","check_digit8_ind","cut_off_hours","cass_ind","counter_ind","csr_ind","iata_ind","csr_type","general_sales_agent","origin_country_code","pre_iata_code","create_date","create_user","update_date","update_user"], visible:true },
        // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
        gridHeight: "80vh",
        dataType: { "create_date" : "date", "vat_rt":"number"},
        isAutoFitColData: true,
        alignLeft: ["major_category", "bill_gr1_nm"],
    };
    /*
        handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
    */
    const handleRowClicked = useCallback((param: RowClickedEvent) => {
        // var data = onRowClicked(param);
        var selectedRow = {"colId": param.node.id, ...param.node.data}
        log("handleRowClicked", selectedRow);
        dispatch({mSelectedRow:selectedRow, isPopUpOpen:true, crudType:crudType.UPDATE});
      }, []);

    const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
        // // const selectedRow = onSelectionChanged(param);
        // const selectedRow = param.api.getSelectedRows()[0];
        // log("handleSelectionChanged", selectedRow);
        // dispatch({mSelectedRow:selectedRow});
        // // document.querySelector('#selectedRows').innerHTML =
        // //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    }, []);

    useEffect(() => {
        if (isMSearch) {
            mainRefetch();
            dispatch({isMSearch:false});
        }
    }, [isMSearch]);

    return (
        <>
            <Grid
                gridRef={gridRef}
                // loadItem={initData}
                listItem={mainData as gridData}
                options={gridOption}
                event={{
                    onRowClicked: handleRowClicked,
                    onSelectionChanged: handleSelectionChanged,
                }}
                />
            <Modal
                loadItem={initData}
            />
        </>
            
    );
});

export default MasterGrid;