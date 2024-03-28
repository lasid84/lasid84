import { useAppContext } from "components/provider/contextObjectProvider";
import { TInput2 } from "components/form/input-row"
import { useCallback } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageContent from "layouts/search-form/page-content"
import { useState } from "react"
import Tab from "components/tab/tab"

const CustomerDetail: React.FC = () => {

    const { dispatch, objState } = useAppContext();

    const formZodMethods = useForm({
        // resolver: zodResolver(formZodSchema),
        defaultValues: {
        },
    });

    type TypeTab = "NORMAL" | "DETAIL" | "ADDRESS"

    const TAB_LIST = [
        { cd_name: "NORMAL", code: "NORMAL" },
        { cd_name: "DETAIL", code: "DETAIL" },
        { cd_name: "ADDRESS", code: "ADDRESS" },
    ];


    const [selectedTab, setSelectedTab] = useState<string>("NORMAL");

    const {
        handleSubmit,
        reset,
        setFocus,
        setValue,
        resetField,
        getValues,
        formState: { errors },
        control,
    } = formZodMethods;

    const onFormSubmit: SubmitHandler<any> = useCallback((param) => {

    }, [objState.popType]);

    const handleOnClickTab = (code: any) => {
        setSelectedTab(code)
    }

    return (
        <FormProvider{...formZodMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="w-full flex flex-col gap-2">
                    <PageContent
                        title={<Tab tabList={TAB_LIST} onClickTab={handleOnClickTab} />}>
                        <div className={`flex flex-col w-full h-[341px] ${selectedTab == "NORMAL" ? "" : "hidden"}`}>
                            <div className=" md:grid md:grid-cols-5 overflow-y-auto">
                                <div className={"col-span-2"}>
                                    <TInput2 id="trans_mode" value={objState.mSelectedRow?.trans_mode}></TInput2>
                                    <TInput2 id="trans_type" value={objState.mSelectedRow?.trans_type} ></TInput2>
                                    <TInput2 id="invoice_no" value={objState.mSelectedRow?.invoice_no}></TInput2>
                                    <TInput2 id="invoice_sts" value={objState.mSelectedRow?.invoice_sts} ></TInput2>
                                    <TInput2 id="apply_to_invoice" value={objState.mSelectedRow?.apply_to_invoice}></TInput2>
                                    <TInput2 id="apply_to_sts" value={objState.mSelectedRow?.apply_to_sts}></TInput2>
                                    <TInput2 id="invoice_dd" value={objState.mSelectedRow?.invoice_dd}></TInput2>
                                    <TInput2 id="confirm_dd" value={objState.mSelectedRow?.confirm_dd}></TInput2>
                                    <TInput2 id="invoice_type" value={objState.mSelectedRow?.invoice_type} ></TInput2>
                                    <TInput2 id="ccn_type" value={objState.mSelectedRow?.ccn_type}></TInput2>
                                    <TInput2 id="mbl_no" value={objState.mSelectedRow?.mbl_no}></TInput2>
                                    <TInput2 id="hbl_no" value={objState.mSelectedRow?.hbl_no}></TInput2>
                                    <TInput2 id="house_bl_type" value={objState.mSelectedRow?.house_bl_type}></TInput2>
                                    <TInput2 id="on_board_dd" value={objState.mSelectedRow?.on_board_dd}></TInput2>
                                    <TInput2 id="arrive_dd" value={objState.mSelectedRow?.arrive_dd}></TInput2>
                                    <TInput2 id="billto_code" value={objState.mSelectedRow?.billto_code}></TInput2>
                                    <TInput2 id="billto_nm_kor" value={objState.mSelectedRow?.billto_nm_kor}></TInput2>
                                    <TInput2 id="cust_tax_id" value={objState.mSelectedRow?.cust_tax_id}></TInput2>
                                </div>
                                <div className={"col-span-1"}>
                                    <TInput2 id="trans_mode" value={objState.mSelectedRow?.trans_mode} nolabel={true}></TInput2>
                                    <TInput2 id="trans_type" value={objState.mSelectedRow?.trans_type} nolabel={true}></TInput2>
                                    <TInput2 id="invoice_no" value={objState.mSelectedRow?.invoice_no} nolabel={true}></TInput2>
                                    <TInput2 id="invoice_sts" value={objState.mSelectedRow?.invoice_sts}></TInput2>
                                    <TInput2 id="apply_to_invoice" value={objState.mSelectedRow?.apply_to_invoice}></TInput2>
                                    <TInput2 id="apply_to_sts" value={objState.mSelectedRow?.apply_to_sts} nolabel={true}></TInput2>
                                    <TInput2 id="invoice_dd" value={objState.mSelectedRow?.invoice_dd}></TInput2>
                                    <TInput2 id="confirm_dd" value={objState.mSelectedRow?.confirm_dd}></TInput2>
                                    <TInput2 id="invoice_type" value={objState.mSelectedRow?.invoice_type} nolabel={true}></TInput2>
                                    <TInput2 id="ccn_type" value={objState.mSelectedRow?.ccn_type}></TInput2>
                                    <TInput2 id="mbl_no" value={objState.mSelectedRow?.mbl_no}></TInput2>
                                    <TInput2 id="hbl_no" value={objState.mSelectedRow?.hbl_no}></TInput2>
                                    <TInput2 id="house_bl_type" value={objState.mSelectedRow?.house_bl_type}></TInput2>
                                    <TInput2 id="on_board_dd" value={objState.mSelectedRow?.on_board_dd}></TInput2>
                                    <TInput2 id="arrive_dd" value={objState.mSelectedRow?.arrive_dd} nolabel={true}></TInput2>
                                    <TInput2 id="billto_code" value={objState.mSelectedRow?.billto_code}></TInput2>
                                    <TInput2 id="billto_nm_kor" value={objState.mSelectedRow?.billto_nm_kor} nolabel={true}></TInput2>
                                    <TInput2 id="cust_tax_id" value={objState.mSelectedRow?.cust_tax_id}></TInput2>
                                </div>
                                <div className={"col-span-2"}>
                                    <TInput2 id="invoice_curr" value={objState.mSelectedRow?.invoice_curr}></TInput2>
                                    <TInput2 id="local_curr" value={objState.mSelectedRow?.local_curr}></TInput2>
                                    <TInput2 id="invoice_tot_amt" value={objState.mSelectedRow?.invoice_tot_amt}></TInput2>
                                    <TInput2 id="invoice_dd" value={objState.mSelectedRow?.invoice_dd}></TInput2>
                                    <TInput2 id="invoice_taxable" value={objState.mSelectedRow?.invoice_taxable}></TInput2>
                                    <TInput2 id="confirm_dd" value={objState.mSelectedRow?.confirm_dd}></TInput2>
                                    <TInput2 id="invoice_taxable" value={objState.mSelectedRow?.invoice_taxable}></TInput2>
                                </div>


                            </div>
                        </div>
                        <div className={`w-full flex flex-col w-full h-[341px] ${selectedTab == "DETAIL" ? "" : "hidden"}`}>
                            <TInput2
                                label="cust_code"
                                id="cust_code"
                                value={objState.mSelectedRow?.cust_code}
                            >
                            </TInput2>

                            <TInput2
                                label="bz_reg_no"
                                id="bz_reg_no"
                                value={objState.mSelectedRow?.bz_reg_no}
                            >
                            </TInput2>
                            <div className="col-span-2">
                                <TInput2
                                    label="addr1"
                                    id="addr1"
                                    value={objState.mSelectedRow?.addr1}
                                >
                                </TInput2>
                            </div>
                            <div className="col-span-2">
                                <TInput2
                                    label="addr1"
                                    id="addr1"
                                    value={objState.mSelectedRow?.addr1}
                                >
                                </TInput2>
                            </div>
                        </div>
                        <div className={`flex flex-col w-full h-[341px] overflow-auto ${selectedTab == "ADDRESS" ? "" : "hidden"}`}>
                            <div className={`flex w-full sm:grid sm:grid-cols-2
                          md:grid md:grid-cols-2 
                          lg:grid lg:grid-cols-2
                          xl:grid xl:grid-cols-2
                          2xl:grid 2xl:grid-cols-2`}>

                                {/* <div className={`flex flex-row w-full gap-1`}> */}
                                <TInput2
                                    label="cust_code"
                                    id="cust_code"
                                    value={objState.mSelectedRow?.cust_code}
                                >
                                </TInput2>
                                <TInput2
                                    label="executive_nm"
                                    id="executive_nm"
                                    value={objState.mSelectedRow?.executive_nm}
                                >
                                </TInput2>
                                <TInput2
                                    label="cust_nm"
                                    id="cust_nm"
                                    value={objState.mSelectedRow?.cust_nm}
                                >
                                </TInput2>
                                <TInput2
                                    label="bz_con"
                                    id="bz_con"
                                    value={objState.mSelectedRow?.bz_con}
                                >
                                </TInput2>
                                <TInput2
                                    label="cust_nm_eng"
                                    id="cust_nm_eng"
                                    value={objState.mSelectedRow?.cust_nm_eng}
                                >
                                </TInput2>
                                <TInput2
                                    label="bz_item"
                                    id="bz_item"
                                    value={objState.mSelectedRow?.bz_item}
                                >
                                </TInput2>
                                <TInput2
                                    label="bz_reg_no"
                                    id="bz_reg_no"
                                    value={objState.mSelectedRow?.bz_reg_no}
                                >
                                </TInput2>
                                <div className="col-span-2">
                                    <TInput2
                                        label="addr1"
                                        id="addr1"
                                        value={objState.mSelectedRow?.addr1}
                                    >
                                    </TInput2>
                                </div>
                                <div className="col-span-2">
                                    <TInput2
                                        label="addr1"
                                        id="addr1"
                                        value={objState.mSelectedRow?.addr1}
                                    >
                                    </TInput2>
                                </div>
                                {/* </div> */}

                            </div>

                        </div>
                        {/* </div> */}

                    </PageContent>

                </div>
            </form>
        </FormProvider>
    );
}

export default CustomerDetail;