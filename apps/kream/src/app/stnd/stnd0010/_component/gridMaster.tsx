
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
        colVisible: { col : ["port_code", "country_code", "time_zone_code", "port_name", "airport_ind", "sea_port_ind","other_port_ind","region_code",
        "hmf_pct","city_ind","hmf_ind","congested_ind","mlb_ipi_ind","port_auth_fees_ind","free_trade_zone_ind","dock_recpts_reqd_ind","rail_acessible_ind","kwe_agent_ind","target_city_ind","fiata_code","conference_code"
        ,"remarks","mdate_tz_code","cdate_tz_code","port_nm","use_yn","create_date","create_user","update_date","update_user"], visible:true },
        // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
        gridHeight: "h-full",
        checkbox: ["airport_ind", "sea_port_ind","other_port_ind","city_ind","hmf_ind","congested_ind","mlb_ipi_ind","port_auth_fees_ind","free_trade_zone_ind","dock_recpts_reqd_ind","rail_acessible_ind","kwe_agent_ind",],
        // editable: ["trans_mode"],
        dataType: { "create_date" : "date", "update_date":"date"},
        // isMultiSelect: false,
        isAutoFitColData: true,
    };
    /*
        handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
    */
    const handleRowClicked = useCallback((param: RowClickedEvent) => {
        // var data = onRowClicked(param);
        // var selectedRow = {"colId": param.node.id, ...param.node.data}
        // log("handleRowClicked", selectedRow);
        // dispatch({mSelectedRow:selectedRow, isPopUpOpen:true, crudType:crudType.UPDATE});
      }, []);

    const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
        // // const selectedRow = onSelectionChanged(param);
        // const selectedRow = param.api.getSelectedRows()[0];
        // log("handleSelectionChanged", selectedRow);
        // dispatch({mSelectedRow:selectedRow});
        // // document.querySelector('#selectedRows').innerHTML =
        // //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    }, []);

    const handleRowDoubleClicked = (param: RowClickedEvent) => {
        var selectedRow = {"colId": param.node.id, ...param.node.data}
        log("handleRowClicked", selectedRow);
        dispatch({mSelectedRow:selectedRow, isPopUpOpen:true, crudType:crudType.UPDATE});
    }

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
                    onRowDoubleClicked : handleRowDoubleClicked,
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