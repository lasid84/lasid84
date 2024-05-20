import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEffect, useState, useCallback, memo } from "react"
import { makeZodI18nMap } from "zod-i18n-map";
import { zodResolver } from "@hookform/resolvers/zod";

import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form"
import Select from "react-select"
import { TSelect2, TCancelButton, TSubmitButton, TButtonBlue, TButtonDarkgray } from "components/form";
import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";
// import { ReactSelect } from "components/select/react-select"
import { ReactSelect, data } from "@/components/select/react-select2";
import { ProgressBarWithText } from "@/components/progress-bars/progressbar";
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
    cursorData: []
    numericData: number;
    textData: string;
}

type Props = {
    initData: any | undefined;
}
const SearchForm = memo(({ loadItem }: any) => {
    // const { initData } = props;

    const { dispatch, objState } = useAppContext()
    const [groupcd, setGroupcd] = useState<any>()
    let selectoptions: any[] = []

    // 다국어
    const { t } = useTranslation();
    z.setErrorMap(makeZodI18nMap({ t }));

    const methods = useForm({
        defaultValues: { grp_cd: "ALL" }
    })

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
        if (loadItem?.length) {
            setGroupcd(loadItem[0])
            onSearch();
        }
    }, [loadItem?.length])

    const onSearch = () => {
        const params = getValues()
        log("onSearch_0005", params, getValues('grp_cd'));
        dispatch({ searchParams: params, isMSearch: true });
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSearch)} className="space-y-1">
                <PageSearchButton
                    right={
                        <>
                            <TButtonDarkgray label={t("search")} onClick={onSearch} />
                            <TCancelButton label={t("reset")} onClick={() => {
                                setFocus("grp_cd");
                                reset();
                            }} />
                        </>
                    }>
                    {/* <ReactSelect id="grp_cd" options={groupcd} inline={true}/> */}
                    <ReactSelect
                        id="grp_cd" label="grp_cd" dataSrc={groupcd as data}
                        options={{
                            keyCol: "grp_cd",
                            displayCol: ['grp_cd', 'grp_cd_nm'],
                            // inline:true,
                            // defaultValue: {label:'A Air', value:'A'}
                            defaultValue: getValues('grp_cd')
                        }}
                    />
                </PageSearchButton>
            </form>
        </FormProvider >
    )
})

export default SearchForm