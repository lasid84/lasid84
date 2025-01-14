"use client";

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { PageContent } from "layouts/search-form/page-search-row";
import {
  SEARCH_MD,
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import GridCost from "./gridCost";

import { log, error } from '@repo/kwe-lib-new';

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
