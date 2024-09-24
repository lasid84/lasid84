
'use client';

import { useEffect, useState, memo } from "react";
import { SP_CreateData, SP_GetMData, SP_UpdateData } from "./data";
import { useAppContext, crudType } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { getGridState, gotoFirstRow, ROW_CHANGED, ROW_TYPE, ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { CellValueChangedEvent, GridPreDestroyedEvent, RowClickedEvent, SelectionChangedEvent, StateUpdatedEvent } from "ag-grid-community";
import { PageMGrid2, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from 'components/button';
import GridReferences from "@/app/ufsm/ufsm0001/_component/gridReferences";
import { toastSuccess } from "@/components/toast";
import dayjs from "dayjs";


const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData: any | null
}

const MasterGrid: React.FC<Props> = memo(({ initData }) => {

    // const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { gridRef_m } = objState
    const [ gridMainData, setGridMainData ] = useState<gridData>();

    const { data: mainData, refetch: mainRefetch, remove } = useGetData(objState?.searchParams, "BKMainData", SP_GetMData, { enabled: false });
    const { Create } = useUpdateData2(SP_CreateData, "BKMainData", {callbacks: [mainRefetch]});
    const { Update } = useUpdateData2(SP_UpdateData, "BKMainData", {callbacks: [mainRefetch]});


    const gridOption: GridOption = {
        colVisible: { col: ["trans_mode", "trans_type", "orig_department_id","shipper_cont_seq","pickup_seq","cy_cont_seq",
                            "cr_t_cont_seq","cr_s_cont_seq", "orig_agent_id", "b_agent_id", "ams_yn","ams","cr_fak","cr_nac",
                            "aci_yn","aci","afr_yn","edi_yn","isf_yn","e_manifest_yn","use_yn",
                            "create_user", "update_date", "update_user"], visible: false },
        gridHeight: "h-[calc(100vh-200px)]",
        minWidth: { "shipment_status": 40 },
        dataType: {
            "executed_on_date": "date", "accounting_date": "date",  "create_date": "date", "bk_dd": "date", "etd": "date", 
            "eta": "date", "final_eta": "date", "doc_close_dd": "date", "cargo_close_dd": "date", "pickup_dd": "date",
            "doc_close_tm" : "time", "cargo_close_tm" : "time", "pickup_tm" : "time",
            "volume": "number", "gross_weight": "number", "volume_weight": "number", "chargeable_weight": "number",
        },
        typeOptions: {
            bk_dd: { inputLimit : 8}
        },
        isAutoFitColData: true,
        editable: ["shipper_id", "carrier_code", "bk_dd", "waybill_no", "incoterms", "incoterms_remark", "port_of_loading", "port_of_unloading", "final_dest_port"
            , "pickup_dd", "pickup_tm", "doc_close_dd", "doc_close_tm", "vessel", "etd", "eta", "final_eta", "vocc", "customs_declation", "status", "bk_remark", "shp_remark"
         ],
         checkbox: ["use_yn", "ams_yn", "aci_yn", "afr_yn", "isf_yn", "e_manifest_yn"]
    };

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            // log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
            if (gridRef_m.current) gotoFirstRow(gridRef_m.current)
        }
    }, [objState?.isMSearch]);

    useEffect(() => {
        if (mainData) {
            setGridMainData((mainData as any)[0] as gridData);
        }
    }, [mainData])
    
    const handleRowDoubleClicked = async (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        if (objState.tab1) {
            if (objState.tab1.findIndex((element: any) => {
                return element.cd === selectedRow.bk_id;
            }) === -1) {
                objState.tab1.push({ cd: selectedRow.bk_id, cd_nm: selectedRow.bk_id })
            }
        }
        dispatch({ 
            isMDSearch: true, isCGOSearch : true, isCSTSearch : true,
            MselectedTab: selectedRow.bk_id,
            popType:crudType.UPDATE
        });
        
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
            log("BKCopy__onGridNew objState", objState)
            // var tabName = "NEW" + (objState.tab1.reduce((acc:number,v:{cd:string}) => v.cd.includes("NEW") && acc + 1,0)+1);
            var temp = objState.tab1
                            .filter((v:{cd:string}) => v.cd.includes("NEW"))
                            .sort()
                            .reverse();
                            
            var tabSeq = temp.length ? Number(temp[0].cd.replace("NEW",'')) + 1 : 1;
            var tabName = `NEW${tabSeq}`;
            var rows = await rowAdd(objState.gridRef_m.current, 
                {   bk_id: tabName,
                    trans_mode: objState.trans_mode,
                    trans_type: objState.trans_type,
                    bk_dd: dayjs().format('YYYYMMDD'),
                    doc_close_dd: dayjs().format('YYYYMMDD'),
                    use_yn: 'Y'
                });

            for (const row of rows) {
                log("onGridNew", row, mainData)
                await ((mainData as any)[0] as gridData).data.push(row);
            }
        
            setTimeout(() => {                
                objState.tab1.push({ cd: tabName, cd_nm: tabName })
                dispatch({ [tabName] : rows[0] , MselectedTab: tabName, isCGDSearch : true });
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
        gridRef_m.current.api.forEachNode((node: any) => {
            var data = node.data;
            
            if (data[ROW_CHANGED]) {
                hasData = true;
                if (gridOption?.checkbox) {
                    for (let i = 0; i < gridOption?.checkbox?.length; i++) {
                        let col = gridOption?.checkbox[i];
                        data[col] = data[col] ? 'Y' : 'N';
                    }
                }
                
                if (data[ROW_TYPE] === ROW_TYPE_NEW) { //신규 추가
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
                    gridRef={objState.gridRef_m}
                    loadItem={initData}
                    listItem={gridMainData}//                await ((mainData as string[])[0] as unknown as gridData).data.push(row);
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

// export const BKCopy = async (objState:any, mainData:any) => {
//     const {gridRef_m} = objState
//     if (objState.tab1) {
//         var temp = objState.tab1
//                         .filter((v:{cd:string}) => v.cd.includes("NEW"))
//                         .sort()
//                         .reverse();
                        
//         var tabSeq = temp.length ? Number(temp[0].cd.replace("NEW",'')) + 1 : 1;
//         var tabName = `NEW${tabSeq}`;
        
//         const rows = await rowAdd(gridRef_m.current, 
//             {   bk_id: tabName,
//                 trans_mode: objState.trans_mode,
//                 trans_type: objState.trans_Type,
//                 bk_dd: dayjs().format('YYYYMMDD'), 
//                 use_yn: true
//             });
//         for (const row of rows) {
//             await (mainData as gridData).data.push(row);
//         }
    
//         setTimeout(() => {                
//             objState.tab1.push({ cd: tabName, cd_nm: tabName })
//             //dispatch({ [tabName] : rows[0] ,MselectedTab: tabName, isMDSearch: true, isCGDSearch : true, popType: crudType.CREATE });
//         }, 200);

//         return ({
//             data : {temp, tabSeq, tabName, mainData              
//             }
//         })
//     }
    
// }

export default MasterGrid;