import DialogBasic from "@/page-parts/tmpl/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { TButtonBlue, TButtonGray, TInput } from "@/page-parts/tmpl/form";
import { ErrorMessage } from "@/components/react-hook-form";
import { PopType } from "@/utils/modal";
import { useState, useEffect, useCallback } from "react";
import Select from "react-select"
import { TSelect2 } from "@/components/form/select-row";
import { PageState, useAppContext, SEARCH_M } from "components/provider/contextProvider"
import { SP_UpdateData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";



type Props = {
    loadItem: any | null
}

const Modal: React.FC<Props> = ({ loadItem }) => {

    const { dispatch, mSelectedRow, crudType: popType, isMChangeSelect: isOpen, searchParams } = useAppContext();

    const { Update,
        // Create
    } = useUpdateData2(SP_UpdateData, SEARCH_M)

    // 선택된 데이터 Select컴포넌트 처리
    const [useYn, setUseYn] = useState<string>("Y")
    const [grpcd, setGrpCd] = useState([])

    const closeModal = () => {
        dispatch({ isMChangeSelect: false });
        reset();
    }

    const formZodMethods = useForm({
        defaultValues: {
            grp_cd: "ALL",
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
            setGrpCd(loadItem[0])
        }
    }, [loadItem])


    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        if (popType === PopType.UPDATE) {
            Update.mutate(param)
        } else {

        }
    }, [popType])


    useEffect(() => {
        reset()
        if (popType === PopType.CREATE) {
            setFocus("grp_cd")
        }
        // if (popType === PopType.UPDATE) {
        //     setModalValue(selectedData, setValue, getValues)
        //     //select 컴포넌트 추가설정
        //     setGrpCd(selectedData.grp_cd)
        //     setUseYn(selectedData.use_yn)
        // }
    }, [popType, isOpen, mSelectedRow])

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
                        <TSelect2
                            id="grp_cd"
                            label={"grp_cd"}
                            allYn={false}
                            isPlaceholder={false}
                            value={mSelectedRow?.grp_cd_nm}
                            options={grpcd}
                        // readOnly={popType === PopType.UPDATE}
                        // value={options && options.find((options: any) => options.value === value)}
                        // onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                        //     setGrpCd(event.target.value)
                        // }}
                        />

                        <div className="col-span-2">
                            {/* <TInput label="grp_cd_nm" id="grp_cd_nm" value={selectedRow?.grp_cd_nm}>

                            </TInput> */}
                        </div>
                        <TInput label="cd" id="cd" readOnly={popType === PopType.UPDATE}
                            value={mSelectedRow?.cd}>
                            {/* {errors?.cd?.message && (
                                <ErrorMessage>{errors.cd.message}</ErrorMessage>
                            )} */}
                        </TInput>
                        <div className="col-span-2">
                            <TInput label="cd_nm" id="cd_nm" value={mSelectedRow?.cd_nm}>
                                {/* {errors?.cd_nm?.message && (
                                    <ErrorMessage>{errors.cd_nm.message}</ErrorMessage>
                                )} */}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="cd_desc" id="cd_desc" value={mSelectedRow?.cd_desc}>
                                {/* {errors?.cd_desc?.message && (
                                    <ErrorMessage>{errors.cd_desc.message}</ErrorMessage>
                                )} */}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="remark" id="remark" value={mSelectedRow?.remark}>
                                {/* {errors?.remark?.message && (
                                    <ErrorMessage>{errors.remark.message}</ErrorMessage>
                                )} */}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="cd_mgcd1" id="cd_mgcd1" value={mSelectedRow?.cd_mgcd1}>
                                {/* {errors?.cd_mgcd1?.message && (
                                    <ErrorMessage>{errors.cd_mgcd1.message}</ErrorMessage>
                                )} */}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="cd_mgcd2" id="cd_mgcd2" value={mSelectedRow?.cd_mgcd2}>
                                {/* {errors?.cd_mgcd2?.message && (
                                    <ErrorMessage>{errors.cd_mgcd2.message}</ErrorMessage>
                                )} */}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TSelect2
                                id="use_yn"
                                // type={"USE_YN"}
                                label="사용여부"
                                options={[
                                    { label: "Y", value: "Y" },
                                    { label: "N", value: "N" },
                                ]}
                                allYn={true}
                                isPlaceholder={false}
                                value={mSelectedRow?.use_yn}
                            >
                                {errors?.use_yn?.message && <ErrorMessage>{errors.use_yn.message}</ErrorMessage>}
                            </TSelect2>
                        </div>

                    </div>

                </DialogBasic>
            </form>
        </FormProvider>

    )

}

export default Modal