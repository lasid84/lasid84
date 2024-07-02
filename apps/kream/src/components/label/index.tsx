import { useTranslation } from "react-i18next";


export type LabelProps = {
  id: string;
  name?: string;
  lwidth?: string;
  textAlignLB? : string;
  isDisplay? : boolean;
  // name?: React.ReactNode;
};

export const Label: React.FC<LabelProps> = ({ id, name, lwidth, textAlignLB, isDisplay }) => {
  const { t } = useTranslation();

  const defWidth = lwidth ? lwidth : "min-w-24"
  const display = isDisplay ? '' : 'block hidden '

  return (
    <label
      htmlFor={id}
      className={`${display} block text-xs font-medium justify-center text-${textAlignLB} text-gray-700 dark:text-gray-200 whitespace-nowrap ${defWidth}`}>
      {t(name ? name : id)}
    </label>
  );
};

export const LabelGrid: React.FC<LabelProps> = ({ id, name, lwidth, textAlignLB }) => {
  const { t } = useTranslation();

  const defWidth = lwidth ? lwidth : "min-w-24"

  return (
    <label
      htmlFor={id}
      className={`gap-1 pb-1 pl-2 md:py-0 font-bold leading-8 text-${textAlignLB} text-gray-700 dark:text-gray-200 whitespace-nowrap ${defWidth}`}>
      {t(name ? name : id)}
    </label>
  );
};
