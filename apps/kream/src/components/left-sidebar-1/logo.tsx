import {FiBox, FiMenu} from "react-icons/fi";
import {useConfigs} from "states/useConfigs";
import {useLeftSidebar} from "states/useLeftSidebar";
import Link from "next/link";

import { log, error } from '@repo/kwe-lib-new';

const Logo: React.FC = () => {
  const configActions = useConfigs((state) => state.actions);

  const {name, collapsed} = useConfigs((state) => state.config);
  const {showLogo} = useLeftSidebar((state) => state.leftSidebar);
  // log("logo", showLogo)
  if (showLogo) {
    return (
      <div className="truncate logo">
        <Link href="/">
          <div className="flex flex-row items-center justify-start space-x-2">
            <FiBox size={28} />
            <span>{name}</span>
          </div>
        </Link>
        <button
          onClick={() => configActions.setConfig({ collapsed: !collapsed, }) }
          className="block ml-auto mr-4 lg:hidden">
          <FiMenu size={20} />
        </button>
      </div>
    );
  }
  return null;
};

export default Logo;
