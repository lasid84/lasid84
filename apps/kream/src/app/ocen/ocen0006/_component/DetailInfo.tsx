import { MaskedInputField, TextArea } from "components/input";
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
                <div className="flex flex-col gap-2 p-5 md:grid md:grid-cols-4">
                    <MaskedInputField 
                        id="cust_code" 
                        value={mSelectedRow?.cust_code}
                        options = {{ 
                            isReadOnly:true,
                            freeStyles:"border-1 border-slate-300"
                        }}
                        />
                    <MaskedInputField 
                        id="executive_nm" 
                        value={mSelectedRow?.executive_nm}
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
                            id="cust_nm" 
                            value={objState.mSelectedRow?.cust_nm}
                            options = {{ 
                                isReadOnly:true
                            }}
                            />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField 
                            id="cust_nm_eng" 
                            value={objState.mSelectedRow?.cust_nm_eng}
                            options = {{ 
                                isReadOnly:true
                            }}
                            />
                    </div>
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

                    </div>
                    <TextArea id="nature_of_goods" rows={7} cols={20}  value="" 
                        options={{ 
                            isReadOnly: false, 
                            inline:true, 
                            freeStyles:"resize-none"
                        }} />

<div style={{ position: 'relative', border: '1px solid black', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
<div style={{ position: 'absolute', top: '-20px', left: '10px', padding: '0 5px' }}>타이틀
                        <MaskedInputField 
                            id="addr1" 
                            value={objState.mSelectedRow?.addr1}
                            options = {{ 
                                isReadOnly:true
                            }}
                        />
                        <MaskedInputField 
                            id="addr1" 
                            value={objState.mSelectedRow?.addr1}
                            options = {{ 
                                isReadOnly:true
                            }}
                        />
                    </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CustomerDetail;