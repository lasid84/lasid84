import Switch from "react-switch";
import {getColor} from "utils/colors";


const SwitchGrid: React.FC = () => {
    const onColor = `blue-200`;
    const onHandleColor = `blue-500`;
    const offColor = `gray-200`;
    const offHandleColor = "white";
    
    //const {collapsed} = {};
    const collapsed =false //BOOLEAN
    return (
      <Switch
        onChange={() => {       
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
  
  export default SwitchGrid