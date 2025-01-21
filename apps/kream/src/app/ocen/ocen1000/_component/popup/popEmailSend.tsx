import DialogBasic from "layouts/dialog/dialog";
import { useEffect, useCallback, useRef, memo, useState } from "react";
import { MaskedInputField, Input, TextArea } from "components/input";
import { useFormContext } from "react-hook-form";
import { useAppContext } from "components/provider/contextObjectProvider";
import { useTranslation } from "react-i18next";
import { FileUpload, AttFileUpload } from "components/file-upload";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { PageContentDivided } from "layouts/search-form/page-search-row";
import MailSend from "@/components/commonForm/mailSend";
import { Checkbox } from "@/components/checkbox";
import { Button } from "components/button";
import { SP_GetMailSample } from "components/commonForm/mailSend/_component/data";
import { TRANPOSRT_EMAIL_LIST_OE } from "components/commonForm/mailReceiver/_component/data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import { SP_SendEmail, SP_GetReportData, SP_DownloadReport, SP_UploadAttachment } from "../data";
import Radio from "components/radio/index"
import RadioGroup from "components/radio/RadioGroup"
import { useUserSettings } from "states/useUserSettings";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
  cust_code?: string;
  cust_nm?: string;
  bk_id?: string;
  initData?: any | null;
  callbacks?: Array<() => void>;
  ref?: any | null;
  loadItem?: any | null;
};

type MailSample = {
  subject: string;
  content: string;
  report: {
    // bknote: boolean;
    // deliv_request: boolean;
    // cust_identification: boolean;
    booking_note: boolean;
    transport_request: boolean;
    customer_dispatch: boolean;
    
  };
  attachment: Attachment[];
  add_folder_name: string;
  files: File[];
};

interface Attachment {
  reportData: any;
  fileExtension: number; // fileExtension은 Number가 아닌 number 타입으로 사용해야 합니다.
  templateType: number;
  fileName: any;
  pageDivide?: number | undefined;  // 선택적 값
};

type FileUploadData = {
  fileName: string;
  fileData: Buffer;
  fileRootDIR: string;
}

type FileUploadRequest = {
  addFolderName: string;
  files: FileUploadData[];
}

type ReportDownloadRequest = {
  responseType: number;
  fileExtension: number;
  reportDataList: any;
  templateTypeList: string[];
  fileNameList: string[];
}

const Modal: React.FC<Props> = ({loadItem, ref = null, bk_id, cust_code, cust_nm, initData, callbacks }) => {
  const gridRef = useRef<any | null>(ref);
  const { dispatch, objState } = useAppContext();
  const { isMailSendPopupOpen: isOpen, MselectedTab } = objState;

  const { t } = useTranslation();
  const user_id = useUserSettings((state) => state.data.user_id);
  const { data : transMailData, refetch: transMailRefetch, remove :transMailRemove } = useGetData({bk_id: bk_id, cust_code:cust_code}, '', SP_GetMailSample, {enabled:false});
  const [reports, setReports] = useState<any>()
  const [mailform, setMailForm] = useState<MailSample>({
    subject: "",
    content: "",
    report: {
      // bknote: false,
      // deliv_request: false,
      // cust_identification: false,
      booking_note: false,
      transport_request: false,
      customer_dispatch: false,
    },
    attachment: [],
    add_folder_name: "", //file upload
    files: [], //file upload
  });

  const [templateTypeList, setTemplateTypeList] = useState<string[]>([]);
  const [attachFileUpload, setAttachFileUpload] = useState<FileUploadData[]>([]);

  const { Create: sendEmail } = useUpdateData2(SP_SendEmail, '');
  const { Create: GetReportData } = useUpdateData2(SP_GetReportData, 'GetReportData');
  const { Create : Download } = useUpdateData2(SP_DownloadReport, "Download");
  const { Create : Upload } = useUpdateData2(SP_UploadAttachment, "Upload");

  useEffect(() => {
    if (isOpen) {
      transMailRefetch();
    }
  }, [transMailRefetch,isOpen]);

  useEffect(() => {
    if (loadItem) {
      setReports(loadItem[21].data);
    }
  }, [loadItem]);

  useEffect(() => {
    if (isOpen && transMailData) {
      // setMailForm(
      //   {...mailform,
      //    ...((transMailData as string[]) as unknown as gridData).data[0]
      //   })
      setMailForm((prevMailform) => ({
        ...prevMailform,
        ...(transMailData as string[] as unknown as gridData).data[0],
      }));
    }
  }, [transMailData, isOpen]);

  const closeModal = () => {
    if (callbacks?.length) callbacks?.forEach((callback) => callback());
    dispatch({ isMailSendPopupOpen: false });
    setTemplateTypeList([]);
  };

  const { getValues } = useFormContext();

  const handleFileDrop = (data: any[], header?: ArrayBuffer[]) => {

    const fileUploadRequestArray : FileUploadData[] = [];
    for (let i=0; i<data.length; i++) {
      const requestData : FileUploadData = {
        fileName : data[i].name,
        fileData : Buffer.from(header![i]),
        fileRootDIR : "MAIL_ATTACH"
      };

      fileUploadRequestArray.push(requestData);
    }
    
    setAttachFileUpload(fileUploadRequestArray);
  };

  const handleCheckBoxClick = (id: string, val: any) => {
    if(val === 'Y'){
      templateTypeList.push(id);
      setTemplateTypeList([...templateTypeList]);
    } else {
      templateTypeList.splice(templateTypeList.indexOf(id), 1);
      setTemplateTypeList([...templateTypeList]);
    }
  };
  
  const sendTransPortEmail = useCallback(async () => {
    const curData = getValues();
    /**
     * @dev
     * reportType과 templateTypeList index 매칭
     */

    const fileUploadRequest : FileUploadRequest = {
      addFolderName : user_id,
      files : []
    };

    if (templateTypeList.length > 0) {

      let reportList = [];
        if (reports.length === templateTypeList.length) {
          reportList.push(reports);
        } else {
          for (const report of reports) {
            for (const template of templateTypeList) {
              if (report.key === template) {
                reportList.push(report);
              }
            }
          }
        }

        /**
         * @dev
         * 선택한 리포트 템플릿의 data 호출, file upload param 세팅
         */

        const fileExtension : number = Number(curData.search_gubn) || 0;

        const reportDataList : any = [];
        const fileNameList : string[] = [];
        for (const report of reportList) {
            try {
              await GetReportData.mutateAsync({ type: (report.report_type-1), bk_id: bk_id }, {
                onSuccess: (res:any) => {
                  let reportData : any = new Object;
                  let pageDivide : any;
                  let voccID : any;

                  for (let [key, value] of Object.entries(res[0].data[0])) {
                    if (value === null || value === undefined) {value = ""}
        
                    switch(key) {
                      case "page_divide":
                        pageDivide = value;
                        break;
                      case "vocc_id":
                        voccID = value;
                        break;     
                      default:
                        reportData[key.toUpperCase()] = value;
                    }
                  }
      
                  fileNameList.push(report.report_type_nm.concat("-", voccID));
                  reportDataList.push(reportData);        
                },
                onError: (error) => {
                  // console.error(` 실패 (type: ${report.key}):`, error);
                }
              });
            } catch (error) {
              log(error)
            }
        }

        /**
         * @dev
         * data To report file API 호출 및 ArrayBuffer response
         */

        const reportDownloadRequest : ReportDownloadRequest = {
          responseType : 1,
          fileExtension : fileExtension,
          reportDataList : reportDataList,
          templateTypeList : templateTypeList,
          fileNameList : fileNameList
        }

        await Download.mutateAsync(reportDownloadRequest, {
          onSuccess: (res: any) => {
            /**
             * @stage_4
             * file upload API 호출 및 경로 return
             */
            const filesList = [];
            for (const data of res.data) {
              const files : FileUploadData = {
                fileName : "test.xlsx",
                fileData : data.fileData,
                fileRootDIR :"MAIL_ATTACH"
              }

              filesList.push(files);
            }

            fileUploadRequest.files = filesList;
          }
      });
    } 
    
    if (attachFileUpload.length > 0) {
      const requestList : FileUploadData[] = [...fileUploadRequest.files, ...attachFileUpload]
      // console.log("requestList : ", requestList);
      fileUploadRequest.files = requestList;
    }

    // console.log("fileUploadRequest.files : ", fileUploadRequest.files);

    await Upload.mutateAsync(fileUploadRequest, {
      onSuccess: async (res:any) => {
        // console.log("res : ", res);

      
      mailform.attachment = res.data.map((filePath: string) => filePath).join(',');
      }
    });

    await sendEmail
      .mutateAsync(
        { ...mailform, pgm_code: TRANPOSRT_EMAIL_LIST_OE + cust_code },
        {
          onSuccess(data, variables, context) {},
        }
      )
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
            pgm_code={TRANPOSRT_EMAIL_LIST_OE}
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
            value={mailform?.subject || ""}
            options={{ isReadOnly: false }}
          />
          <TextArea
            id="content"
            rows={10}
            cols={32}
            value={mailform?.content || ""}
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
                <AttFileUpload
                  onFileDrop={handleFileDrop}
                  isInit={objState.uploadFile_init}
                />
              }
            >
              <Checkbox
                id="booking_note"
                //label="bknote"
                value={mailform?.report?.booking_note ? "Y" : "N"}
                options={{ inline: false }}
                events={{ onChange: handleCheckBoxClick }}
              />
              <Checkbox
                id="transport_request"
                //label="deliv_request"
                value={mailform?.report?.transport_request ? "Y" : "N"}
                options={{ inline: false }}
                events={{ onChange: handleCheckBoxClick }}
              />
              <Checkbox
                id="customer_dispatch"
                //label="cust_identification"
                value={mailform?.report?.customer_dispatch ? "Y" : "N"}
                options={{ inline: false }}
                events={{ onChange: handleCheckBoxClick }}
              />

              <div className="row-span-1 row-start-2 px-1 mx-1 space-x-1 border rounded-full">
                <RadioGroup label="">
                  <Radio
                    id="search_gubn"
                    name="download"
                    value="0"
                    label="excel"
                    defaultChecked
                  />
                  <Radio
                    id="search_gubn"
                    name="download"
                    value="1"
                    label="pdf"
                  />
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
