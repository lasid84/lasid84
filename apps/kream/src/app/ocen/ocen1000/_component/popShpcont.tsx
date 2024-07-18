import DialogBasic from "layouts/dialog/dialog"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useCallback, useRef, memo, useState } from "react";
import { SP_GetContData, SP_InsertData } from "./data";
import { crudType, useAppContext } from "components/provider/contextObjectProvider"
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { SP_CreateIFData } from 'components/ufs-interface/_component/data';
import { Button } from "components/button"
import { Translation, useTranslation } from "react-i18next";
import { PageGrid } from "layouts/grid/grid";
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "components/toast"
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";

import { Anonymous_Pro } from "next/font/google";
import { LabelGrid } from "@/components/label";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
}

const Modal: React.FC<Props> = ({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { crudType: popType, isPopUpOpen: isOpen } = objState;

    const { Create } = useUpdateData2(SP_InsertData);
    const { t } = useTranslation();
    // const { Update } = useUpdateData2(SP_UpdateDetail, SEARCH_D);
    const [gridOptions, setGridOptions] = useState<GridOption>();

    const { data: detailData, refetch: detailRefetch, remove: detailRemove } = useGetData({ ...objState?.mSelectedRow, cont_type: objState.cont_type }, SEARCH_D, SP_GetContData, { enabled: true });

    const closeModal = () => {
        dispatch({ isPopUpOpen: false });
        log('ffffff', objState.isPopUpOpen)
        reset();
    }

    const methods = useForm({
        defaultValues: {
        },
    });

    const {
        handleSubmit,
        reset,
        setFocus,
    } = methods;

    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        log("onFormSubmit", param)
        Create.mutate(param, {
            onSuccess: (res: any) => {
                closeModal();
                dispatch({ isMSearch: true });
            },
        })


    }, [popType]);

    useEffect(() => {
        if (detailData) {
            const gridOption: GridOption = {
                colVisible: { col: ["cust_code", "cont_seq", "cont_type"], visible: false },
                // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
                gridHeight: "h-full",
                checkbox: ["use_yn", "def"],
                select: { "user_dept": initData[0].data.map((row: any) => row['user_dept']) },
                minWidth: { "email": 200 },
                editable: ["pic_nm", "email", "cust_office", "tel_num", "fax_num", "user_dept", "bz_plc_cd", "use_yn", "def"],
                dataType: { "create_date": "date", "vat_rt": "number", "bz_reg_no": "bizno" },
                // isMultiSelect: false,
                isAutoFitColData: false,
                // alignLeft: ["major_category", "bill_gr1_nm"],
                // alignRight: [],
            };

            setGridOptions(gridOption);
        }
    }, [detailData])

    const onSave = () => {
        log("===================", objState.mSelectedRow, objState.isMSearch, objState.dSelectedRow);
        var hasData = false
        gridRef.current.api.forEachNode((node: any) => {
            var data = node.data;
            gridOptions?.checkbox?.forEach((col) => data[col] = data[col] ? 'Y' : 'N');
            if (data.__changed) {
                hasData = true;
                if (data.__ROWTYPE === ROW_TYPE_NEW) { //신규 추가
                    data.cust_code = objState.mSelectedRow.shipper_id;
                    data.cont_type = objState.cont_type
                    Create.mutate(data);
                } else { //수정
                    // Update.mutate(data);
                }
            }
        });
        // log("onSave", gridRef.current.api, modifiedRows);
        if (hasData) toastSuccess('Success.');

    };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        // const row = onSelectionChanged(param);
        const selectedRow = param.api.getSelectedRows()[0];
        log("handleSelectionChanged", selectedRow)
        dispatch({ dSelectedRow: selectedRow });
        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    };
    const handleCellValueChanged = (param: CellValueChangedEvent) => {
        // log("handleCellValueChanged");
        gridRef.current.api.forEachNode((node: IRowNode, i: number) => {
            log("handleCellValueChanged2", param.column.getColId(), node.id, param.node.id, node.id === param.node.id, node.data.def, param.data.def);
            if (!param.node.data.def) return;
            if (node.id === param.node.id) return;

            if (node.data.def === true) {
                node.setDataValue('def', false);
            }
        });
    };

    return (
        <FormProvider{...methods}>
            <DialogBasic
                isOpen={isOpen}
                onClose={closeModal}
                title={t("shipper 담당자 관리")}
                bottomRight={
                    <>
                        {/* <Button id={"cancel"} onClick={handleSubmit(onFormSubmit)} icon={null} /> */}
                        <Button id={"close"} onClick={closeModal} icon={null} width="w-32" />
                    </>
                }
            >
                <div className="flex flex-col w-[98rem] h-[28rem] gap-4 w-96 ">
                    <PageGrid
                        title={<LabelGrid id={'contact_nm'} />}
                        right={
                            <>
                                <Button id={"add"} onClick={() => rowAdd(gridRef.current, { "use_yn": true, "def": false })} width='w-15' />
                                <Button id={"save"} onClick={onSave} width='w-15' />
                            </>
                        }>
                        <Grid
                            gridRef={gridRef}
                            listItem={detailData as gridData}
                            options={gridOptions}
                            event={{
                                onCellValueChanged: handleCellValueChanged,
                                onSelectionChanged: handleSelectionChanged
                            }}
                        />
                    </PageGrid>
                </div>
            </DialogBasic>
        </FormProvider >
    )
}

export default Modal;