
'use client';

import { useEffect, useState, memo } from "react";
import { SP_CreateData, SP_GetMasterData, SP_UpdateData } from "./data";
import { useAppContext, crudType } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { getGridState, gotoFirstRow, ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { CellValueChangedEvent, GridPreDestroyedEvent, RowClickedEvent, SelectionChangedEvent, StateUpdatedEvent } from "ag-grid-community";
import { PageMGrid2, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from 'components/button';
import GridReferences from "@/app/ufsm/ufsm0001/_component/gridReferences";
import { toastSuccess } from "@/components/toast";


const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData: any | null
}

const MasterGrid: React.FC<Props> = memo(({ initData }) => {

    // const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();

    const [gridRef, setGridRef] = useState(objState.gridRef_m)

    const { data: mainData, refetch: mainRefetch } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enabled: false });
    const { Create } = useUpdateData2(SP_CreateData, SEARCH_M);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_M);


    const gridOption: GridOption = {
        colVisible: { col: ["trans_mode", "trans_type", "orig_department_id","shipper_cont_seq","pickup_seq","cy_cont_seq",
                            "cr_t_cont_seq","cr_s_cont_seq", "orig_agent_id", "b_agent_id", "ams_yn","ams","cr_fak","cr_nac",
                            "aci_yn","aci","afr_yn","edi_yn","isf_yn","e_manifest_yn","use_yn",
                            "create_user", "update_date", "update_user"], visible: false },
        gridHeight: "h-[calc(100vh-200px)]",
        minWidth: { "bk_id": 100, "waybill_no": 150, "shipment_status": 40 },
        dataType: {
            "executed_on_date": "date", "accounting_date": "date",  "create_date": "date", "bk_dd": "date", "etd": "date", 
            "eta": "date", "final_eta": "date", "doc_close_dd": "date", "cargo_close_dd": "date", "pickup_dd": "date",
            "doc_close_tm" : "time", "cargo_close_tm" : "time", "pickup_tm" : "time",
            "volume": "number", "gross_weight": "number", "volume_weight": "number", "chargeable_weight": "number",
        },
        isAutoFitColData: true,
        editable: ["bk_dd", "origin_terminal_id", "dest_terminal_id", "vocc_id", "customs_declation", "milestone", "state", "bk_remark", "shipper_id", "sales_person", "ship_remark", "cnee_id"
            , "ts_port", "vessel", "port_of_loading", "port_of_unloading", "etd", "eta", "final_dest_port", "final_eta", "doc_close_dd", "doc_close_tm", "cargo_close_dd", "cargo_close_tm"
            , "svc_type", "vement_type", "commodity", "strategic_yn", "cargo_remark", "pickup_dd", "pickup_tm", "pickup_loc", "transport_company", "cy_place_code", "carrier_code", "cr_fak", "cr_nac"
            , "bl_type", "bill_type", "incoterms", "incoterms_remark", "ams_yn", "ams", "aci_yn", "aci", "afr_yn", "edi_yn", "isf_yn", "e_manifest_yn"
         ],
    };

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            // log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
            if (gridRef.current) gotoFirstRow(gridRef.current)
        }
    }, [objState?.isMSearch]);

    const handleRowDoubleClicked = async (param: RowClickedEvent) => {
        log("handleRowDoubleClicked")
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        if (objState.tab1) {
            if (objState.tab1.findIndex((element: any) => {
                if (element.cd === selectedRow.bk_id) { return true }
            }) !== -1) {
                dispatch({ MselectedTab: selectedRow.bk_id })
            } else {
                objState.tab1.push({ cd: selectedRow.bk_id, cd_nm: selectedRow.bk_id })
                dispatch({ MselectedTab: selectedRow.bk_id,  })
            }
        }
        dispatch({ isMDSearch: true, mSelectedRow: selectedRow, popType:crudType.UPDATE});
        
    }

    const handleRowClicked = async (param: RowClickedEvent) => { };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = param.api.getSelectedRows()[0];
        log("handleSelectionChanged", selectedRow);
        // console.log('handleSelectionChanged2', gridRef.current.api.getFirstDisplayedRowIndex())
        // dispatch({ refRow: gridRef.current.api.getFirstDisplayedRowIndex() })
    };

    const onGridNew = async () => {
        // var selectedRow = { "colId": param.node.id, ...param.node.data }
        if (objState.tab1) {
            // var tabName = "NEW" + (objState.tab1.reduce((acc:number,v:{cd:string}) => v.cd.includes("NEW") && acc + 1,0)+1);
            var temp = objState.tab1
                            .filter((v:{cd:string}) => v.cd.includes("NEW"))
                            .sort()
                            .reverse();
                            
            var tabSeq = temp.length ? Number(temp[0].cd.replace("NEW",'')) + 1 : 1;
            var tabName = `NEW${tabSeq}`;

            var rows = await rowAdd(gridRef.current, {bk_id: tabName, use_yn: true});
            for (const row of rows) {
                await (mainData as gridData).data.push(row);
            }
        
            setTimeout(() => {                
                objState.tab1.push({ cd: tabName, cd_nm: tabName })
                dispatch({ MselectedTab: tabName, isMDSearch: true, isCGDSearch : true, popType: crudType.CREATE, });
                //dispatch({mSelectedRow: ...mSelectedRow, })
            }, 200);
        }
        
    }

    const handleGridPreDestroyed = (param:GridPreDestroyedEvent) => {
        // let gridState = getGridState(gridRef.current);
        // log('handleGridPreDestroyed', param.state);
        dispatch({ mGridState:param.state });
    }

    const handleStateUpdated = (param:StateUpdatedEvent) => {
        if (!objState.mGridStateInit) dispatch({ mGridStateInit:param.state });
    }

    const handleCellValueChanged = (param:CellValueChangedEvent) => {
        let nodeData = param.node.data;
        // log("handleCellValueChanged1", nodeData);
        let idx = (mainData as gridData).data.findIndex((row:any) => row["bk_id"] === nodeData["bk_id"]);
        (mainData as gridData).data[idx] = {...nodeData};
    }

    const onGridSave = () => {
        var hasData = false;
        gridRef.current.api.forEachNode((node: any) => {
            var data = node.data;
            
            if (data.__changed) {
                hasData = true;
                if (gridOption?.checkbox) {
                    for (let i = 0; i < gridOption?.checkbox?.length; i++) {
                        let col = gridOption?.checkbox[i];
                        data[col] = data[col] ? 'Y' : 'N';
                    }
                }
                
                if (data.__ROWTYPE === ROW_TYPE_NEW) { //신규 추가
                    Create.mutate(data);
                } else { //수정
                    Update.mutate(data);
                }
            }
        });
        if (hasData) {
            toastSuccess('Success.');
        }
    }

    return (
        <>
            <PageMGrid2
                title={<> </>}
                right={
                    <>
                        <ICONButton id="alarm" disabled={false} size={'24'} />
                        <Button id={"gird_new"} label="new" onClick={onGridNew} width="w-20" />
                        <Button id={"grid_save"} label="save" onClick={onGridSave} width="w-20" />
                    </>
                }>
                <Grid
                    gridRef={gridRef}
                    loadItem={initData}
                    listItem={mainData as gridData}
                    options={gridOption}
                    event={{
                        onRowDoubleClicked: handleRowDoubleClicked,
                        onRowClicked: handleRowClicked,
                        onSelectionChanged: handleSelectionChanged,
                        onGridPreDestroyed: handleGridPreDestroyed,
                        // onStateUpdated: handleStateUpdated
                        onCellValueChanged: handleCellValueChanged
                    }}
                    gridState={objState.mGridState}
                />
            </PageMGrid2>
        </>
    );
});

export default MasterGrid;