import { useTranslation } from "react-i18next";
import DialogBasic from "layouts/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { ErrorMessage } from "@/components/react-hook-form";
import { PopType, setModalValue } from "@/utils/modal";
import { useState, useEffect, useCallback } from "react";
import Select from "react-select"
import { TSelect2 } from "@/components/form/select-row";
import { Button } from "components/button";
import { useAppContext, SEARCH_M, crudType } from "components/provider/contextObjectProvider"
import { SP_UpdateData, SP_InsertData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { ReactSelect, data } from "@/components/select/react-select2"
import { MaskedInputField } from "@/components/input/react-text-mask";


type Props = {
    initData: any | undefined;
}

const Modal: React.FC<Props> = (props) => {
    const { initData } = props

    const { dispatch, objState, } = useAppContext();
    const { mSelectedRow, isPopupOpen: isOpen, crudType: popType } = objState
    let selectoptions: any[] = []
    const [useYN, setUseYn] = useState<any>(undefined);
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_M)
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_M)

    //다국어
    const { t } = useTranslation();

    // 선택된 데이터 Select컴포넌트 처리
    const [groupcd, setGroupcd] = useState<any>([])

    const closeModal = () => {
        dispatch({ isPopupOpen: false });
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
        if (initData) {
            // initData[0].data.map((item: any) => {
            //     var key = item[Object.keys(item)[0]];
            //     var label = item[Object.keys(item)[1]];
            //     selectoptions.push({ value: key, label: key + " " + label });
            // })
            // setGroupcd(selectoptions)
            setGroupcd(initData[0])
        }
    }, [initData])



    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        if (popType === PopType.UPDATE) {
            console.log('UpdateLogic')
            Update.mutate(param)
        } else {
            console.log('CreateLogic')
            Create.mutate(param)
        }
    }, [popType])


    useEffect(() => {
        reset()
        if (popType === PopType.CREATE) {
            dispatch({ mSelectedRow: {} })
            setFocus("grp_cd")
        }
        if (popType === PopType.UPDATE) {
            setModalValue(mSelectedRow, setValue, getValues)
            //select 컴포넌트 추가설정
            // setGrpCd(selectedData.grp_cd)
            setUseYn(mSelectedRow.use_yn)
        }
    }, [popType, isOpen])

    return (

        <FormProvider{...formZodMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <DialogBasic
                    isOpen={isOpen!}
                    onClose={closeModal}
                    title={"종합코드 관리 " + (popType === PopType.CREATE ? "등록" : "수정")}
                    bottomRight={
                        <>
                            <Button id={"save"} onClick={handleSubmit(onFormSubmit)} icon={null} width="w-32"/>
                            <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32"/>
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
                        {/* <ReactSelect id="grp_cd" name="grp_cd" options={groupcd} /> */}
                        <MaskedInputField id="cd" value={mSelectedRow?.cd_nm} options={{ isReadOnly: true }} />
                        <div className="col-span-2">
                            <MaskedInputField id="cd_nm" value={mSelectedRow?.cd_nm} options={{}} />
                        </div>
                        <div className="col-span-3">
                            <MaskedInputField id="cd_desc" value={mSelectedRow?.cd_desc} options={{}} />
                        </div>
                        <div className="col-span-3">
                            <MaskedInputField id="cd_mgcd1" value={mSelectedRow?.cd_mgcd1} options={{}} />
                        </div>
                        <div className="col-span-3">
                            <MaskedInputField id="cd_mgcd2" value={mSelectedRow?.cd_mgcd2} options={{}} />
                        </div>
                        <div className="col-span-3">
                            <ReactSelect
                                id="use_yn" dataSrc={{
                                    data: [
                                        { use_yn: 'Y' },
                                        { use_yn: 'N' }
                                    ]
                                } as data }                                
                                options={{
                                    dialog : true,
                                    keyCol: "use_yn",
                                    displayCol: ['use_yn'],                                    
                                    defaultValue: mSelectedRow?.use_yn
                                }}
                            />
                            {/* <TSelect2
                                id="use_yn"
                                options={[
                                    { label: "Y", value: "Y" },
                                    { label: "N", value: "N" },
                                ]}
                                allYn={true}
                                isPlaceholder={false}
                                value={mSelectedRow?.use_yn}
                            ></TSelect2> */}
                        </div>

                    </div>

                </DialogBasic>
            </form>
        </FormProvider>

    )

}

export default Modal