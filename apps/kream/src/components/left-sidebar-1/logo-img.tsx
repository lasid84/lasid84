// import * as React from "react"
// import {FiBox, FiMenu, FiX} from "react-icons/fi";
// import { useConfigs } from "states/useConfigs";
// import { useStore } from "utils/zustand";
// import { useLeftSidebar } from "states/useLeftSidebar";
// import Link from "next/link";

// const LogoImg: React.FC = () => {
//   // const configActions = useConfigs((state) => state.actions);
//   // const { name, collapsed } = useConfigs((state) => state.config);
//   const configActions = useStore(useConfigs, (state) => state.actions);
//   const name = useStore(useConfigs, (state) => state.config.name);
//   const collapsed = useStore(useConfigs, (state) => state.config.collapsed);

//   const { showLogo } = useLeftSidebar((state) => state.leftSidebar);
//   if (showLogo) {
//     return (
//       <div className="logo truncate border-b h-[3.75rem] dark:border-[#000000] dark:bg-[#1f2937]">
//         <Link href="/">
//           <div className="flex flex-row items-center justify-center dark:hidden">
//             <img className={"expanded"} src={`/logos/kwe_logo_bright.png`} alt={""} />
//             <img className={"collapsed"} src={`/logos/kwe_logo_bright_collapsed.png`} alt={""} />
//           </div>
//           <div className="flex flex-row items-center justify-center hidden dark:block">
//             <img className={"expanded"} src={`/logos/kwe_logo_dark.png`} alt={""} />
//             <img className={"collapsed"} src={`/logos/kwe_logo_dark_collapsed.png`} alt={""} />
//           </div>
//         </Link>
//         <button
//           onClick={() => configActions!.setConfig({ collapsed: !collapsed })}
//           className="block ml-auto mr-4 lg:hidden">
//           {/*<FiMenu size={20} />*/}
//           <FiX size={20} />
//         </button>
//       </div>
//     );
//   }
//   return null;
// };

// export default LogoImg;
import {FiBox, FiMenu} from "react-icons/fi";
import {useConfigs} from "states/useConfigs";
import {useLeftSidebar} from "states/useLeftSidebar";
import Link from "next/link";

const { log } = require('@repo/kwe-lib/components/logHelper');

const LogoImg: React.FC = () => {
  const configActions = useConfigs((state) => state.actions);

  const {name, collapsed} = useConfigs((state) => state.config);
  const {showLogo} = useLeftSidebar((state) => state.leftSidebar);
  log("logo", showLogo)
  if (showLogo) {
    return (
      <div className="truncate logo">
        <Link href="/">
          <div className="flex flex-row items-center justify-center dark:hidden">
            <img className={"expanded"} src={`/logos/12-removebg-preview.png`} alt={""} />
            <img className={"collapsed"} src={`/logos/kwe_logo_bright_collapsed.png`} alt={""} />
          </div>
          <div className="flex flex-row items-center justify-center hidden dark:block">
            <img className={"expanded"} src={`/logos/1-gary-900.png`} alt={""} />
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
