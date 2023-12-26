import {FiSettings, FiMenu, FiUser, FiExternalLink} from "react-icons/fi";
import {useConfigs} from "states/useConfigs";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const config = useConfigs((state) => state.config);
  const {rightSidebar, collapsed} = config;
  const configActions = useConfigs((state) => state.actions);
  const router = useRouter();

  return (
    <div className="text-gray-900 bg-white border-b border-gray-100 dark:bg-gray-900 dark:text-white dark:border-gray-800">
      <div className="flex items-center justify-start w-full">
        <button
          onClick={() =>
            configActions.
              setConfig({
                collapsed: !collapsed,
              })
          }
          className="mx-4">
          <FiMenu size={20} />
        </button>
        <span className="ml-auto"></span>
        {/*
        <Dropdown2 />
        <Dropdown1 />
        <Dropdown4 />
        <Dropdown3 />
        <Dropdown5 />
        */}
        <button
          className="flex items-center justify-center h-16 mx-4"
          onClick={() => null }>
          <FiUser size={18} />
          <span className="ml-1"></span>
        </button>        
        <button
          className="flex items-center justify-center h-16 mx-4"
          onClick={() => {router.push("/login");} }>
          <FiExternalLink size={18} />
          <span className="ml-1">로그아웃</span>
        </button>         
        <button
          className="flex items-center justify-center h-16 mx-4"
          onClick={() =>
            configActions.
              setConfig({
                rightSidebar: !rightSidebar,
              })
          }>
          <FiSettings size={18} />
          <span className="ml-1">설정</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
