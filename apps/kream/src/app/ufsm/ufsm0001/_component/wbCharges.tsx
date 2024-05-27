'use client'
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {PageContent} from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { useAppContext } from "components/provider/contextObjectProvider";
import dayjs from 'dayjs'
import GridCharges from './gridCharges'
import GridInvoices from './gridInvoices'
import { gridData } from "components/grid/ag-grid-enterprise";

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
  mainData: typeloadItem;
};

const WBCharges = memo(({ loadItem, mainData }: any) => {
  // const { loadItem } = props;

  // log("search-form 시작", Date.now());
  const { dispatch, objState } = useAppContext();

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
  const [data, setData] = useState<any>()
  const [charges, setChargeDetail] = useState<gridData>({})
  const [invoices, setInvoiceDetail] = useState<gridData>({})

  useEffect(() => {
    if (loadItem?.length) {
      onSearch()

    }
  }, [loadItem?.length])

  const onSearch = () => {
    //const params = getValues();
    //log("onSearch_wbcharges", params);
    //dispatch({ searchParams: params, isMSearch: true });
  }

  useEffect(() => {
    if (mainData) {
      setChargeDetail(mainData?.[5] as gridData)
      setInvoiceDetail(mainData?.[6] as gridData)
    }
  }, [mainData])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageContent
          title={<span className="w-full px-1 py-1 text-blue-500">Charges</span>}>
          <div className="col-span-6">
          <GridCharges loadData={charges} />
          </div>
        </PageContent>

        <PageContent
          title={<span className="w-full px-1 py-1 text-blue-500">Invoices</span>}>
          <div className="col-span-6">
          <GridInvoices loadData={invoices} />
          </div>
        </PageContent>

      </form>
    </FormProvider>
  );
});


export default WBCharges