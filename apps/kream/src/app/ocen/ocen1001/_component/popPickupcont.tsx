import DialogBasic from "layouts/dialog/dialog"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useCallback, useRef, memo, useState } from "react";
import { useAppContext } from "components/provider/contextObjectProvider"
import { useTranslation } from "react-i18next";
import CustPickupPlace from "@/components/commonForm/customerPickupPlace";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    ref?: any | null;
    initData?: any | null;
    callbacks?: Array<() => void>;
}

const Modal: React.FC<Props> = ({ ref = null, initData, callbacks }) => {

    const gridRef = useRef<any | null>(ref);
    const { dispatch, objState } = useAppContext();
    const { MselectedTab, isPickupPopupOpen: isOpen } = objState;

    const { t } = useTranslation();

    const closeModal = () => {
        if (callbacks?.length) callbacks?.forEach((callback) => callback());
        dispatch({ isPickupPopupOpen: false });
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
                title={t("Pickup 담당자 관리")}
                bottomRight={
                    <>
                        {/* <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" /> */}
                    </>
                }>

                <div className="flex flex-col w-[78rem] h-[28rem] gap-4 ">
                    <CustPickupPlace
                        ref={gridRef}
                        params={{
                            cust_code:objState[MselectedTab]?.shipper_id, 
                            pickup_type:objState.trans_mode + objState.trans_type
                        }}
                    />
                </div>
            </DialogBasic>
        </FormProvider >
    )
}

export default Modal;