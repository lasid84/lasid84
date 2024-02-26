import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import { zodResolver } from "@hookform/resolvers/zod";
import PageSearch from "../../../../shared/tmpl/page-search"
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useEffect, useState, useCallback, memo } from "react"
import Select from "react-select"
import { TInput2, TSelect2, TCancelButton, TSubmitButton } from "components/form";
import { useAppContext } from "@/components/provider/contextProvider";
import { SEARCH } from "./model"
import { useUserSettings } from "@/states/useUserSettings";

const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
    numericData: any,
    textData: string,
    cursorData: string[],
}

export interface typeloadItem {
    data: {} | undefined
}

// export interface Props {
//     onSubmit: SubmitHandler<any>;
//     loadItem: typeloadItem;
// }

export const stnd0005SearchSchema = z.object({
    grp_cd: z.coerce.string(),
})

// stnd0005검색스키마 선언
export const formSchema = stnd0005SearchSchema
// stnd0005검색스키마 타입선언
export type FormType = z.infer<typeof stnd0005SearchSchema>

type Props = {
    loadItem: any | null
}

const SearchForm: React.FC<Props> = (props) => {    
  const { loadItem } = props;
    //const SearchForm = memo(({loadItem}:any) => {
    // 다국어
    const { t } = useTranslation();
    z.setErrorMap(makeZodI18nMap({ t }));

    const methods = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: { grp_cd: 'ALL' }
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


    const { dispatch, needSearch } = useAppContext()

    const [groupcd, setGroupcd] = useState([])

    useEffect(() => {
        if (loadItem) {
            console.log('llllllllllllllllllllloadItem', loadItem[0])
            setGroupcd(loadItem[0])
            onSubmit();
        }
    }, [loadItem])

    const onSubmit = () => {
        const params = getValues()
        console.log('parammmmmmmmmmmmmmmmmmms', params)
        dispatch({ type: SEARCH, params: params })
    }


    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <><PageSearch
                    // right={
                    //     <TSubmitButton label={t("search")} />
                    // }
                    >
                    <label className="space-y-2">{t("grp_cd_nm")}</label>
                    <Controller
                        control={control}
                        name="grp_cd"
                        defaultValue={'defaultValues'}
                        render={({ field: { onChange, value, ref } }) => (
                            <Select
                                id="grp_cd"
                                inputId="grp_cd"
                                placeholder='ALL'
                                options={groupcd}
                                ref={ref}
                                //value={groupcd && groupcd.find((options: any) => options.value === value)}
                                // onChange={(options: any) => onChange(options.label)}
                                onChange={(selectedOption: any) => {
                                    onChange(selectedOption.label); // 선택된 옵션의 라벨로 grp_cd 필드 값 변경
                                    handleSubmit(onSubmit)(); // 폼 제출
                                }}
                            />
                        )}
                    />
                </PageSearch></>
            </form>
        </FormProvider >
    )

}

export default SearchForm