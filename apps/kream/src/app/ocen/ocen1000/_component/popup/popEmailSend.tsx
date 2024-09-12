import DialogBasic from "layouts/dialog/dialog";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useCallback, useRef, memo, useState } from "react";
import { MaskedInputField, Input, TextArea } from "components/input";
import { useFormContext } from "react-hook-form";
import { useAppContext } from "components/provider/contextObjectProvider";
import { useTranslation } from "react-i18next";
import { FileUpload,AttFileUpload } from "components/file-upload";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { PageContentDivided } from "layouts/search-form/page-search-row";
import MailSend from "@/components/commonForm/mailSend";
import { Checkbox } from "@/components/checkbox";
import { Button } from "components/button";
import { SP_GetMailSample } from "components/commonForm/mailSend/_component/data";
import { TRANPOSRT_EMAIL_LIST_OE } from "components/commonForm/mailReceiver/_component/data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import { SP_SendEmail, SP_GetReportData } from "../data";
import Radio from "components/radio/index"
import RadioGroup from "components/radio/RadioGroup"
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  cust_code?: string;
  cust_nm?: string;
  bk_id?: string;
  initData?: any | null;
  callbacks?: Array<() => void>;
  ref?: any | null;
  loadItem?: any| null;
};

type MailSample = {
  subject: string;
  content: string;
  report: {
    bknote: boolean;
    deliv_request: boolean;
    cust_identification: boolean;
  };
  attachment:Attachment[]
};

interface Attachment {
  reportData: any;
  fileExtension: number;  // fileExtension은 Number가 아닌 number 타입으로 사용해야 합니다.
  templateType: number;
  fileName: any;
  pageDivide?: number | undefined;  // 선택적 값
}



const Modal: React.FC<Props> = ({loadItem, ref = null, bk_id, cust_code, cust_nm, initData, callbacks }) => {
  const gridRef = useRef<any | null>(ref);
  const { dispatch, objState } = useAppContext();
  const { isMailSendPopupOpen: isOpen, MselectedTab } = objState;

  const { t } = useTranslation();
  const { data : transMailData, refetch: transMailRefetch, remove :transMailRemove } = useGetData({bk_id: bk_id, cust_code:cust_code}, '', SP_GetMailSample, {enabled:false});
  const [reports, setReports] = useState<any>()
  const [mailform, setMailForm] = useState<MailSample>({
    subject:'',
    content:'',
    report: {
      bknote:false,
      deliv_request: false,
      cust_identification:false,
    },
    attachment:[]
  });

  const { Create: sendEmail } = useUpdateData2(SP_SendEmail, '');
  const { Create: GetReportData } = useUpdateData2(SP_GetReportData, 'GetReportData');



  useEffect(() => {
    if(isOpen){
      transMailRefetch()    
    }
}, [transMailRefetch,isOpen]);

  useEffect(()=>{
    if(loadItem){
      setReports(loadItem[21].data)
    }
  },[loadItem])

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


  const { getValues } = useFormContext();

  const handleFileDrop = (data: any[], header: string[]) => {
    log('file upload -data, header', data, header)

    const downloadData : Attachment= {
      "reportData" : data, 
      "fileExtension" : 0, 
      "templateType" : 0, 
      "fileName" : data[0].name, 
      "pageDivide" : 0
   };
   mailform.attachment.push(downloadData)  
    

  };

  const handleCheckBoxClick = (id: string, val: any) => {
    log('Checkbox clicked', id, val);
     // 'Y'이면 true, 'N'이면 false로 변환
    const booleanVal = val === 'Y';
    if(booleanVal){
      //val === true ? 'Y'
      setMailForm((prevState) => {
        const updatedAttachment = {...prevState.report,[id]: val};
        return {...prevState,report: updatedAttachment  };
      });
    }
  };
  

    
  const sendTransPortEmail = useCallback(async () => {
    const curData = getValues();
    // 1. Get Data
    for (const report of reports) {
      const attachmentValue = mailform?.report?.[report.key as keyof typeof mailform.report] ?? false; // 타입 단언 사용

    if (attachmentValue) {
        try {
          await GetReportData.mutateAsync({ type: report.report_type, bk_id: bk_id }, {
            onSuccess: (res:any) => {
              console.log(` 성공 (type: ${report.key}):`, res);

              let reportData : any = new Object;
              let pageDivide;
              for (let [key, value] of Object.entries(res[0].data[0])) {
                
                if (value === null || value === undefined) {value = ""}
    
                switch(key) {                
                  default:
                    reportData[key.toUpperCase()] = value;
                }
              }

              const templateType = Number(report.report_type);
              const fileExtension : number = Number(curData.search_gubn) || 0;    
              const fileName = loadItem[21].data[templateType-1].report_type_nm
    
              const downloadData : Attachment= {
                  "reportData" : reportData, 
                  "fileExtension" : fileExtension, 
                  "templateType" : templateType, 
                  "fileName" : fileName, 
                  "pageDivide" : pageDivide
              };              
                mailform.attachment.push(downloadData)              
            },
            onError: (error) => {
              console.error(` 실패 (type: ${report.key}):`, error);
            }
          });
        } catch (error) {
          log(error)
        }
      }           
    }
    
    // 2.업로드파일 서버생성

    // 3. 서버 파일업로드 경로받아 데이터 insert - attachment

    // 4. sendEmail 실행
    await sendEmail.mutateAsync({...mailform, pgm_code: TRANPOSRT_EMAIL_LIST_OE + cust_code}, {
      onSuccess(data, variables, context) {
      },
    })
    .catch(() => {});

  }, [mailform, bk_id, GetReportData]);


  return (

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
                <span className="px-1 py-1 text-sm text-blue-500">첨부파일</span>
              }
              addition={
                <AttFileUpload
                  onFileDrop={handleFileDrop}
                  isInit={objState.uploadFile_init}
                />
              }
            >
              <Checkbox
                id="bknote"
                //label="bknote"
                value={(mailform?.report?.bknote ? "Y" : "N")}
                options={{ inline: false }}
                events={{onChange: handleCheckBoxClick}}
              />
              <Checkbox
                id="deliv_request"
                //label="deliv_request"
                value={mailform?.report?.deliv_request ? "Y" : "N"}
                options={{ inline: false }}
                events={{onChange: handleCheckBoxClick}}
              />
              <Checkbox
                id="cust_identification"
                //label="cust_identification"
                value={mailform?.report?.cust_identification ? "Y" : "N"}
                options={{ inline: false }}
                events={{onChange: handleCheckBoxClick}}
              />

              <div className='row-span-1 row-start-2 px-1 mx-1 space-x-1 border rounded-full'>               
                  <RadioGroup label=''>
                      <Radio id ="search_gubn" name="download" value="0" label="excel" defaultChecked/>
                      <Radio id ="search_gubn" name="download" value="1" label="pdf" />
                  </RadioGroup>
                </div>
            </PageContentDivided>      
              
          </div>
        </div>
      </div>
    </DialogBasic>
  );
};

export default Modal;
