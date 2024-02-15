import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import { zodResolver } from "@hookform/resolvers/zod";
import PageSearch from "../../../../shared/tmpl/page-search"
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import Select from "react-select"
import { TInput2, TSelect2, TCancelButton, TSubmitButton } from "components/form";


export interface returnData {
    numericData: any,
    textData: string,
    cursorData: string[],
}

export interface Props {
    // onSubmit: SubmitHandler<any>,
    loadData: {
        data: returnData
    },
}


const SearchForm: React.FC<Props> = ({ loadData }) => {
    // 다국어
    const { t } = useTranslation();
    z.setErrorMap(makeZodI18nMap({ t }));

    const stnd0005SearchSchema = z.object({
        grp_cd: z.coerce.string(),
    })

    // stnd0005검색스키마 선언
    const formSchema = stnd0005SearchSchema
    // stnd0005검색스키마 타입선언
    type FormType = z.infer<typeof stnd0005SearchSchema>

    const methods = useForm<FormType>({
        resolver: zodResolver(formSchema),
    });
    const {
        handleSubmit,
        reset,
        setFocus,
        setValue,
        getValues,
        register,
        control,
        formState: { errors, isSubmitSuccessful },
    } = methods;

    const handleFormSubmit = async (FormType: any) => {
        console.log('?', FormType);
    };


    const [options, setOptions] = useState<any>(undefined);

    useEffect(() => {
        if (loadData) {
            console.log('loadData!', loadData.data.cursorData)
            setOptions(loadData.data.cursorData)
        }
    }, [loadData, options])


    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <><PageSearch
                    right={
                        <TSubmitButton label={t("search")} />
                    }>
                    <Controller
                        control={control}
                        name="grp_cd"
                        render={({ field: { onChange, value, ref } }) => (
                            <Select
                                inputId="grp_cd"
                                options={options && options[0]}
                                ref={ref}
                                value={options.find((options: any) => options.value === value)}
                                onChange={(options: any) => onChange(options.value)}
                            />
                        )}
                    />
                </PageSearch></>
            </form>
        </FormProvider >
    )

}

export default SearchForm