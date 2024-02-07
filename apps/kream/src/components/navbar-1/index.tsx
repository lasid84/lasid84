'use client'

import { FiSettings, FiMenu, FiUser, FiExternalLink } from "react-icons/fi";
import { useConfigs } from "states/useConfigs";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserSettings } from "states/useUserSettings";
import { useSession, signIn, signOut } from 'next-auth/react';
import { shallow } from "zustand/shallow";

export default function Navbar() {
  const config = useConfigs((state) => state.config);
  const { rightSidebar, collapsed } = config;
  const configActions = useConfigs((state) => state.actions);
  // const [user_nm, setUserNm] = useState('');
  let user_nm = useUserSettings((state) => state.data.user_nm, shallow);
  const [greeting, setGreeting] = useState('');
  // const user_nm = useUserSettings.getState().data.user_nm;

  useEffect(() => {
    // if (!user_nm) {
    //   router.replace("/login");
    // }
    if (user_nm) {
      setGreeting(user_nm + "님 안녕하세요");
    }
  }, [user_nm])

  const router = useRouter();

  console.log("navbar", !user_nm, user_nm);

  return (
    <div className="text-gray-900 bg-white border-b border-gray-100 dark:bg-gray-900 dark:text-white dark:border-gray-800 h-[3.75rem]">

      {true &&
        // // ? <div className="flex items-center justify-start w-full">
        // //   <button
        // //     onClick={() =>
        // //       configActions.
        // //         setConfig({
        // //           collapsed: !collapsed,
        // //         })
        // //     }
        // //     className="mx-4">
        // //     <FiMenu size={20} />
        // //   </button>
        // //   <span className="ml-auto"></span>
        // //   <p>이 페이지는 로그인이 필요한 페이지입니다./{user_nm}</p>

        // //   <button
        // //     className="flex items-center justify-center h-12 mx-4"
        // //     onClick={() => router.push("/login")}>
        // //      <FiUser size={18} />
        // //     <span className="ml-1">로그인</span>
        // //      </button>
        // // </div>
        // // :

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
            <span className="ml-1">{greeting}</span>
          </button>
          <button
            className="flex items-center justify-center h-[3.7rem] mx-4"
            onClick={() => {
              localStorage.removeItem('USER_SETTINGS')
              signOut({ callbackUrl: "/login" });
            }}>
            <FiExternalLink size={18} />
            <span className="ml-1">로그아웃</span>
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
            <span className="ml-1 hidden md:flex">설정</span>
          </button></div>
      }



    </div>

  );
};

// export default Navbar;
