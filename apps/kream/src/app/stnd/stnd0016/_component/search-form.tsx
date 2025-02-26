'use client'

import React, { useState, useEffect, Dispatch, useContext, memo, RefObject, useRef } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useCommonStore } from "../_store/store";
import CustomSelect from "@/components/select/customSelect";
import AutoCompleteSelct, { AutoCompleteSelectRef } from 'components/select/AutoCompleteSelect';

import { log, error } from '@repo/kwe-lib-new';
import { MaskedInputField } from "@/components/input";
import { set } from "lodash";

type Props = {
    // mGridRef: RefObject<AgGridReact>;
    // focusRef: RefObject<any>;
};

const SearchForm: React.FC<Props> = ({}) => {
  const { getValues, setValue, handleSubmit, reset } = useFormContext();
    
  const { loadDatas, selectedCustData, custDetailData, gridRef, dtdChargeRateData } = useCommonStore((state) => state);
  const { refDTDCustCharge, refFHCustCharge } = gridRef;
  const selectRef = useRef<AutoCompleteSelectRef>(null);
  const [ isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [ searchFilters, setSearchFilters ] = useState('');
  
  const { setState, resetSearchParam,  getLoad, getCustDetailDatas, setCustDetailDatas } = useCommonStore((state) => state.actions);

  const onSave = async () => {
    const params = getValues();
    log("onSave", params);
    setCustDetailDatas(params);
  }
  
  return (
      <form>
        <PageSearchButton
          right={
            <>
              {/* <div className={"col-span-1"}>
                <Button id="btnSearch" label="search" onClick={onSearch} />
              </div> */}
              <div className={"col-span-1"}>
                <Button id="btnSave" label="save"
                  toolTip="ShortCut: Ctrl+S"
                  disabled={!selectedCustData?.cust_code}
                  onClick={onSave} 
                  />
              </div>
            </>
          }
        >
          
          <div className={"col-span-2"}>
            {/* <CustomSelect
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
                  onSelectionChanged(e, id, value) {
                      // log("onSelectionChanged", e, id, value, );
                      const selectedRow = e.api.getSelectedRows()[0];
                      setValue(id, value);
                      setState({selectedCustData:selectedRow, selectedCharge:null});
                  },
                }}
              /> */}
              <MaskedInputField
                    id="cust_nm"
                    value={selectedCustData?.cust_nm}
                    // height={componetHeight}
                    options={{
                        isReadOnly: false,
                        inline:true
                    }}
                    events={{
                        onChange: (e) => {
                          if (!isCustomerOpen) setIsCustomerOpen(true);
                          // setSearchFilters(e.target.value);
                        },
                        onClick: () => {
                          if (!isCustomerOpen) setIsCustomerOpen(true);
                        }
                    }}
                />
              {isCustomerOpen 
              && <AutoCompleteSelct
                  value={searchFilters}
                  values={loadDatas?.[0].data}
                  ref={selectRef}
                  onClose={() => {
                    if (selectRef.current) setState({cust_code:selectRef.current.getValue()?.cust_code });
                    setIsCustomerOpen(false);
                    // setSearchFilters('');
                  }}
              />}
          </div>
        </PageSearchButton>
        </form>
    );
};

export default memo(SearchForm);