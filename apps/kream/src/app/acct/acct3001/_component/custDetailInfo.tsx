import { useAppContext } from "components/provider/contextProvider";
import { TInput } from "page-parts/tmpl/form"
import { useCallback } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";


const CustomerDetail: React.FC = () => {    

    const { dispatch, mSelectedRow, crudType:popType } = useAppContext();

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
        
    }, [popType]);

    return (
        <FormProvider{...formZodMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
                    <TInput 
                        label="cust_code" 
                        id="cust_code" 
                        value={mSelectedRow?.cust_code}
                        >
                    </TInput>
                    <TInput 
                        label="executive_nm" 
                        id="executive_nm" 
                        value={mSelectedRow?.executive_nm}
                        >
                    </TInput>
                    <TInput 
                        label="cust_nm" 
                        id="cust_nm" 
                        value={mSelectedRow?.cust_nm}
                        >
                    </TInput>
                    <TInput 
                        label="bz_con" 
                        id="bz_con" 
                        value={mSelectedRow?.bz_con}
                        >
                    </TInput>
                    <TInput 
                        label="cust_nm_eng" 
                        id="cust_nm_eng" 
                        value={mSelectedRow?.cust_nm_eng}
                        >
                    </TInput>
                    <TInput 
                        label="bz_item" 
                        id="bz_item" 
                        value={mSelectedRow?.bz_item}
                        >
                    </TInput>
                    <TInput 
                        label="bz_reg_no" 
                        id="bz_reg_no" 
                        value={mSelectedRow?.bz_reg_no}
                        >
                    </TInput>
                    <div className="col-span-2">
                        <TInput 
                            label="addr1" 
                            id="addr1" 
                            value={mSelectedRow?.addr1}
                            >
                        </TInput>
                    </div>
                    <div className="col-span-2">
                        <TInput 
                            label="addr1" 
                            id="addr1" 
                            value={mSelectedRow?.addr1}
                            >
                        </TInput>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CustomerDetail;