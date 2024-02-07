'use client'

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import Layout1 from "layouts/layout-1";
import { useConfigs } from "states/useConfigs";
import AuthProvider from "@/components/provider/AuthProvider";
import { useHotkeys } from "react-hotkeys-hook";

export type LayoutProps = {
  children: React.ReactNode;
};



const Layouts: React.FC<LayoutProps> = ({ children }) => {

  const config = useConfigs((state) => state.config);
  const configActions = useConfigs((state) => state.actions);
  const { background } = config;
  useEffect(() => {
    const root = window.document.documentElement;
    const backgroundClass = background === "light" ? "dark" : "light";
    root.classList.remove(backgroundClass);
    root.classList.add(background);
  }, [background]);

  useHotkeys(
    "ctrl+i",
    () => {
      const root = window.document.documentElement;
      const backgroundClass = background === "light" ? "dark" : "light";
      root.classList.remove(backgroundClass);
      root.classList.add(background);
      configActions.setConfig({
        background: backgroundClass,
      });
    },
    [background]
  );

  // const router = useRouter();
  // const { pathname, query } = router;

  const pathname = usePathname()
  console.log("app/layouts/page.tsx", pathname);
  // let relativeURL = "";
  // if (query?.slug) {
  //   relativeURL = pathname.replace("/[...slug]", "");
  // } else {
  //   relativeURL = pathname;
  //   if (relativeURL.includes("[...slug]")) return <></>;
  // }

  switch (pathname) {

    case "/login":
        return <>{children}</>
    default:
      return (
        // <AuthProvider>
          <Layout1>
            {children}
            <ProgressBar height="4px" color="#FF5500" shallowRouting/>
          </Layout1>
        // </AuthProvider>
      );
  }
};

export default Layouts;
