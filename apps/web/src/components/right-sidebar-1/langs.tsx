import {useConfigs} from "states/useConfigs";
import {Select} from "@repo/ui/src/select/select"

type Option = {
  key: string;
  value: string;
};

const Langs: React.FC = () => {
  const langs: Option[] = [
    {key: "한국어", value: "kr"},
    {key: "English", value: "en"},
    {key: "日本語", value: "jp"},
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
          <Select 
              name="language"
              onChange={selectLangChange}
              options={[
              {label: "한국어", value: "ko"},
              {label: "English", value: "en"},
              {label: "JP", value: "jp"},
              ]}
          />  
      </div>
    </div>
  );
};

export default Langs;
