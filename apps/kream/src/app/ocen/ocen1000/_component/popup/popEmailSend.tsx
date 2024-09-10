import DialogBasic from "layouts/dialog/dialog";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useCallback, useRef, memo, useState } from "react";
import { MaskedInputField, Input, TextArea } from "components/input";
import { useAppContext } from "components/provider/contextObjectProvider";
import { useTranslation } from "react-i18next";
import { FileUpload } from "components/file-upload";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { PageContentDivided } from "layouts/search-form/page-search-row";
import MailSend from "@/components/commonForm/mailSend";
import { Checkbox } from "@/components/checkbox";
import { Button } from "components/button";
import { SP_GetMailSample } from "components/commonForm/mailSend/_component/data";
import { TRANPOSRT_EMAIL_LIST_OE } from "components/commonForm/mailReceiver/_component/data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import { SP_SendEmail, SP_GetReportData } from "./data";
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  cust_code?: string;
  cust_nm?: string;
  bk_id?: string;
  initData?: any | null;
  callbacks?: Array<() => void>;
  ref?: any | null;
};

type MailSample ={
  subject : string;
  content : string;
  maillist : {};
  attachment?: {
    bknote: boolean;
    deliv_request : boolean;
    cust_identification : boolean;
  }
}

const Modal: React.FC<Props> = ({ ref = null, bk_id, cust_code, cust_nm, initData, callbacks }) => {
  const gridRef = useRef<any | null>(ref);
  const { dispatch, objState } = useAppContext();
  const { isMailSendPopupOpen: isOpen, MselectedTab } = objState;

  const { t } = useTranslation();
  const { data : mailData, refetch: mailRefetch, remove :mailRemove } = useGetData({bk_id: bk_id, cust_code:cust_code}, '', SP_GetMailSample, {enabled:true});
  const [mailform, setMailForm] = useState<MailSample>({
    subject:'',
    content:'',
    maillist : {},
    attachment: {
      bknote:false,
      deliv_request: false,
      cust_identification:false,
    },
  });

  const { Create: sendEmail } = useUpdateData2(SP_SendEmail, '');
  const { Create: GetReportData } = useUpdateData2(SP_GetReportData, 'GetReportData');

  useEffect(() => {
    mailRefetch()    
}, [mailRefetch]);

  useEffect(()=>{
    if(mailData){
      setMailForm(
        {...mailform,
         ...((mailData as string[]) as unknown as gridData).data[0] 
        })
    }
  },[mailData])


  const closeModal = () => {
    if (callbacks?.length) callbacks?.forEach((callback) => callback());
    dispatch({ isMailSendPopupOpen: false });
    reset();
  };

  const methods = useForm({
    defaultValues: {},
  });

  const { handleSubmit, reset, setFocus, getValues } = methods;

  const handleFileDrop = (data: any[], header: string[]) => {
    log('data, header', data, header)
  };


  const sendTransPortEmail = useCallback(async () => {
        // ※ in_type 		
        // - 0 : 부킹노트
        // - 1 : 운송요청서
        // - 2 : 고객발송용
        // 1.체크된 첨부파일 서버 생성
        GetReportData.mutateAsync({bk_id:bk_id}, {

        })
        // 2.업로드파일 서버생성

        // 1,2 서버경로 리턴하여 attachment에 쉼표구분으로 데이터 insert
        // 3. sendEmail 실행
        // await sendEmail.mutateAsync({...mailform, pgm_code: TRANPOSRT_EMAIL_LIST_OE + cust_code}, {
        //   onSuccess(data, variables, context) {
        //   },
        // })
        // .catch(() => {});


  }, [mailform, cust_code]);
    

  const handleCheckBoxClick = (id : string, val : any) => {
   log('2323', id, val)
       setMailForm((prevState) => ({
      ...prevState,
      [id]: val,
    }));
  }

  return (
    // <FormProvider{...methods}>
    <DialogBasic
      isOpen={isOpen}
      onClose={closeModal}
      title={t(TRANPOSRT_EMAIL_LIST_OE)}
      bottomRight={
        <>
          <Button id={"send"} onClick={sendTransPortEmail} width="w-32" />
          <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" />
        </>
      }
    >
      <div className="flex w-[82rem] h-[32rem] gap-4 ">
        <div className="flex w-1/3 h-full">
          {/* grid */}
          <MailSend
            ref={gridRef}
            pgm_code={TRANPOSRT_EMAIL_LIST_OE + cust_code} 
            title={cust_nm}
            params={{
              cust_code: objState[MselectedTab]?.shipper_id,
              pickup_type: objState.trans_mode + objState.trans_type,
            }}
          />
        </div>
        <div className="flex-col w-2/3">
          {/* TextArea */}
          {/* <div className="w-full"> */}
          <TextArea
            id="subject"
            rows={1}
            cols={32}
            value={mailform?.subject||''}
            options={{ isReadOnly: false }}
          />
          <TextArea
            id="content"
            rows={10}
            cols={32}
            value={mailform?.content||''}
            options={{ isReadOnly: false }}
          />
          {/* </div> */}
          {/* content */}
          <div className="flex w-full">
            {/* <div className='flex w-full'> */}
            <PageContentDivided
              title={
                <span className="px-1 py-1 text-sm text-blue-500">
                  첨부파일
                </span>
              }
              addition={
                <FileUpload
                  onFileDrop={handleFileDrop}
                  isInit={objState.uploadFile_init}
                />
              }
            >
              <Checkbox
                id="bknote"
                //label="bknote"
                value={(mailform?.attachment?.bknote ? "Y" : "N")}
                options={{ inline: false }}
                events={{onChange: handleCheckBoxClick}}
              />
              <Checkbox
                id="deliv_request"
                //label="deliv_request"
                value={mailform?.attachment?.deliv_request ? "Y" : "N"}
                options={{ inline: false }}
                events={{onChange: handleCheckBoxClick}}
              />
              <Checkbox
                id="cust_identification"
                //label="cust_identification"
                value={mailform?.attachment?.cust_identification ? "Y" : "N"}
                options={{ inline: false }}
                events={{onChange: handleCheckBoxClick}}
              />           
                    
            </PageContentDivided>       
              
          </div>
        </div>
      </div>
    </DialogBasic>
    // </FormProvider >
  );
};

export default Modal;
