'use client'

import { PropsWithChildren, useEffect, useState } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';
import { useConfigs } from 'states/useConfigs';
import { useSession } from 'next-auth/react';
import { useUserSettings, setUserSetting } from "states/useUserSettings";
import { useStore } from "utils/zustand";


const { log } = require('@repo/kwe-lib/components/logHelper');



function App({ children }: PropsWithChildren) {
  const { lang } = useConfigs((state) => state.config);

  const { i18n } = useTranslation();

//   const resources = {
//     en: {
//         translation: {
//           "trans_mode": "mode",
//           "n.selected": "{{n}} selected."
//       }
//     },
//     ko: {
//         translation: {
//           "trans_mode": "모드1!!",
//           "n.selected": "{{n}} selected."
//       }
//     }
// };

// i18n.use(initReactI18next) // passes i18n down to react-i18next
//     .init({
//         resources,
//         lng: lang,
//         fallbackLng: lang,
//         keySeparator: false, // we do not use keys in form messages.welcome
//         interpolation: {
//             escapeValue: false // react already safes from xss
//         }
//     });

  // useEffect(() => {
  //   i18n.changeLanguage(lang);
  // }, [i18n,lang,]);

  log("app/layouts/App.tsx");

  return (
    <>
        {children}
    </>
  );
}

export default App;
