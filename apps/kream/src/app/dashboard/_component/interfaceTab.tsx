import { useState } from 'react';
import { useTranslation } from "react-i18next";
import * as ufs from '@/components/ufs-interface/_component/data';
import { SP_CreateIFData } from '@/components/ufs-interface/_component/data';
import { Button } from '@/components/button';
import { useUpdateData2 } from '@/components/react-query/useMyQuery';
import { MaskedInputField } from '@/components/input/react-text-mask';
import { FormProvider, useForm } from 'react-hook-form';

export default function InterfaceTab() {
  const { t } = useTranslation();
  const [selectedMenu, setSelectedMenu] = useState(0);

  const translateMessageList = [ 'interface_select_link_menu', 'interface_input_code', 'MSG_0181', 'interface_click_message_1', 'interface_click_message_2', 'MSG_0182', 'interface_link' ]
  
  const { Create } = useUpdateData2(SP_CreateIFData);

  const methods = useForm({
    defaultValues: {
      id: ""
    },
  });

  const {
      handleSubmit,
      getValues
  } = methods;

  // const interfaceMenuList = [
  //   'Carrier 프로파일',
  //   'Customer 프로파일',
  //   'Port 프로파일',
  //   'House BL',
  //   'Master BL',
  // ];
  const interfaceMenuList = [
    ufs.SCRAP_UFSP_PROFILE_CARRIER,
    ufs.SCRAP_UFSP_PROFILE_CUSTOMER,
    ufs.SCRAP_UFSP_PROFILE_PORT,
    ufs.SCRAP_UFSP_HBL,
    ufs.SCRAP_UFSP_MBL
  ];

  const onInterface = () => {

    const param = {
      pgm_code : interfaceMenuList[selectedMenu],
      id: getValues("id")
    }
    Create.mutate(param);
  }

  return (
    <FormProvider{...methods}>
      <div className="flex flex-col p-5 m-5 bg-white drop-shadow-lg w-fit">
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">{t(translateMessageList[0])}</h2>
          <div className="flex p-1 bg-gray-300 rounded-2xl shadow-inner w-fit">
            {interfaceMenuList.map((menu, index) => (
              <button key={menu} onClick={() => setSelectedMenu(index)}
                className={`px-4 py-2 mx-1 rounded-2xl transition-colors duration-200 ${ interfaceMenuList[selectedMenu] === menu? 'bg-white shadow-md text-black font-bold' : 'text-gray-500'}`}>
                {t(menu)}
              </button>
            ))}
          </div>
        </div>

        <form>
          <div className="w-full">
            <h2 className="mb-4 text-lg font-semibold">{t(translateMessageList[1])}</h2>
            {/* <input type="text" className="px-4 py-2 mb-4 w-full rounded-lg border border-gray-300" placeholder={`${t(translateMessageList[2])}`} /> */}
            <div className="col-span-1">
              <MaskedInputField
                  id="id"
                  options={{
                      noLabel: true
                  }}
              />
            </div>
            <p className="text-sm text-red-500">{t(translateMessageList[3])}<span className="font-bold"> {t(interfaceMenuList[selectedMenu])} </span>{t(translateMessageList[4])}</p>
            <p className="mb-4 text-sm text-orange-500">{t(translateMessageList[5])}</p>
            {/* <div className="text-center"> */}
              {/* <button className="py-2 w-1/4 text-base text-white bg-blue-500 rounded-lg">{t(translateMessageList[6])}
                onClick={onInterfaceClick}
              </button> */}
              <div className='py-2 mx-auto w-1/4 text-center'>
                <Button id="interface" onClick={onInterface} />
              </div>
            {/* </div> */}
          </div>
        </form>
      </div>
    </FormProvider>
    
  );
};