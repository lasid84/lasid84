import DialogBasic from "layouts/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { Button } from "components/button";
import { crudType, useAppContext, SEARCH_M } from "components/provider/contextObjectProvider"
import { SP_UpdateData, SP_InsertData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { ReactSelect, data } from "@/components/select/react-select2"
import { MaskedInputField } from "@/components/input/react-text-mask";

type Props = {
    loadItem: any | null
}

const Modal: React.FC<Props> = ({ loadItem }) => {

    const { dispatch, objState, } = useAppContext();
    const { mSelectedRow, isPopUpOpen: isOpen, crudType: popType } = objState

    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_M)
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_M)

    // 선택된 데이터 Select컴포넌트 처리
    const [groupcd, setGroupcd] = useState<any>([])

    const closeModal = () => {
        dispatch({ isPopUpOpen: false });
        reset();
    }

    const formZodMethods = useForm({
        defaultValues: {
            grp_cd: "",
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
            setGroupcd(loadItem[0])
        }
    }, [loadItem])

    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        if (popType === crudType.UPDATE) {
            console.log('UpdateLogic')
            Update.mutate(param, {
                onSuccess: (res: any) => {
                    closeModal();
                    dispatch({ isMSearch: true });
                },
            })
        } else {
            Create.mutate(param, {
                onSuccess: (res: any) => {
                    closeModal();
                    dispatch({ isMSearch: true });
                },
            })
        }
    }, [popType])


    useEffect(() => {
        reset()
        if (popType === crudType.CREATE) {
            setFocus("grp_cd")
        }
        // if (popType === crudType.UPDATE) {
        //     setModalValue(mSelectedRow, setValue, getValues)
        //     //select 컴포넌트 추가설정
        //     // setGrpCd(selectedData.grp_cd)
        //     setUseYn(mSelectedRow.use_yn)
        // }
    }, [popType, isOpen])

    return (

        <FormProvider{...formZodMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <DialogBasic
                    isOpen={isOpen!}
                    onClose={closeModal}
                    title={"종합코드 관리 " + (popType === crudType.CREATE ? "등록" : "수정")}
                    bottomRight={
                        <>
                            <Button id={"save"} onClick={handleSubmit(onFormSubmit)} width="w-32" />
                            <Button id={"cancel"} onClick={closeModal} width="w-32" />
                        </>
                    }>
                    <></>
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
                        <ReactSelect
                            id="grp_cd" label="grp_cd" dataSrc={groupcd as data}
                            width='w-96' lwidth='w-20' height="8px"
                            options={{
                                keyCol: "grp_cd",
                                displayCol: ['grp_cd'],
                                inline: false,
                                defaultValue: getValues('grp_cd')
                            }}
                        />
                        <MaskedInputField id="cd" value={mSelectedRow?.cd} options={crudType.CREATE ? {} : { isReadOnly: true }} />
                        <div className="col-span-2">
                            <MaskedInputField id="cd_nm" value={mSelectedRow?.cd_nm} options={{}} />
                        </div>
                     
                        <div className="col-span-1">
                            <MaskedInputField id="cd_desc" value={mSelectedRow?.cd_desc} options={{}} />
                        </div>
                        <div className="col-span-1">
                            <MaskedInputField id="cd_mgcd1" value={mSelectedRow?.cd_mgcd1} options={{}} />
                        </div>
                        <div className="col-span-1">
                            <MaskedInputField id="cd_mgcd2" value={mSelectedRow?.cd_mgcd2} options={{}} />
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
                                    dialog: true,
                                    keyCol: "use_yn",
                                    displayCol: ['use_yn'],
                                    defaultValue: mSelectedRow?.use_yn
                                }}
                            />
                        </div>
                    </div>
                </DialogBasic>
            </form>
        </FormProvider>

    )

}

export default Modal