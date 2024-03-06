import DialogBasic from "@/page-parts/tmpl/dialog/dialog"
import { Controller, useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { TButtonBlue, TButtonGray, TInput, TSelectCode } from "@/page-parts/tmpl/form";
import { PopType, setModalValue } from "@/utils/modal";
import { useMemo, useState, useEffect, useCallback } from "react";
import { PageState, useAppContext } from "components/provider/contextProvider"
import { SET_CHANGESELECT, ROW_CLICK, SEARCH } from "components/provider/contextProvider";
import { SP_UpdateData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";

import {useRouter, usePathname} from 'next/navigation'
import { TSelect2 } from "@/components/form/select-row";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadItem: any | null
}

const Modal: React.FC<Props> = ({ loadItem }) => {

    const { dispatch, selectedRow, crudType:popType, isGridClick:isOpen, searchParams } = useAppContext();
    const router = usePathname()
    console.log('query.폴더명',router)
    const { Update } = useUpdateData2(SP_UpdateData, SEARCH);

    // 선택된 데이터 Select컴포넌트 처리
    const [transmode, setTransmode] = useState([]);
    const [transtype, setTranstype] = useState([]);
    const [prodGrCd, setprodGrCd] = useState([]);
    const [billGr1Cd, setBillGr1Cd] = useState([]);
    
    const closeModal = () => {
        dispatch({isGridClick:false});
        reset();
    }

    const formZodMethods = useForm({
        // resolver: zodResolver(formZodSchema),
        defaultValues: {
            trans_mode: popType === PopType.CREATE 
                    ? searchParams.trans_mode : selectedRow?.trans_mode,
            trans_type: popType === PopType.CREATE 
                    ? searchParams.trans_type : selectedRow?.trans_type,
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
        if(loadItem){
          setTransmode(loadItem[0]) 
          setTranstype(loadItem[1])
          setprodGrCd(loadItem[2])
        }    
      }, [loadItem]);

    useEffect(() => {        
        var modetype = selectedRow?.trans_mode + selectedRow?.trans_type;
        switch (modetype) {
            case "AE": setBillGr1Cd(loadItem[7]); break;
            case "AI": setBillGr1Cd(loadItem[8]); break;
            case "OE": setBillGr1Cd(loadItem[9]); break;
            case "OI": setBillGr1Cd(loadItem[10]); break;
        }

    }, [selectedRow])

    //Refactore by using custom hook
    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        if (popType === PopType.UPDATE) {
            Update.mutate(param);
        } else {
        //     Create.mutate(param, {
        //         onSuccess: (res: any) => {
        //             toastSuccess("등록되었습니다."+res);
        //             // setIsOpen(false)
        //             closeModal();
        //         },
        //         // onError:(res:any) =>{
        //         //     toastError("등록에실패했습니다."+res);
        //         // }
        //     })
        }
    }, [popType]);

    useEffect(() => {
        reset()
        if (popType === PopType.CREATE) {
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
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <DialogBasic
                    isOpen={isOpen!}
                    onClose={closeModal}
                    title={"차지코드 관리 - " + (popType === PopType.CREATE ? "등록" : "수정")}
                    bottomRight={
                        <>
                            <TButtonBlue label={"저장"} onClick={handleSubmit(onFormSubmit)} />
                            <TButtonGray label={"취소"} onClick={closeModal} />
                        </>
                    }
                >
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-4">
                        <div className="col-span-2">
                            <TSelect2
                                id="trans_mode"
                                label={"trans_mode"}
                                allYn={false}
                                isPlaceholder={false}
                                value={selectedRow?.trans_mode}
                                options={transmode}
                                />
                        </div>                            

                        <div className="col-span-2">
                            <TSelect2
                                id="trans_type"
                                label={"trans_type"}
                                allYn={false}
                                isPlaceholder={false}
                                value={selectedRow?.trans_type}
                                options={transtype}
                                />
                        </div>
                        <div className="col-span-4">
                            <TSelect2
                                id="prod_gr_cd"
                                label={"prod_gr_cd"}
                                // allYn={false}
                                // isPlaceholder={false}
                                value={selectedRow?.prod_gr_cd}
                                options={prodGrCd}
                                />
                        </div>

                        <div className="col-span-4">
                            <TInput 
                                label="charge_code" 
                                id="charge_code" 
                                value={selectedRow?.charge_code}
                                >
                            </TInput>
                        </div>
                        <div className="col-span-4">
                            <TInput 
                                label="charge_desc" 
                                id="charge_desc" 
                                value={selectedRow?.charge_desc}
                                >
                            </TInput>
                        </div>
                        
                        <div className="col-span-2">
                            <TInput 
                                label="vat_yn" 
                                id="vat_yn" 
                                value={selectedRow?.vat_yn}
                                >
                            </TInput>
                        </div>
                        <div className="col-span-2">
                            <TInput 
                                label="vat_type" 
                                id="vat_type" 
                                value={selectedRow?.vat_type}
                                >
                            </TInput>
                        </div>

                        <div className="col-span-2">
                            <TInput 
                                label="vat_rt" 
                                id="vat_rt"
                                value={selectedRow?.vat_rt}
                                >
                            </TInput>
                        </div>
                        <div className="col-span-2">
                            <TInput 
                                label="fins_yn" 
                                id="fins_yn"
                                value={selectedRow?.fins_yn}
                                >
                            </TInput>
                        </div>

                        <div className="col-span-2">
                            <TInput 
                                label="fin_category" 
                                id="fin_category"
                                value={selectedRow?.fin_category}
                                >
                            </TInput>
                        </div>


                        <div className="col-span-2">
                            <TInput 
                                label="rem_prt_yn" 
                                id="rem_prt_yn"
                                value={selectedRow?.rem_prt_yn}
                                >
                                {/* {errors?.cd_mgcd2?.message && (
                                    <ErrorMessage>{errors.cd_mgcd2.message}</ErrorMessage>
                                )} */}
                            </TInput>
                        </div>
                        <div className="col-span-4">
                            <TSelect2
                                id="bill_gr1_cd"
                                label={"bill_gr1_cd"}
                                allYn={false}
                                isPlaceholder={false}
                                value={selectedRow?.bill_gr1_cd}
                                options={billGr1Cd}
                                />
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
                                value={selectedRow?.use_yn}
                                // onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                //     setUseYn(event.target.value)
                                // }}
                            />
                            
                        </div>

                    </div>

                </DialogBasic>
            </form>
        </FormProvider>

    )

}

export default Modal