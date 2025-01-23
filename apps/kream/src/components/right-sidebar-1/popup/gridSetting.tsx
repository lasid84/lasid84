import DialogBasic from "layouts/dialog/dialog";
import { useMemo, useState, useEffect, useCallback, memo, useRef } from "react";
import { Button } from "components/button";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "../store/store";
import Grid, { gridData, GridOption } from "components/grid/ag-grid-enterprise";
import CustomSelect from "@/components/select/customSelect";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { SP_InitMyColumnInfo } from "components/grid/ag-grid-enterprise/_component/data";
import { useConfigs } from "@/states/useConfigs";

import { log, error } from '@repo/kwe-lib-new';
import { RowNode } from "ag-grid-community";

type Props = {
};

const Modal: React.FC<Props> = () => {
  const gridRef = useRef<any | null>(null);
  const state = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);

  const configActions = useConfigs((state) => state.actions);
  const { Create: initMyColInfo } = useUpdateData2(SP_InitMyColumnInfo, "InitMyColumnInfo");

  const { t } = useTranslation();
  

  const gridOptions: GridOption = {
    gridHeight: "w-full",
    checkbox: ["visible"],
    colVisible: { col : ["user_id", "menu_code", "grid_id", "state"], visible:false },
    minWidth: {
      col_nm: 180,
      col_trans: 180,
    },
    dataType: {
      col_width: "number", seq:"number"
    },
    isShowRowNo: true,
    isAutoFitColData: false,
    isMultiSelect: false,
    editable: ["col_width", "visible", "seq"],
    isNoSaveColInfo: true
  };

  useEffect(() => {
    if (state.isPopupGridSettingOpen) {
      onSearch();
    }
  }, [state.selectedID, state.isPopupGridSettingOpen])

  
  const closeModal = async () => {
    actions.setState({isPopupGridSettingOpen:false, selectedID: null});
  };

  const onSearch = async () => {
    // const selectedID = 
    actions.getGridSettingDatas();
  }

  const onInit = async () => {
    const param = {
          id:'',
          state: ''
        }

    initMyColInfo.mutateAsync(param)
      .then(() => {
        configActions.setConfig({ gridInfo_Refresh: true });
        onSearch();
      })
    ;
  }

  const onSave = async () => {
    const api = gridRef.current.api;
      let col_nms = '';
      let col_widths = '';
      let col_visibles = '';
      const nodes: RowNode[] = [];
                  
      api.forEachNode((node: RowNode) => {
        nodes.push(node);
      });
      for (const node of nodes) {
        var data = node.data;

        col_nms += col_nms ? "," + data.col_nm : data.col_nm;
        col_widths += col_widths ? "," + data.col_width : data.col_width;
        col_visibles += col_visibles ? "," + data.visible : data.visible;
      }

      const params = {
        col_nms : col_nms,
        col_widths: col_widths,
        col_visibles: col_visibles
      }

      await actions.setGridInfo(params);
      onSearch();
  };

  return (
    <DialogBasic
      isOpen={state.isPopupGridSettingOpen}
      onClose={closeModal}
      title={t("gridsetting")}
      bottomRight={
        <>
          <Button id={"reset"} onClick={onInit} width="w-20" />
          <Button id={"save"} onClick={onSave} width="w-20" />
          <Button id={"cancel"} onClick={closeModal} width="w-20" />
        </>
      }
    >
      <div className="flex flex-col w-[42rem] h-[35rem] gap-4">
        <CustomSelect
            id="grid_id"
            listItem={state.loadDatas?.[0]}
            valueCol={["grid_id"]}
            displayCol="grid_id"
            gridOption={{
              colVisible: { col: ["grid_id",], visible: true },
            }}
            gridStyle={{ width: '500px', height: '200px' }}
            style={{ width: '500px', height: "8px" }}
            defaultValue={state.selectedID || ''}
            isDisplay={true}
            isSelectRowAfterRender={true}
            events={{
              onSelectionChanged(e, id, val) {
                if (val != state.selectedID) actions.setSelectedGridID(val);
              },
            }}
          />
          
        <Grid
          id="popupGridSetting"
          gridRef={gridRef}
          listItem={state.mainDatas}
          options={gridOptions}
          event={{
          }}
        />
      </div>
    </DialogBasic>
  );
};

export default Modal;
