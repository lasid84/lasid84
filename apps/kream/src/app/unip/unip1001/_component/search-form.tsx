'use client'

import React, { useState, useEffect, Dispatch, useContext, memo, useTransition, KeyboardEvent, useRef } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { shallow } from "zustand/shallow";
import { ReactSelect, data } from "@/components/select/react-select2";
import dayjs from "dayjs";
import { MaskedInputField } from "components/input";
import { toastError } from "@/components/toast";
import { useTranslation } from "react-i18next";
import RadioGroup from "@/components/radio/RadioGroup";
import Radio from "@/components/radio";
import RadioGroupField from "@/components/radio/mui/muiRadioGroup";

const { log } = require("@repo/kwe-lib/components/logHelper");

export interface typeloadItem {
  data: {} | undefined
}
type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

// export function SearchForm({searchParams, dispatch}) {
const SearchForm = memo(({ loadItem }: any) => {

  const { t } = useTranslation();
  const { dispatch, objState } = useAppContext();
  const { searchParams } = objState;
  const { getValues, setFocus, handleSubmit, reset, trigger } = useFormContext();
  const [ blNoFocus, setBLNoFocus] = useState(false);
  const [ blyy, setBLYY ] = useState(getValues('blyy'));

  useEffect(() => {
    const params = getValues();
    dispatch({ searchParams: params, isMSearch: true });
  }, [])

  const onSearch = () => {
    const params = getValues();
    log("params", params)
    if (!params.blyy || !params.blno) {
      toastError(t("MSG_0173"));
      // setFocus("blno", { shouldSelect: true });
      return;
    }
    dispatch({ searchParams: params, isMSearch: true });
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      onSearch();
    }
  }

  const onReset = async () => {
    reset();
    const params = getValues();
    log("reset params", params)
    dispatch({ searchParams: params});
    setBLNoFocus(true);
  }

  const onChange = () => {
    
  }

  return (
        <PageSearchButton
          right={
            <>
              <Button id={"search"} onClick={onSearch} width='w-32'/>
              <Button id={"reset"} onClick={onReset} width='w-32'/>
            </>
          }>
          <div className={"col-span-1 border"}>
            {/* <RadioGroup id="search_gubn" >
              <Radio id ="search_gubn1" value="0" label="detail" defaultChecked={getValues('search_gubn')=== "0"}/>
              <Radio id ="search_gubn2" value="1" label="summary" defaultChecked={getValues('search_gubn')=== "1"} />
            </RadioGroup> */}
            <RadioGroupField
              id="search_gubn"
              dataSrc={[
                { value : '0', label:'detail'},
                { value : '1', label:'summary'}
              ]}
            />
          </div>
          <MaskedInputField id="blyy"  label="blyy" value={searchParams.blyy} options={{ textAlign: 'center', inline: true, noLabel: false, limit:4 }} width="w-20" height='h-8' />
          <div className={"col-span-3"}>
          <MaskedInputField id="blno" label="house_bl_no" value={getValues('blno')} options={{ textAlign: 'center', inline: true, noLabel: false }} height='h-8' isFocus={blNoFocus}
            events={{
              onKeyDown: handleKeyDown,
              onFocus(e) {
                  e.target.select();
                  setBLNoFocus(false);
              },
            }}
          />
          </div>
        </PageSearchButton>
      // </form>
  );
});


export default SearchForm