'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from 'components/input';
import PageSearch from "layouts/search-form/page-search-row";
import { Button } from "components/button";
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DateInput, DatePicker } from 'components/date'
import { gridData } from "components/grid/ag-grid-enterprise";
import GridCargo from './gridCargo'
import { ReactSelect, data } from "@/components/select/react-select2";
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

  const [svcType, setSvcType] = useState([])
  const [movement, setMovement] = useState([])

  //Set select box data
  const [cargo, setCargoDetail] = useState<gridData>({})

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  }

  useEffect(() => {
    log("maindata", mainData);
    if (mainData)
      setCargoDetail((mainData?.[1] as gridData));
  }, [mainData])

  useEffect(() => {
    if (loadItem) {
      log('loadItem',loadItem)
      setSvcType(loadItem[5])
      setMovement(loadItem[6])
    }
  }, [loadItem])


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">

        <PageContent
          title={<span className="px-1 py-1 text-lg font-bold text-blue-500">Cargo</span>}>
          <div className="col-span-6">
            <PageSearch
              right={
                <>
                  {/* <Button id={"delete"} width="w-15" /> */}
                </>}>
              <>
                <ReactSelect
                  id="svc_type" dataSrc={svcType as data}
                  options={{
                    keyCol: "svc_type",
                    displayCol: ['svc_type', 'svc_type_nm'],
                    defaultValue: data?.svc_type,
                    isAllYn: false
                  }}/>
                  <ReactSelect
                  id="movement_type" dataSrc={movement as data}
                  options={{
                    keyCol: "movement",
                    displayCol: ['movement', 'movement_nm'],
                    defaultValue: data?.movement_type,
                    isAllYn: false
                  }}/>

                <MaskedInputField id="commodity" value={data?.commodity} options={{ isReadOnly: false }} />
                <MaskedInputField id="strategic_yn" value={data?.strategic_yn} options={{ isReadOnly: false }} />
              </>
            </PageSearch>
                <div className="col-start-1 col-end-6 "><TextArea id="cargo_remark" rows={1} cols={32} value={data?.cargo_remark} options={{ isReadOnly: false }} /></div>
          </div>
        </PageContent>

        <div className="flex flex-row w-full">
          <div className="flex w-full">
            <PageContent
              title={<span className="w-full px-1 py-1 text-lg font-bold text-blue-500">Cargo Detail</span>}>
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