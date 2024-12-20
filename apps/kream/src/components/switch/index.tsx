import SwitchGrid from "components/switch/switch";

type SwitchProps = {
  onClick?: (checked:boolean) => void; // 클릭 이벤트 핸들러를 props로 받을 수 있도록 정의
};

const Switch: React.FC<SwitchProps> = ({ onClick }) => {
  const handleSwitchClick = (checked:boolean) => {
    if (onClick) {
      onClick(checked); // 상위의 클릭 이벤트 호출
    }
  };

    return (
      <div className="flex flex-col m-1 gap-0.5 p-1">
            <SwitchGrid onSwitchClick={handleSwitchClick} /> {/* 하위 컴포넌트 */}
      </div>
    );
  };
  
  
  export default Switch;
  