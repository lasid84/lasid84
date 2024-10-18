'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {PageContent} from "layouts/search-form/page-search-row";
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
    // log("onSearch_wbreferences", params);
    //dispatch({ searchParams: params, isMSearch: true });
  }


  useEffect(() => {
    if (mainData) {
      setData((mainData?.[0] as gridData).data[0]);
      setReferences((mainData?.[7] as gridData))
      setMilestones((mainData?.[8] as gridData))
    }
  }, [mainData])


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="space-y-1 w-full">
        <PageContent
          title={<span className="px-1 py-1 w-full text-blue-500">References</span>}>
          <div className="col-span-6">
            <GridReferences loadData={references} />
          </div>
        </PageContent>

        <PageContent
          title={<span className="px-1 py-1 w-full text-blue-500">Milestones</span>}>
          <div className="col-span-6">
            <GridMilestones loadData={milestones} />
          </div>
        </PageContent>
      </form>
    </FormProvider>
  );
});


export default WBReference