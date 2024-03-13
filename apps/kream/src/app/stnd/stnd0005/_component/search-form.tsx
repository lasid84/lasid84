import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import { zodResolver } from "@hookform/resolvers/zod";
import PageSearch from "../../../../shared/tmpl/page-search"
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useEffect, useState, useCallback, memo } from "react"
import Select from "react-select"
import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { PopType, useAppContext } from "@/components/provider/contextProvider";
import { SEARCH, NEW, SELECTED_ROW } from "components/provider/contextProvider";
import { useUserSettings } from "@/states/useUserSettings";
import { StringifyOptions } from "querystring";

const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
    cursorData : []
    numericData : number;
    textData : string;
}

export interface typeloadItem {
    data: {} | undefined
}

type Props = {
    // onSubmit: SubmitHandler<any>;
    loadItem: typeloadItem | any
}

const SearchForm: React.FC<Props> = (props) => {
    const { loadItem } = props;

    const { dispatch } = useAppContext()
    const [groupcd, setGroupcd] = useState<any>([])
        let selectoptions:any[] = []
    //const SearchForm = memo(({loadItem}:any) => {
    // 다국어
    const { t } = useTranslation();
    z.setErrorMap(makeZodI18nMap({ t }));

    const methods = useForm({})

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

    useEffect(() => {

        if (loadItem) {
            loadItem[0].map((item:any) => {
                var key = item[Object.keys(item)[0]];
                var label = item[Object.keys(item)[1]];
                log(key, label)
                selectoptions.push({ value: key, label: key + " "+ label });
              })
            setGroupcd(selectoptions)
            onSearch();
        }
    }, [loadItem])

    const onSubmit = () => {
        const params = getValues()
    }

    const onSearch = () => {
        const params = getValues();
        log("onSearch", params)
        dispatch({ type: SEARCH, searchParams: params, isSearch: true });
    }

    const onNew = () => {
        // dispatch({ type: SELECTED_ROW, selectedRow: null});
        dispatch({ selectedRow: null, crudType: PopType.CREATE, isGridClick: true });
    }




    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <><PageSearch
                    right={
                        <>
                            <TButtonBlue label={t("search")} onClick={onSearch} />
                            <TButtonBlue label={t("new")} onClick={onNew} />
                            <TCancelButton label={t("reset")} onClick={() => {
                                setFocus("grp_cd");
                                reset();
                            }} />
                        </>
                    }
                >
                    <label className="space-y-2">{t("grp_cd")}</label>
                    <Controller
                        control={control}
                        name="grp_cd"
                        defaultValue={'ALL'}
                        render={({ field: { onChange, value, ref } }) => (
                            <Select
                                id="grp_cd"
                                inputId="grp_cd"
                                placeholder='ALL'
                                options={groupcd}
                                ref={ref}
                                value={groupcd && groupcd.find((options: any) => options.key === value)}                               
                                onChange={(selectedOption: any) => {
                                    console.log("afdsfdsfadsfasf",selectedOption)
                                    onChange(selectedOption.value); // 선택된 옵션의 라벨로 grp_cd 필드 값 변경
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