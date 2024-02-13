'use client'

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import Layout1 from "layouts/layout-1";
import { useConfigs } from "states/useConfigs";
import AuthProvider from "@/components/provider/AuthProvider";
import { useHotkeys } from "react-hotkeys-hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type LayoutProps = {
  children: React.ReactNode;
};



const Layouts: React.FC<LayoutProps> = ({ children }) => {

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { // 서버비용을 줄이기 위한 refetch 설정
          queries: {
            retry: false, //API 요청실패 시 재시도 하는 옵션 (설정값 만큼 재시도)
            refetchOnWindowFocus: false, //원도우가 다시 포커스 되었을 때 데이터를 refresh
            refetchOnMount: false, //데이터가 stale 상태이면 컴포넌트가 마운트 될 때 refresh
          },
        },
      })
  );

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

    case "/login":
      return <>{children}</>
    default:
      return (
        // <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Layout1>
            <QueryClientProvider client={queryClient}>
            {children}
<<<<<<< HEAD
            </QueryClientProvider>
=======
            <ReactQueryDevtools initialIsOpen={process.env.NEXT_PUBLIC_MODE ==='local'}/>
            <ProgressBar height="4px" color="#FF5500" shallowRouting />
>>>>>>> c03cfa43b16528ff44aae3f839fbf134b8811281
          </Layout1>
        </QueryClientProvider>
        // </AuthProvider>
      );
  }
};

export default Layouts;
