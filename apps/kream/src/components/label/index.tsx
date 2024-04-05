import { useTranslation } from "react-i18next";


export type LabelProps = {
  id: string;
  name?: string;
  lwidth?: string;
  // name?: React.ReactNode;
};

export const Label: React.FC<LabelProps> = ({ id, name, lwidth }) => {
  const { t } = useTranslation();

  const defWidth = lwidth ? lwidth : "min-w-24"

  return (
    <label
      htmlFor={id}
      className={`block text-xs font-medium justify-center text-right text-gray-700 dark:text-gray-200 whitespace-nowrap ${defWidth}`}>
      {t(name ? name : id)}
    </label>
  );
};
