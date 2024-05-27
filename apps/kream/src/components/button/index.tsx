import { FiShoppingCart, FiArrowDown as ChevronDownIcon } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { TiPlus } from "react-icons/ti";
// import { ChevronDownIcon } from "@heroicons/react";
import clsx from "clsx";
import { RiRefreshLine } from "react-icons/ri";
import { RiSaveLine, RiSaveFill, RiSave2Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { ReactElement, cloneElement } from "react";
import { GrPowerReset } from "react-icons/gr";
import { HiOutlineRefresh } from "react-icons/hi";
import { GrDownload } from "react-icons/gr";

const { log } = require('@repo/kwe-lib/components/logHelper');

export type ButtonProps = {
    id: string;
    label?: string;
    onClick?: any;
    color?: string;
    icon?: any;
    disabled?: boolean;
    type?: "submit" | "button";
    size?:any //타입 수정
    //   direction?: "UP" | "DOWN" | "LEFT" | "RIGHT";
    //   refresh?: boolean;
    isHidden?: boolean;
};

const btnColor: any = {
    // 'blue' : ' text-white bg-[#19a6e7] rounded hover:bg-[#0d95d4]',
    // 'black': ' text-white bg-[#333322] rounded hover:bg-gray-500 disabled:bg-gray-200 hover:bg-gray-300',
    // 'gray' : ' text-black bg-gray-200 rounded border-gray-400 hover:bg-gray-300',
    // 'grey' : ' text-black bg-gray-200 rounded border-gray-400 hover:bg-gray-300',
    // 'green': ' text-white bg-green-500 rounded hover:bg-green-800',
    // 'orange': ' text-white bg-yellow-500 rounded hover:bg-yellow-800',
    // 'pink' : ' text-white bg-pink-500 rounded hover:bg-pink-800',
    // 'red'  : ' text-white bg-[#f94164] rounded hover:bg-[#dd2548]',
    // 'white': ' text-black font-bold bg-white rounded border border-gray-400 hover:bg-gray-100',
    'sky-fill': 'text-white bg-sky-500 rounded hover:bg-sky-600',
    'amber-fill': 'text-white bg-amber-200 rounded hover:bg-amber-500',
    'green': 'text-white bg-green-500 rounded hover:bg-green-800',
    'pink': 'text-white bg-pink-500 rounded hover:bg-pink-800',
    'red': 'text-white bg-red-500 rounded hover:bg-red-800',
    'black': 'text-white bg-black rounded hover:bg-gray-500 disabled:bg-gray-200 hover:bg-gray-300',
    'gray': 'text-white bg-gray-400 rounded border-gray-400 hover:bg-gray-300',
    'white': 'text-black font-bold bg-white rounded border border-gray-400 hover:bg-gray-100',
    'sky-outline': 'bg-transparent hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-400  hover:border-transparent rounded',
    'gray-outline': 'bg-transparent hover:bg-gray-900/75 text-gray-700/75 hover:text-white border border-gray-700/75  hover:border-transparent rounded',
    'green-outline': 'bg-transparent hover:bg-green-600/75 text-green-600/75 hover:text-white border border-green-600/75  hover:border-transparent rounded',
    'orange-outline': 'bg-transparent hover:bg-orange-600/75 text-orange-600/75 hover:text-white border border-orange-600/75  hover:border-transparent rounded',
    'red-outline': 'bg-transparent hover:bg-red-600/75 text-red-600/75 hover:text-white border border-red-600/75  hover:border-transparent rounded',

}

const getColor = (label: string, color: string = '') => {
    var c = color.toLowerCase();
    if (!c) {
        switch (label.toLowerCase()) {
            case "search":
                c = 'sky-fill';
                break;
            case "add":
            case "new":
                c = 'gray-outline';
                break;
            case "save":
                c = 'red-outline';
                break;
            case "cancel":
            case "reset":
                c = 'gray';
                break;
            case "refresh":
                c = 'gray-outline'
            default:
                c = 'black';
                break;
        }
    }
    if (!btnColor[c]) return btnColor['black'];

    return btnColor[c];
}

const getIcon = (label: string, icon: JSX.Element, size:string) => {
    if (icon === null) return null;
    //var size = 14;

    if (icon) return cloneElement(icon as ReactElement, { size });

    switch (label.toLowerCase()) {
        case "search":
            icon = <FaSearch size={size} />;
            break;
        case "new":
            icon = <TiPlus size={size} />;
            break;
        case "add":
            icon = <TiPlus size={size} />;
            break;
        case "save":
            icon = <RiSave2Fill size={size} />;
            break;
        case "reset":
            icon = <GrPowerReset size={size} />;
            break;
        case "refresh":
            icon = <HiOutlineRefresh size={size} />
            break;
        case "download":
            icon = <GrDownload size={size} />
    }
    return (
        icon
    )
}

export const Button: React.FC<ButtonProps> = (props) => {

    const { t } = useTranslation();
    const { id, label, disabled, color, type, size, isHidden, icon, onClick
    } = props;

    const disabledCss = "disabled:bg-gray-200 hover:bg-gray-300'"

    return (
        <button
            className={`m-1 flex flex-row gap-0.5 h-8 w-full w-min-24 p-1 text-xs font-medium ml-auto flex items-center justify-center ${getColor(label ? label : id, color)}
            ${isHidden ? "hidden" : ""}
            ${disabledCss}`}
            id={label}
            onClick={onClick}
            type={type ? type : "button"}
            disabled={disabled ? true : false}>
            {getIcon(label ? label : id, icon,  size? size : '14')}
            {t((label ? label : id).toLowerCase())}
        </button>
    );
};


export const ICONButton: React.FC<ButtonProps> = (props) => {

    const { t } = useTranslation();
    const { id, label, disabled, color, type, size, isHidden, icon, onClick
    } = props;

    const disabledCss = "disabled:bg-gray-200 hover:bg-gray-300'"

    return (
        <button
            className={`m-1 flex flex-row gap-0.5 h-8 w-full w-min-24 p-1 text-xs font-medium ml-auto flex items-center justify-center text-gray-500 hover:text-sky-500 
            ${isHidden ? "hidden" : ""}
            ${disabledCss}`}
            id={label}
            onClick={onClick}
            type={type ? type : "button"}
            disabled={disabled ? true : false}>
            {getIcon(label ? label : id, icon, size? size : '14')}
        </button>
    );
};