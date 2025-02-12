'use client'

import React, { useState, useEffect, Dispatch, useContext, memo, RefObject } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useCommonStore } from "../_store/store";
import CustomSelect from "@/components/select/customSelect";
import { rowAdd } from "@/components/grid/ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    mGridRef: RefObject<AgGridReact>;
    focusRef: RefObject<any>;
};

const SearchForm: React.FC<Props> = ({mGridRef, focusRef}) => {
  const { getValues, handleSubmit, reset } = useFormContext();
    
  const loadDatas = useCommonStore((state) => state.loadDatas);
  const mainDatas = useCommonStore((state) => state.mainDatas);
  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
  
  const { setState, resetSearchParam, getMainDatas, getLoad, setMainDatas } = useCommonStore((state) => state.actions);

  useEffect(() => {
    onSearch();
  }, [loadDatas])

  const onSearch = () => {
    const params = getValues();
    getMainDatas(params);
  };
  
  const onReset = () => {
    resetSearchParam();
    getLoad();
    setState({mainDatas:{...mainDatas, data:[]}});
  }

  const onAdd = async () => {
    if (mGridRef?.current) {
      var temp = await rowAdd(mGridRef.current, {  });
      setTimeout(() => {
        focusRef?.current.inputElement.focus();
      }, 200);

      log("onAdd", temp);
    }
  }

  const onSave = () => {
    const param = getValues();
    const newData = {
      ...mainSelectedRow,
      ...param
    }

    // log("onSave", newData, mainSelectedRow);
    setMainDatas( newData);
      // .then(() => {getMainDatas(param)});
  }
  
  return (
      <form>
        <PageSearchButton
          right={
            <>
              <div className={"col-span-1"}>
                <Button id="btnSearch" label="search" onClick={onSearch} />
              </div>
              <div className={"col-span-1"}>
                <Button id="btnAdd" label="add" onClick={onAdd} />
              </div>
              <div className={"col-span-1"}>
                <Button id="btnSave" label="save" onClick={onSave} />
              </div>
              {/* <div className={"col-span-1"}>
                <Button id="reset" disabled={false} onClick={onReset} />
              </div> */}
            </>
          }
        >
          
          <div className={"col-span-2"}>
            <CustomSelect
                id="search_cust_code"
                initText="Select an option"
                listItem={loadDatas?.[0]}
                valueCol={["cust_code", "cust_nm", "bz_reg_no"]}
                displayCol="cust_nm"
                gridOption={{
                  colVisible: {
                    col: ["cust_code", "cust_nm", "bz_reg_no"],
                    visible: true,
                  },
                }}
                gridStyle={{ width: "600px", height: "300px" }}
                style={{ width: "1000px", height: "8px" }}
                isDisplay={true}
                inline={true}
                events={{
                  onSelectionChanged: onSearch
                }}
              />
          </div>
        </PageSearchButton>
        </form>
    );
};


export default memo(SearchForm);