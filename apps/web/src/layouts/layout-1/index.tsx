import Head from "next/head";
import {useConfigs} from "states/useConfigs";
import Navbar1 from "components/navbar-1";
import LeftSidebar1 from "components/left-sidebar-1";
import RightSidebar1 from "components/right-sidebar-1";
import App from "../App";

export type Layout1Props = {
  children: React.ReactNode;
};

const Layout1: React.FC<Layout1Props> = ({children}) => {
  const config = useConfigs((state) => state.config);
  const {background, layout, collapsed} = config;

  return (
    <App>
      <Head>
        <title>KREAM</title>
      </Head>
      <div
        data-layout={layout}
        data-collapsed={collapsed}
        data-background={background}
        className={`font-sans antialiased text-sm disable-scrollbars ${
          background === "dark" ? "dark" : ""
        }`}>
        <RightSidebar1 />
        <div className="wrapper">
          <div className="">
            <LeftSidebar1 />
          </div>
          <div className="main w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            <Navbar1 />
            <div className="w-full min-h-screen p-4">{children}</div>
          </div>
        </div>
      </div>
    </App>
  );
};
export default Layout1;
