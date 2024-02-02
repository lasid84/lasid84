'use client'
import { FiSettings, FiMenu, FiUser, FiExternalLink } from "react-icons/fi";
import { useConfigs } from "states/useConfigs";
import { useRouter } from "next/router";
import { useEffect, useRef, useMemo, useState } from "react";
import { useUserSettings } from "states/useUserSettings";
import { useSession, signIn, signOut } from 'next-auth/react';
import { Tab } from "page-parts/acct/tab-list"
import LoadingComponent from "page-parts/loadming";

const Navbar: React.FC = () => {
  const config = useConfigs((state) => state.config);
  const { rightSidebar, collapsed } = config;
  const configActions = useConfigs((state) => state.actions);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const {
    data: userSettings,
    actions: userSettingsActions
  } = useUserSettings((state) => state);

  const isLoading = useMemo(() => {
    return (userSettings.loading && userSettings.loading == "ON")
  }, [userSettings.loading])

  const router = useRouter();
  const { data: session } = useSession();
  const ref = useRef<HTMLDivElement | null>(null);


  return (
    <>
      <div className="opacity-90 z-10 fixed w-full text-gray-900 bg-white border-b border-gray-100 dark:bg-gray-900 dark:text-white dark:border-gray-800">
        {
          isLoading &&
          <div className="absolute h-screen w-full z-50">
            <LoadingComponent />
          </div>
        }
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
          <div className=" flex items-center justify-start w-full">
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
              onClick={() => {
                signOut()
                localStorage.removeItem('USER_SETTINGS')
              }}>
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
            </button>
          </div>
        }
        <div className="flex flex-col align-center items-center">
          <Tab tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </div>
      </div>

    </>
  );
};

export default Navbar;
