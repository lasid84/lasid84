import { FiShoppingCart, FiArrowDown as ChevronDownIcon } from "react-icons/fi";
// import { ChevronDownIcon } from "@heroicons/react";
import clsx from "clsx";
import { RiRefreshLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { ReactElement, cloneElement } from "react";

const { log } = require('@repo/kwe-lib/components/logHelper');

export type ButtonProps = {
  id: string;
  label?: string;
  onClick?: any;
  color?: string;
  icon?: any;
  disabled?: boolean;
  type?: "submit" | "button";
//   direction?: "UP" | "DOWN" | "LEFT" | "RIGHT";
//   refresh?: boolean;
  isHidden?: boolean;
};

const btnColor:any = {
    // 'blue' : ' text-white bg-[#19a6e7] rounded hover:bg-[#0d95d4]',
    // 'black': ' text-white bg-[#333322] rounded hover:bg-gray-500 disabled:bg-gray-200 hover:bg-gray-300',
    // 'gray' : ' text-black bg-gray-200 rounded border-gray-400 hover:bg-gray-300',
    // 'grey' : ' text-black bg-gray-200 rounded border-gray-400 hover:bg-gray-300',
    // 'green': ' text-white bg-green-500 rounded hover:bg-green-800',
    // 'orange': ' text-white bg-yellow-500 rounded hover:bg-yellow-800',
    // 'pink' : ' text-white bg-pink-500 rounded hover:bg-pink-800',
    // 'red'  : ' text-white bg-[#f94164] rounded hover:bg-[#dd2548]',
    // 'white': ' text-black font-bold bg-white rounded border border-gray-400 hover:bg-gray-100',
    'blue': 'text-white bg-blue-400 rounded hover:bg-blue-800',
    'black': 'text-white bg-black rounded hover:bg-gray-500 disabled:bg-gray-200 hover:bg-gray-300',
    'gray': 'text-black bg-gray-200 rounded border-gray-400 hover:bg-gray-300',
    'green': 'text-white bg-green-500 rounded hover:bg-green-800',
    'orange': 'text-white bg-yellow-500 rounded hover:bg-yellow-800',
    'pink': 'text-white bg-pink-500 rounded hover:bg-pink-800',
    'red': 'text-white bg-red-500 rounded hover:bg-red-800',
    'white': 'text-black font-bold bg-white rounded border border-gray-400 hover:bg-gray-100',

}

const getColor = (label:string, color:string = '') => {
    var c = color.toLowerCase();
    if (!c) {
        switch(label.toLowerCase()) {
            case "search":
                c = 'black';
                break;
            case "add":
            case "save":
            case "new":
                c = 'blue';
                break;
            case "cancel":
            case "reset":
                c = 'gray';
                break;
            default:
                c = 'black';
                break;
        }
    }
    if (!btnColor[c]) return btnColor['black'];

    return btnColor[c];
}

const getIcon = (label:string, icon:JSX.Element) => {
    if (icon === null) return null;
    var size = 18;
    if (icon) return cloneElement(icon as ReactElement, { size });;

    switch (label.toLowerCase()) {
        case "search":
            icon = <FiShoppingCart size={size} />;
            break;
        case "new":
            icon = <FiShoppingCart size={size} />;
            break;            
        case "add":
            icon = <FiShoppingCart size={size} />;
            break;            
        case "save":
            icon = <FiShoppingCart size={size} />;
            break;
        case "reset":
            icon = <FiShoppingCart size={size} />;
            break;
    }
    return (
        icon
    )
}

export const Button : React.FC<ButtonProps> = ( props ) => {

    const { t } = useTranslation();
    const { id, label, disabled, color, type, isHidden, icon
          , onClick
    } = props;

    const disabledCss = "disabled:bg-gray-200 hover:bg-gray-300'"

    return (
      <button
        className= {`flex flex-row gap-2 h-[32px] px-4 py-2 text-xs font-bold ${getColor(label?label:id, color)}
            ${isHidden ? "hidden" : ""}
            ${disabledCss}
        `}
        id={label}
        onClick={onClick}
        type={type ? type : "button"}
        disabled={disabled ? true : false }
        >
        {getIcon(label ? label : id, icon)}
        {/* {direction && <ChevronDownIcon
            className={clsx(
            "w-8 ml-2 duration-300 ease-in-out fill-black",
            direction === "UP" && "-rotate-180",
            direction === "DOWN" && "rotate-0",
            direction === "LEFT" && "rotate-90",
            direction === "RIGHT" && "-rotate-90"
            )}
            aria-hidden="true"
        />} */}
        {t((label?label:id).toLowerCase())}
      </button>
    );
  };