import {FiBox, FiMenu} from "react-icons/fi";
import {useConfigs} from "states/useConfigs";
import Link from "next/link";

const Logo: React.FC = () => {
  const configActions = useConfigs((state) => state.actions);
  const {name, collapsed} = useConfigs((state) => state.config);
  return (
    <div className="truncate flex flex-row items-center justify-start w-full text-base font-bold tracking-wider uppercase whitespace-nowrap text-blue-500 h-16 px-4">
      <Link href="/">
        <div className="flex flex-row items-center justify-start space-x-2">
          <FiBox size={28} />
          <span>{name}</span>
        </div>
      </Link>
      <button
        onClick={() =>
          configActions.
            setConfig({
              collapsed: !collapsed,
            })
        }
        className="block ml-auto">
        <FiMenu size={20} />
      </button>
    </div>
  );
};

export default Logo;
