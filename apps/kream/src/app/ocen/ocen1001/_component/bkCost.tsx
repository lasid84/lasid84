"use client";

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input, TextArea } from "components/input";
import {
  SEARCH_MD,
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import CustomSelect from "components/select/customSelect";
import { gridData } from "components/grid/ag-grid-enterprise";
import GridCost from "./gridCost";
import { ReactSelect, data } from "@/components/select/react-select2";
// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface typeloadItem {
  data: {} | undefined;
}

type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

const BKCost = memo(({ loadItem, mainData }: any) => {
  const { dispatch, objState } = useAppContext();
  const { MselectedTab, mSelectedRow, popType, mSelectedCargo, selectedobj } =
    objState;

  const methods = useForm({
    defaultValues: {},
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

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  };

  useEffect(() => {
    if (loadItem) {
    }
  }, [loadItem]);

  useEffect(() => {
    if (mainData)
      dispatch({ mSelectedRow: (mainData[0] as gridData)?.data[0] });
  }, [mainData]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <div className="flex flex-row w-full">
          <div className="flex w-full">
            <PageContent
              title={
                <span className="px-1 py-1 text-lg font-bold text-blue-500">
                  Cost
                </span>
              }
            >
              <div className="col-span-6">
                <GridCost initData={loadItem} />
              </div>
            </PageContent>
          </div>
        </div>
      </form>
    </FormProvider>
  );
});

export default BKCost;
