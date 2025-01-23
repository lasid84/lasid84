import DialogBasic from "layouts/dialog/dialog";
import { useFormContext} from "react-hook-form";
import { FileUpload } from "components/file-upload";
import { Button } from "components/button";
import { useTranslation } from "react-i18next";
import ExcelUploadGrid from "./popupGrid";
import { Store } from "../../_store/store";

import { log, error } from '@repo/kwe-lib-new';

type Callback = () => void;
type Props = {
};

const Modal: React.FC<Props> = ({ }) => {
  const { t } = useTranslation();
  const { getValues, setValue, reset, setFocus, handleSubmit } = useFormContext();
  const {mainSelectedRow, popup, loadDatas} = Store((state)=>state)
  const actions = Store((state)=>state.actions)

  const closeModal = async () => {
    actions.updatePopup({
      isPopupUploadOpen: false,
    });
    actions.setState({excelDatas:{data:[], fields:[]}});
  };
  
  const handleFileDrop = (data: any[], header?: any[]) => {
   
    const fileOptions = ((loadDatas ?? [])[4].data as Array<{header: number}>) ;
    const headerRow = fileOptions[0] ? fileOptions[0]['header'] : 1; 

    const columnNames = data[headerRow - 1] as string[]; // 헤더 행 추출
    
    // 헤더 이후의 데이터 추출
    data = data.slice(headerRow).map((row) => {
      const rowArray = row as any[];
      const rowObject: Record<string, any> = {};
      columnNames.forEach((col: string, index: number) => rowObject[index+1] = rowArray[index]);
      
      return rowObject;
    });

    actions.getExcelCustomsData({jsonData: JSON.stringify(data)});
  };
  
  return (
    <DialogBasic
      isOpen={popup.isPopupUploadOpen!}
      onClose={closeModal}
      title={t("MSG_0186")}
      bottomRight={
        <>
          {/* <Button id={"save"} onClick={onSave} width="w-32" /> */}
          <Button id={"cancel"} onClick={closeModal} width="w-32" />
        </>
      }
    >
      <form>
        <div className="w-full gap-4 md:gap-8">
          <div className="flex w-[75vw] h-[70vh] p-1 border rounded-lg  mx-auto">
            <div className="w-full p-4">
              <FileUpload
                onFileDrop={handleFileDrop}
                isReturnRawData={true}
              />
                <ExcelUploadGrid
                  params={{
                    waybill_no: mainSelectedRow?.waybill_no,
                    invoice_no: mainSelectedRow?.invoice_no,
                  }}
                />
            </div>
          </div>
        </div>
      </form>
    </DialogBasic>
  );
};

export default Modal;
