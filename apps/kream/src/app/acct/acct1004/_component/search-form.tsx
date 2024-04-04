'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import dayjs from 'dayjs'

// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined
}


type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

const SearchForm = memo(({ loadItem }: any) => {
  // const { loadItem } = props;

  // log("search-form 시작", Date.now());
  const { dispatch, objState } = useAppContext();
  const [groupcd, setGroupcd] = useState<any>([])

  // //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

  const methods = useForm({
    defaultValues: {
      trans_mode: gTransMode || 'ALL',
      trans_type: gTransType || 'ALL',
      fr_date: dayjs().subtract(1, 'month').startOf('month').format("YYYY-MM-DD"),
      to_date: dayjs().subtract(1, 'month').endOf('month').format("YYYY-MM-DD"),
      no: '',
      cust_code: ''
    }
  });

  const {
    handleSubmit,
    reset,
    setFocus,
    setValue,
    getValues,
    register,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  // //Set select box data
  const [transmode, setTransmode] = useState<any>();
  const [transtype, setTranstype] = useState<any>();
  const [custcode, setCustcode] = useState<any>();

  useEffect(() => {
    if (loadItem?.length) {
      // log("=================", loadItem[0].data, loadItem[1].data)
      setTransmode(loadItem[0])
      setTranstype(loadItem[1])
      setCustcode(loadItem[8])

      onSearch();
      // onSubmit();
      // handleSubmit(onSubmit)();
    }
  }, [loadItem?.length])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="space-y-1">
        <PageSearch
          right={
            <>
              <TButtonBlue label={"search"} onClick={onSearch} />
              <TButtonBlue label={"createtax"} onClick={() => { }} />
              <TCancelButton label={"searchccn"} onClick={() => { }} />
              <TCancelButton label={"modifyVAT"} onClick={() => { }} />
            </>
          }>

          <ReactSelect
            id="trans_mode" label="trans_mode" dataSrc={transmode as data}
            options={{
              keyCol: "trans_mode",
              displayCol: ['name'],
              inline: true,
              // defaultValue: {label:'A Air', value:'A'}
              defaultValue: getValues('trans_mode')
            }}
          />
          <ReactSelect
            id="trans_type" label="trans_type" dataSrc={transtype as data}
            options={{
              keyCol: "trans_type",
              displayCol: ['name'],
              inline: true,
              defaultValue: getValues('trans_type')
            }}
          />
          {/* <ReactSelect
            id="cust_code" label="cust_code" dataSrc={custcode as data}
            options={{
              keyCol: "cust_code",
              displayCol: ['cust_nm'],
              inline: true,
              defaultValue: getValues('cust_code')
            }}
          /> */}
          <Input id="fr_date" type="date" inline={true} />
          <Input id="to_date" type="date" inline={true} />
          <Input id="no" name="bl/inv no." inline={true} />

        </PageSearch>
      </form>
    </FormProvider>
  );
});


export default SearchForm