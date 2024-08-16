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
import GridCargo from "./gridCargo";
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

const BKCargo = memo(({ loadItem, mainData }: any) => {
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

  //Set select box data
  const [svctype, setSvcType] = useState<any>();
  const [movementtype, setMovementType] = useState<any>();

  const onSearch = () => {
    // const params = getValues();
    // log("onSearch", params, objState?.mSelectedRow);
  };

  useEffect(() => {
    if (loadItem) {
      setSvcType(loadItem[5]);
      setMovementType(loadItem[6]);
    }
  }, [loadItem]);

  useEffect(() => {
    log("bkcargo maindata", mainData);
    if (mainData)
      //setCargoDetail((mainData?.[1] as gridData));
      dispatch({ mSelectedRow: (mainData[0] as gridData)?.data[0] });
    //dispatch({ mSelectedCargo: (mainData?.[1] as gridData).data[0] })
  }, [mainData]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageContent
          title={
            <span className="px-1 py-1 text-lg font-bold text-blue-500">
              Cargo
            </span>
          }
        >
          <ReactSelect
            id="svc_type"
            dataSrc={svctype as gridData}
            options={{
              keyCol: "svc_type",
              displayCol: ["svc_type_nm"],
              defaultValue: mSelectedRow?.svc_type,
              isAllYn: false,
            }}
          />

          <ReactSelect
            id="movement_type"
            dataSrc={movementtype as gridData}
            options={{
              keyCol: "movement",
              displayCol: ["movement_nm"],
              defaultValue: mSelectedRow?.movement_type,
              isAllYn: false,
            }}
          />

          <MaskedInputField
            id="commodity"
            value={mSelectedRow?.commodity}
            options={{ isReadOnly: false, textAlign: "center" }}
          />
          <MaskedInputField
            id="strategic_yn"
            value={mSelectedRow?.strategic_yn}
            options={{ isReadOnly: false, textAlign: "center" }}
          />

        </PageContent>

        <div className="flex flex-row w-full">
          <div className="flex w-full">
            <PageContent
              title={
                <span className="px-1 py-1 text-lg font-bold text-blue-500">Cargo Detail</span>
              }
            >
              <div className="col-span-6">
                <GridCargo initData={loadItem} mainData={mainData} />
              </div>
            </PageContent>
          </div>
        </div>
        <PageContent
          title={<></>}
        >
          <div className="col-start-1 col-end-6 ">
            <TextArea
              id="cargo_remark"
              rows={8}
              cols={32}
              value={mSelectedRow?.cargo_remark}
              options={{ isReadOnly: false }}
            />
          </div>
        </PageContent>
      </form>
    </FormProvider>
  );
});

export default BKCargo;
