'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from 'components/input';
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from 'components/date'
import CustomSelect from "components/select/customSelect";
import { Button } from 'components/button';
import { gridData } from "components/grid/ag-grid-enterprise";
import Modal from "components/ufs-interface/popupInterface";
import PrintPopup from "./popup/waybillPrintPopup";
import { SCRAP_UFSP_MBL } from "components/ufs-interface/_component/data"

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

const SearchForm = ({ loadItem }: any) => {
  // const { loadItem } = props;

  // log("search-form 시작", Date.now());
  const { dispatch, objState } = useAppContext();
  const { getValues, handleSubmit } = useFormContext();
  const { trans_mode, trans_type, fr_date, to_date, wb_no, cust_code } = objState.searchParams;

  // //Set select box data
  const [transmode, setTransmode] = useState<any>();
  const [transtype, setTranstype] = useState<any>();
  const [custcode, setCustcode] = useState<any>();

  useEffect(() => {
    if (loadItem?.length) {
      setTransmode(loadItem[0])
      setTranstype(loadItem[1])
      setCustcode(loadItem[8])
      dispatch({ isFirstRender: false });
      if (objState.isFirstRender) { onSearch() }
    }
  }, [loadItem?.length])

  const onSearch = () => {
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true, mGridState: null });
  }

  const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }

  const onPrint = () => { dispatch({ crudType: crudType.CREATE, isPrintPopUpOpen: true }); }


  return (
    <>
      <form onSubmit={handleSubmit(onSearch)} className="flex pt-10 space-y-1">
        <PageSearchButton
          right={
            <>
              <div className={"col-span=1"}>
                <Button id="print" disabled={false} onClick={onPrint} />
              </div>
              <div className={"col-span-1"}>
                <Button id="search" disabled={false} onClick={onSearch} />
              </div>
              <div className={"col-span-1"}>
                <Button id="interface" disabled={false} onClick={onInterface} />
              </div>
            </>
          }>
          <div className={"col-span-1"}>
            <ReactSelect
              id="trans_mode" label="trans_mode" dataSrc={transmode as data}
              width='w-96' lwidth='w-20' height="8px"
              options={{
                keyCol: "trans_mode",
                displayCol: ['name'],
                inline: true,
                defaultValue: getValues('trans_mode')
              }}
            />

            <ReactSelect
              id="trans_type" label="trans_type" dataSrc={transtype as data}
              width='w-96' lwidth='w-20' height="8px"
              options={{
                keyCol: "trans_type",
                displayCol: ['name'],
                inline: true,
                defaultValue: getValues('trans_type')
              }}
            />
          </div>
          <div className={"col-span-1"}>
            <DatePicker id="fr_date" value={fr_date} options={{ inline: true, textAlign: 'center', freeStyles: "p-1 border-1 border-slate-300" }} lwidth='w-20' height="h-8" />
            <DatePicker id="to_date" value={to_date} options={{ inline: true, textAlign: 'center', freeStyles: "border-1 border-slate-300" }} lwidth='w-20' height="h-8" />
          </div>
          <div className={"col-span-2"}>
            <CustomSelect
              id="cust_code"
              initText='Select a Customer'
              listItem={custcode as gridData}
              valueCol={["cust_code", "cust_nm", "bz_reg_no"]}
              displayCol="cust_nm"
              gridOption={{
                colVisible: { col: ["cust_code", "cust_nm", "bz_reg_no"], visible: true },
              }}
              gridStyle={{ width: '600px', height: '300px' }}
              style={{ width: '1000px', height: "8px" }}
              isDisplay={true}
              inline={true}
            />
            <MaskedInputField id="wb_no" label="mwb_no" value={wb_no} options={{ textAlign: 'center', inline: true, noLabel: false }} height='h-8' />
            <MaskedInputField id="cust_nm" value={objState.searchParams?.cust_nm} options={{ textAlign: 'center', inline: true, noLabel: false, outerClassName: 'hidden' }} height='h-8' />
          </div>
        </PageSearchButton>
      </form>
      {
        /**
        * @dev
        * Interface 팝업
        * */
      }
      <Modal pgm_code={SCRAP_UFSP_MBL} />
      {
        /**
         * @dev
         * Waybill 프린트 팝업
         */
      }
      <PrintPopup />
    </>
  );
};


export default SearchForm