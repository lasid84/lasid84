
'use client';

import { useEffect, useState, memo } from "react";
import { SP_CreateTemplateData, SP_GetTemplateData, SP_UpdateTemplateData } from "./data";
import { useAppContext, crudType } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { getGridState, gotoFirstRow, ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { CellValueChangedEvent, GridPreDestroyedEvent, RowClickedEvent, SelectionChangedEvent, StateUpdatedEvent } from "ag-grid-community";
import { PageMGrid2, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from 'components/button';
import { toastSuccess } from "@/components/toast";
import dayjs from "dayjs";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    initData: any | null
}

const MasterGrid: React.FC<Props> = memo(({ initData }) => {

    // const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();

    const [gridRef, setGridRef] = useState(objState.gridRef_m)
    const [ gridMainData, setGridMainData ] = useState<gridData>();

    const { data: mainData, refetch: mainRefetch } = useGetData(objState?.searchParams, SEARCH_M, SP_GetTemplateData, { enabled: true });
    const { Create } = useUpdateData2(SP_CreateTemplateData, SEARCH_M);
    const { Update } = useUpdateData2(SP_UpdateTemplateData, SEARCH_M);


    const gridOption: GridOption = {
        colVisible: { col: ["template_id", "trans_mode", "trans_type", "orig_department_id","shipper_cont_seq","pickup_seq","cy_cont_seq",
                            "cr_t_cont_seq","cr_s_cont_seq", "orig_agent_id", "b_agent_id", "ams_yn","ams","cr_fak","cr_nac",
                            "aci_yn","aci","afr_yn","edi_yn","isf_yn","e_manifest_yn","use_yn",
                            "create_user", "update_date", "update_user"], visible: false },
        gridHeight: "h-full",
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
         checkbox: ["use_yn", "ams_yn", "aci_yn", "afr_yn", "isf_yn", "e_manifest_yn"]
    };

    // useEffect(() => {
    //     if (objState.isMSearch) {
    //         mainRefetch();
    //         // log("mainisSearch", objState.isMSearch);
    //         dispatch({ isMSearch: false });
    //         if (gridRef.current) gotoFirstRow(gridRef.current)
    //     }
    // }, [objState?.isMSearch]);

    useEffect(() => {
        if (mainData) {
            setGridMainData((mainData as any)[0] as gridData);
        }
    }, [mainData])

    const handleRowDoubleClicked = async (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        if (objState.tab1) {
            if (objState.tab1.findIndex((element: any) => {
                return element.cd === selectedRow.template_id;
            }) === -1) {
                objState.tab1.push({ cd: selectedRow.template_id, cd_nm: selectedRow.template_nm })
            }
        }
        dispatch({ 
            isMDSearch: true,
            MselectedTab: selectedRow.template_id,
            popType:crudType.UPDATE
        });
        
    }

    const handleRowClicked = async (param: RowClickedEvent) => { };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = param.api.getSelectedRows()[0];
        // console.log('handleSelectionChanged2', gridRef.current.api.getFirstDisplayedRowIndex())
        // dispatch({ refRow: gridRef.current.api.getFirstDisplayedRowIndex() })
    };

    const onGridNew = async () => {
        if (objState.tab1) {
           var temp = objState.tab1
                            .filter((v:{cd:string}) => v.cd.includes("NEW"))
                            .sort()
                            .reverse();
                            
            var tabSeq = temp.length ? Number(temp[0].cd.replace("NEW",'')) + 1 : 1;
            var tabName = `NEW${tabSeq}`;
            var rows = await rowAdd(gridRef.current, 
                {   template_id: tabName,
                    trans_mode: objState.trans_mode,
                    trans_type: objState.trans_Type,
                    bk_dd: dayjs().format('YYYYMMDD'), 
                    ROW_TYPE : 'NEW',
                    ROW_CHANGED : '__changed',
                    use_yn: true
                });
            for (const row of rows) {
                await (mainData as gridData).data.push(row);         
            }
            setTimeout(() => {                
                objState.tab1.push({ cd: tabName, cd_nm: tabName })
                dispatch({ [tabName] : rows[0] , MselectedTab: tabName, isMDSearch: true, isCGDSearch : true, popType: crudType.CREATE });
            }, 200);
        }
        
    }

    const onSearch = () => {
        mainRefetch();
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
                        <Button id={"search"} onClick={onSearch} width="w-20" />
                        {/* <Button id={"gird_new"} label="new" onClick={onGridNew} width="w-20" /> */}
                        <Button id={"grid_save"} label="save" onClick={onGridSave} width="w-20" />
                    </>
                }>
                <Grid
                    id="master"
                    gridRef={objState.gridRef_m}
                    loadItem={initData}
                    listItem={gridMainData}
                    options={gridOption}
                    event={{
                        onRowDoubleClicked: handleRowDoubleClicked,
                        onRowClicked: handleRowClicked,
                        onSelectionChanged: handleSelectionChanged,
                        onCellValueChanged: handleCellValueChanged
                    }}
                    gridState={objState.mGridState}
                />
            </PageMGrid2>
        </>
    );
});

export default MasterGrid;