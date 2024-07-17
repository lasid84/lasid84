import DialogBasic from "layouts/dialog/dialog"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useCallback, memo } from "react";
import { crudType, useAppContext } from "components/provider/contextObjectProvider"
import { SP_CreateIFData } from './_component/data';
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { Button } from "components/button"
import { MaskedInputField } from "@/components/input/react-text-mask";
import { Translation, useTranslation } from "react-i18next";


const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    pgm_code: string;
}

const Modal: React.FC<Props> = (props) => {
    const { dispatch, objState } = useAppContext();
    const { crudType: popType, isIFPopUpOpen: isOpen } = objState;
    const { pgm_code, } = props;
    const { Create } = useUpdateData2(SP_CreateIFData);
    const { t } = useTranslation();

    const closeModal = () => {
        dispatch({ isIFPopUpOpen: false });
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

    // useEffect(() => {
    //     if (popType === crudType.CREATE) {
    //         setFocus("cust_code", { shouldSelect: true })
    //     }
    // }, [popType, isOpen])

    return (
        <FormProvider{...methods}>
            <DialogBasic
                isOpen={isOpen!}
                onClose={closeModal}
                title={t("request_ufsp_interface")}
                bottomRight={
                    <>
                        <Button id={"request"} onClick={handleSubmit(onFormSubmit)} icon={null} />
                        <Button id={"cancel"} onClick={closeModal} icon={null} />
                    </>
                }
            >
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
                        <div className="col-span-2">
                            <MaskedInputField
                                id="id"
                                label={t(pgm_code)}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>

                        <div className="col-span-1">
                            <MaskedInputField
                                id="pgm_code"
                                value={pgm_code}
                                options={{
                                    freeStyles: "hidden",
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                    noLabel: true
                                }}
                            />
                        </div>
                    </div>
                </form>
            </DialogBasic>
        </FormProvider>
    )
}

export default Modal;