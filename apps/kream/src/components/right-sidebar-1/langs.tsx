import {useConfigs} from "states/useConfigs";
import { TSelect } from "components/form/select";
const { log } = require('@repo/kwe-lib/components/logHelper');

type Option = {
  key: string;
  label: string;
  value: string;
};

const Langs: React.FC = () => {
  const langs: Option[] = [
    { key: "ko", label: "한국어", value: "ko" },
    { key: "en", label: "English", value: "en" },
    { key: "jp", label: "日本語", value: "jp" },
  ];

  const configActions = useConfigs((state) => state.actions);

  const setLang = (lang: string) => {
    switch (lang) {
      case "kr":
      case "en":
      case "jp":
        configActions.setConfig({ 
            lang: lang,
            rightSidebar: false,
        });
        break;
      default:
        configActions.setConfig({ 
            lang: "kr",
            rightSidebar: false,
        });
        break;
    }
  };

  const selectLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const key = event.target;
    log(key, value);
    configActions.setConfig({ 
        lang: value,
        rightSidebar: false,
    });
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
