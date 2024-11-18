import React, {  useState, } from 'react';
import { FaSearch, FaSpinner } from "react-icons/fa";
import { TiPlus } from "react-icons/ti";
import { RiSaveLine, RiSaveFill, RiSave2Fill } from "react-icons/ri";
import { MdOutlineAlarm } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { MouseEvent, ReactElement, cloneElement } from "react";
import { GrPowerReset } from "react-icons/gr";
import { HiOutlineRefresh } from "react-icons/hi";
import { GrDownload } from "react-icons/gr";
import { VscSymbolInterface } from "react-icons/vsc";
import { MdOutlineSyncAlt } from "react-icons/md";
import { FaClipboardCheck } from "react-icons/fa";  //clipboard
import { RxCopy } from "react-icons/rx";            //copy
import { SP_InsertLog } from "@/services/clientAction";
import { useUpdateData2 } from "../react-query/useMyQuery";
import { usePathname } from "next/navigation";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiMailSendFill } from "react-icons/ri";
import { RiUserSettingsLine } from "react-icons/ri";
import { FaTruckPickup } from "react-icons/fa";
import { LuContainer } from "react-icons/lu";
import { AiOutlineUser } from 'react-icons/ai';
import { RiFileExcel2Line } from "react-icons/ri"; //excel
import { IoSend } from "react-icons/io5";          //send
import { FaSignOutAlt } from "react-icons/fa";     //out, extraction
import { IoMdPrint } from "react-icons/io";

const { log } = require("@repo/kwe-lib/components/logHelper");

export type data = {
  data?: {}[],
  field?: any[]
} | undefined;



export type ButtonProps = {
  id: string;
  label?: string;
  onClick?: any;
  color?: string;
  icon?: any;
  disabled?: boolean;
  type?: "submit" | "button";
  size?: any; //타입 수정
  //   direction?: "UP" | "DOWN" | "LEFT" | "RIGHT";
  //   refresh?: boolean;
  isHidden?: boolean;
  isLabel?: boolean;
  isDisplay? : boolean; // Controlling the visibility of an element.
  width?: string;
  dataSrc? : data;
  options ? : {
    keyCol ?: string;
  }
  isCircle? : boolean;
  toolTip?: string;
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
  "sky-fill": "text-white bg-sky-500 rounded hover:bg-sky-600",
  "amber-fill": "text-white bg-amber-200 rounded hover:bg-amber-500",
  green: "text-white bg-green-500 rounded hover:bg-green-800",
  pink: "text-white bg-pink-500 rounded hover:bg-pink-800",
  red: "text-white bg-red-500 rounded hover:bg-red-800",
  black:
    "text-white bg-black rounded hover:bg-gray-500 disabled:bg-gray-200 hover:bg-gray-300",
  gray: "text-white bg-gray-400 rounded border-gray-400 hover:bg-gray-300",
  white:
    "text-black font-bold bg-white rounded border border-gray-400 hover:bg-gray-100",
  "sky-outline":
    "bg-transparent hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-400  hover:border-transparent rounded",
  "blue-outline":
    "bg-transparent hover:bg-sky-600 text-sky-500 hover:text-white border border-sky-500  hover:border-transparent rounded",
  "gray-outline":
    "bg-transparent hover:bg-gray-900/75 text-gray-700/75 hover:text-white border border-gray-700/75  hover:border-transparent rounded dark:border-gray-200/75 dark:text-gray-100 dark:hover:bg-gray-400",
  "green-outline":
    "bg-transparent hover:bg-green-600/75 text-green-600/75 hover:text-white border border-green-600  hover:border-transparent rounded  dark:border-green-200/75 dark:text-green-100 dark:hover:bg-green-400",
  "deep-green-outline":
    "bg-transparent hover:bg-green-800/75 text-green-800/75 hover:text-white border border-green-800  hover:border-transparent rounded  dark:border-green-400/75 dark:text-green-300 dark:hover:bg-green-600",
  "orange-outline":
    "bg-transparent hover:bg-orange-600/75 text-orange-600/75 hover:text-white border border-orange-600/75  hover:border-transparent rounded",
  "red-outline":
    "bg-transparent hover:bg-red-600/75 text-red-600/75 hover:text-white border border-red-600/75  hover:border-transparent rounded",
  "light-gray-outline":
    "bg-transparent hover:bg-gray-300/75 text-gray-900/75 hover:text-gray-900/75 border border-gray-200/75  hover:border-transparent rounded dark:border-gray-200/75 dark:text-gray-100 dark:hover:bg-gray-200",
};

const getColor = (label: string, color: string = "") => {
  var c = color.toLowerCase();
  if (!c) {
    switch (label.toLowerCase()) {
      case "search":
      case "check":
      case "request":
        c = "sky-fill";
        break;
      case "add":
      case "add_m":
      case "add_d":
      case "new":
      case "mail_rcvlist":
      case "manage_pickup":
      case "manage_cont_cy":
      case "save_template":     
      case "manage_con":   
      case "descartes":
        c = "gray-outline";
        break;
      case "delete":
        c = "light-gray-outline"
        break;
      case "download":
      case "send":
        c = "sky-outline";
        break;
      case "send_email":  
        c = "blue-outline"
        break;
      case "save":
      case "save_m":
      case "save_d":
        c = "red-outline";
        break;
      case "cancel":
      case "reset":
        c = "gray";
        break;
      case "refresh":
        c = "gray-outline";
        break;
      case "upload_excel":
        c = "green-outline";
        break;
      case "extract_hscode":
        c = "deep-green-outline";
        break;
      default:
        c = "black";
        break;
    }
  }
  if (!btnColor[c]) return btnColor["black"];

  return btnColor[c];
};

const getIcon = (label: string, icon: JSX.Element, size: string) => {
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
    case "add_m":
    case "add_d":
      icon = <TiPlus size={size} />;
      break;
    case "save":
    case "save_m":
    case "save_d":
    case "":
      icon = <RiSave2Fill size={size} />;
      break;
    case "reset":
      icon = <GrPowerReset size={size} />;
      break;
    case "refresh":
      icon = <HiOutlineRefresh size={size} />;
      break;
    case "download":
      icon = <GrDownload size={size} />;
      break;
    case "interface":
      icon = <MdOutlineSyncAlt size={size} />;
      break;
    case "alarm":
      icon = <MdOutlineAlarm size={size} />;
      break;
    case "clipboard":
      icon = <FaClipboardCheck size={size} />;
      break;
    case "bkcopy":
      icon = <RxCopy size={size} />;
      break;
    case "delete":
      icon = <RiDeleteBinLine size={size} />
      break;
    case "send_email":
      icon = <RiMailSendFill size={size} />
      break;
    case "mail_rcvlist":
      icon = <RiUserSettingsLine size={size} />
      break;
    case "manage_pickup":
      icon = <FaTruckPickup size={size}/>
      break;
    case "manage_cont_cy":
      icon = <LuContainer size={size} />
      break;
    case "manage_con":
      icon = <AiOutlineUser size={size} />
      break;
    case "upload_excel":
      icon = <RiFileExcel2Line size={size} />
      break;
    case "send":
      icon = <IoSend  size={size} />
      break;
    case "extract_hscode":
      icon = <FaSignOutAlt size={size}/>
      break;
    case "descartes":
      const descartesIcon = () => {
        return (
          <>
        <img 
            src="/images/descartes.png" 
            alt="DSG Logo"
            style={{ width: '60px', height: '24px' }} // MdOutlineAlarm과 같은 크기
        /></>)
      };
      icon = descartesIcon();
      break;
  }
  return icon;
};

export const Button: React.FC<ButtonProps> = (props) => {
  // BUTTON 순서
  // SEARCH - INTERFACE - ADD - DELETE - SAVE - DOWNLIAD - MANAGE

  const { t } = useTranslation();
  const {
    id,
    label,
    disabled,
    color,
    type,
    size,
    isHidden = false,
    isLabel = true,
    isDisplay=true,
    icon,
    onClick,
    width,
    isCircle,
    toolTip
  } = props;


  const { Create } = useUpdateData2(SP_InsertLog, "");
  const pathName = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e:MouseEvent<HTMLButtonElement>) => {
    // log("button", pathName)
    var data = {
      menucode: pathName,
      buttontype: id,
    };
    Create.mutate(data);

    if (onClick) onClick(e);
  };

  const disabledCss = "disabled:bg-gray-200 hover:bg-gray-300'";

  return (
    <div className="flex w-min-24 group">
    <button
      className={`m-1 flex flex-row gap-0.5 h-8 ${width ? width : "w-full"} w-min-24 p-1 text-xs font-medium flex items-center justify-center ${getColor(label ? label : id, color)}
            ${isHidden ? "hidden" : ""}
            ${disabledCss}
            ${isDisplay ? '' : 'invisible'}
            `}
      id={id}
      onClick={handleClick}
      type={type ? type : "button"}
      disabled={isCircle ? true : (disabled ? true : false)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    > 
      {!isCircle && getIcon(label ? label : id, icon, size ? size : "14")}
      {!isCircle && isLabel && t((label ? label : id).toLowerCase())}
      { isCircle && <><FaSpinner className="justify-center w-full animate-spin" size={20} color="#f070f3" /></> }
    </button>
    
    {showTooltip && toolTip &&
      <span className="invisible h-8 text-xs origin-bottom text-sky-500 w-35 group-hover:visible group-hover:absolute group-hover:-translate-x-6 group-hover:translate-y-9"
        style={{ zIndex: 9999 }} 
      >
        {toolTip}
      </span>
    }
    </div>
  );
};


export const DropButton: React.FC<ButtonProps> = (props) => {
  // BUTTON 순서
  // SEARCH - INTERFACE - ADD - DELETE - SAVE - DOWNLOAD - MANAGE
  const { t } = useTranslation();
  const {
    id,
    label,
    disabled,
    color,
    type,
    size,
    isHidden,
    icon,
    onClick,
    width,
    dataSrc,
    options = {},
  } = props;
  const { keyCol } = options;

  const { Create } = useUpdateData2(SP_InsertLog, "");
  const pathName = usePathname();


  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleClick = (e:MouseEvent<HTMLButtonElement>) => {
    
    if (dataSrc && dataSrc.data && dataSrc.data.length > 0) {
      setDropdownVisible((prev) => !prev);
    } 
  };
  
  const handleSelect = (item: any) => {
    var data = {
      menucode: pathName,
      buttontype: id,
    };
    Create.mutate(data);
    
    setDropdownVisible(false);
    if (onClick) onClick(item); 
  };

  const disabledCss = "disabled:bg-gray-200 hover:bg-gray-300'";

  return (
    <div className='relative'>
      <button
        className={`m-1 flex flex-row gap-0.5 h-8 ${width ? width : "w-full"} w-min-24 p-1 text-xs font-medium flex items-center justify-center ${getColor(label ? label : id, color)}
              ${isHidden ? "hidden" : ""}
              ${disabledCss}`}
        id={id}
        onClick={handleClick}
        type={type ? type : "button"}
        disabled={disabled ? true : false}
      >
        {getIcon(label ? label : id, icon, size ? size : "14")}
        {t((label ? label : id).toLowerCase())}
      </button>
            {dropdownVisible && dataSrc && dataSrc.data && dataSrc.data.length > 0 && (
              <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow-md max-h-60">
                {dataSrc.data.map((item : any, i) => (
                  <div
                    key={i}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelect(i)}
                  >
                    {keyCol && item[keyCol]}
                  </div>
                ))}
              </div>
            )}
    </div>

    
  );
};


export const ICONButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation();
  const {
    id,
    label,
    disabled,
    color,
    type,
    size,
    isHidden,
    icon,
    onClick,
    width,
  } = props;

  const { Create } = useUpdateData2(SP_InsertLog, "");
  const pathName = usePathname();

  const handleClick = (e:MouseEvent<HTMLButtonElement>) => {
    // log("button", pathName)
    var data = {
      menucode: pathName,
      buttontype: id,
    };
    Create.mutate(data);

    if (onClick) onClick(e);
  };

  const disabledCss = "disabled:bg-gray-200 hover:bg-gray-300'";

  return (
    <div className="flex w-10 group">
      <button
        className={`m-1 flex flex-row gap-0.5 h-8 ${width ? width : "w-full"} w-min-24 p-1 text-xs font-medium ml-auto flex items-center justify-center text-gray-500 hover:text-sky-500 
            ${isHidden ? "hidden" : ""}
            ${disabledCss}`}
        id={id}
        onClick={handleClick}
        type={type ? type : "button"}
        disabled={disabled ? true : false}
      >
        {getIcon(label ? label : id, icon, size ? size : "14")}
      </button>
      <span className="invisible h-8 origin-bottom text-sky-500 w-30 group-hover:visible group-hover:absolute group-hover:-translate-x-8 group-hover:translate-y-10">
        {t(label ? label : id).toLowerCase()}
      </span>
    </div>
  );
};

