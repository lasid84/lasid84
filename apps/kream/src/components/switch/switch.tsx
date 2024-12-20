import Switch from "react-switch";
import {getColor} from "utils/colors";
import { useState } from "react";


type SwitchGridProps = {
  onSwitchClick?: (checked:boolean) => void; // 상위에서 전달받는 클릭 이벤트 핸들러
};

const SwitchGrid: React.FC<SwitchGridProps> = ({ onSwitchClick }) => {
  const [collapsed, setCollapsed] = useState(false); // 상태 관리


  const handleSwitchChange = (checked: boolean) => {
    setCollapsed(checked); // 로컬 상태 업데이트
    if (onSwitchClick) {
      onSwitchClick(checked); // 상위 컴포넌트에 상태 전달
    }
  };
    const onColor = `blue-200`;
    const onHandleColor = `blue-500`;
    const offColor = `gray-200`;
    const offHandleColor = "white";
    
    return (
      <Switch
        onChange={handleSwitchChange} // 스위치 상태 변경 처리
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