
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "layouts";
import Router from "next/router";
import NProgress from "nprogress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ni18nConfig } from "configs/ni18n.config";
import { toastConfig } from "configs/toast.config";
import { appWithI18Next } from "ni18n";
import { ToastContainer } from "react-toastify";

import "css/tailwind.css";
import "css/main.css";
import "css/layouts/layout-1.css";
import "css/layouts/e-commerce.css";
import "css/animate.css";
import "css/components/left-sidebar-1/styles-lg.css";
import "css/components/left-sidebar-1/styles-sm.css";
import "css/components/nprogress.css";
import "css/components/recharts.css";
import "css/components/steps.css";
import "css/components/left-sidebar-3.css";
import "css/ag-grid/ag-grid.css";
import "css/ag-grid/ag-theme-custom.css";
import "css/vendors/ReactToastify.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

import { useRouter } from "next/router";
import { useUserSettings } from "states/useUserSettings";
import { log } from "@repo/kwe-lib/components/logHelper";

function App({ Component, pageProps }: AppProps): React.ReactElement {
  
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

  // axios.defaults.withCredentials = true;
  // useEffect(() => {
  //   const getCsrfToken = async () => {
  //     const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`);
  //     axios.defaults.headers.common["csrf-token"] = data.csrfToken;
  //   };
  //   getCsrfToken();
  // }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        <Head>
          <title>KREAM Web</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer {...toastConfig} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default appWithI18Next(App, ni18nConfig);
//export default App;