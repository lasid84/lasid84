import { MaskedInputField } from "@/components/input";
import { useAppContext } from "components/provider/contextObjectProvider";
import { useCallback } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const { log } = require('@repo/kwe-lib/components/logHelper');

const CustomerDetail: React.FC = () => {

    const { dispatch, objState } = useAppContext();
    const { mSelectedRow } = objState;

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
                <div className="flex flex-col gap-2 p-5 md:grid md:grid-cols-6">

                    <MaskedInputField
                        id="carrier_code"
                        value={mSelectedRow?.carrier_code}
                        options={{
                            isReadOnly: true,
                            freeStyles: "border-1 border-slate-300"
                        }}
                    />
                    <div className="col-span-2">
                        <MaskedInputField
                            id="carrier_nm"
                            value={objState.mSelectedRow?.carrier_nm}
                            options={{
                                isReadOnly: true
                            }}
                        />
                    </div>
                    <MaskedInputField
                        id="carrier_type"
                        value={mSelectedRow?.carrier_type}
                        options={{
                            isReadOnly: true
                        }}
                    />
                    <MaskedInputField
                        id="alternate_carrier_code"
                        value={objState.mSelectedRow?.alternate_carrier_code}
                        options={{
                            isReadOnly: true
                        }}
                    />
                    <MaskedInputField
                        id="tel_num"
                        value={objState.mSelectedRow?.tel_num}
                        options={{
                            isReadOnly: true
                        }}
                    />
                    {/* <MaskedInputField 
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
                    </div> */}
                </div>
            </form>
        </FormProvider>
    );
}

export default CustomerDetail;