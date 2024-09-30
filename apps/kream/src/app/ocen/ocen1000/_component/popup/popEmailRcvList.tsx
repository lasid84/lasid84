import DialogBasic from "layouts/dialog/dialog"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useCallback, useRef, memo, useState } from "react";
import { useAppContext } from "components/provider/contextObjectProvider"
import { Button } from "components/button"
import { useTranslation } from "react-i18next";

import PopupEmailRcvList from 'components/commonForm/mailReceiver';
import { TRANPOSRT_EMAIL_LIST_OE } from "components/commonForm/mailReceiver/_component/data";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    cust_code: string;
    cust_nm?: string;
    initData?: any | null;
    callbacks?: Array<() => void>;
}

const EmailRcvList: React.FC<Props> = ({ initData, callbacks, cust_code, cust_nm }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { isMailRcvPopupOpen: isOpen, MselectedTab } = objState;

    const { t } = useTranslation();

    const closeModal = () => {
        if (callbacks?.length) callbacks?.forEach((callback) => callback());
        
        dispatch({ isMailRcvPopupOpen: false,  });
    }

    return (
        <DialogBasic
            isOpen={isOpen}
            onClose={closeModal}
            title={t(TRANPOSRT_EMAIL_LIST_OE)}
            bottomRight={
                    <>
                        {/* <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" /> */}
                    </>
                }>
            <div className="flex flex-col w-[38rem] h-[28rem] gap-4 w-30 ">
                <PopupEmailRcvList pgm_code={TRANPOSRT_EMAIL_LIST_OE} cust_code={cust_code} title={cust_nm}/>
                </div>
        </DialogBasic>
    )
}

export default EmailRcvList;