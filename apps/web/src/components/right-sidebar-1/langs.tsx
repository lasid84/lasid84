import { useConfigs } from "states/useConfigs";
import { Select } from "@repo/ui/src/select/select"
import { useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

const Langs: React.FC = () => {
  const langs: Option[] = [
    { label: "한국어", value: "ko" },
    { label: "English", value: "en" },
    { label: "日本語", value: "jp" },
  ];

  const configActions = useConfigs((state) => state.actions);
  const selectedLang = useConfigs((state) => state.config.lang);

  useEffect(() => {
    if (!selectedLang) {
      configActions.setConfig({ lang: "ko" });
    }
  }, []);


  const selectLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    console.log('target value', value)
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
          value={selectedLang}
          onChange={selectLangChange}
          isPlaceholder={false}
          options={[
            { label: "한국어", value: "ko" },
            { label: "English", value: "en" },
            { label: "JP", value: "jp" },
          ]}
        />
      </div>
    </div>
  );
};

export default Langs;
