'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button, ICONButton } from 'components/button';
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import Modal from "components/ufs-interface/popupInterface";
import { SCRAP_UFSP_PROFILE_CUSTOMER } from "components/ufs-interface/_component/data"

import { log, error } from '@repo/kwe-lib-new';

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

// export function SearchForm({searchParams, dispatch}) {
const SearchForm = memo(({ loadItem }: any) => {

  const { dispatch } = useAppContext();
  const { getValues } = useFormContext();

  // //Set select box data
  const [carriertype, setCarrierType] = useState<any>()

  useEffect(() => {
    if (loadItem?.length) {
      setCarrierType(loadItem[0])
      onSearch();
    }
  }, [loadItem?.length])


  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    dispatch({ searchParams: params, isMSearch: true });
  }

  const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }

  return (
    <>
      <PageSearchButton
        right={
          <>
            <Button id={"search"} onClick={onSearch} width="w-32"/>
            <Button id={"interface"} onClick={onInterface} width="w-32"/>
            {/* <Button id={"add"} onClick={onInterface} width="w-44" /> */}
          </>
        }>
        <></>
      </PageSearchButton>
      <Modal pgm_code={SCRAP_UFSP_PROFILE_CUSTOMER}/>
    </>
  );
});


export default SearchForm