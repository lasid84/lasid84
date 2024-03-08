// 'use server'
'use client'

import { setI18n } from "components/i18n/i18n";
import { useConfigs } from "states/useConfigs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  // const { lang } = useConfigs((state) => state.config);

  // useEffect(() => {
  //     setI18n(lang);
  // }, [i18n, lang])
  
  return (
    <>
      {t("grp_cd")}
      {/* {session ? JSON.stringify(session) : "X"} */}
    </>
  );
}

