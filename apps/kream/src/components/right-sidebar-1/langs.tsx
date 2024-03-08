import {useConfigs} from "states/useConfigs";
import { useTranslation } from "react-i18next";
import { executFunction } from "services/api.services";
import { useUserSettings } from "states/useUserSettings";
const { log } = require('@repo/kwe-lib/components/logHelper');

type Option = {
  key: string;
  label: string;
  value: string;
};

export const SP_UpdateData = async (Param: any) => {

  const {lang, user_id, ipaddr } = Param;
  // log("searchData:", trans_mode, trans_type);
  
  const params = {
    inparam : ["in_lang", "in_user_id", "in_ipaddr" ],
    invalue: [ lang, user_id, ipaddr],
    inproc: 'public.f_admn_set_lang'
    }
  
    await executFunction(params);
}

const Langs: React.FC = () => {
  const langs: Option[] = [
    { key: "KOR", label: "한국어", value: "KOR" },
    { key: "ENG", label: "English", value: "ENG" },
    { key: "JPN", label: "日本語", value: "JPN" },
  ];

  const configActions = useConfigs((state) => state.actions);
  const { lang } = useConfigs((state) => state.config);
  const { user_id, ipaddr } = useUserSettings((state) => state.data);

  const selectLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const key = event.target;
    log(key, value);
    configActions.setConfig({ 
        lang: value,
        rightSidebar: false,
    });
    SP_UpdateData({lang:value, user_id:user_id, ipaddr:ipaddr});
  };

  return (
    <div className="flex flex-col p-4">
      <div className="mb-2 text-sm font-bold tracking-wider uppercase">
        언어 선택
      </div>
      <div className="flex flex-col">
      <select
          id='1'
          // disabled={readOnly}
          // defaultValue={currentValue}
          onChange={selectLangChange}
          defaultValue={lang}
          className={`block w-full h-8 p-0 pl-2 text-[13px] form-select border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500 focus:ring-0 rounded` }>
          {/* {isPlaceholder ? <option value="">{placeholder}</option> : <></>} */}
          {langs?.map((option, i) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>           
      </div>
    </div>
  );
};

export default Langs;
