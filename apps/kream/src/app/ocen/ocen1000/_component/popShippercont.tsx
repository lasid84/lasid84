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
    callbacks?: Array<() => void>;
}

const Modal: React.FC<Props> = ({ initData, callbacks }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { isShpContPopUpOpen: isOpen, MselectedTab } = objState;

    const { t } = useTranslation();

    const closeModal = () => {
        if (callbacks?.length) callbacks?.forEach((callback) => callback());
        
        dispatch({ isShpContPopUpOpen: false,  });
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
                                    cust_code:objState[MselectedTab]?.shipper_id, 
                                    cont_type:objState.trans_mode + objState.trans_type
                                }}
                    />
                 </div>
            </DialogBasic>
        </FormProvider >
    )
}

export default Modal;