'use client'
import { FiSettings, FiMenu, FiUser, FiExternalLink } from "react-icons/fi";
import { useConfigs } from "states/useConfigs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUserSettings } from "states/useUserSettings";
import { useSession, signIn, signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  const config = useConfigs((state) => state.config);
  const { rightSidebar, collapsed } = config;
  const configActions = useConfigs((state) => state.actions);

  const router = useRouter();
  const { data: session } = useSession();


  return (
    <div className=" text-gray-900 bg-white border-b border-gray-100 dark:bg-gray-900 dark:text-white dark:border-gray-800">
      {!session?.user
        ? <div className="flex items-center justify-start w-full">
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
          <p>이 페이지는 로그인이 필요한 페이지입니다.</p>
          
          <button
            className="flex items-center justify-center h-12 mx-4"
            onClick={() => router.push("/login")}>
             <FiUser size={18} />
            <span className="ml-1">로그인</span>
             </button>
        </div>

        :
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
            className="flex items-center justify-center h-12 mx-4"
            onClick={() => null}>
            <FiUser size={18} />
            <span className="ml-1">{session.user.user_nm}님 안녕하세요</span>
          </button>
          <button
            className="flex items-center justify-center h-12 mx-4"
            onClick={()=>{
              signOut()
              localStorage.removeItem('USER_SETTINGS')}}>
            <FiExternalLink size={18} />
            <span className="ml-1">로그아웃</span>
          </button>
          <button
            className="flex items-center justify-center h-12 mx-4"
            onClick={() =>
              configActions.
                setConfig({
                  rightSidebar: !rightSidebar,
                })
            }>
            <FiSettings size={18} />
            <span className="ml-1">설정</span>
          </button></div>
      }

</div>

  );
};

export default Navbar;
