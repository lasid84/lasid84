'use client';

import Head from "next/head";
import { useConfigs } from "states/useConfigs";
import Navbar1 from "components/navbar-1";
import LeftSidebar1 from "components/left-sidebar-1";
import RightSidebar1 from "components/right-sidebar-1";
import App from "../App";
import { useEffect, useState } from "react";
// import {devConsoleLog} from "../../utils/dev";
import { useSession } from "next-auth/react";
import { useUserSettings } from "@/states/useUserSettings";
import { useStore } from "@/utils/zustand";
import { memo } from "react";

import AuthProvider from 'components/provider/AuthProvider'

export type Layout1Props = {
  children: React.ReactNode;
};

const Layout1: React.FC<Layout1Props> = ({ children }) => {
  const config = useConfigs((state) => state.config);

  const [background, setBackground] = useState<string>(config.background);
  const [layout, setLayout] = useState<string>(config.layout);
  const [collapsed, setCollapsed] = useState<boolean>(config.collapsed);
  // const { data:session, update, status} = useSession();
  console.log("app/layouts/layout-1/index.tsx");

  useEffect(() => {
    setBackground(config.background)
  }, [config.background]);

  useEffect(() => {
    setLayout(config.layout)
  }, [config.layout]);

  useEffect(() => {
    setCollapsed(config.collapsed)
  }, [config.collapsed]);

  // useEffect(() => {
  //   const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
  //   userSettingsActions?.setData({...session?.user})
  // }, []);

  return (
    // <AuthProvider>
    <App>
      {/* <Head>
          <title>KREAM Web</title>
        </Head> */}
      <div
        data-layout={layout}
        data-collapsed={collapsed}
        data-background={background}
        className={`font-sans antialiased text-sm disable-scrollbars ${background === "dark" ? "dark" : "light"
          }`}>
        <RightSidebar1 />
        <div className="wrapper">
          <div className="">
            <LeftSidebar1 />
          </div>
          <div className="main w-full h-screen text-gray-900 main bg-gray-50 dark:bg-gray-900 dark:text-white">
            <Navbar1 />
            <div className="h-[calc(100vh-60px)] overflow-y-auto px-4 py-4">{children}</div>
          </div>
        </div>
      </div>
    </App>
    //  </AuthProvider>
  );
};
export default Layout1;
