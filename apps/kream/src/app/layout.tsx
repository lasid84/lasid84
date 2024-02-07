
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react"
import AuthProvider from "components/provider/AuthProvider";
import Layout from 'layouts/page'
import Router from "next/router";
import NProgress from "nprogress";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KREAM",
  description: "Generated by create next app",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("app/layout.tsx");
  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          {/* <AuthProvider> */}
          <Layout>
            {children}
          </Layout>
          {/* </AuthProvider> */}
        </body>
      </html>
    </>
  );
}
