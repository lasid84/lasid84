import DialogBasic from "layouts/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
import { crudType, useAppContext } from "components/provider/contextObjectProvider"
import { SP_UpdateData, SP_CreateData } from './data';
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
    const { Create } = useUpdateData2(SP_CreateData);

    // 선택된 데이터 Select컴포넌트 처리
    const [transmode, setTransmode] = useState([]);
    const [transtype, setTranstype] = useState([]);
    const [prodGrCd, setprodGrCd] = useState([]);
    const [billGr1Cd, setBillGr1Cd] = useState([]);
    const [glGr1Cd, setGlGr1Cd] = useState([]);
    const [glGr2Cd, setGlGr2Cd] = useState([]);

    const closeModal = () => {
        dispatch({ isPopUpOpen: false });
        reset();
    }
    const defTransMode = popType === crudType.CREATE ? searchParams.trans_mode : mSelectedRow?.trans_mode;
    const defTransType = popType === crudType.CREATE ? searchParams.trans_type : mSelectedRow?.trans_type;
    const formZodMethods = useForm({
        // resolver: zodResolver(formZodSchema),
        defaultValues: {
            trans_mode: defTransMode,
            trans_type: defTransType,
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
            setTransmode(loadItem[0])
            setTranstype(loadItem[1])
            setprodGrCd(loadItem[2])
            setGlGr1Cd(loadItem[5])
            setGlGr2Cd(loadItem[6])
        }
    }, [loadItem]);

    useEffect(() => {
        // log("=====", loadItem);
        if (loadItem && mSelectedRow && Object.keys(mSelectedRow).length > 0) {
            var modetype = mSelectedRow?.trans_mode + mSelectedRow?.trans_type;
            switch (modetype) {
                case "AE": setBillGr1Cd(loadItem[7]); break;
                case "AI": setBillGr1Cd(loadItem[8]); break;
                case "OE": setBillGr1Cd(loadItem[9]); break;
                case "OI": setBillGr1Cd(loadItem[10]); break;
            }
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
        log("popup mSelectedRow :", mSelectedRow);
        if (popType === crudType.CREATE) {
            setFocus("trans_mode")
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
                title={"차지코드 관리 - " + (popType === crudType.CREATE ? "등록" : "수정")}
                bottomRight={
                    <>
                        <Button id={"save"} onClick={handleSubmit(onFormSubmit)} icon={null} />
                        <Button id={"cancel"} onClick={closeModal} icon={null} />
                    </>
                }
            >
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-6">
                        <div className="col-span-2">
                            <ReactSelect
                                id="trans_mode" label="trans_mode" dataSrc={transmode as data}
                                options={{
                                    keyCol: "trans_mode",
                                    displayCol: ['trans_mode', 'name'],
                                    // inline:true,
                                    // defaultValue: {label:'A Air', value:'A'}
                                    defaultValue: defTransMode,
                                    isAllYn: false
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <ReactSelect
                                id="trans_type" dataSrc={transtype as data}
                                options={{
                                    keyCol: "trans_type",
                                    displayCol: ['trans_type', 'name'],
                                    // inline:true,
                                    // defaultValue: {label:'A Air', value:'A'}
                                    defaultValue: defTransType,
                                    isAllYn: false
                                }}
                            />
                        </div>
                        <div className="col-span-2">
                            <ReactSelect
                                id="prod_gr_cd" dataSrc={prodGrCd as data}
                                options={{
                                    keyCol: "prod_gr_cd",
                                    displayCol: ['prod_gr_cd'],
                                    defaultValue: mSelectedRow?.prod_gr_cd
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            {/* <TInput 
                                label="charge_code" 
                                id="charge_code" 
                                value={mSelectedRow?.charge_code}
                                >
                            </TInput> */}
                            <MaskedInputField
                                id="charge_code"
                                value={mSelectedRow?.charge_code}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : true,
                                }}
                            />
                        </div>
                        <div className="col-span-4">
                            <MaskedInputField
                                id="charge_desc"
                                value={mSelectedRow?.charge_desc}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <MaskedInputField
                                id="ass_transaction"
                                value={mSelectedRow?.ass_transaction}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <MaskedInputField
                                id="category"
                                value={mSelectedRow?.category}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <MaskedInputField
                                id="major_category"
                                value={mSelectedRow?.major_category}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <MaskedInputField
                                id="report_category"
                                value={mSelectedRow?.report_category}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="vat_yn"
                                value={mSelectedRow?.vat_yn}
                                options={{
                                }}
                            />
                        </div>
                        <div className="col-span-2">
                            <MaskedInputField
                                id="vat_type"
                                value={mSelectedRow?.vat_type}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="vat_rt"
                                value={mSelectedRow?.vat_rt}
                                options={{
                                }}
                            />
                        </div>
                        <div className="col-span-2">
                            <MaskedInputField
                                id="fins_yn"
                                value={mSelectedRow?.fins_yn}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="fin_category"
                                value={mSelectedRow?.fin_category}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="uas_gl_code"
                                value={mSelectedRow?.uas_gl_code}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="billing_yn"
                                value={mSelectedRow?.billing_yn}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="rem_prt_yn"
                                value={mSelectedRow?.rem_prt_yn}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            {/* <MaskedInputField
                                id="fe_ref_item"
                                value={mSelectedRow?.fe_prt_item}
                                options={{
                                }}
                            /> */}
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="fe_ref_item"
                                value={mSelectedRow?.fe_ref_item}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <MaskedInputField
                                id="rem_prt_nm"
                                value={mSelectedRow?.rem_prt_nm}
                                options={{
                                }}
                            />
                        </div>

                        <div className="col-span-2">
                            <ReactSelect
                                id="use_yn" dataSrc={{
                                    data: [
                                        { use_yn: 'Y' },
                                        { use_yn: 'N' }
                                    ]
                                } as data}
                                options={{
                                    keyCol: "use_yn",
                                    displayCol: ['use_yn'],
                                    defaultValue: mSelectedRow?.use_yn
                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <ReactSelect
                                id="bill_gr1_cd" dataSrc={billGr1Cd as data}
                                options={{
                                    keyCol: "bill_gr1_cd",
                                    displayCol: ['bill_gr1_cd', 'name'],
                                    defaultValue: mSelectedRow?.bill_gr1_cd
                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <ReactSelect
                                id="bill_gr2_cd" dataSrc={billGr1Cd as data}
                                options={{
                                    keyCol: "bill_gr2_cd",
                                    displayCol: ['bill_gr2_cd', 'name'],
                                    defaultValue: mSelectedRow?.bill_gr2_cd
                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <ReactSelect
                                id="gl_gr1_cd" dataSrc={glGr1Cd as data}
                                options={{
                                    keyCol: "gl_gr1_cd",
                                    displayCol: ['gl_gr1_cd', 'name'],
                                    defaultValue: mSelectedRow?.gl_gr1_cd
                                }}
                            />
                        </div>

                        <div className="col-span-3">
                            <ReactSelect
                                id="gl_gr2_cd" dataSrc={glGr2Cd as data}
                                options={{
                                    keyCol: "gl_gr2_cd",
                                    displayCol: ['gl_gr2_cd', 'name'],
                                    defaultValue: mSelectedRow?.gl_gr2_cd
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