'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input,TextArea } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DateInput, DatePicker } from 'components/date'
import { gridData } from "components/grid/ag-grid-enterprise";
import GridCargo from './gridCargo'
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

const BKCargo = memo(({ loadItem, mainData }: any) => {

  const { dispatch, objState } = useAppContext();
  const [data, setData] = useState<any>();

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


  //Set select box data
  const [cargo, setCargoDetail] = useState<gridData>({})

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    log("maindata", mainData);
    if (mainData)
      setCargoDetail((mainData?.[0] as gridData).data[0]);
  }, [mainData])


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">


        <PageContent
          title={<span className="px-1 py-1 text-blue-500">Cargo</span>}>
          <MaskedInputField id="svc_type" value={data?.svc_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="movement_type" value={data?.movement_type} options={{ isReadOnly: true }} />
          <MaskedInputField id="commodity" value={data?.commodity} options={{ isReadOnly: true }} />
          <MaskedInputField id="strategic_yn" value={data?.strategic_yn} options={{ isReadOnly: true }} />
          <div className="col-start-1 col-end-6 "><TextArea id="cargo_remark" rows={1} cols={32} value={data?.cargo_remark} options={{ isReadOnly: true }} /></div>


        </PageContent>

        <div className="flex flex-row w-full">
          <div className="flex w-full">
            <PageContent
              title={<span className="w-full px-1 py-1 text-blue-500">Cargo Detail</span>}>
              <div className="col-span-6">
                <GridCargo loadData={cargo} />
              </div>
            </PageContent>
          </div>
        </div>


      </form>
    </FormProvider>
  );
});


export default BKCargo