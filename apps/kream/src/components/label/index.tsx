import { useTranslation } from "react-i18next";


export type LabelProps = {
  id: string;
  name?: string;
  // name?: React.ReactNode;
};

export const Label: React.FC<LabelProps> = ({id, name}) => {
  const { t } = useTranslation();
  
  return (
    <label
      htmlFor={id}
      className="block text-xs font-medium justify-center text-right text-gray-700 dark:text-gray-200 whitespace-nowrap min-w-14 max-w-24">
      {t(name? name : id)}
    </label>
  );
};
