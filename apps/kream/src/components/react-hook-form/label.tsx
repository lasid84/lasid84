import { useTranslation } from "react-i18next";


export type LabelProps = {
  id: string;
  name?: string;
  // name?: React.ReactNode;
};

export const Label: React.FC<LabelProps> = ({id, name}) => {
  const { t } = useTranslation()
  if (!name) {    
    return (
      <div className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
        {t(id)}
      </div>
    );
  }
  return (
    <label
      htmlFor={id}
      className="block text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
      {t(name as string)}
    </label>
  );
};
