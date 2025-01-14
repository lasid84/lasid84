
import {useConfigs} from "states/useConfigs";
import {useLeftSidebar} from "states/useLeftSidebar";
import Link from "next/link";
import { useStore } from "zustand";
import { useUserSettings } from "@/states/useUserSettings";
import { usePathname } from "next/navigation";
import { useUpdateData2 } from "../react-query/useMyQuery";
import { SP_InsertLog } from "@/services/clientAction";

import { log, error } from '@repo/kwe-lib-new';

const LogoImg: React.FC = () => {
  const configActions = useConfigs((state) => state.actions);

  const {name, collapsed} = useConfigs((state) => state.config);
  const {showLogo} = useLeftSidebar((state) => state.leftSidebar);
  const userSettingsActions = useStore(useUserSettings, (state) => state.actions);

  const { Create } = useUpdateData2(SP_InsertLog, "");
  const pathName = usePathname();
  // log("logo", showLogo)
  if (showLogo) {

    const handleClick = () => {
      userSettingsActions?.setData({currentMenu:0, currentParams:''});
      var data = {
        menucode: pathName,
        action: 'Open'
      };
      Create.mutate(data);
    }

    return (
      <div className="truncate logo" onClick={handleClick}>
        <Link href="/">
          <div className="flex flex-row items-center justify-center dark:hidden">
            <img className={"expanded"} src={`/logos/12-removebg-preview.png`} alt={""} />
            <img className={"collapsed"} src={`/logos/kwe_logo_bright_collapsed.png`} alt={""} />
          </div>
          <div className="flex flex-row items-center justify-center hidden dark:block">
            <img className={"expanded"} src={`/logos/1-gray-900.png`} alt={""} />
            <img className={"collapsed"} src={`/logos/kwe_logo_dark_collapsed.png`} alt={""} />
          </div>
        </Link>
        <button
          onClick={() => configActions.setConfig({ collapsed: !collapsed, }) }
          className="block ml-auto mr-4 lg:hidden">
          {/* <FiMenu size={20} /> */}
        </button>
      </div>
    );
  }
  return null;
};

export default LogoImg;
