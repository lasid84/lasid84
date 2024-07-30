
'use client';

import { useEffect, useState, memo } from "react";
import { SP_GetMasterData } from "./data";
import { useAppContext, crudType } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid, { getGridState, gotoFirstRow, ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { GridPreDestroyedEvent, RowClickedEvent, SelectionChangedEvent, StateUpdatedEvent } from "ag-grid-community";
import { PageMGrid2, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from 'components/button';
import GridReferences from "@/app/ufsm/ufsm0001/_component/gridReferences";


const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData: any | null
}

const MasterGrid: React.FC<Props> = memo(({ initData }) => {

    // const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();

    // const [gridRef, setGridRef] = useState(objState.gridRef_m)

    const { data: mainData, refetch: mainRefetch } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enabled: false });
    // const { data: mainDetailData } = useGetData(objState?.mSelectedRow, SEARCH_MD, SP_GetDetailData, { enabled: true });


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
        // refRow: objState.refRow //scroll
    };

    const handleRowDoubleClicked = async (param: RowClickedEvent) => {
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
        log("handleSelectionChanged", selectedRow)
        // console.log('handleSelectionChanged2', gridRef.current.api.getFirstDisplayedRowIndex())
        // dispatch({ refRow: gridRef.current.api.getFirstDisplayedRowIndex() })
    };

    const handleonClick = async () => {
        // var selectedRow = { "colId": param.node.id, ...param.node.data }
        if (objState.tab1) {
            // var tabName = "NEW" + (objState.tab1.reduce((acc:number,v:{cd:string}) => v.cd.includes("NEW") && acc + 1,0)+1);
            var temp = objState.tab1
                            .filter((v:{cd:string}) => v.cd.includes("NEW"))
                            .sort()
                            .reverse();
                            
            var tabSeq = temp.length ? Number(temp[0].cd.replace("NEW",'')) + 1 : 1;
            var tabName = `NEW${tabSeq}`;

            var initData = await rowAdd(objState.gridRef_m.current, {bk_id: tabName, use_yn: true});
            await (mainData as gridData).data.push(initData);
        
            setTimeout(() => {
                log("setTimeout")
                
                objState.tab1.push({ cd: tabName, cd_nm: tabName })
                dispatch({ MselectedTab: tabName, isMDSearch: true, popType: crudType.CREATE, });
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

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            // log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
            if (objState.gridRef_m.current) gotoFirstRow(objState.gridRef_m.current)
        }
    }, [objState?.isMSearch]);

    return (
        <>
            <PageMGrid2
                title={<> </>}
                right={
                    <>
                        <ICONButton id="alarm" disabled={false} size={'24'} />
                        <Button id={"new"} onClick={handleonClick} width="w-40" />
                    </>
                }>
                <Grid
                    gridRef={objState.gridRef_m}
                    loadItem={initData}
                    listItem={mainData as gridData}
                    options={gridOption}
                    event={{
                        onRowDoubleClicked: handleRowDoubleClicked,
                        onRowClicked: handleRowClicked,
                        onSelectionChanged: handleSelectionChanged,
                        onGridPreDestroyed: handleGridPreDestroyed,
                        // onStateUpdated: handleStateUpdated
                    }}
                    gridState={objState.mGridState}
                />
            </PageMGrid2>
        </>
    );
});

export default MasterGrid;