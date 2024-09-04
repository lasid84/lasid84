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

type Props = {
  bkData:any;
  loadItem: any;
};

const BKCost = memo(({ loadItem, bkData }: Props) => {
  const { dispatch, objState } = useAppContext();
  const { MselectedTab, mSelectedRow, popType, mSelectedCargo, selectedobj } =
    objState;

  return (
      <div className="w-full">
        <PageContent
          title={
            <span className="px-1 py-1 text-lg font-bold text-blue-500">
              Cost
            </span>
          }
        >
          <div className="col-span-6">
            <GridCost initData={loadItem} bkData={bkData} />
          </div>
        </PageContent>
      </div>
  );
});

export default BKCost;
