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
import { SP_SendEmail, SP_GetReportData } from "../data";
import { AnyMxRecord } from "dns";
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  cust_code?: string;
  cust_nm?: string;
  bk_id?: string;
  initData?: any | null;
  callbacks?: Array<() => void>;
  ref?: any | null;
};

type MailSample = {
  subject: string;
  content: string;
  attachment: {
    bknote: boolean;
    deliv_request: boolean;
    cust_identification: boolean;
  };
};


const Modal: React.FC<Props> = ({ ref = null, bk_id, cust_code, cust_nm, initData, callbacks }) => {
  const gridRef = useRef<any | null>(ref);
  const { dispatch, objState } = useAppContext();
  const { isMailSendPopupOpen: isOpen, MselectedTab } = objState;

  const { t } = useTranslation();
  const { data : transMailData, refetch: transMailRefetch, remove :transMailRemove } = useGetData({bk_id: bk_id, cust_code:cust_code}, '', SP_GetMailSample, {enabled:false});
  const [mailform, setMailForm] = useState<MailSample>({
    subject:'',
    content:'',
    attachment: {
      bknote:false,
      deliv_request: false,
      cust_identification:false,
    },
  });

  const { Create: sendEmail } = useUpdateData2(SP_SendEmail, '');
  const { Create: GetReportData } = useUpdateData2(SP_GetReportData, 'GetReportData');

  useEffect(() => {
    if(isOpen){
      transMailRefetch()    
    }
}, [transMailRefetch,isOpen]);

  useEffect(()=>{
    log('bk_id, cust_code', bk_id, cust_code, isOpen, transMailData)
    if(isOpen && transMailData){
      // setMailForm(
        //   {...mailform,
        //    ...((transMailData as string[]) as unknown as gridData).data[0] 
        //   })
        setMailForm((prevMailform) => ({
          ...prevMailform,
          ...((transMailData as string[]) as unknown as gridData).data[0],
        }));
    }
  },[transMailData,isOpen])


  const closeModal = () => {
    if (callbacks?.length) callbacks?.forEach((callback) => callback());
    dispatch({ isMailSendPopupOpen: false });
    //reset();
  };

  const methods = useForm({
    defaultValues: {},
  });

  const { handleSubmit, reset, setFocus, getValues } = methods;

  const handleFileDrop = (data: any[], header: string[]) => {
    log('data, header', data, header)
  };
    
  const sendTransPortEmail = useCallback(async () => {

    const attachments = [
      { key: 'bknote', type: 0 },
      { key: 'deliv_request', type: 1 },
      { key: 'cust_identification', type: 2 }
    ];
    for (const attachment of attachments) {
      const attachmentValue = mailform?.attachment?.[attachment.key as keyof typeof mailform.attachment] ?? false; // 타입 단언 사용

    //첨부파일(체크박스) 체크된경우
    if (attachmentValue) {
        try {
          await GetReportData.mutateAsync({ type: attachment.type, bk_id: bk_id }, {
            onSuccess: (data) => {
              console.log(` 성공 (type: ${attachment.type}):`, data);
            },
            onError: (error) => {
              console.error(` 실패 (type: ${attachment.type}):`, error);
            }
          });
        } catch (error) {
          log(error)
        }
      }
      
      // 2.업로드파일 서버생성
      // 1,2 서버경로 리턴하여 attachment에 key, value 쉼표구분으로 데이터 insert
      // 3. sendEmail 실행
      await sendEmail.mutateAsync({...mailform, pgm_code: TRANPOSRT_EMAIL_LIST_OE + cust_code}, {
        onSuccess(data, variables, context) {
        },
      })
      .catch(() => {});

    }

  }, [mailform, bk_id, GetReportData]);


  // const handleCheckBoxClick = (id : string, val : any) => {
  //      setMailForm((prevState) => ({
  //     ...prevState,
  //     [id]: val,
  //   }));
  // }
  const handleCheckBoxClick = (id: string, val: any) => {
    log('Checkbox clicked', id, val);
     // 'Y'이면 true, 'N'이면 false로 변환
    const booleanVal = val === 'Y';
    if(booleanVal){
      //val === true ? 'Y'
      setMailForm((prevState) => {
        const updatedAttachment = {...prevState.attachment,[id]: val};
        return {...prevState,attachment: updatedAttachment  };
      });
    }
  };
  

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
