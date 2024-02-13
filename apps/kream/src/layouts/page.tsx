'use client'

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
// import Centered from "layouts/centered";
// import LoginTypeA from "./login-type-A";
// import LoginTypeB from "./login-type-B";
import Layout1 from "layouts/layout-1";
import { useConfigs } from "states/useConfigs";
import AuthProvider from "@/components/provider/AuthProvider";
import { useHotkeys } from "react-hotkeys-hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

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
    // case "/404":
    // case "/500":
    //   return <Centered>{children}</Centered>;
    // case "/example/login-1":
    // case "/example/login-2":
    // case "/example/login-3":
    // case "/logout":
    // case "/reset-password":
    // case "/forgot-password":
    // case "/lock-screen":
    // case "/subscribe":
    // case "/error-page":
    // case "/coming-soon":
    //   return <Centered>{children}</Centered>;
    // case "/example/login-new-1":
    //   return <LoginTypeA>{children}</LoginTypeA>;
    // case "/example/login-new-2":
    case "/login":
    //   return <LoginTypeB>{children}</LoginTypeB>;
        return <>{children}</>
    // case "/sidebars":
    //   return <>{children}</>;
    // case "/epod":
    //   return <>{children}</>;
    default:
      return (
        // <AuthProvider>
          <Layout1>
            <QueryClientProvider client={queryClient}>
            {children}
            </QueryClientProvider>
          </Layout1>
        // </AuthProvider>
      );
  }
};

export default Layouts;
