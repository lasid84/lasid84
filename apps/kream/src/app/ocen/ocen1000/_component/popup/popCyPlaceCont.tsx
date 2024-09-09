import DialogBasic from "layouts/dialog/dialog"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useCallback, useRef, memo, useState } from "react";
import { useAppContext } from "components/provider/contextObjectProvider"
import { useTranslation } from "react-i18next";
import CyPlaceCont from "components/commonForm/containerYardContact"

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
    callbacks?: Array<() => void>;
}

const Modal: React.FC<Props> = ({ initData, callbacks }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { isCYContPopupOpen: isOpen, MselectedTab } = objState;

    const { t } = useTranslation();
        
    const closeModal = () => {
        if (callbacks?.length) callbacks?.forEach((callback) => callback());
        
        dispatch({ isCYContPopupOpen: false,  });
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
                title={t("반입지 담당자 관리")}
                bottomRight={
                     <>
                         {/* <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" /> */}
                     </>
                 }>
                <div className="flex flex-col w-[78rem] h-[28rem] gap-4 w-76 ">
                    <CyPlaceCont 
                            params={
                                {
                                    place_code:objState[MselectedTab]?.cy_place_code, 
                                    cont_type:objState.trans_mode + objState.trans_type
                                }}
                    />
                 </div>
            </DialogBasic>
        // </FormProvider >
    )
}

export default Modal;