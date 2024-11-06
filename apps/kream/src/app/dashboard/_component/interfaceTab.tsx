import { useState } from 'react';
import { useTranslation } from "react-i18next";

export default function InterfaceTab() {
  const { t } = useTranslation();
  const [selectedMenu, setSelectedMenu] = useState(0);

  const translateMessageList = [ 'interface_select_link_menu', 'interface_input_code', 'MSG_0181', 'interface_click_message_1', 'interface_click_message_2', 'MSG_0182', 'interface_link' ]

  const interfaceMenuList = [
    'Carrier 프로파일',
    'Customer 프로파일',
    'Port 프로파일',
    'House BL',
    'Master BL',
  ];

  return (
    <div className="w-fit flex flex-col bg-white drop-shadow-lg m-5 p-5">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">{t(translateMessageList[0])}</h2>
        <div className="w-fit flex bg-gray-300 rounded-2xl p-1 shadow-inner">
          {interfaceMenuList.map((menu, index) => (
            <button key={menu} onClick={() => setSelectedMenu(index)}
              className={`px-4 py-2 mx-1 rounded-2xl transition-colors duration-200 ${ interfaceMenuList[selectedMenu] === menu? 'bg-white shadow-md text-black font-bold' : 'text-gray-500'}`}>
              {menu}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-lg font-semibold mb-4">{t(translateMessageList[1])}</h2>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" placeholder={`${t(translateMessageList[2])}`} />
        <p className="text-red-500 text-sm">{t(translateMessageList[3])}<span className="font-bold"> {interfaceMenuList[selectedMenu]} </span>{t(translateMessageList[4])}</p>
        <p className="text-orange-500 text-sm mb-4">{t(translateMessageList[5])}</p>
        <div className="text-center">
          <button className="w-1/4 bg-blue-500 text-white text-base py-2 rounded-lg">{t(translateMessageList[6])}</button>
        </div>
      </div>
    </div>
  );
};