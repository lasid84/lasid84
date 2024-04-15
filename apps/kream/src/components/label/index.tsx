import { useTranslation } from "react-i18next";


export type LabelProps = {
  id: string;
  name?: string;
  lwidth?: string;
  textAlignLB? : string;
  // name?: React.ReactNode;
};

export const Label: React.FC<LabelProps> = ({ id, name, lwidth, textAlignLB }) => {
  const { t } = useTranslation();

  const defWidth = lwidth ? lwidth : "min-w-24"

  return (
    <label
      htmlFor={id}
      className={`block text-xs font-medium justify-center text-${textAlignLB} text-gray-700 dark:text-gray-200 whitespace-nowrap ${defWidth}`}>
      {t(name ? name : id)}
    </label>
  );
};
