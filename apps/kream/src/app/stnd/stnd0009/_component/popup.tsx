import DialogBasic from "layouts/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray, useFormContext } from "react-hook-form";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
import { crudType, useAppContext } from "components/provider/contextObjectProvider"
import { SP_UpdateData, SP_CreateData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";

import { useRouter, usePathname } from 'next/navigation'
import { Button } from "components/button";
import { ReactSelect, data } from "@/components/select/react-select2";
import { MaskedInputField } from "@/components/input/react-text-mask";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    loadItem: any | null
}

const Modal: React.FC<Props> = ({ loadItem }) => {

    const { dispatch, objState } = useAppContext();
    const { mSelectedRow, crudType: popType, isPopUpOpen: isOpen, searchParams } = objState;
    const router = usePathname()
    const { Update } = useUpdateData2(SP_UpdateData);
    const { Create } = useUpdateData2(SP_CreateData);
    const { getValues, setValue, reset, setFocus, handleSubmit } = useFormContext();

    const closeModal = () => {
        dispatch({ isPopUpOpen: false });
        reset();
    }

    // const formZodMethods = useForm({
    //     defaultValues: {
    //         use_yn: "Y",
    //     },
    // });

    // const {
    //     handleSubmit,
    //     reset,
    //     setFocus,
    //     setValue,
    //     resetField,
    //     getValues,
    //     formState: { errors },
    //     control,
    // } = formZodMethods;

    useEffect(() => {
        if (loadItem) {

        }
    }, [loadItem]);

    useEffect(() => {
        // log("=====", loadItem);
        if (loadItem && mSelectedRow && Object.keys(mSelectedRow).length > 0) {
        }
    }, [mSelectedRow, loadItem])

    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        if (popType === crudType.UPDATE) {
            Update.mutate(param, {
                onSuccess: (res: any) => {
                    closeModal();
                    dispatch({ isMSearch: true });
                },
            });
        } else {
            Create.mutate(param, {
                onSuccess: (res: any) => {
                    closeModal();
                    dispatch({ isMSearch: true });
                },
                // onError:(res:any) =>{
                //     toastError("등록에실패했습니다."+res);
                // }
            })
        }

    }, [popType]);

    useEffect(() => {
        reset()
        if (popType === crudType.CREATE) {
            setFocus("use_yn")
        }
        // if (popType === PopType.UPDATE) {
        //     setModalValue(selectedData, setValue, getValues)
        //     //select 컴포넌트 추가설정
        //     setGrpCd(selectedData.grp_cd)
        //     setUseYn(selectedData.use_yn)

        //     //setUseGrpCd(selectedData.grp_cd)
        // }
    }, [popType, isOpen])

    return (

        // <FormProvider{...formZodMethods}>
            <DialogBasic
                isOpen={isOpen!}
                onClose={closeModal}
                title={"Carrier코드 관리 - " + (popType === crudType.CREATE ? "등록" : "수정")}
                bottomRight={
                    <>
                        <Button id={"check"} onClick={closeModal} width="w-32" />
                    </>
                }
            >
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-6">
                        <div className="col-span-1">
                            <MaskedInputField
                                id="carrier_code"
                                value={mSelectedRow?.carrier_code}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>
                        <div className="col-span-1">
                            <MaskedInputField
                                id="carrier_type"
                                value={mSelectedRow?.carrier_type}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>

                        <div className="col-span-1">
                            <MaskedInputField
                                id="alternate_carrier_code"
                                value={mSelectedRow?.alternate_carrier_code}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>
                        <div className="col-span-3">
                            <MaskedInputField
                                id="carrier_nm"
                                value={mSelectedRow?.carrier_nm}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>

                        <div className="col-span-1">
                            <MaskedInputField
                                id="tel_num"
                                value={mSelectedRow?.tel_num}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="url"
                                value={mSelectedRow?.url}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>

                        <div className="col-span-1">
                            <MaskedInputField
                                id="partner_id"
                                value={mSelectedRow?.partner_id}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>
                        <MaskedInputField
                            id="general_sales_agent"
                            value={mSelectedRow?.general_sales_agent}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />


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


                        <div className="col-span-3">
                            <MaskedInputField
                                id="remark"
                                value={mSelectedRow?.remark}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>

                        <div className="col-span-3">
                            <MaskedInputField
                                id="default_address_no"
                                value={mSelectedRow?.default_address_no}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>
                        
                        <div className="col-span-2">
                            <MaskedInputField
                                id="default_contact_no"
                                value={mSelectedRow?.default_contact_no}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>

                        <MaskedInputField
                            id="conference_ind"
                            value={mSelectedRow?.conference_ind}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                            
                        <MaskedInputField
                            id="check_digit8_ind"
                            value={mSelectedRow?.check_digit8_ind}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <MaskedInputField
                            id="cut_off_hours"
                            value={mSelectedRow?.cut_off_hours}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <MaskedInputField
                            id="csr_type"
                            value={mSelectedRow?.csr_type}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                            


                        <MaskedInputField
                            id="iata_ind"
                            value={mSelectedRow?.iata_ind}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />


                        <MaskedInputField
                            id="cass_ind"
                            value={mSelectedRow?.cass_ind}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                        <MaskedInputField
                            id="counter_ind"
                            value={mSelectedRow?.counter_ind}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <MaskedInputField
                            id="csr_ind"
                            value={mSelectedRow?.csr_ind}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <MaskedInputField
                            id="iata_ind"
                            value={mSelectedRow?.iata_ind}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />




                    </div>
                </form>
            </DialogBasic>
        // </FormProvider>

    )

}

export default Modal;