import DialogBasic from "layouts/dialog/dialog"
import { useForm, FormProvider, SubmitHandler, useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useCallback, memo } from "react";
import { crudType, useAppContext } from "components/provider/contextObjectProvider"
import { Button } from "components/button";
import { ReactSelect, data } from "@/components/select/react-select2";
import { MaskedInputField } from "@/components/input/react-text-mask";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadItem: any | null
}

const Modal: React.FC<Props> = ({ loadItem }) => {

    const { dispatch, objState } = useAppContext();
    const { mSelectedRow, crudType: popType, isPopUpOpen: isOpen } = objState;
    const { getValues, setValue, reset, setFocus, handleSubmit } = useFormContext();


    const closeModal = () => {
        dispatch({ isPopUpOpen: false });
        reset();
    }

    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        log("onFormSubmit", param)
        if (popType === crudType.UPDATE) {
        } else {
        }

    }, [popType]);

    useEffect(() => {
        reset()
        log("popup mSelectedRow :", mSelectedRow);
        if (popType === crudType.CREATE) {
        }
    }, [popType, isOpen])

    return (
        <DialogBasic
            isOpen={isOpen!}
            onClose={closeModal}
            title={"Port코드 관리 - " + (popType === crudType.CREATE ? "등록" : "조회")}
            bottomRight={
                <>
                    <Button id={"check"} onClick={closeModal} width="w-32" />
                </>
            }
        >
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="flex flex-col gap-4 md:grid md:grid-cols-4">
                    <div className="col-span-1">
                        <MaskedInputField
                            id="port_code"
                            value={mSelectedRow?.port_code}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>
                    <div className="col-span-1">
                        <MaskedInputField
                            id="port_nm"
                            value={mSelectedRow?.port_nm}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>

                    <div className="col-span-1">
                        <MaskedInputField
                            id="country_code"
                            value={mSelectedRow?.country_code}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>

                    <div className="col-span-1">
                        <MaskedInputField
                            id="time_zone_code"
                            value={mSelectedRow?.time_zone_code}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>

                    <div className="col-span-1">
                        <MaskedInputField
                            id="region_code"
                            value={mSelectedRow?.region_code}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>

                    <div className="col-span-1">
                        <MaskedInputField
                            id="fiata_code"
                            value={mSelectedRow?.fiata_code}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>

                    <div className="col-span-1">
                        <MaskedInputField
                            id="conference_code"
                            value={mSelectedRow?.conference_code}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>
                    <div className="col-span-1">
                        <ReactSelect
                            id="use_yn" dataSrc={{
                                data: [
                                    { use_yn: 'Y' },
                                    { use_yn: 'N' }
                                ]
                            } as data}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                                dialog: true,
                                keyCol: "use_yn",
                                displayCol: ['use_yn'],
                                defaultValue: mSelectedRow?.use_yn
                            }}
                        />
                    </div>

                    <div className="col-span-2">
                        <MaskedInputField
                            id="remarks"
                            value={mSelectedRow?.remarks}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>


                    <div className="col-span-1">
                        <MaskedInputField
                            id="mdate_tz_code"
                            value={mSelectedRow?.mdate_tz_code}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>

                    <div className="col-span-1">
                        <MaskedInputField
                            id="cdate_tz_code"
                            value={mSelectedRow?.cdate_tz_code}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }}
                        />
                    </div>
                </div>
            </form>
        </DialogBasic>

    )

}

export default Modal;