import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEffect, useState, useCallback, memo } from "react"
import { makeZodI18nMap } from "zod-i18n-map";
import { zodResolver } from "@hookform/resolvers/zod";
// import PageSearch from "../../../../shared/tmpl/page-search"
import PageSearch from "@/layouts/search-form/page-search-row"
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form"
import Select from "react-select"
import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue, TButtonDarkgray } from "components/form";
import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";


const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
    cursorData: []
    numericData: number;
    textData: string;
}


type Props = {
    // onSubmit: SubmitHandler<any>;
    initData: any | undefined;
}

const SearchForm: React.FC<Props> = (props) => {
    const { initData } = props;

    const { dispatch, objState } = useAppContext()
    const [groupcd, setGroupcd] = useState<any>([])
    let selectoptions: any[] = []
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
        if (initData) {
            initData[0].data.map((item: any) => {
                var key = item[Object.keys(item)[0]];
                var label = item[Object.keys(item)[1]];
                log(key, label)
                selectoptions.push({ value: key, label: key + " " + label });
            })
            setGroupcd(selectoptions)
            //onSearch();
        }
    }, [initData])


    const onSearch = () => {
        const params = getValues();
        log("onSearch", objState.isMSearch)
        dispatch({searchParams: params, isMSearch: true });
    }

    const onNew = () => {
        // dispatch({ type: SELECTED_ROW, selectedRow: null});
        dispatch(objState.push({ selectedRow: null, crudType: crudType.CREATE, isGridClick: true }));
    }


    return (
        <FormProvider {...methods}>
            <form>
            {/* onSubmit={handleSubmit(onSubmit)} */}
                <><PageSearch
                    right={
                        <>
                            <TButtonDarkgray label={t("search")} onClick={onSearch} />
                            <TCancelButton label={t("reset")} onClick={() => {
                                setFocus("grp_cd");
                                reset();
                            }} />
                            {/* <TButtonBlue label={t("new")} onClick={onNew} /> */}
                        </>
                    }
                >
                    <label className="px-1 py-1 text-align:right">{t("grp_cd")}</label>
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
                                    console.log("afdsfdsfadsfasf", selectedOption)
                                    onChange(selectedOption.value); // 선택된 옵션의 라벨로 grp_cd 필드 값 변경
                                    handleSubmit(onSearch)(); // 폼 제출
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