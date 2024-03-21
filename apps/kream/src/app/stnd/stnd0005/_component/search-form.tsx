import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEffect, useState, useCallback, memo } from "react"
import { makeZodI18nMap } from "zod-i18n-map";
import { zodResolver } from "@hookform/resolvers/zod";

import PageSearch from "@/layouts/search-form/page-search"
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form"
import Select from "react-select"
import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue, TButtonDarkgray } from "components/form";
import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";
import { ReactSelect} from "components/select/react-select"
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

const SearchForm: React.FC<Props> = (props) => {
    const { initData } = props;

    const { dispatch, objState } = useAppContext()
    const [groupcd, setGroupcd] = useState<any>([])
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
        if (initData) {
            initData[0].data.map((item: any) => {
                var key = item[Object.keys(item)[0]];
                var label = item[Object.keys(item)[1]];
                selectoptions.push({ value: key, label: key + " " + label });
            })
            setGroupcd(selectoptions)
            onSearch();
        }
    }, [initData])

    const onSearch = () => {
        const params = getValues()
        dispatch({ searchParams: params, isMSearch: true });
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSearch)}>
                <PageSearch
                    right={
                        <>
                            <TButtonDarkgray label={t("search")} onClick={onSearch} />
                            <TCancelButton label={t("reset")} onClick={() => {
                                setFocus("grp_cd");
                                reset();
                            }} />
                        </>
                    }>
                    <ReactSelect id="grp_cd" name="grp" options={groupcd} defaultValue={{ label: "ALL", value: "ALL" }} inline={true}/>
                </PageSearch>
            </form>
        </FormProvider >
    )
}

export default SearchForm