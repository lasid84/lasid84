import DialogBasic from "layouts/dialog/dialog";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useCallback, useRef, memo, useState } from "react";
import { MaskedInputField, Input, TextArea } from "components/input";
import { useAppContext } from "components/provider/contextObjectProvider";
import { useTranslation } from "react-i18next";
import { FileUpload } from "components/file-upload";
import { PageContentDivided } from "layouts/search-form/page-search-row";
import MailSend from "@/components/commonForm/mailSend";
import { Checkbox } from "@/components/checkbox";
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  ref?: any | null;
  initData?: any | null;
  callbacks?: Array<() => void>;
};

const Modal: React.FC<Props> = ({ ref = null, initData, callbacks }) => {
  const gridRef = useRef<any | null>(ref);
  const { dispatch, objState } = useAppContext();
  const { isMailSendPopupOpen: isOpen, MselectedTab } = objState;

  const { t } = useTranslation();

  const closeModal = () => {
    if (callbacks?.length) callbacks?.forEach((callback) => callback());
    dispatch({ isMailSendPopupOpen: false });
    reset();
  };

  const methods = useForm({
    defaultValues: {},
  });

  const { handleSubmit, reset, setFocus } = methods;

  const handleFileDrop = (data: any[], header: string[]) => {};

  return (
    // <FormProvider{...methods}>
    <DialogBasic
      isOpen={isOpen}
      onClose={closeModal}
      title={t("Mail")}
      bottomRight={
        <>
          {/* <Button id={"cancel"} onClick={closeModal} icon={null} width="w-32" /> */}
        </>
      }
    >
      <div className="flex w-[78rem] h-[32rem] gap-4 ">
        <div className="flex w-1/3 h-full">
          {/* grid */}
          <MailSend
            ref={gridRef}
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
            value={""}
            options={{ isReadOnly: false }}
          />
          <TextArea
            id="content"
            rows={10}
            cols={32}
            value={""}
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
                id="DG"
                label="bknote"
                value="Y"
                options={{ inline: false }}
                events={{}}
              />
              <Checkbox
                id="DG"
                label="deliv_request"
                value="Y"
                options={{ inline: false }}
                events={{}}
              />
              <Checkbox
                id="DG"
                label="cust_identification"
                value="Y"
                options={{ inline: false }}
                events={{}}
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
