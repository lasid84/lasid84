'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
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
  const { MselectedTab, mSelectedRow, popType } = objState

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
      //setCargoDetail((mainData?.[1] as gridData));
      dispatch({ mSelectedRow: (mainData?.[0] as gridData).data[0] })
  }, [mainData])


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">


        <PageContent
          title={<span className="px-1 py-1 text-blue-500">Cargo</span>}>
          <MaskedInputField id="svc_type" value={mSelectedRow?.svc_type} options={{ isReadOnly: false, textAlign: 'center', }} />
          <MaskedInputField id="movement_type" value={mSelectedRow?.movement_type} options={{ isReadOnly: false, textAlign: 'center', }} />
          <MaskedInputField id="commodity" value={mSelectedRow?.commodity} options={{ isReadOnly: false, textAlign: 'center', }} />
          <MaskedInputField id="strategic_yn" value={mSelectedRow?.strategic_yn} options={{ isReadOnly: false, textAlign: 'center', }} />
          <div className="col-start-1 col-end-6 "><TextArea id="cargo_remark" rows={1} cols={32} value={mSelectedRow?.cargo_remark} options={{ isReadOnly: false }} /></div>


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