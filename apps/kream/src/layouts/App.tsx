'use client'

import { PropsWithChildren, useEffect, useState } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';
import { useConfigs } from 'states/useConfigs';
import { useSession } from 'next-auth/react';
import { useUserSettings, setUserSetting } from "states/useUserSettings";
import { useStore } from "utils/zustand";
import { setI18n } from 'components/i18n/i18n';
import 'components/i18n/i18n';

const { log } = require('@repo/kwe-lib/components/logHelper');



function App({ children }: PropsWithChildren) {
  const { lang } = useConfigs((state) => state.config);


  log("app/layouts/App.tsx");

  return (
    <>
        {children}
    </>
  );
}

export default App;
