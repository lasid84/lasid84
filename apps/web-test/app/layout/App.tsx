'use client'

import { PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigs } from '@/app/states/useConfigs';

function App({ children }: PropsWithChildren) {
  const { lang } = useConfigs((state) => state.config);

  const { i18n } = useTranslation();

  useEffect(() => {
    () => {
    i18n.changeLanguage(lang);}
  }, [
    i18n,
    lang,
  ]);

  return (
    <>
      {children}
    </>
  );
}

export default App;
