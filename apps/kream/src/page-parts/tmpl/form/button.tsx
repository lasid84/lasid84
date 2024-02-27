import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useConfigs } from "../../../states/useConfigs";
import { FiShoppingCart, FiArrowDown as ChevronDownIcon } from "react-icons/fi";
// import { ChevronDownIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { RiRefreshLine } from "react-icons/ri";
import { FaArrowsAltH } from "react-icons/fa";
import { BsArrowsAngleExpand, BsArrowsExpand, BsArrowsExpandVertical } from "react-icons/bs";

export type ButtonProps = {
  label: string;
  onClick?: any;
  disabled?: boolean;
  type?: "submit" | "button";
  direction?: "UP" | "DOWN" | "LEFT" | "RIGHT";
  refresh?: boolean;
  isHidden?: boolean;
};

export const TSubmitButton: React.FC<ButtonProps> = ({ label }) => {
  return (
    <button
      type="submit"
      className="h-[32px] px-4 py-2 text-xs font-bold text-white bg-[#19a6e7] rounded hover:bg-[#0d95d4]">
      {label}
    </button>
  );
};

export const TCancelButton: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="h-[32px] px-4 py-2 rounded text-xs font-bold text-black bg-gray-200 border border-gray-400 hover:bg-gray-300 ">
      {label}
    </button>
  );
};

export const TButtonBlue: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="h-[32px] px-4 py-2 text-xs font-bold text-white bg-[#19a6e7] rounded hover:bg-[#0d95d4]">
      {label}
    </button>
  );
};

export const TButtonRed: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="h-[32px] px-4 py-2 rounded text-xs font-bold text-white bg-[#f94164] hover:bg-[#dd2548]">
      {label}
    </button>
  );
};

export const TButtonBlack: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="h-[32px] px-4 py-2 text-xs font-bold text-white bg-[#333333] rounded hover:bg-gray-600 ">
      {label}
    </button>
  );
};

export const TButtonOrange: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="h-[32px] px-4 py-2 text-xs font-bold text-white bg-yellow-500 rounded hover:bg-yellow-800 ">
      {label}
    </button>
  );
};

export const TButtonGreen: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="h-[32px] px-4 py-2 text-xs font-bold text-white bg-green-500 rounded hover:bg-green-800 ">
      {label}
    </button>
  );
};

export const TButtonPink: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="h-[32px] px-4 py-2 text-xs font-bold text-white bg-pink-500 rounded hover:bg-pink-800 ">
      {label}
    </button>
  );
};

export const TButtonWhite: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="h-[32px] px-4 py-1 text-xs text-black font-bold bg-white rounded border border-gray-400 hover:bg-gray-100 ">
      {label}
    </button>
  );
};

export const TButtonGray: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="h-[32px] px-4 py-1 text-xs font-bold text-black bg-gray-200 rounded border border-gray-300 hover:bg-gray-300 ">
      {label}
    </button>
  );
};

export const TButtonKart: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex flex-row gap-2 h-[32px] px-4 py-2 text-xs font-bold text-white bg-[#19a6e7] rounded hover:bg-[#0d95d4]">
      <FiShoppingCart size={18} className="stroke-current" />
      {label}
    </button>
  );
};

export const TButtonBlueDisabled: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = "submit" || "button",
}) => {
  const disabledCss = disabled
    ? "bg-gray-200 hover:bg-gray-300"
    : " bg-[#19a6e7] hover:bg-[#0d95d4]";
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`h-[32px] px-4 py-2 text-xs font-bold text-white rounded ${disabledCss}`}>
      {label}
    </button>
  );
};

export const TButtonOrangeDisabled: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = "submit" || "button",
}) => {
  const disabledCss = disabled
    ? "bg-gray-200 hover:bg-gray-300"
    : "bg-yellow-500 hover:bg-yellow-800";
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`h-[32px] px-4 py-2 text-xs font-bold text-white rounded ${disabledCss}`}>
      {label}
    </button>
  );
};

export const TButtonGrayDisabled: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = "submit" || "button",
}) => {
  const disabledCss = disabled
    ? "bg-gray-200 hover:bg-gray-300 text-white"
    : "bg-gray-200 hover:bg-gray-300 text-black";
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`h-[32px] px-4 py-2 text-xs font-bold rounded border border-gray-300 ${disabledCss}`}>
      {label}
    </button>
  );
};

export const TButtonMove: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = "button",
  direction = "LEFT",
}) => {
  const disabledCss = disabled ? "bg-gray-200 hover:bg-gray-300" : "bg-white hover:bg-gray-100";
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`h-[70px] w-[50px] text-xs font-bold text-black rounded border border-gray-200 ${disabledCss}`}>
      <ChevronDownIcon
        className={clsx(
          "w-8 ml-2 duration-300 ease-in-out fill-black",
          direction === "UP" && "-rotate-180",
          direction === "DOWN" && "rotate-0",
          direction === "LEFT" && "rotate-90",
          direction === "RIGHT" && "-rotate-90"
        )}
        aria-hidden="true"
      />
      <span>{label}</span>
    </button>
  );
};

export const TButtonRefresh: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = "button",
  refresh,
}) => {
  const disabledCss = disabled
    ? "bg-gray-200 hover:bg-gray-300"
    : " bg-[#19a6e7] hover:bg-[#0d95d4]";
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`inline-flex justify-center items-center h-[32px] px-4 py-2 text-xs font-bold text-white rounded ${disabledCss}`}>
      {label}
      <RiRefreshLine
        color="#FFFFFF"
        className={clsx("w-5 ml-2 duration-300 ease-in-out", refresh && "animate-spin")}
        size={18}
      />
    </button>
  );
};

export const TButtonRedDisabled: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = "submit" || "button",
}) => {
  const disabledCss = disabled
    ? "bg-gray-200 hover:bg-gray-300"
    : "bg-[#f94164] hover:bg-[#dd2548]";
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`h-[32px] px-4 py-2 text-xs font-bold text-white rounded ${disabledCss}`}>
      {label}
    </button>
  );
};

export const TButtonHideBlue: React.FC<ButtonProps> = ({ label, onClick, isHidden }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`h-[32px] px-4 py-2 text-xs font-bold text-white bg-[#19a6e7] rounded hover:bg-[#0d95d4] ${
        isHidden ? "hidden" : ""
      }`}>
      {label}
    </button>
  );
};

export const TButtonGreenDisabled: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = "submit" || "button",
}) => {
  const disabledCss = disabled
    ? "bg-gray-200 hover:bg-gray-300"
    : "bg-green-500 hover:bg-green-800";
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`h-[32px] px-4 py-2 text-xs font-bold text-white rounded ${disabledCss}`}>
      {label}
    </button>
  );
};

export const TButtonGridOrientation: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  type = "button",
  direction = "LEFT",
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`inline-flex justify-center items-center h-[32px] w-[32px]`}>
      {direction && (direction === "LEFT" || direction === "RIGHT") && <BsArrowsExpand size={20} />}
      {direction && (direction === "UP" || direction === "DOWN") && (
        <BsArrowsExpandVertical size={20} />
      )}
    </button>
  );
};
