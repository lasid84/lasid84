'use client'

import { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigs } from 'states/useConfigs';
import { useSession } from 'next-auth/react';
import { useUserSettings, setUserSetting } from "states/useUserSettings";
import { useStore } from "utils/zustand";

const { log } = require('@repo/kwe-lib/components/logHelper');



function App({ children }: PropsWithChildren) {
  const { lang } = useConfigs((state) => state.config);

  const { i18n } = useTranslation();

  // const {data:session, update, status} = useSession();
  // const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
  // const user_nm = useUserSettings((state)=>state.data.user_nm);
 
  // useEffect(() => {
  //   console.log("App useEfect [session?.user]", session?.user.email);
  //   const user = session?.user;
  //   console.log("App useEfect [session?.user]", user);
  //     setUserSetting({...session?.user});
  //     // () => {
  //     //   userSettingsActions!.setData({ ...user });
  //     //   // userSettingsActions!.setData({ user_id: user.user_id });
  //     //   // userSettingsActions!.setData({ user_nm: user.name });
  //     // }
  // }, [!session?.user]);

  // useEffect(() => {
  //   i18n.changeLanguage(lang);
  // }, [
  //   i18n,
  //   lang,
  // ]);

  // const [element, setElement] = useState<HTMLElement | null>(null);

  // useEffect(() => {
  //     setElement(document.getElementById('app'));
  // }, []);

  // if (!element) {
  //     return <>/{element}</>;
  // }

    log("app/layouts/App.tsx");

  return (
    <>
        {children}
    </>
  );
}

export default App;
