'use client'

import { FiSettings, FiMenu, FiUser, FiExternalLink } from "react-icons/fi";
import { useConfigs } from "states/useConfigs";
import { useEffect, useState, useMemo } from "react";
import { useUserSettings } from "states/useUserSettings";
// import { useSession, signIn, signOut } from 'next-auth/react';
import { logOut } from "@/services/serverAction";
import {signOut} from "next-auth/react";
import { shallow } from "zustand/shallow";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
const { log } = require("@repo/kwe-lib/components/logHelper");

export default function Navbar() {
  const config = useConfigs((state) => state.config);
  const {
    data: userSettings,
    actions: userSettingsActions
  } = useUserSettings((state) => state);
  const { rightSidebar, collapsed } = config;
  const configActions = useConfigs((state) => state.actions);
  // const [user_nm, setUserNm] = useState('');
  let user_nm = useUserSettings((state) => state.data.user_nm, shallow);
  const [greeting, setGreeting] = useState('');
  // const user_nm = useUserSettings.getState().data.user_nm;
  const { t } = useTranslation();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (user_nm) {
      setGreeting(user_nm);
    }
  }, [user_nm])


  log("navbar", !user_nm, user_nm);


  return (
    <div className="text-gray-900 bg-white border-b border-gray-100 dark:bg-gray-900 dark:text-white dark:border-gray-800 h-[3.75rem]">
      {true &&
        <div className="flex items-center justify-start w-full">
          <button
            onClick={() =>
              configActions.
                setConfig({
                  collapsed: !collapsed,
                })
            }
            className="mx-4">
            <FiMenu size={20} />
          </button>
          <span className="ml-auto"></span>

          <button
            className="flex items-center justify-center h-[3.7rem] mx-4"
            onClick={() => null}>
            <FiUser size={18} />
            <span className="ml-1">{greeting === '' ? greeting : greeting + t("nav_hello")}</span>
          </button>
          <button
            className="flex items-center justify-center h-[3.7rem] mx-4"
            onClick={() => {
              localStorage.removeItem('USER_SETTINGS')
              // signOut({ callbackUrl: "/login" });
              logOut();
              // signOut({
              //   redirect:true,
              //   // callbackUrl:'/login'
              // })
            }}>
            <FiExternalLink size={18} />
            <span className="ml-1"> {t("logout")}</span>
          </button>
          <button
            className="flex items-center justify-center  h-[3.7rem] mx-4"
            onClick={() =>
              configActions.
                setConfig({
                  rightSidebar: !rightSidebar,
                })
            }>
            <FiSettings size={18} />
            <span className="hidden ml-1 md:flex">{t("setting")}</span>
          </button></div>
      }



    </div>

  );
};

// export default Navbar;
