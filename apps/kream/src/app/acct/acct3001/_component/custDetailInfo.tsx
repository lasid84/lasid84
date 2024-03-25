import { MaskedInputField } from "@/components/input";
import { useAppContext } from "components/provider/contextObjectProvider";
import { TInput } from "page-parts/tmpl/form"
import { useCallback } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";


const CustomerDetail: React.FC = () => {    

    const { dispatch, objState } = useAppContext();

    const formZodMethods = useForm({
        // resolver: zodResolver(formZodSchema),
        defaultValues: {
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

    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
        
    }, [objState.popType]);

    return (
        <FormProvider{...formZodMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="flex flex-col gap-2 p-5 md:grid md:grid-cols-2">
                    {/* <TInput 
                        label="cust_code" 
                        id="cust_code" 
                        value={objState.mSelectedRow?.cust_code}
                        >
                    </TInput> */}
                    <MaskedInputField 
                        id="cust_code" 
                        // label="cust_code"
                        value={objState.mSelectedRow?.cust_code}
                        // width="w-80"
                        // height="h-12"
                        options = {{ 
                            // type:"number",
                            // limit:7,
                            // isAllowDecimal:true,
                            // decimalCnt:2,
                            // myPlaceholder:"Enter business number" 
                            // myPlaceholder:"bz_reg_no"
                            // inline:{true}
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="executive_nm" 
                        value={objState.mSelectedRow?.executive_nm}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="cust_nm" 
                        value={objState.mSelectedRow?.cust_nm}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="bz_con" 
                        value={objState.mSelectedRow?.bz_con}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="cust_nm_eng" 
                        value={objState.mSelectedRow?.cust_nm_eng}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="bz_item" 
                        value={objState.mSelectedRow?.bz_item}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="bz_reg_no" 
                        value={objState.mSelectedRow?.bz_reg_no}
                        options = {{ 
                            type:"bz_reg_no",
                            isReadOnly:true
                        }}
                        />
                    <div className="col-span-2">
                        <MaskedInputField 
                            id="addr1" 
                            value={objState.mSelectedRow?.addr1}
                            options = {{ 
                                isReadOnly:true
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField 
                            id="addr2" 
                            value={objState.mSelectedRow?.addr2}
                            options = {{ 
                                isReadOnly:true
                            }}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CustomerDetail;