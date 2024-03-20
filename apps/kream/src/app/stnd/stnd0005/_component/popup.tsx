import { useTranslation } from "react-i18next";
import DialogBasic from "@/page-parts/tmpl/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { TButtonBlue, TButtonGray, TInput } from "@/page-parts/tmpl/form";
import { ErrorMessage } from "@/components/react-hook-form";
import { PopType } from "@/utils/modal";
import { useState, useEffect, useCallback } from "react";
import Select from "react-select"
import { TSelect2 } from "@/components/form/select-row";
import { useAppContext, SEARCH_M, crudType } from "components/provider/contextObjectProvider"
import { SP_UpdateData, SP_InsertData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { ReactSelect, Label, LabelTop, InputWrapper } from "@/components/react-hook-form"



type Props = {
    initData: any | undefined;
}

const Modal: React.FC<Props> = (props) => {
    const { initData } = props

    const { dispatch, objState, } = useAppContext();
    const { mSelectedRow, isPopupOpen: isOpen, crudType: popType } = objState
    const [groupcd, setGroupcd] = useState<any>([])
    let selectoptions: any[] = []
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH_M)
    const { Create } = useUpdateData2(SP_InsertData, SEARCH_M)

    //다국어
    const { t } = useTranslation();

    // 선택된 데이터 Select컴포넌트 처리
    const [grpcd, setGrpCd] = useState([])

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
            setGrpCd(initData[0].data)
        }
    }, [initData])

    useEffect(() => {
        if (initData) {
            initData[0].data.map((item: any) => {
                var key = item[Object.keys(item)[0]];
                var label = item[Object.keys(item)[1]];
                selectoptions.push({ value: key, label: key + " " + label });
            })
            setGroupcd(selectoptions)
            //onSearch();
        }
    }, [initData])



    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        if (popType === PopType.UPDATE) {
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
        // if (popType === PopType.UPDATE) {
        //     setModalValue(selectedData, setValue, getValues)
        //     //select 컴포넌트 추가설정
        //     setGrpCd(selectedData.grp_cd)
        //     setUseYn(selectedData.use_yn)
        // }
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
                            <TButtonBlue label={"저장"} onClick={handleSubmit(onFormSubmit)} />
                            <TButtonGray label={"취소"} onClick={closeModal} />
                        </>
                    }
                >
                    <></>
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
                        <InputWrapper outerClassName="" inline={false}>
                            <LabelTop id="grp_cd2">{t("grp_cd")}</LabelTop>
                            <ReactSelect id="grp_cd2" name="grp_cd" options={groupcd} />
                        </InputWrapper>
                        {/* <TSelect2
                            id="grp_cd"
                            label={"grp_cd"}
                            allYn={false}
                            isPlaceholder={false}
                            value={mSelectedRow?.grp_cd_nm}
                            options={grpcd}
                            readOnly={popType === PopType.UPDATE}
                        /> */}

                        <TInput label="cd" id="cd" readOnly={popType === PopType.UPDATE} value={mSelectedRow?.cd}>
                        </TInput>
                        <div className="col-span-2">
                            <TInput label="cd_nm" id="cd_nm" value={mSelectedRow?.cd_nm}>
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="cd_desc" id="cd_desc" value={mSelectedRow?.cd_desc}>
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="remark" id="remark" value={mSelectedRow?.remark}>
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="cd_mgcd1" id="cd_mgcd1" value={mSelectedRow?.cd_mgcd1}>
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="cd_mgcd2" id="cd_mgcd2" value={mSelectedRow?.cd_mgcd2}>
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TSelect2
                                id="use_yn"
                                label={t("use_yn")}
                                options={[
                                    { key: "Y", value: "Y" },
                                    { key: "N", value: "N" },
                                ]}
                                allYn={true}
                                isPlaceholder={false}
                                value={mSelectedRow?.use_yn}
                            ></TSelect2>
                        </div>

                    </div>

                </DialogBasic>
            </form>
        </FormProvider>

    )

}

export default Modal