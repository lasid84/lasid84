import DialogBasic from "layouts/dialog/dialog";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
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
import { SP_GetMailSample,SP_GetMailSample_comm } from "components/commonForm/mailSend/_component/data";
import {
  TRANPOSRT_EMAIL_LIST_OE,
  CUSTOMER_EMAIL_LIST_OE,
} from "components/commonForm/mailReceiver/_component/data";
import { gridData } from "@/components/grid/ag-grid-enterprise";
import {
  SP_SendEmail,
  SP_GetReportData,
  SP_FileUpload,
  SP_ReportUpload,
} from "../data";
import Radio from "components/radio/index";
import RadioGroup from "components/radio/RadioGroup";
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  transport_company?: string;
  shipper_id?: string;
  bk_id?: string;
  pgm_code?: string;
  initData?: any | null;
  callbacks?: Array<() => void>;
  ref?: any | null;
  loadItem?: any | null;
};

type MailSample = {
  subject: string;
  content: string;
  report: {
    bknote: boolean;
    deliv_request: boolean;
    cust_identification: boolean;
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
  pageDivide?: number | undefined; // 선택적 값
}

interface File {
  file_name: string;
  file_data: any;
  file_root_dir: string;
}

const Modal: React.FC<Props> = ({
  loadItem,
  ref = null,
  bk_id,
  transport_company,
  shipper_id,
  initData,
  callbacks,
}) => {
  const gridRef = useRef<any | null>(ref);
  const { dispatch, objState } = useAppContext();
  const { isMailSendPopupOpen: isOpen, MselectedTab } = objState;

  const { getValues } = useFormContext();

  const { t } = useTranslation();

  const [gubn, setGubn] = useState<string>('');
  const [pgmCode, setPgmCode] = useState<string>(TRANPOSRT_EMAIL_LIST_OE);
  const [custCode, setCustCode] = useState<string>('')


  //Mail Template Get Data 
  const {
    data: transMailData,
    refetch: transMailRefetch,
    remove: transMailRemove,
  } = useGetData(
    { bk_id: bk_id, cust_code: custCode, pgm_code: pgmCode },
    "",
    SP_GetMailSample_comm,
    {
      enabled: false,
    }
  );
  const [reports, setReports] = useState<any>();
  const [mailform, setMailForm] = useState<MailSample>({
    subject: "",
    content: "",
    report: {
      bknote: false,
      deliv_request: false,
      cust_identification: false,
    },
    attachment: [],
    add_folder_name: "", //file upload
    files: [], //file upload
  });

  const { Create: sendEmail } = useUpdateData2(SP_SendEmail, "");
  const { Create: fileUpload } = useUpdateData2(SP_FileUpload, "");
  const { Create: reportUpload } = useUpdateData2(SP_ReportUpload, "");
  const { Create: GetReportData } = useUpdateData2(
    SP_GetReportData,
    "GetReportData"
  );

  const loadEmailData = useCallback(() => {
    transMailRefetch();
  }, [gubn, bk_id, custCode, transMailRefetch]);

  useEffect(() => {
    if (isOpen) {
      loadEmailData();
    }
  }, [loadEmailData, isOpen, pgmCode, gubn]);

  useEffect(() => {
    if (loadItem) {
      setReports(loadItem[21].data);
    }
  }, [loadItem]);

  useEffect(() => {
    log("bk_id, cust_code", bk_id, custCode, isOpen, transMailData);
    if (isOpen && transMailData) {
      setMailForm((prevMailform) => ({
        ...prevMailform,
        ...(transMailData as string[] as unknown as gridData).data[0],
      }));
    }
  }, [transMailData, isOpen]);

  // gubn이 변경될 때 pgmCode 자동 업데이트
  useEffect(() => {
    if (gubn === 'transport_company') {
      setPgmCode(TRANPOSRT_EMAIL_LIST_OE);
      setCustCode(transport_company||'')
    } else if (gubn === 'shipper_id') {
      setPgmCode(CUSTOMER_EMAIL_LIST_OE);
      setCustCode(shipper_id||'')
    }
    // gubn 변경 시 데이터 refetch
    if (isOpen) {
      transMailRemove(); // 기존 데이터 제거
      loadEmailData();    // 새로운 데이터 가져오기
    }
  }, [gubn, isOpen, transport_company, shipper_id, transMailRemove, loadEmailData]);

//   // 상태 초기화 또는 리렌더링이 필요한 부분에 해당 useEffect를 추가
// useEffect(() => {
//   setGubn('');  // 초기값 설정 또는 리셋 로직
// }, [isOpen]);  // Modal이 열릴 때 gubn 초기화

  const closeModal = () => {
    if (callbacks?.length) callbacks?.forEach((callback) => callback());
    dispatch({ isMailSendPopupOpen: false });
    setGubn('');  // 초기값 설정 또는 리셋 로직
    setCustCode('')
    setPgmCode(TRANPOSRT_EMAIL_LIST_OE)
  };

  const handleFileDrop = async (data: any[], buffer: any[]) => {
    log("file upload -data, header", data, buffer);

    data.forEach((fileData, index) => {
      const uploadFile = {
        file_name: fileData.file.name, // 각 파일의 이름
        file_data: fileData.file.arrayBuffer, // 파일 데이터를 저장
        file_root_dir: "MAIL", // 루트 디렉토리 설정
      };

      // mailform 객체에 파일 추가
      mailform.files.push(uploadFile);
    });
  };

  const handleCheckBoxClick = (id: string, val: any) => {
    log("Checkbox clicked", id, val);
    // 'Y'이면 true, 'N'이면 false로 변환
    const booleanVal = val === "Y";
    if (booleanVal) {
      //val === true ? 'Y'
      setMailForm((prevState) => {
        const updatedAttachment = { ...prevState.report, [id]: val };
        return { ...prevState, report: updatedAttachment };
      });
    }
  };

  const sendTransPortEmail = useCallback(async () => {
    const curData = getValues();
    // 1. Get Data
    for (const report of reports) {
      const attachmentValue =
        mailform?.report?.[report.key as keyof typeof mailform.report] ?? false; // 타입 단언 사용

      if (attachmentValue) {
        try {
          await GetReportData.mutateAsync(
            { type: report.report_type, bk_id: bk_id },
            {
              onSuccess: (res: any) => {
                console.log(` 성공 (type: ${report.key}):`, res);

                let reportData: any = new Object();
                let pageDivide;
                for (let [key, value] of Object.entries(res[0].data[0])) {
                  if (value === null || value === undefined) {
                    value = "";
                  }

                  switch (key) {
                    default:
                      reportData[key.toUpperCase()] = value;
                  }
                }

                const templateType = Number(report.report_type);
                const fileExtension: number = Number(curData.search_gubn) || 0;
                const fileName =
                  loadItem[21].data[templateType - 1].report_type_nm;

                const downloadData: Attachment = {
                  reportData: reportData,
                  fileExtension: fileExtension,
                  templateType: templateType,
                  fileName: fileName,
                  pageDivide: pageDivide,
                };
                mailform.attachment.push(downloadData);
              },
              onError: (error) => {
                console.error(` 실패 (type: ${report.key}):`, error);
              },
            }
          );
        } catch (error) {
          log(error);
        }
      }
    }

    //1. 리포트파일 서버업로드(?)
    await reportUpload
      .mutateAsync(
        { ...mailform, pgm_code: pgmCode + custCode },
        {
          onSuccess(data, variables, context) {
            log("upload data", data);
          },
        }
      )
      .catch(() => {});

    // 2.업로드파일 서버업로드
    await fileUpload
      .mutateAsync(
        { ...mailform, pgm_code: pgmCode + custCode },
        {
          onSuccess(data, variables, context) {
            log("upload data", data);
          },
        }
      )
      .catch(() => {});

    // 3. sendEmail 실행
    await sendEmail
      .mutateAsync(
        { ...mailform, pgm_code: pgmCode + custCode },
        {
          onSuccess(data, variables, context) {},
        }
      )
      .catch(() => {});
  }, [mailform, bk_id, GetReportData]);


  const onChange = (e: any) => {
    const value = e.target.value
    setGubn(value);
  };

  return (
    <DialogBasic
      isOpen={isOpen}
      onClose={closeModal}
      title={t(pgmCode)}
      bottomRight={
        <>
          <Button id={"send"} onClick={sendTransPortEmail} width="w-32" disabled={custCode === ''}/>
          <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" />
        </>
      }
    >
      <div className="flex w-[82rem] h-[36rem] gap-4 ">
        <div className="flex w-1/3 h-full">
          {/* grid */}
          {custCode === "" ? (
            <div className="p-1 m-1 font-medium text-red-400"> {t(gubn||'transport_company')}{t('MSG_0178')}</div>
          ) : (
          <MailSend
            ref={gridRef}
            pgm_code={pgmCode}            
            params={{
              cust_code: custCode,           
              pickup_type: objState.trans_mode + objState.trans_type,
            }}
          />
          )}
        </div>
        <div className="flex-col w-2/3">
          {/* radio group */}
          <RadioGroup label="gubn">
            <Radio
              id="gubn"
              name="gubn"
              value="transport_company"
              label="transport_company"
              onChange={onChange}
              defaultChecked
            />
            <Radio
              id="gubn"
              name="gubn"
              value="shipper_id"
              label="customer"
              onChange={onChange}
            />
          </RadioGroup>

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
                id="bknote"
                //label="bknote"
                value={mailform?.report?.bknote ? "Y" : "N"}
                options={{ inline: false }}
                events={{ onChange: handleCheckBoxClick }}
              />
              <Checkbox
                id="deliv_request"
                //label="deliv_request"
                value={mailform?.report?.deliv_request ? "Y" : "N"}
                options={{ inline: false }}
                events={{ onChange: handleCheckBoxClick }}
              />
              <Checkbox
                id="cust_identification"
                //label="cust_identification"
                value={mailform?.report?.cust_identification ? "Y" : "N"}
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
