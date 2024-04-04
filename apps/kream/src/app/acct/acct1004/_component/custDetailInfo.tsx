import { useAppContext } from "components/provider/contextObjectProvider";
import { useEffect, useReducer, useMemo, useCallback, useRef, memo } from "react";
import { TInput2 } from "components/form/input-row"
import { MaskedInputField, Input } from 'components/input';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageContent from "layouts/search-form/page-content"
import { useState } from "react"
import Tab, { tab } from "components/tab/tab"

const { log } = require('@repo/kwe-lib/components/logHelper');


export interface typeloadItem {
    data: {} | undefined
}
type Props = {
    loadItem: typeloadItem;
};


const CustomerDetail: React.FC = memo(({ loadItem }: any) => {

    const { dispatch, objState } = useAppContext();
    const { searchParams, isMSearch, mSelectedRow, mSelectedDetail } = objState;

    const formZodMethods = useForm({
        // resolver: zodResolver(formZodSchema),
        defaultValues: {
        },
    });


    const [tab, settab] = useState<tab[]>()
    const [selectedTab, setselectedTab] = useState<string>("NM");

    useEffect(() => {
        if (loadItem?.length) {
            log("loadItem", loadItem[14].data)
            settab(loadItem[14].data)
        }
    }, [loadItem?.length])
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = formZodMethods;

    const onFormSubmit: SubmitHandler<any> = useCallback((param) => { }, []);

    const handleOnClickTab = (code: any) => { setselectedTab(code) }

    useEffect(() => {
        if (objState.isMDSearch) {
            //mainRefetch();
        }
    }, [objState?.isMDSearch]);

    return (
        <FormProvider{...formZodMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="w-full flex space-y-2 flex-col gap-2">
                    <PageContent
                        title={<Tab tabList={tab} onClickTab={handleOnClickTab} />}>
                        <div className={`flex flex-col w-full h-[400px] ${selectedTab == "NM" ? "" : "hidden"}`}>
                            <div className=" md:grid md:grid-cols-5 overflow-y-auto">
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="trans_mode" value={objState.mSelectedDetail?.trans_mode} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="invoice_no" value={objState.mSelectedDetail?.invoice_no} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="apply_to_invoice" value={objState.mSelectedDetail?.apply_to_invoice} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="invoice_dd" value={objState.mSelectedDetail?.invoice_dd} options={{ inline: true, type: "date" }} height='h-6' />
                                    <MaskedInputField id="confirm_dd" value={objState.mSelectedDetail?.confirm_dd} options={{ inline: true, type: "date" }} height='h-6' />
                                    <MaskedInputField id="invoice_type" value={objState.mSelectedDetail?.invoice_type} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="ccn_type" value={objState.mSelectedDetail?.ccn_type} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="mbl_no" value={objState.mSelectedDetail?.mbl_no} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="hbl_no" value={objState.mSelectedDetail?.hbl_no} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="on_board_dd" value={objState.mSelectedDetail?.on_board_dd} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="arrive_dd" value={objState.mSelectedDetail?.arrive_dd} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="billto_code" value={objState.mSelectedDetail?.billto_code} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="billto_nm_kor" value={objState.mSelectedDetail?.billto_nm_kor} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="cust_tax_id" value={objState.mSelectedDetail?.cust_tax_id} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="origin_port" value={objState.mSelectedDetail?.origin_port} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="freight_term" value={objState.mSelectedDetail?.freight_term} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="tax_no" value={objState.mSelectedDetail?.tax_no} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="billing_dd" value={objState.mSelectedDetail?.billing_dd} options={{ inline: true }} height='h-6' />

                                </div>
                                <div className={"col-span-1"}>
                                    <MaskedInputField id="trans_type" value={objState.mSelectedDetail?.trans_type} options={{ inline: true, noLabel: true }} height='h-6' />
                                    <MaskedInputField id="invoice_sts" value={objState.mSelectedDetail?.invoice_sts} options={{ inline: true, noLabel: true }} height='h-6' />
                                    <MaskedInputField id="apply_to_sts" value={objState.mSelectedDetail?.apply_to_sts} options={{ inline: true, noLabel: true }} height='h-6' />
                                    <div className="h-12" />
                                    <MaskedInputField id="invoice_type2" value={objState.mSelectedDetail?.invoice_type2} options={{ inline: true, noLabel: true }} height='h-6' />
                                    <div className="h-12" />
                                    <MaskedInputField id="house_bl_type" value={objState.mSelectedDetail?.ccn_type} options={{ inline: true, noLabel: true }} height='h-6' />
                                    <div className="h-12" />
                                    <div className="h-12" />
                                    <div className="h-6" />
                                    <MaskedInputField id="dest_port" value={objState.mSelectedDetail?.mbl_no} options={{ inline: true }} height='h-6' />
                                    <div className="h-6" />
                                    <MaskedInputField id="tax_seq2" value={objState.mSelectedDetail?.house_bl_type} options={{ inline: true, noLabel: true }} height='h-6' />

                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="invoice_curr" value={objState.mSelectedDetail?.invoice_curr} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="local_curr" value={objState.mSelectedDetail?.local_curr} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="invoice_tot" value={objState.mSelectedDetail?.invoice_tot} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="invoice_amount" value={objState.mSelectedDetail?.invoice_amount} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="invoice_taxable1" value={objState.mSelectedDetail?.invoice_taxable1} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="invoice_taxable2" value={objState.mSelectedDetail?.invoice_taxable2} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="invoice_taxable3" value={objState.mSelectedDetail?.invoice_taxable3} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="invoice_non_taxable" value={objState.mSelectedDetail?.invoice_non_taxable} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="invoice_tot_vat" value={objState.mSelectedDetail?.invoice_tot_vat} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="exchg_rt" value={objState.mSelectedDetail?.exchg_rt} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="local_tot_amt" value={objState.mSelectedDetail?.local_tot_amt} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="local_taxable" value={objState.mSelectedDetail?.local_taxable} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="local_taxable1" value={objState.mSelectedDetail?.local_taxable1} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="local_taxable2" value={objState.mSelectedDetail?.local_taxable2} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="local_taxable3" value={objState.mSelectedDetail?.local_taxable3} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="local_non_taxable" value={objState.mSelectedDetail?.local_non_taxable} options={{ inline: true, type: "number" }} height='h-6' />
                                    <MaskedInputField id="local_total_vat" value={objState.mSelectedDetail?.local_total_vat} options={{ inline: true, type: "number" }} height='h-6' />
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex flex-col w-full h-[400px] ${selectedTab == "DE" ? "" : "hidden"}`}>
                            <div className=" md:grid md:grid-cols-5 overflow-y-auto">
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="shipper_code" value={objState.mSelectedDetail?.shipper_code} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="consign_code" value={objState.mSelectedDetail?.consign_code} options={{ inline: true }} height='h-6' />
                                    {/* <MaskedInputField id="description" value={objState.mSelectedDetail?.description} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="vessel_nm" value={objState.mSelectedDetail?.vessel_nm} options={{ inline: true, type: "date" }} height='h-6' />
                                    <MaskedInputField id="voyage_no" value={objState.mSelectedDetail?.voyage_no} options={{ inline: true, type: "date" }} height='h-6' />
                                    <div className="h-6" />
                                    <MaskedInputField id="carrier" value={objState.mSelectedDetail?.carrier} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="flight_no" value={objState.mSelectedDetail?.flight_no} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="free_house_term" value={objState.mSelectedDetail?.free_house_term} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="service_type" value={objState.mSelectedDetail?.service_type} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="freight_rt" value={objState.mSelectedDetail?.freight_rt} options={{ inline: true }} height='h-6' />
                                    <div className="h-6" />
                                    <MaskedInputField id="lc_no" value={objState.mSelectedDetail?.lc_no} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="shipment_no" value={objState.mSelectedDetail?.shipment_no} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="comm_invoice" value={objState.mSelectedDetail?.comm_invoice} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="po_no" value={objState.mSelectedDetail?.po_no} options={{ inline: true }} height='h-6' /> */}

                                </div>
                                <div className={"col-span-3"}>
                                    <MaskedInputField id="shipper_nm" value={objState.mSelectedDetail?.shipper_nm} options={{ inline: true, noLabel: true }} height='h-6' />
                                    <MaskedInputField id="consign_nm" value={objState.mSelectedDetail?.consign_nm} options={{ inline: true, noLabel: true }} height='h-6' />
                                    {/* <div className="h-12" />
                                    <MaskedInputField id="tot_pieces" value={objState.mSelectedDetail?.tot_pieces} options={{ inline: true }} height='h-6' />
                                    <div className="h-12" />
                                    <MaskedInputField id="tot_slac_stc" value={objState.mSelectedDetail?.tot_slac_stc} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_gross_wt" value={objState.mSelectedDetail?.tot_gross_wt} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_charge_wt" value={objState.mSelectedDetail?.tot_charge_wt} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_volumn_wt" value={objState.mSelectedDetail?.tot_volumn_wt} options={{ inline: true }} height='h-6' />
                                    <div className="h-12" /> */}
                                </div>
                                <div className={"col-span-5"}>
                                    <MaskedInputField id="description" value={objState.mSelectedDetail?.description} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="vessel_nm" value={objState.mSelectedDetail?.vessel_nm} options={{ inline: true, type: "date" }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="voyage_no" value={objState.mSelectedDetail?.voyage_no} options={{ inline: true, type: "date" }} height='h-6' />
                                    <MaskedInputField id="carrier" value={objState.mSelectedDetail?.carrier} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="flight_no" value={objState.mSelectedDetail?.flight_no} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="free_house_term" value={objState.mSelectedDetail?.free_house_term} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="service_type" value={objState.mSelectedDetail?.service_type} options={{ inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <div className="h-12" />
                                    <MaskedInputField id="tot_pieces" value={objState.mSelectedDetail?.tot_pieces} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_slac_stc" value={objState.mSelectedDetail?.tot_slac_stc} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_gross_wt" value={objState.mSelectedDetail?.tot_gross_wt} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_charge_wt" value={objState.mSelectedDetail?.tot_charge_wt} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_volumn_wt" value={objState.mSelectedDetail?.tot_volumn_wt} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="uom_gross_wt" value={objState.mSelectedDetail?.uom_gross_wt} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="uom_charge_wt" value={objState.mSelectedDetail?.uom_charge_wt} options={{ inline: true }} height='h-6' />
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex flex-col h-[400px] overflow-auto ${selectedTab == "AD" ? "" : "hidden"}`}>
                            <div className="w-full md:grid md:grid-cols-5 overflow-y-auto">
                                <div className={"col-span-5"}>
                                    <MaskedInputField id="country_code" value={objState.mSelectedDetail?.country_code} options={{ inline: true }} height='h-6' />
                                    <div className="h-6" />
                                    <MaskedInputField id="billto_nm_eng" value={objState.mSelectedDetail?.billto_nm_eng} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="addr1_eng" value={objState.mSelectedDetail?.addr1_eng} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="addr2_eng" value={objState.mSelectedDetail?.addr2_eng} options={{ inline: true, type: "date" }} height='h-6' />
                                    <MaskedInputField id="addr3_eng" value={objState.mSelectedDetail?.addr3_eng} options={{ inline: true, type: "date" }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="city_nm_eng" value={objState.mSelectedDetail?.city_nm_eng} options={{ inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="post_no" value={objState.mSelectedDetail?.post_no} options={{ inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-5"}>
                                    <div className="h-6" />
                                    <MaskedInputField id="executive_nm" value={objState.mSelectedDetail?.executive_nm} options={{ inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="bz_con" value={objState.mSelectedDetail?.bz_con} options={{ inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="bz_item" value={objState.mSelectedDetail?.bz_item} options={{ inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-5"}>
                                    <div className="h-6" />
                                    <MaskedInputField id="billto_nm_kor" value={objState.mSelectedDetail?.billto_nm_kor} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="addr1_kor" value={objState.mSelectedDetail?.addr1_kor} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="addr2_kor" value={objState.mSelectedDetail?.addr2_kor} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="addr3_kor" value={objState.mSelectedDetail?.addr3_kor} options={{ inline: true }} height='h-6' />
                                    <MaskedInputField id="city_nm_kor" value={objState.mSelectedDetail?.city_nm_kor} options={{ inline: true }} height='h-6' />
                                    <div className="h-6" />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="tel_no" value={objState.mSelectedDetail?.tel_no} options={{ inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="fax_no" value={objState.mSelectedDetail?.fax_no} options={{ inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-5"}>
                                    <div className="h-6" />
                                    <MaskedInputField id="remark" value={objState.mSelectedDetail?.remark} options={{ inline: true }} height='h-6' />
                                </div>
                            </div>
                        </div>
                    </PageContent>
                </div>
            </form>
        </FormProvider>
    );
})

export default CustomerDetail;