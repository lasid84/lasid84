// 'use server'
'use client'

import { setI18n } from "components/i18n/i18n";
import { useConfigs } from "states/useConfigs";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from './_component/test';
import { FaChevronDown } from "react-icons/fa";

export default function Home() {
  const { t } = useTranslation();
  
  
  return (
    <>
        <label
          className={`w-full md:text-left mx-1 py-2`}>
          라벨
        </label>        
        <CustomSelect/>
    </>
  );
}

