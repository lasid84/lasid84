import DialogBasic from "@/page-parts/tmpl/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { useStnd0004Store } from "@/states/stnd/stnd0004.store"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useZod } from "utils/zod"
import { TButtonBlue, TButtonGray, TInput, TSelectCode } from "@/page-parts/tmpl/form";
import { ErrorMessage } from "@/components/react-hook-form";
import { PopType, setModalValue } from "@/utils/modal";
import { useMemo, useState, useEffect } from "react";
import Select from "react-select"
import { useStnd0005Store } from "@/states/stnd/stnd0005.store";

export interface returnData {
    numericData: any,
    textData: string,
    cursorData: string[],
}
type Props = {
    isOpen: boolean;
    popType: string;
    setIsOpen: (val: boolean, popType?: string) => void;
    setData?: (data: any) => void;
    loadData: {
        data: returnData
    } | undefined,
}
const Modal: React.FC<Props> = ({ loadData, isOpen, popType, setIsOpen }) => {
    const selectedData = useStnd0005Store((state) => state.popData)


    // 선택된 데이터 Select컴포넌트 처리
    const [useYn, setUseYn] = useState<string>("Y")
    const [useGrpCd, setUseGrpCd] = useState<string>()
    const { t, zodStringRequired } = useZod()

    const closeModal = () => {
        setIsOpen(false, popType);
        // reset();
    }

    const formZodSchema = useMemo(() => {
        return z.object({
            grp_cd: z.string().min(1, `${t("zod.required")}`),
            grp_cd_nm: z.string().min(1, `${t("zod.required")}`),
            cd: z.string().min(1, `${t("zod.required")}`),
            cd_nm: z.string().min(1, `${t("zod.required")}`),
            cd_desc: z.string().optional(),
            remark: z.string().optional(),
            cd_mgcd1: z.string().optional(),
            cd_mgcd2: z.string().optional(),
            use_yn: z.string().min(1, `${t("zod.required")}`),
        })
    }, [])

    type FormZodType = z.infer<typeof formZodSchema>;

    const formZodMethods = useForm<FormZodType>({
        resolver: zodResolver(formZodSchema),
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

    const onFormSubmit: SubmitHandler<FormZodType> = async (param) => {
        const params = {
            ...param
        }
        console.log("params:: ", params)
    }

    const [options, setOptions] = useState<any>(undefined)

    useEffect(() => {
        if (loadData) {
            setOptions(loadData.data.cursorData)
        }
    }, [loadData, options]);

    useEffect(() => {
        reset()
        if (popType === PopType.CREATE) {
            setFocus("grp_cd")
        }
        if (popType === PopType.UPDATE) {
            setModalValue(selectedData, setValue, getValues)
            //select 컴포넌트 추가설정
            setUseYn(selectedData.use_yn)
            setUseGrpCd(selectedData.grp_cd)

        }
    },[popType, isOpen])

    return (

        <FormProvider{...formZodMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <DialogBasic
                    isOpen={isOpen}
                    onClose={closeModal}
                    title={"종합코드 관리 " + (popType === PopType.CREATE ? "등록" : "수정")}
                    bottomRight={
                        <>
                            <TButtonBlue label={"저장"} onClick={handleSubmit(onFormSubmit)} />
                            <TButtonGray label={"취소"} onClick={closeModal} />
                        </>
                    }
                >
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
                        <TSelectCode
                            id="grp_cd"
                            type={"USE_YN"}
                            label="grp_cd"
                            allYn={false}
                            options={options && options[0]}
                            isPlaceholder={false}
                            // value={options && options.find((options: any) => options.value === value)}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                setUseGrpCd(event.target.value)
                            }}
                        >
                            {errors?.grp_cd?.message && <ErrorMessage>{errors.grp_cd.message}</ErrorMessage>}
                        </TSelectCode>

                        <div className="col-span-2">
                            <TInput label="grp_cd_nm" id="grp_cd_nm">
                                {errors?.grp_cd_nm?.message && (
                                    <ErrorMessage>{errors.grp_cd_nm.message}</ErrorMessage>
                                )}
                            </TInput>
                        </div>
                        <TInput label="cd" id="cd">
                            {errors?.cd?.message && (
                                <ErrorMessage>{errors.cd.message}</ErrorMessage>
                            )}
                        </TInput>
                        <div className="col-span-2">
                            <TInput label="cd_nm" id="cd_nm">
                                {errors?.cd_nm?.message && (
                                    <ErrorMessage>{errors.cd_nm.message}</ErrorMessage>
                                )}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="cd_desc" id="cd_desc">
                                {errors?.cd_desc?.message && (
                                    <ErrorMessage>{errors.cd_desc.message}</ErrorMessage>
                                )}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="remark" id="remark">
                                {errors?.remark?.message && (
                                    <ErrorMessage>{errors.remark.message}</ErrorMessage>
                                )}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="cd_mgcd1" id="cd_mgcd1">
                                {errors?.cd_mgcd1?.message && (
                                    <ErrorMessage>{errors.cd_mgcd1.message}</ErrorMessage>
                                )}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TInput label="cd_mgcd2" id="cd_mgcd2">
                                {errors?.cd_mgcd2?.message && (
                                    <ErrorMessage>{errors.cd_mgcd2.message}</ErrorMessage>
                                )}
                            </TInput>
                        </div>
                        <div className="col-span-3">
                            <TSelectCode
                                id="use_yn"
                                type={"USE_YN"}
                                label="사용여부"
                                options={[
                                    { label: "Y", value: "Y" },
                                    { label: "N", value: "N" },
                                ]}
                                allYn={true}
                                isPlaceholder={false}
                                value={useYn}
                                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                    setUseYn(event.target.value)
                                }}
                            >
                                {errors?.use_yn?.message && <ErrorMessage>{errors.use_yn.message}</ErrorMessage>}
                            </TSelectCode>
                        </div>

                    </div>

                </DialogBasic>
            </form>
        </FormProvider>

    )

}

export default Modal