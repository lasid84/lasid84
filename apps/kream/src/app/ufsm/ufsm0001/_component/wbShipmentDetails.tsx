'use client'
import React, { useState, useEffect, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageSearch from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import ShipmentDetailGrid from "./gridShipDetail"
import GridFCharges from "./gridFCharges"
import { useAppContext } from "components/provider/contextObjectProvider";
import dayjs from 'dayjs'
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

const WBShipmentDetails = memo(({ loadItem, mainData }: any) => {
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


  const [shipmentDetail, setShipmentDetail] = useState<gridData>({});
  const [freightCharge, setFreightCharge] = useState<gridData>({});
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (loadItem?.length) {
      // log("=================", loadItem[0].data, loadItem[1].data)
      // setTransmode(loadItem[0])
      // setTranstype(loadItem[1])
      // setCustcode(loadItem[8])

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

  useEffect(() => {
    if (mainData) {
      setData((mainData?.[0] as gridData).data[0]);
      setShipmentDetail((mainData?.[3] as gridData))
      setFreightCharge((mainData?.[4] as gridData))
    }
  }, [mainData])


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageSearch
          title={<span className="w-full px-1 py-1 text-blue-500">Shipment Details & Freight</span>}>
          <div className="w-full flex col-span-6">
            <ShipmentDetailGrid loadData={shipmentDetail} />
          </div>
          <fieldset className="w-full flex border-solid border-2 p-1 space-y-1 space-x-1 col-span-6">
            <legend className="text-sx">Total</legend>
            <MaskedInputField id="pieces" value={data?.pieces} options={{ isReadOnly: true }} width="w-40" />
            <MaskedInputField id="pkg_type" value={data?.pkg_type} options={{ isReadOnly: true }} width="w-12" />
            <MaskedInputField id="volume" value={data?.volume} options={{ isReadOnly: true }} width="w-40" />
            <MaskedInputField id="uom" value={data?.uom} options={{ isReadOnly: true }} width="w-12" />
            <MaskedInputField id="gross_wt" value={data?.gross_wt} options={{ isReadOnly: true }} width="w-40" />
            <MaskedInputField id="uom" value={data?.uom} options={{ isReadOnly: true }} width="w-12" />
            <MaskedInputField id="volume_wt" value={data?.volume_wt} options={{ isReadOnly: true }} width="w-40" />
            <MaskedInputField id="uom" value={data?.uom} options={{ isReadOnly: true }} width="w-12" />
            <MaskedInputField id="chargeable_wt" value={data?.chargeable_wt} options={{ isReadOnly: true }} width="w-40" />
            <MaskedInputField id="uom" value={data?.uom} options={{ isReadOnly: true }} width="w-12" />
          </fieldset>
        </PageSearch>

        <PageSearch
          title={<span className="w-full px-1 py-1 text-blue-500">Freight Charge</span>}>
          <div className="col-span-6">
            <GridFCharges loadData={freightCharge} />
          </div>
          <div className="flex w-full col-span-1">

          </div>
        </PageSearch>
      </form>
    </FormProvider>
  );
});


export default WBShipmentDetails