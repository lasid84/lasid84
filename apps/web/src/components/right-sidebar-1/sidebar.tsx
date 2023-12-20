import {useConfigs} from "states/useConfigs";
import Switch from "react-switch";
import {getColor} from "utils/colors";

const Component: React.FC = () => {
  const onColor = `blue-200`;
  const onHandleColor = `blue-500`;
  const offColor = `gray-200`;
  const offHandleColor = "white";
  const config = useConfigs((state) => state.config);

  const {collapsed} = config;
  const configActions = useConfigs((state) => state.actions);

  return (
    <Switch
      onChange={() => {
        configActions.
          setConfig({
            collapsed: !collapsed,
          });
      }}
      checked={collapsed}
      onColor={getColor(onColor)}
      onHandleColor={getColor(onHandleColor)}
      offColor={getColor(offColor)}
      offHandleColor={getColor(offHandleColor)}
      handleDiameter={24}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
      activeBoxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
      height={20}
      width={48}
      className="react-switch"
    />
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col p-4">
      <div className="uppercase text-sm font-bold tracking-wider mb-2">
        메뉴바 토글
      </div>
      <div className="flex flex-col">
        <Component />
      </div>
    </div>
  );
};

export default Sidebar;
