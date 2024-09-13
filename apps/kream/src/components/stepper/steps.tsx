export type ItemProps = {
  title: string;
  subtitle?: string;
  active: boolean;
  disabled: boolean;
};
export const Steps1: React.FC = () => {
  const items: ItemProps[] = [
    { title: "01", active: true, disabled: false },
    { title: "02", active: false, disabled: true },
    { title: "03", active: false, disabled: true },
    { title: "04", active: false, disabled: true },
  ];

  return (
    <div className="relative steps-1">
      <div className="flex flex-row flex-wrap w-full mb-8">
        {items.map((item, key) => (
          <div
            key={key}
            className={`number flex w-1/4 items-center justify-center ${
              item.disabled ? "opacity-25 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => {
              //eslint-disable-next-line
              console.log(item);
            }}
          >
            <span
              className={`h-8 w-8 bg-blue-500 text-gray-200 flex items-center justify-center rounded-full text-lg font-display font-extrabold z-10`}
            >
              {key + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Steps2: React.FC = () => {
  const items: ItemProps[] = [
    {
      title: "Step 1",
      subtitle: "Lorem ipsum dolor",
      active: true,
      disabled: false,
    },
    {
      title: "Step 2",
      subtitle: "Lorem ipsum dolor",
      active: false,
      disabled: true,
    },
    {
      title: "Step 3",
      subtitle: "Lorem ipsum dolor",
      active: false,
      disabled: true,
    },
    {
      title: "Step 4",
      subtitle: "Lorem ipsum dolor",
      active: false,
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-col w-full mb-8 lg:flex-wrap lg:flex-row">
      {items.map((item, key) => (
        <div
          key={key}
          className={`flex w-full lg:w-1/4 items-center p-2 justify-start ${
            item.disabled
              ? "opacity-25 cursor-not-allowed"
              : "cursor-pointer bg-blue-500 text-white"
          }`}
          onClick={() => {
            //eslint-disable-next-line
            console.log(item);
          }}
        >
          <div className="w-8 shrink-0">
            <span
              className={`h-8 w-8 ${
                item.active
                  ? "bg-white text-gray-900"
                  : "bg-blue-700 text-white"
              } flex items-center justify-center rounded-full text-lg font-display font-extrabold`}
            >
              {key + 1}
            </span>
          </div>
          <div className="flex flex-col w-full ml-4">
            <div className="text-sm font-bold">{item.title}</div>
            <div className="text-sm">{item.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export const Steps3: React.FC = () => {
  const items: ItemProps[] = [
    {
      title: "작성중",
      active: true,
      disabled: false,
    },
    {
      title: "선사부킹완료",
      active: false,
      disabled: true,
    },
    {
      title: "배차통관완료",
      active: false,
      disabled: true,
    },
    {
      title: "BL작성중",
      active: false,
      disabled: true,
    },
    {
      title: "EDI신고여부",
      active: false,
      disabled: true,
    },
    {
      title: "선적완료",
      active: false,
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-col w-full mb-8 lg:flex-wrap lg:flex-row">
      {items.map((item, key) => (
        <div
          key={key}
          className="flex items-center justify-center w-full lg:w-1/4"
        >
          <button
            disabled={item.disabled}
            onClick={() => {
              //eslint-disable-next-line
              console.log(item.title);
            }}
            className={`font-bold uppercase text-xs px-4 py-2 w-full ${
              item.active
                ? "bg-blue-500 text-white"
                : "bg-transparent text-gray-900"
            }`}
            type="button"
          >
            {item.title}
          </button>
        </div>
      ))}
    </div>
  );
};

import React, { useEffect, useState } from "react";

const initialSteps = [
  { number: 0, title: "작성중", description: "", active: true },
  { number: 1, title: "선사부킹완료", description: "" },
  { number: 2, title: "배차통관완료", description: "" },
  { number: 3, title: "BL작성중", description: "" },
  { number: 4, title: "신고여부", description: "" },
  { number: 5, title: "선적완료", description: "" },
];

const StepList = ({ state }: any) => {
  const steps = initialSteps.map((step) => ({
    ...step,
    active: step.number === parseInt(state),
  }));

  return (
    <ol className="flex items-center w-full space-y-4 sm:flex sm:space-x-4 sm:space-y-0 rtl:space-x-reverse">
      {steps.map((step, index) => (
        <li
          key={index}
          className={`flex items-center ${
            step.active
              ? "text-blue-800 dark:text-blue-500"
              : "text-gray-700 dark:text-gray-400"
          } space-x-2.5 rtl:space-x-reverse ${step.active ? "animate-pulse" : ""}`}
        >
          <span
            className={`flex items-center  justify-center w-8 h-8 border ${
              step.active
                ? "border-blue-800 dark:border-blue-500"
                : "border-gray-500 dark:border-gray-400"
            } rounded-full shrink-0`}
          >
            {step.number + 1}
          </span>
          <span>
            <h3
              className={`font-xs  leading-tight ${
                step.active ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {step.title}
            </h3>
            <p className="text-xs">{step.description}</p>
          </span>
        </li>
      ))}
    </ol>
  );
};

export default StepList;
