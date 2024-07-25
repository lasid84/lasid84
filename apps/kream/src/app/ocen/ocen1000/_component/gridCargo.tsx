
'use client';

import { useRef, memo, useEffect, useState } from "react";
import Grid, { rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import PageSearch from "layouts/search-form/page-search-row";
import { Button } from "components/button";
import { useAppContext } from "components/provider/contextObjectProvider";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { toastSuccess } from "components/toast"
import { SP_InsertCargo } from "./data";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    mainData: gridData
};

const GridCargo: React.FC<Props> = memo(({ mainData }: any) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertCargo, 'CHARGE');
    const [data, setData] = useState<any>();


    useEffect(() => {
        log("bkcargo maindata", mainData);
        if (mainData)
            //setCargoDetail((mainData?.[1] as gridData));
            //dispatch({ mSelectedRow: (mainData?.[0] as gridData).data[0] })
            dispatch({ mSelectedCargo: (mainData?.[1] as gridData).data[0] })
    }, [mainData])


    const gridOption: GridOption = {
        colVisible: { col: ["waybill_no", "piece", "pkg_type", "slac_stc", "stc_uom", "container_refno", "container_type", "seal_no", "description", "measurement", "measurement_uom", "gross_wt", "gross_uom", "volume_factor", "volume_wt", "charable_wt", "chargeable_uom", "commodity_cd", "dg_yn"], visible: true },
        gridHeight: "20vh",
        maxWidth: { "print": 40, "sort_id": 60, "trans_type": 60 },
        minWidth: { "charge_code": 150, "charge_desc": 300, "invoice_wb_amt": 110, "invoice_charge_amt": 110, "actual_cost_amt": 110, "vendor_id": 110, "vendor_ref_no": 150 },
        dataType: { "invoice_wb_amt": "number", "invoice_charge_amt": "number", "actual_cost_amt": "number" },
        editable: ["charge_code", "charge_desc", "sort_id", "import_export_ind", "ppc_ind", "invoice_wb_amt", "invoice_wb_currency_code", "invoice_charge_amt", "actual_cost_amt", "cost_currency_code", "vendor_id", "vendor_ref_no", "print_ind", "vat_cat_code_ap"],
        isShowFilter: false,
        isAutoFitColData: false,
        isEditableOnlyNewRow: true,
    };

    const onSave = () => {
        var hasData = false;
        gridRef.current.api.forEachNode((node: any) => {
            var data = node.data;
            if (data['__changed']) {
                log("onSave - ", data, objState);
                Create.mutate(data)
                    ;
                // node.setDataValue('__changed', false);
                // data['__changed'] = false;
                hasData = true;
            }
        });
        // log("onSave", gridRef.current.api, modifiedRows);
        if (hasData) toastSuccess('Success.');

    };

    return (
        <>
            <PageSearch
                right={
                    <>
                        <Button id={"add"} onClick={() => rowAdd(gridRef.current, { 'bk_id': objState.MselectedTab, })} width="w-15" />
                        <Button id={"save"} onClick={onSave} width="w-15" />
                    </>
                }>
                <></>
            </PageSearch>
            <Grid
                gridRef={gridRef}
                listItem={mainData?.[1] as gridData}
                options={gridOption}
                event={{
                }}
            />
             <Grid
                gridRef={gridRef}
                listItem={mainData?.[1] as gridData}
                options={gridOption}
                event={{
                }}
            />
        </>
    );
});

export default GridCargo;