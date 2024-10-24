import { useTranslation } from "react-i18next";


export type LabelProps = {
  id: string;
  name?: string;
  lwidth?: string;
  textAlignLB? : string;
  isDisplay? : boolean;
  // name?: React.ReactNode;
  textColor?: string;
};

export const Label: React.FC<LabelProps> = ({ id, name, lwidth, textAlignLB, isDisplay, textColor = 'black-500/75' }) => {
  const { t } = useTranslation();

  const defWidth = lwidth ? lwidth : "min-w-24"
  const display = isDisplay ? '' : 'block hidden '

  return (
    <label
      htmlFor={id}
      className={`block justify-center text-xs font-medium whitespace-nowrap ${display} text-${textAlignLB} text-${textColor} dark:text-${textColor} ${defWidth}`}>
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
      className={`gap-1 pb-1 pl-2 font-bold leading-8 whitespace-nowrap md:py-0 text-${textAlignLB} text-gray-500/75 dark:text-gray-200 ${defWidth}`}>
      {t(name ? name : id)}
    </label>
  );
};
