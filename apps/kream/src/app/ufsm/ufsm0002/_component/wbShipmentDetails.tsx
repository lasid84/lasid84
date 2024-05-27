'use client'
import React, { useState, useEffect, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
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
    if (mainData) {
      setData((mainData?.[0] as gridData).data[0]);
      setShipmentDetail(mainData?.[3] as gridData)
      setFreightCharge(mainData?.[4] as gridData)
    }
  }, [mainData])


  return (
    <FormProvider {...methods}>
      <form className="w-full space-y-1">
        <PageContent
          title={<span className="w-full px-1 py-1 text-blue-500">Shipment Details & Freight</span>}>
          <div className="flex w-full col-span-6">
            <ShipmentDetailGrid loadData={shipmentDetail} />
          </div>
          <fieldset className="flex w-full col-span-6 p-1 space-x-1 space-y-1 border-2 border-solid">
            <legend className="text-sx">Total</legend>
            <MaskedInputField id="num_pieces" value={data?.num_pieces} options={{ isReadOnly: true }} width="w-36" />
            <MaskedInputField id="packaging_form_code" value={data?.packaging_form_code} options={{ isReadOnly: true }} width="w-14" />
            <MaskedInputField id="volume" value={data?.volume} options={{ isReadOnly: true }} width="w-36" />
            <MaskedInputField id="volume_uom_code" value={data?.volume_uom_code} options={{ isReadOnly: true }} width="w-12" />
            <MaskedInputField id="gross_weight" value={data?.gross_weight} options={{ isReadOnly: true }} width="w-36" />
            <MaskedInputField id="gross_weight_uom_code" value={data?.gross_weight_uom_code} options={{ isReadOnly: true }} width="w-12" />
            <MaskedInputField id="volume_weight" value={data?.volume_weight} options={{ isReadOnly: true }} width="w-36" />
            <MaskedInputField id="volume_weight_uom_code" value={data?.volume_weight_uom_code} options={{ isReadOnly: true }} width="w-12" />
            <MaskedInputField id="chargeable_weight" value={data?.chargeable_weight} options={{ isReadOnly: true }} width="w-36" />
            <MaskedInputField id="chargeable_weight_uom_code" value={data?.chargeable_weight_uom_code} options={{ isReadOnly: true }} width="w-12" />
          </fieldset>
        </PageContent>

        <PageContent
          title={<span className="w-full px-1 py-1 text-blue-500">Freight Charge</span>}>
          <div className="col-span-6">
            <GridFCharges loadData={freightCharge} />
          </div>
          <div className="flex w-full col-span-1">

          </div>
        </PageContent>
      </form>
    </FormProvider>
  );
});


export default WBShipmentDetails