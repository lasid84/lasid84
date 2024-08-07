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

import ShpContModal from 'components/commonForm/customerContact';

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

    return (
        <FormProvider{...methods}>
            <DialogBasic
                isOpen={isOpen}
                onClose={closeModal}
                title={t("shipper 담당자 관리")}
                 bottomRight={
                     <>
                         {/* <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" /> */}
                     </>
                 }>
                <div className="flex flex-col w-[78rem] h-[28rem] gap-4 w-76 ">
                <ShpContModal initData={[initData[15]]} 
                        params={
                            {
                                cust_code:objState.mSelectedRow.shipper_id, 
                                cont_type:objState.trans_mode + objState.trans_type
                            }}
                />
                
                     {/* <PageGrid
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
                     </PageGrid> */}
                 </div>
            </DialogBasic>
        </FormProvider >
    )
}

export default Modal;