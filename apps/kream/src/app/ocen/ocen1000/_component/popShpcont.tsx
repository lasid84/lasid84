import DialogBasic from "layouts/dialog/dialog"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useCallback, useRef, memo, useState } from "react";
import {  SP_InsertShipContData, SP_UpdateShipContData } from "./data";
import { useAppContext } from "components/provider/contextObjectProvider"
import { Button } from "components/button"
import { useTranslation } from "react-i18next";
import { PageGrid } from "layouts/grid/grid";
import { CellValueChangedEvent, IRowNode, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { toastSuccess } from "components/toast"
import {  useUpdateData2 } from "components/react-query/useMyQuery";
import { LabelGrid } from "@/components/label";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
    detailData?: any | null;
}

const Modal: React.FC<Props> = ({ initData, detailData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { crudType: popType, isShpPopUpOpen: isOpen } = objState;

    const { Create } = useUpdateData2(SP_InsertShipContData)
    const { Update } = useUpdateData2(SP_UpdateShipContData)

    const { t } = useTranslation();
    const [gridOptions, setGridOptions] = useState<GridOption>();

    const closeModal = () => {
        dispatch({ isShpPopUpOpen: false });
        log(' objState.isShpPopUpOpen', objState.isShpPopUpOpen)
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
            log('result??!!', detailData)
            const gridOption: GridOption = {
                colVisible: { col: ["cust_code", "cont_seq", "cont_type"], visible: false },
                // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
                gridHeight: "h-full",
                checkbox: ["use_yn", "def"],
                select: { "user_dept": initData[15]?.data.map((row: any) => row['user_dept']) },
                minWidth: { "email": 200 },
                editable: ["pic_nm", "email", "cust_office", "tel_num", "fax_num", "user_dept", "bz_plc_cd", "use_yn", "def"],
                dataType: { "create_date": "date", "vat_rt": "number", "bz_reg_no": "bizno" },
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
                    Update.mutate(data);
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
                        <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" />
                    </>
                }>

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