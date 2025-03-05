import { useEffect} from "react"
import { MaskedInputField } from "@/components/input";
import { useCommonStore } from "../_store/store";
import { log, error } from '@repo/kwe-lib-new';

const CustomerDetail: React.FC = () => {

    
  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
  const actions = useCommonStore((state) => state.actions);


    useEffect(() => {
        console.log("mainSelectedRow 변경됨:", mainSelectedRow);
      }, [mainSelectedRow]);

    return (
                <div className="flex flex-row gap-2 p-5 md:grid md:grid-cols-4">

                    <MaskedInputField 
                        id="cust_code" 
                        value={mainSelectedRow?.cust_code}
                        options = {{ 
                            isReadOnly:true,
                            freeStyles:"border-1 border-slate-300"
                        }}
                        />
                    <MaskedInputField 
                        id="cust_nm" 
                        value={mainSelectedRow?.cust_nm}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="cust_nm_eng" 
                        value={mainSelectedRow?.cust_nm_eng}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="settlement_type" 
                        value={mainSelectedRow?.settlement_type}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    <MaskedInputField 
                        id="tot_balance" 
                        value={mainSelectedRow?.tot_balance}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />
                    {/* <MaskedInputField 
                        id="bz_reg_no" 
                        value={objState.mSelectedRow?.data?.bz_reg_no}
                        options = {{ 
                            type:"bz_reg_no",
                            isReadOnly:true
                        }}
                        />             */}
                    <MaskedInputField 
                        id="total_insert" 
                        value={mainSelectedRow?.total_insert}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />    
                    <MaskedInputField 
                        id="total_refund" 
                        value={mainSelectedRow?.total_refund}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />    
                    <MaskedInputField 
                        id="total_adjust" 
                        value={mainSelectedRow?.total_adjust}
                        options = {{ 
                            isReadOnly:true
                        }}
                        />      
                </div>
          
    );
}

export default CustomerDetail;