import DialogBasic from "layouts/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
import { crudType, useAppContext } from "components/provider/contextObjectProvider"
import { SP_UpdateData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";

import { useRouter, usePathname } from 'next/navigation'
import { Button } from "components/button";
import { ReactSelect, data } from "@/components/select/react-select2";
import { MaskedInputField } from "@/components/input/react-text-mask";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadItem: any | null
}

const Modal: React.FC<Props> = ({ loadItem }) => {

    const { dispatch, objState } = useAppContext();
    const { mSelectedRow, crudType: popType, isPopUpOpen: isOpen, searchParams } = objState;
    const router = usePathname()
    const { Update } = useUpdateData2(SP_UpdateData);

    const closeModal = () => {
        dispatch({ isPopUpOpen: false });
        reset();
    }

    const formZodMethods = useForm({
        defaultValues: {
            use_yn: "Y",
        },
    });

    const {
        handleSubmit,
        reset,
        setFocus,
        setValue,
        resetField,
        getValues,
        formState: { errors },
        control,
    } = formZodMethods;

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
        log("onFormSubmit", param)
        if (popType === crudType.UPDATE) {
            Update.mutate(param, {
                onSuccess: (res: any) => {
                    closeModal();
                    dispatch({ isMSearch: true });
                },
            });
        } else {          
        }

    }, [popType]);

    useEffect(() => {
        reset()
        log("popup mSelectedRow :", mSelectedRow);
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

        <FormProvider{...formZodMethods}>
            <DialogBasic
                isOpen={isOpen!}
                onClose={closeModal}
                title={"거래처 관리 - " + (popType === crudType.CREATE ? "등록" : "수정")}
                bottomRight={
                    <>
                        <Button id={"save"} onClick={closeModal} icon={null} width="w-32" />
                        <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" />
                    </>
                }
            >
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-6">
                        <div className="col-span-1">
                            <MaskedInputField
                                id="cust_code"
                                value={mSelectedRow?.cust_code}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>
                        <div className="col-span-1">
                            <MaskedInputField
                                id="main_cust_code"
                                value={mSelectedRow?.main_cust_code}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="city_nm"
                                value={mSelectedRow?.city_nm}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>


                        <MaskedInputField
                            id="bz_type"
                            value={mSelectedRow?.bz_type}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />


                        <MaskedInputField
                            id="bz_con"
                            value={mSelectedRow?.bz_con}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <div className="col-span-2">
                            <MaskedInputField
                                id="cust_nm"
                                value={mSelectedRow?.cust_nm}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>


                        <div className="col-span-2">
                            <MaskedInputField
                                id="addr1"
                                value={mSelectedRow?.addr1}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>



                        <MaskedInputField
                            id="bz_reg_no"
                            value={mSelectedRow?.bz_reg_no}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <MaskedInputField
                            id="bz_item"
                            value={mSelectedRow?.bz_item}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />



                        <div className="col-span-2">
                            <MaskedInputField
                                id="cust_nm_abbr"
                                value={mSelectedRow?.cust_nm_abbr}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="addr2"
                                value={mSelectedRow?.addr2}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>
                        <MaskedInputField
                            id="corp_reg_no"
                            value={mSelectedRow?.corp_reg_no}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <MaskedInputField
                            id="bz_kind_cd"
                            value={mSelectedRow?.bz_kind_cd}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />



                        <div className="col-span-2">
                            <MaskedInputField
                                id="cust_nm_eng"
                                value={mSelectedRow?.cust_nm_eng}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>



                        <div className="col-span-2">
                            <MaskedInputField
                                id="city_nm_eng"
                                value={mSelectedRow?.city_nm_eng}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>
                        <MaskedInputField
                            id="vendor_id"
                            value={mSelectedRow?.vendor_id}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />


                        <MaskedInputField
                            id="contact_nm"
                            value={mSelectedRow?.contact_nm}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />


                        <div className="col-span-2">
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
                                }} />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="addr1_eng"
                                value={mSelectedRow?.addr1_eng}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>
                        <MaskedInputField
                            id="nation_code"
                            value={mSelectedRow?.nation_code}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <MaskedInputField
                            id="tel_no"
                            value={mSelectedRow?.tel_no}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <MaskedInputField
                            id="area_cd"
                            value={mSelectedRow?.area_cd}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                        <MaskedInputField
                            id="fax_no"
                            value={mSelectedRow?.fax_no}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <div className="col-span-2">
                            <MaskedInputField
                                id="addr2_eng"
                                value={mSelectedRow?.addr1_eng}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }} />
                        </div>
                        <MaskedInputField
                            id="post_no"
                            value={mSelectedRow?.fax_no}
                            options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />

                        <div className="col-span-1">
                            <ReactSelect
                                id="sale_cust_yn" dataSrc={{
                                    data: [
                                        { sale_cust_yn: 'Y' },
                                        { sale_cust_yn: 'N' }
                                    ]
                                } as data}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                    dialog: true,
                                    keyCol: "sale_cust_yn",
                                    displayCol: ['sale_cust_yn'],
                                    defaultValue: mSelectedRow?.sale_cust_yn
                                }} />
                        </div>



                        <div className="col-span-1">
                            <ReactSelect
                                id="prch_cust_yn" dataSrc={{
                                    data: [
                                        { prch_cust_yn: 'Y' },
                                        { prch_cust_yn: 'N' }
                                    ]
                                } as data}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                    dialog: true,
                                    keyCol: "prch_cust_yn",
                                    displayCol: ['prch_cust_yn'],
                                    defaultValue: mSelectedRow?.prch_cust_yn
                                }} />
                        </div>
                        <div className="col-span-1">
                            <ReactSelect
                                id="gen_cust_yn" dataSrc={{
                                    data: [
                                        { gen_cust_yn: 'Y' },
                                        { gen_cust_yn: 'N' }
                                    ]
                                } as data}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                    dialog: true,
                                    keyCol: "gen_cust_yn",
                                    displayCol: ['gen_cust_yn'],
                                    defaultValue: mSelectedRow?.gen_cust_yn
                                }} />
                        </div>
                        <div className="col-span-1">
                            <ReactSelect
                                id="cal_except_yn" dataSrc={{
                                    data: [
                                        { cal_except_yn: 'Y' },
                                        { cal_except_yn: 'N' }
                                    ]
                                } as data}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                    dialog: true,
                                    keyCol: "cal_except_yn",
                                    displayCol: ['cal_except_yn'],
                                    defaultValue: mSelectedRow?.cal_except_yn
                                }} />
                        </div>


                    </div>
                </form>
            </DialogBasic>
        </FormProvider>

    )

}

export default Modal;