import {useEffect} from "react";
import {useRouter} from "next/router";
import Centered from "layouts/centered";

import Layout1 from "layouts/layout-1";
import LoginTypeA from "./login-type-A";
import LoginTypeB from "./login-type-B";
import LoginTypeC from './login-type-C';

import {useConfigs} from "states/useConfigs";
import {useHotkeys} from "react-hotkeys-hook";

import {useUserSettings} from "states/useUserSettings";
import { log } from '@repo/kwe-lib/components/logHelper';

export type LayoutProps = {
  children: React.ReactNode;
};

const Layouts: React.FC<LayoutProps> = ({children}) => {
  const config = useConfigs((state) => state.config);
  const configActions = useConfigs((state) => state.actions);
  const {background} = config;

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
      configActions.
        setConfig({
          background: backgroundClass,
        });
    },
    [background]
  );

  const router = useRouter();
  let {pathname} = router;

  switch (pathname) {
    case "/404":
    case "/500":
      return <Centered>{children}</Centered>;
    case "/login-1":
    case "/logout":
    case "/reset-password":
    case "/forgot-password":
    case "/lock-screen":
    case "/subscribe":
    case "/error-page":
    case "/coming-soon":
      return <Centered>{children}</Centered>;
    case "/login-2":
    case "/login-3":
    case "/sidebars":
      return <>{children}</>;
    case "/example/login-new-1":
      return <LoginTypeA>{children}</LoginTypeA>;
    case "/example/login-new-2":
      return <LoginTypeB>{children}</LoginTypeB>;
    case "/login":      
      return <LoginTypeC>{children}</LoginTypeC>;
    default:
      return <Layout1>{children}</Layout1>;
  }
};

export default Layouts;
