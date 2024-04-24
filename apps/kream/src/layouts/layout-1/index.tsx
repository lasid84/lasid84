'use client';

import Head from "next/head";
import { useConfigs } from "states/useConfigs";
import Navbar1 from "components/navbar-1";
import LeftSidebar1 from "components/left-sidebar-1";
import RightSidebar1 from "components/right-sidebar-1";
import App from "../App";
import { Suspense, useEffect, useState } from "react";
import { useUserSettings } from "states/useUserSettings";
import { memo, useMemo } from "react";
import { setI18n } from "components/i18n/i18n";
import LoadingComponent from "../../components/loading/loading"
import PageTitle from "components/page-title/page-title";
import { useNavigation } from "states/useNavigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toastWaring } from "@/components/toast";
import { getSession } from "@/services/serverAction";
const { log } = require("@repo/kwe-lib/components/logHelper");

export type Layout1Props = {
  children: React.ReactNode;
};

function checkAuth(menu: string[], url:string, menu_param:string|null):boolean {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1].toUpperCase().trim();

  if (url === '/' || lastPart === 'DASHBOARD') return true;

  if (menu?.some(m => m === lastPart.trim() + (menu_param ? menu_param : ''))) return true;

  // log("checkAuth", lastPart.trim(), menu_param, lastPart.trim() + (menu_param ? menu_param : ''));

  return false;
}

const Layout1: React.FC<Layout1Props> = ({ children }) => {

  const config = useConfigs((state) => state.config);

  const [background, setBackground] = useState<string>(config.background);
  const [layout, setLayout] = useState<string>(config.layout);
  const [collapsed, setCollapsed] = useState<boolean>(config.collapsed);
  const [menus, isReady] = useNavigation((state) => [state.menu_arr, state.isReady]);
  const url = usePathname();
  const queryParam = useSearchParams();
  const params = queryParam.get('params');
  const router = useRouter();
  
  log("app/layouts/layout-1/index.tsx");

  useEffect(() => {
    setBackground(config.background)
  }, [config.background]);

  useEffect(() => {
    setLayout(config.layout)
  }, [config.layout]);

  useEffect(() => {
    setCollapsed(config.collapsed)
  }, [config.collapsed]);

  // const { i18n } = useTranslation();

  useEffect(() => {
    setI18n(config.lang);
  }, [])

  useEffect(() => {

    const sessionCheck = async () => {

      const user = useUserSettings.getState().data;
      if (!user.user_id) router.replace('/login');

      const session = await getSession();
      log("layout index session", session);
      if (!session) router.replace('/login');
    };
    sessionCheck();

    if (isReady) {
      if (!checkAuth(menus, url, params)) {
        log(menus, url, isReady);
        toastWaring(url + " 권한이 없습니다.");
        router.replace('/');
      }
    }
  }, [isReady])

  const {
    data: userSettings,
    actions: userSettingsActions
  } = useUserSettings((state) => state);

  const isLoading = useMemo(() => {
    //client data loading 용
    return (userSettings.loading == "ON")
  }, [userSettings.loading])


  return (
    // <AuthProvider>
    <App>
      <div
        data-layout={layout}
        data-collapsed={collapsed}
        data-background={background}
        className={`font-sans antialiased text-sm disable-scrollbars ${background === "dark" ? "dark" : "light"
          }`}>
        {
          isLoading &&
          <div className="absolute z-50 w-full h-screen">
            <LoadingComponent />
          </div>
        }

        <RightSidebar1 />
        <div className="wrapper">
          <div className="">
            <LeftSidebar1 />
          </div>
          <div className="w-full h-screen text-gray-900 main bg-gray-50 dark:bg-gray-900 dark:text-white">
            <Navbar1 />
            <PageTitle />
            <div className="h-[calc(100vh-60px)] overflow-y-auto px-4 py-1">{children}</div>
          </div>
        </div>
      </div>
    </App>
    //  </AuthProvider>
  );
};
export default Layout1;
