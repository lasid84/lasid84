import {useConfigs} from "states/useConfigs";
import {FiX} from "react-icons/fi";

const Close: React.FC = () => {
  const config = useConfigs((state) => state.config);
  const {rightSidebar} = config;
  const configActions = useConfigs((state) => state.actions);
  return (
    <button
      onClick={() =>
        configActions.
          setConfig({
            rightSidebar: !rightSidebar,
          })
      }
      className="font-bold uppercase  text-xs h-8 w-8 rounded-full inline-flex items-center justify-center p-0">
      <FiX size={18} />
    </button>
  );
};

export default Close;
