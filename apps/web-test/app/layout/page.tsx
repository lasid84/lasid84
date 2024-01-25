'use client'

import "@/app/css/layouts/layout-1.css";

import Head from "next/head";
import {useConfigs} from "@/app/states/useConfigs";
// import Navbar1 from "components/navbar-1";
import SideNav from '@/app/ui/dashboard/sidenav';
import LeftSidebar from '@/app/page-parts/left-sidebar/page';
// import LeftSidebar1 from "components/left-sidebar-1";
// import RightSidebar1 from "components/right-sidebar-1";
import App from "./App";
import { Component, Fragment, useEffect, useState } from "react";
import {useNavigation, setNavigationData} from "@/app/states/useNavigation";
import { useStore } from "@/app/utils/zustand";
import { useUserSettings } from "@/app/states/useUserSettings";

import { useSession } from "next-auth/react"
const { log } = require("@repo/kwe-lib/components/logHelper");

export type Layout1Props = {
  children: React.ReactNode;
};

const Layout1: React.FC<Layout1Props> = ({children}) => {
  const config = useConfigs((state) => state.config);
  const {background, layout, collapsed} = config;

  const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
  //   const { data: session, update } = useSession()

  //   const [isReady, setReady] = useState(false);

  // () => {
  //   const userData = session?.user;
  //   console.log("LeftSidebar start", userData.user_id); 
  //   userSettingsActions!.setData(userData);    
  //   console.log("LeftSidebar start useUserSettings", useUserSettings.getState().data);    
    
  //   setReady(true);

  //   console.log("isReady!?!", isReady); 
  // }

  return (
    <App>
      <Head>
        <title>KREAM Web</title>
      </Head>
      <div
        data-layout={layout}
        data-collapsed={collapsed}
        data-background={background}
        className={`font-sans antialiased text-sm disable-scrollbars ${
          background === "dark" ? "dark" : ""
        }`}>
        {/* <RightSidebar1 /> */}
        <div className="wrapper">
          <div className="">
            <LeftSidebar />
          </div>
          <div className="w-full text-gray-900 main bg-gray-50 dark:bg-gray-900 dark:text-white">
            {/* <Navbar1 /> */}
            <div className="w-full min-h-screen p-4">{children}</div>
          </div>
        </div>
      </div>
    </App>
  );
};
export default Layout1;
