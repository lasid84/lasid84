import DialogBasic from "layouts/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { Button } from "components/button";
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext, SEARCH_M } from "components/provider/contextObjectProvider"
import { SP_UpdateData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { ReactSelect, data } from "@/components/select/react-select2"
import { ReactMultiSelect } from "@/components/select/react-multi-select"
import { MaskedInputField } from "@/components/input/react-text-mask";
const { decrypt, encrypt } = require('@repo/kwe-lib/components/cryptoJS.js');

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
    loadItem: any | null
}

const Modal: React.FC<Props> = ({ loadItem }) => {

    const { dispatch, objState, } = useAppContext();
    const { mSelectedRow, isPopUpOpen: isOpen, crudType: popType } = objState

    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_M)

    //사용자 정보
    const gUserGroupId = useUserSettings((state) => state.data.user_grp_id)

    // 선택된 데이터 Select컴포넌트 처리
    const [bzplccode, setBzplccode] = useState<any>([])
    const [terminalcd, setTerminalcode] = useState<any>([])
    const [permissionid, setPermissionId] = useState<any>([])
    const [deptcd, setDeptcd] = useState<any>([])
    const [officecd, setOfficecd] = useState<any>([])

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
            setBzplccode(loadItem[0])
            setTerminalcode(loadItem[1])
            setPermissionId(loadItem[2])
            setDeptcd(loadItem[3])
            setOfficecd(loadItem[4])
        }
    }, [loadItem])

    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        if (popType === crudType.UPDATE) {
            console.log('UpdateLogic', param)
            Update.mutate(param, {
                onSuccess: (res: any) => {
                    closeModal();
                    dispatch({ isMSearch: true });
                },
            })
        } else {

        }
    }, [popType])


    useEffect(() => {
        reset()
        if (popType === crudType.CREATE) {
            //setFocus("grp_cd")
        }
        // if (popType === crudType.UPDATE) {
        //     setModalValue(mSelectedRow, setValue, getValues)
        //     //select 컴포넌트 추가설정
        //     // setGrpCd(selectedData.grp_cd)
        //     setUseYn(mSelectedRow.use_yn)
        // }
    }, [popType, isOpen])

    useEffect(() => {
        if (mSelectedRow) {
            log('mSelectedRow?', mSelectedRow)
        }
    }, [mSelectedRow])

    return (

        <FormProvider{...formZodMethods}>
            <DialogBasic
                isOpen={isOpen!}
                onClose={closeModal}
                title={"사용자 기준정보 " + (popType === crudType.CREATE ? "등록" : "수정")}
                bottomRight={
                    <>
                        <Button id={"save"} onClick={handleSubmit(onFormSubmit)} icon={null} width="w-32" />
                        <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" />
                    </>
                }>
                <></>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
                        {/* form의 user_id, react-query의 user_id 중복으로 form의 파라미터 user_id2로 변경  */}
                        <MaskedInputField id="user_id2" label="user_id" value={mSelectedRow?.user_id} options={{
                            isReadOnly: popType === crudType.CREATE ? true : true,
                        }} />
                        
                        <div className="col-span-1">
                            <MaskedInputField id="user_nm" value={mSelectedRow?.user_nm} options={{
                                isReadOnly: popType === crudType.CREATE ? false : true,
                            }} />
                        </div>


                        <div className="col-span-1">
                            <ReactMultiSelect
                                id="perm_id" label="perm_id" dataSrc={permissionid as data}
                                width='w-96' lwidth='w-20' height="8px"
                                options={{
                                    keyCol: "permission_id",
                                    displayCol: ['permission_id', 'permission_nm'],
                                    inline: false,
                                    dialog: true,
                                    isMulti: true,
                                    defaultValue: mSelectedRow?.permission_id,
                                    isDisplay : (gUserGroupId as unknown as number) >= 9999 ? true : false,
                                }} />
                        </div>

                        <ReactSelect
                            id="bz_plc_code" label="bz_plc_code" dataSrc={bzplccode as data}
                            width='w-96' lwidth='w-20' height="8px"
                            options={{
                                keyCol: "bz_plc_code",
                                displayCol: ['bz_plc_code', 'bz_plc_nm'],
                                inline: false,
                                defaultValue: mSelectedRow?.bz_plc_code
                            }} />

                        <div className="col-span-1">
                            <ReactSelect
                                id="terminal_cd" label="terminal_cd" dataSrc={terminalcd as data}
                                width='w-96' lwidth='w-20' height="8px"
                                options={{
                                    keyCol: "terminal_cd",
                                    displayCol: ['terminal_cd', 'terminal_nm'],
                                    inline: false,
                                    dialog: true,
                                }} />
                        </div>

                        <div className="col-span-1">
                            <ReactSelect
                                id="office_cd" label="office_cd" dataSrc={officecd as data}
                                width='w-96' lwidth='w-20' height="8px"
                                options={{
                                    keyCol: "office_cd",
                                    displayCol: ['office_cd', 'office_nm'],
                                    inline: false,
                                    dialog: true,
                                    defaultValue: mSelectedRow?.office_cd
                                }} />
                        </div>


                        <div className="col-span-1">
                            <ReactSelect
                                id="dept_cd" label="dept_cd" dataSrc={deptcd as data}
                                width='w-96' lwidth='w-20' height="8px"
                                options={{
                                    keyCol: "dept_cd",
                                    displayCol: ['dept_cd', 'dept_nm'],
                                    inline: false,
                                    dialog: true,
                                    defaultValue: mSelectedRow?.dept_cd
                                }} />
                        </div>

                        <div className="col-span-1">
                            <MaskedInputField id="ufs_id" value={mSelectedRow?.ufs_id} options={{
                                isReadOnly: popType === crudType.CREATE ? false : false,
                            }} />
                        </div>

                        <div className="col-span-1">
                            <MaskedInputField id="ufs_pw" value={mSelectedRow?.ufs_pw}
                                options={{
                                    isReadOnly: popType === crudType.CREATE ? false : false,
                                    type: 'password',
                                    isAutoComplete: 'one-time-code'
                                }} />
                        </div>


                        <div className="col-span-1">
                            <MaskedInputField id="remark" value={mSelectedRow?.remark} options={{
                                isReadOnly: popType === crudType.CREATE ? false : false,
                            }} />
                        </div>
                        <div className="col-span-1">
                            <MaskedInputField id="tel_num" value={mSelectedRow?.tel_num} options={{
                                isReadOnly: popType === crudType.CREATE ? false : false,
                            }} />
                        </div>

                        {/* <div className="col-span-1">
                            <MaskedInputField id="emp_no" value={mSelectedRow?.emp_no} options={{
                                isReadOnly: popType === crudType.CREATE ? false : false,
                            }} />
                        </div> */}

                        {/* <div className="col-span-1">
                            <MaskedInputField id="edi_email" value={mSelectedRow?.edi_email} options={{
                                isReadOnly: popType === crudType.CREATE ? false : false,
                            }} />
                        </div> */}

                        <div className="col-span-1">
                            <ReactSelect
                                id="use_yn" dataSrc={{
                                    data: [
                                        { use_yn: 'Y' },
                                        { use_yn: 'N' }
                                    ]
                                } as data}
                                options={{
                                    dialog: true,
                                    keyCol: "use_yn",
                                    displayCol: ['use_yn'],
                                    defaultValue: mSelectedRow?.use_yn
                                }}
                            />
                        </div>
                    </div>
                </form>
            </DialogBasic>
        </FormProvider>

    )

}

export default Modal