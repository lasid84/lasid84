'use client'

import { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigs } from 'states/useConfigs';

import { log, error } from '@repo/kwe-lib-new';

export type LayoutProps = {
  children: React.ReactNode;
};

const App: React.FC<LayoutProps> = ({ children }) => {
  // 계속 호출 되면서 Should have a queue 에러 발생... React Bug인듯
  // const { lang } = useConfigs((state) => state.config);

  // const { i18n } = useTranslation();

  // useEffect(() => {
  //     setI18n('ko');
  // }, [i18n])

  const { lang } = useConfigs((state) => state.config);

  const { i18n, ready } = useTranslation();

  useEffect(() => {
      i18n.changeLanguage(lang);
  }, [i18n,lang]);

  // log("app/layouts/App.tsx", lang);

  return (
    <>
        {children}
    </>
  );
}

export default App;
