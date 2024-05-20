'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageSearch from "layouts/search-form/page-search-row";
import { useAppContext } from "components/provider/contextObjectProvider";
import { gridData } from "components/grid/ag-grid-enterprise";
import GridReferences from "./gridReferences";
import GridMilestones from "./gridMilestones";

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
  mainData : typeloadItem;
};

const WBReference = memo(({ loadItem, mainData }: any) => {

  const { dispatch, } = useAppContext();

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

  const [references, setReferences] = useState<gridData>({});
  const [milestones, setMilestones] = useState<gridData>({});
  const [data, setData] = useState<any>();


  useEffect(() => {
    if (mainData) {
      setData((mainData?.[0] as gridData).data[0]);
      setReferences((mainData?.[7] as gridData))
      setMilestones((mainData?.[9] as gridData))
    }
  }, [mainData])

  return (
    <FormProvider {...methods}>
      <form className="w-full space-y-1">
        <PageSearch
          title={<span className="w-full px-1 py-1 text-blue-500">References</span>}>
          <div className="col-span-6">
            <GridReferences loadData={references} />
          </div>
        </PageSearch>

        <PageSearch
          title={<span className="w-full px-1 py-1 text-blue-500">Milestones</span>}>
          <div className="col-span-6">
            <GridMilestones loadData={milestones} />
          </div>
        </PageSearch>
      </form>
    </FormProvider>
  );
});


export default WBReference