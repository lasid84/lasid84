'use client'
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {PageContent} from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { useAppContext } from "components/provider/contextObjectProvider";
import dayjs from 'dayjs'
import GridCharges from './gridCharges'
import GridHouses from "./gridHouses";
import GridInvoices from "./gridInvoices";
import GridManifests from "./gridManifests";
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

  const { dispatch, objState } = useAppContext();

  // //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

  const methods = useForm({
    defaultValues: {
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
  const [charges, setChargesDetail] = useState<gridData>({})
  const [houses, setHousesDetail] = useState<gridData>({})
  const [manifests, setManifestsDetail] = useState<gridData>({})
  const [invoices, setInvoicesDetail] = useState<girdData>({})

  useEffect(() => {
    if (loadItem?.length) {
      onSearch();
    }
  }, [loadItem?.length])

  const onSearch = () => {
    // const params = getValues()
    // log("onSearch", params)
  }

  useEffect(() => {
    if (mainData) {
      setChargesDetail(mainData?.[5] as gridData)
      setHousesDetail(mainData?.[6] as gridData)
      setManifestsDetail(mainData?.[7] as gridData)
      setInvoicesDetail(mainData?.[8] as gridData)
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
          title={<span className="w-full px-1 py-1 text-blue-500">Houses</span>}>
          <div className="col-span-6">
            <GridHouses loadData={houses} />
          </div>
        </PageContent>

        <PageContent
          title={<span className="w-full px-1 py-1 text-blue-500">Manifests</span>}>
          <div className="col-span-6">
            <GridManifests loadData={manifests} />
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