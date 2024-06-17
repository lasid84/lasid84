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
import { useNavigation } from "states/useNavigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getSession } from "services/serverAction";
import { SP_InsertLog  } from "services/clientAction";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { shallow } from "zustand/shallow";

const { log } = require("@repo/kwe-lib/components/logHelper");

export type Layout1Props = {
  children: React.ReactNode;
};

const Layout1: React.FC<Layout1Props> = ({ children }) => {

  const config = useConfigs((state) => state.config);
  
  const [background, setBackground] = useState<string>(config.background);
  const [layout, setLayout] = useState<string>(config.layout);
  const [collapsed, setCollapsed] = useState<boolean>(config.collapsed);
  const [menus, isReady] = useNavigation((state) => [state.menu_arr, state.isReady]);
  const pathname = usePathname();
  const queryParam = useSearchParams();
  const params = queryParam.get('params');
  const router = useRouter();
  const { Create } = useUpdateData2(SP_InsertLog, '');
  
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
      if (!user.user_id) {
        log('sessionCheck', user)
        router.replace('/login');
        return;
      }

      const session = await getSession();
      log("layout index session", session);
      if (!session) {
        router.replace('/login');
        return;
      }
    };
    // 2024.06.13 버그로 인한 주석(세션체크 로직 다시 검토 필요)
    // sessionCheck();

    if (!isReady) {
      return;
      // if (!checkAuth(menus, url, params)) {
      //   log(menus, url, isReady);
      //   toastWaring(url + " 권한이 없습니다.");
      //   router.replace('/');
      // }
    }
  }, [isReady])

  const {
    data: userSettings,
    // actions: userSettingsActions
  } = useUserSettings((state) => state);

  const isLoading = useMemo(() => {
    //client data loading 용
    return (userSettings.loading == "ON")
  }, [userSettings.loading])

  useEffect(() => {
    if (pathname === '/') return;

    var data = {
        menucode: pathname,
        action: 'Open'
    }
    Create.mutate(data);
    
  }, [pathname, params])
   
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
            <div className="h-[calc(100vh-60px)] overflow-y-auto px-4 ">{children}</div>
          </div>
        </div>
      </div>
    </App>
    //  </AuthProvider>
  );
};
export default Layout1;
