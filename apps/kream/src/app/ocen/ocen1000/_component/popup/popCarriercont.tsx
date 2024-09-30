import DialogBasic from "layouts/dialog/dialog"
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useRef } from "react";
import { useAppContext } from "components/provider/contextObjectProvider"
import { useTranslation } from "react-i18next";

import CarrierContModal from 'components/commonForm/carrierContact';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
    callbacks?: Array<() => void>;
}

const Modal: React.FC<Props> = ({ initData, callbacks }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { isCarrierContPopupOpen: isOpen, MselectedTab } = objState;

    const { t } = useTranslation();

    useEffect(() => {
    }, [])

    const closeModal = () => {
        if (callbacks?.length) callbacks.forEach(callback => callback());
        
        dispatch({ isCarrierContPopupOpen: false });
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
        // <FormProvider{...methods}>
            <DialogBasic
                isOpen={isOpen}
                onClose={closeModal}
                title={t("Carrier 담당자 관리")}
                bottomRight={
                     <>
                         {/* <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" /> */}
                     </>
                 }>
                <div className="flex flex-col w-[78rem] h-[28rem] gap-4 w-76 ">
                    <CarrierContModal params={{carrier_code: objState[MselectedTab]?.carrier_code, cont_type:"task"}} />
                    {/* <div className="flex flex-col w-[78rem] h-[28rem] gap-4 w-76 "> */}
                    <CarrierContModal params={{carrier_code: objState[MselectedTab]?.carrier_code, cont_type:"sale"}} />
                    {/* </div> */}
                </div>
            </DialogBasic>
        // </FormProvider >
    )
}

export default Modal;