import { useAppContext } from "components/provider/contextObjectProvider";
import { useEffect, useReducer, useMemo, useCallback, useRef, memo } from "react";
import { TInput2 } from "components/form/input-row"
import { MaskedInputField, Input } from 'components/input';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageContent from "layouts/search-form/page-content"
import { useState } from "react"
import Tab, { tab } from "components/tab/tab"
import { DateInput, DatePicker } from 'components/date'
import { Button } from 'components/button';

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

    const onClick = (e:any) => {
        log("onClick~~~~~~~~~~~~~~~~~~~~~~~~~", e);
      }

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
                        left={<Tab tabList={tab} onClickTab={handleOnClickTab} />
                        }
                        right={<>
                        <Button id="save" disabled={false} onClick={onClick}/>
                        <Button id="new" disabled={false} onClick={onClick}/>
                        </>
                            }>
                        <div className={`flex flex-col w-full h-[400px] ${selectedTab == "NM" ? "" : "hidden"}`}>
                            <div className=" md:grid md:grid-cols-5 overflow-y-auto">
                                <div className={"p-1 col-span-2"}>
                                    <MaskedInputField id="trans_mode" value={objState.mSelectedDetail?.trans_mode} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="invoice_no" value={objState.mSelectedDetail?.invoice_no} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="apply_to_invoice" value={objState.mSelectedDetail?.apply_to_invoice} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <DatePicker id={"invoice_dd"} value={objState.mSelectedDetail?.invoice_dd} options={{ isReadOnly: true, inline: true, textAlign: 'center', freeStyles: "underline border-1 border-slate-300" }} height="h-6" />
                                    <DatePicker id={"confirm_dd"} value={objState.mSelectedDetail?.invoice_dd} options={{ isReadOnly: true, inline: true, textAlign: 'center', freeStyles: "underline border-1 border-slate-300" }} height="h-6" />
                                    <MaskedInputField id="invoice_type" value={objState.mSelectedDetail?.invoice_type} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="ccn_type" value={objState.mSelectedDetail?.ccn_type} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="mbl_no" value={objState.mSelectedDetail?.mbl_no} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="hbl_no" value={objState.mSelectedDetail?.hbl_no} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <DatePicker id={"on_board_dd"} value={objState.mSelectedDetail?.on_board_dd} options={{ inline: true, textAlign: 'center', freeStyles: "hover:bg-amber-200 underline border-1 border-slate-300  min-w-200 max-w-500" }} height="h-6" />
                                    <DatePicker id={"arrive_dd"} value={objState.mSelectedDetail?.arrive_dd} options={{ inline: true, textAlign: 'center', freeStyles: "hover:bg-amber-200 underline border-1 border-slate-300  min-w-200 max-w-500" }} height="h-6" />
                                    <MaskedInputField id="billto_code" value={objState.mSelectedDetail?.billto_code} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="billto_nm_kor" value={objState.mSelectedDetail?.billto_nm_kor} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="cust_tax_id" value={objState.mSelectedDetail?.cust_tax_id} options={{ isReadOnly: true, textAlign: 'center', inline: true, type:"bz_reg_no"}} height='h-6' />
                                    <MaskedInputField id="origin_port" value={objState.mSelectedDetail?.origin_port} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="freight_term" value={objState.mSelectedDetail?.freight_term} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="tax_no" value={objState.mSelectedDetail?.tax_no} options={{ isReadOnly: true, textAlign: 'center', inline: true, bgColor: 'bg-yellow-100' }} height='h-6' />
                                    <MaskedInputField id="billing_dd" value={objState.mSelectedDetail?.billing_dd} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />

                                </div>
                                <div className={"p-1 col-span-1"}>
                                    <MaskedInputField id="trans_type" value={objState.mSelectedDetail?.trans_type} options={{ isReadOnly: true, textAlign: 'center', inline: true, noLabel: true }} height='h-6' />
                                    <MaskedInputField id="invoice_sts" value={objState.mSelectedDetail?.invoice_sts} options={{ isReadOnly: true, textAlign: 'center', inline: true, noLabel: true }} height='h-6' />
                                    <MaskedInputField id="apply_to_sts" value={objState.mSelectedDetail?.apply_to_sts} options={{ isReadOnly: true, textAlign: 'center', inline: true, noLabel: true }} height='h-6' />
                                    <div className="h-12" />
                                    <MaskedInputField id="invoice_type2" value={objState.mSelectedDetail?.invoice_type2} options={{ isReadOnly: true, textAlign: 'center', inline: true, noLabel: true }} height='h-6' />
                                    <div className="h-12" />
                                    <MaskedInputField id="house_bl_type" value={objState.mSelectedDetail?.house_bl_type} options={{ isReadOnly: true, textAlign: 'center', inline: true, noLabel: true }} height='h-6' />
                                    <div className="h-12" />
                                    <div className="h-12" />
                                    <div className="h-6" />
                                    <MaskedInputField id="dest_port" value={objState.mSelectedDetail?.dest_port} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' lwidth='w-12' />
                                    <div className="h-6" />
                                    <MaskedInputField id="tax_seq2" value={objState.mSelectedDetail?.tax_seq2} options={{ isReadOnly: true, textAlign: 'center', inline: true, noLabel: true }} height='h-6' />

                                </div>
                                <div className={"p-1 col-span-2"}>
                                    <MaskedInputField id="invoice_curr" value={objState.mSelectedDetail?.invoice_curr} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="local_curr" value={objState.mSelectedDetail?.local_curr} options={{ isReadOnly: true, textAlign: 'center', inline: true }} height='h-6' />
                                    <MaskedInputField id="invoice_tot_amt" value={objState.mSelectedDetail?.invoice_tot_amt} options={{ isReadOnly: true, textAlign: 'right', inline: true ,type:"number", limit:7, isAllowDecimal:true, decimalLimit:2  }} height='h-6' />
                                    <MaskedInputField id="invoice_taxable" value={objState.mSelectedDetail?.invoice_taxable} options={{ isReadOnly: true, textAlign: 'right', inline: true  ,type:"number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="invoice_taxable1" value={objState.mSelectedDetail?.invoice_taxable1} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="invoice_taxable2" value={objState.mSelectedDetail?.invoice_taxable2} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="invoice_taxable3" value={objState.mSelectedDetail?.invoice_taxable3} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="invoice_non_taxable" value={objState.mSelectedDetail?.invoice_non_taxable} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="invoice_tot_vat" value={objState.mSelectedDetail?.invoice_tot_vat} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="exchg_rt" value={objState.mSelectedDetail?.exchg_rt} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="local_tot_amt" value={objState.mSelectedDetail?.local_tot_amt} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="local_taxable" value={objState.mSelectedDetail?.local_taxable} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="local_taxable1" value={objState.mSelectedDetail?.local_taxable1} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="local_taxable2" value={objState.mSelectedDetail?.local_taxable2} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="local_taxable3" value={objState.mSelectedDetail?.local_taxable3} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="local_non_taxable" value={objState.mSelectedDetail?.local_non_taxable} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                    <MaskedInputField id="local_total_vat" value={objState.mSelectedDetail?.local_total_vat} options={{ isReadOnly: true, textAlign: 'right', inline: true, type: "number", limit:7, isAllowDecimal:true, decimalLimit:2 }} height='h-6' />
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex flex-col w-full h-[400px] ${selectedTab == "DE" ? "" : "hidden"}`}>
                            <div className="px-5 py-5 md:grid md:grid-cols-5 overflow-y-auto">
                                <div className={"p-1 col-span-2"}>
                                    <MaskedInputField id="shipper_code" value={objState.mSelectedDetail?.shipper_code} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="consign_code" value={objState.mSelectedDetail?.consign_code} options={{ isReadOnly: true, inline: true }} height='h-6' />

                                </div>
                                <div className={"p-1 col-span-3"}>
                                    <MaskedInputField id="shipper_nm" value={objState.mSelectedDetail?.shipper_nm} options={{ isReadOnly: true, inline: true, noLabel: true }} height='h-6' />
                                    <MaskedInputField id="consign_nm" value={objState.mSelectedDetail?.consign_nm} options={{ isReadOnly: true, inline: true, noLabel: true }} height='h-6' />
                                </div>
                                <div className={"p-1 col-span-5"}>
                                    <MaskedInputField id="description" value={objState.mSelectedDetail?.description} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="vessel_nm" value={objState.mSelectedDetail?.vessel_nm} options={{ isReadOnly: true, inline: true, type: "date" }} height='h-6' />
                                </div>
                                <div className={"p-1 col-span-2"}>
                                    <MaskedInputField id="voyage_no" value={objState.mSelectedDetail?.voyage_no} options={{ isReadOnly: true, inline: true, type: "date" }} height='h-6' />
                                    <MaskedInputField id="carrier" value={objState.mSelectedDetail?.carrier} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="flight_no" value={objState.mSelectedDetail?.flight_no} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="free_house_term" value={objState.mSelectedDetail?.free_house_term} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="service_type" value={objState.mSelectedDetail?.service_type} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                </div>
                                <div className={"p-1 col-span-2"}>
                                    <div className="h-12" />
                                    <MaskedInputField id="tot_pieces" value={objState.mSelectedDetail?.tot_pieces} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_slac_stc" value={objState.mSelectedDetail?.tot_slac_stc} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_gross_wt" value={objState.mSelectedDetail?.tot_gross_wt} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_charge_wt" value={objState.mSelectedDetail?.tot_charge_wt} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="tot_volumn_wt" value={objState.mSelectedDetail?.tot_volumn_wt} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="uom_gross_wt" value={objState.mSelectedDetail?.uom_gross_wt} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="uom_charge_wt" value={objState.mSelectedDetail?.uom_charge_wt} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex flex-col h-[400px] overflow-auto ${selectedTab == "AD" ? "" : "hidden"}`}>
                            <div className="w-full md:grid md:grid-cols-5 overflow-y-auto">
                                <div className={"col-span-5"}>
                                    <MaskedInputField id="country_code" value={objState.mSelectedDetail?.country_code} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <div className="h-6" />
                                    <MaskedInputField id="billto_nm_eng" value={objState.mSelectedDetail?.billto_nm_eng} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="addr1_eng" value={objState.mSelectedDetail?.addr1_eng} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="addr2_eng" value={objState.mSelectedDetail?.addr2_eng} options={{ isReadOnly: true, inline: true, type: "date" }} height='h-6' />
                                    <MaskedInputField id="addr3_eng" value={objState.mSelectedDetail?.addr3_eng} options={{ isReadOnly: true, inline: true, type: "date" }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="city_nm_eng" value={objState.mSelectedDetail?.city_nm_eng} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="post_no" value={objState.mSelectedDetail?.post_no} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-5"}>
                                    <div className="h-6" />
                                    <MaskedInputField id="executive_nm" value={objState.mSelectedDetail?.executive_nm} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="bz_con" value={objState.mSelectedDetail?.bz_con} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="bz_item" value={objState.mSelectedDetail?.bz_item} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-5"}>
                                    <div className="h-6" />
                                    <MaskedInputField id="billto_nm_kor" value={objState.mSelectedDetail?.billto_nm_kor} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="addr1_kor" value={objState.mSelectedDetail?.addr1_kor} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="addr2_kor" value={objState.mSelectedDetail?.addr2_kor} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="addr3_kor" value={objState.mSelectedDetail?.addr3_kor} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <MaskedInputField id="city_nm_kor" value={objState.mSelectedDetail?.city_nm_kor} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                    <div className="h-6" />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="tel_no" value={objState.mSelectedDetail?.tel_no} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-2"}>
                                    <MaskedInputField id="fax_no" value={objState.mSelectedDetail?.fax_no} options={{ isReadOnly: true, inline: true }} height='h-6' />
                                </div>
                                <div className={"col-span-5"}>
                                    <div className="h-6" />
                                    <MaskedInputField id="remark" value={objState.mSelectedDetail?.remark} options={{ isReadOnly: true, inline: true }} height='h-6' />
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