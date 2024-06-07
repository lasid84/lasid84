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
                <div className="flex flex-col gap-2 p-5 md:grid md:grid-cols-6 ">
                    <div className="col-span-2">
                        <MaskedInputField
                            id="place_code"
                            value={mSelectedRow?.place_code}
                            options={{
                                isReadOnly: true,
                                freeStyles: "border-1 border-slate-300"
                            }}
                        />
                    </div>
                    <div className="col-span-4">
                        <MaskedInputField
                            id="place_nm"
                            value={objState.mSelectedRow?.place_nm}
                            options={{
                                isReadOnly: true
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField
                            id="area_nm"
                            value={mSelectedRow?.area_nm}
                            options={{
                                isReadOnly: true
                            }}
                        />
                    </div>
                    <div className="col-span-4">
                        <MaskedInputField
                            id="remark"
                            value={objState.mSelectedRow?.remark}
                            options={{
                                isReadOnly: true
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <MaskedInputField
                            id="create_date"
                            value={objState.mSelectedRow?.create_date}
                            options={{
                                isReadOnly: true,
                                type:"time"
                            }}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CustomerDetail;