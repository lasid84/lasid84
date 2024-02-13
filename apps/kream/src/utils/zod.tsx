import { z } from "zod";
import { useTranslation } from "react-i18next";
import { makeZodI18nMap } from "zod-i18n-map";

export function useZod() {
  const { t } = useTranslation();
  const zodStringRequired = z.string().min(1, `${t("zod.required")}`);
  const zodNumberOrNaN = z.number().or(z.nan());
  z.setErrorMap(makeZodI18nMap({ t }));

  return { t, zodStringRequired, zodNumberOrNaN };
}
