import { useTranslation } from "react-i18next";


export type LabelProps = {
  id: string;
  name?: string;
  lwidth?: string;
  textAlignLB? : string;
  isDisplay? : boolean;
  // name?: React.ReactNode;
  textColor?: string | null;
  backgroundColor?: "gray" | "red" | "yellow" | "blue" | "white";
  freeStyle?: string;
};

export const Label: React.FC<LabelProps> = ({ id, name, lwidth, textAlignLB, isDisplay, textColor = 'black-500/75' }) => {
  const { t } = useTranslation();

  const defWidth = lwidth ? lwidth : "min-w-24"
  const display = isDisplay ? '' : 'block hidden '

  return (
    <label
      htmlFor={id}
      className={`block justify-center text-xs font-medium whitespace-nowrap ${display} text-${textAlignLB} text-${textColor} dark:text-${textColor} ${defWidth} ml-2`}>
      {t(name ? name : id)}
    </label>
  );
};

export const LabelGrid: React.FC<LabelProps> = ({ id, name, lwidth, textAlignLB, textColor="gray-500/75", freeStyle="" }) => {
  const { t } = useTranslation();

  const defWidth = lwidth ? lwidth : "min-w-22"

  return (
    <label
      htmlFor={id}
      className={`gap-1 pb-1 pl-2 font-bold leading-8 whitespace-nowrap md:py-0 text-${textAlignLB}  dark:text-gray-200 ${defWidth} text-${textColor} ${freeStyle}`}>
      {t(name ? name : id)}
    </label>
  );
};



export const DTDLabel: React.FC<LabelProps> = ({
  id,
  name,
  lwidth,
  backgroundColor = "gray",
}) => {
  const backgroundClasses = {
    gray: "bg-gray-600/80 text-white",
    red: "bg-gradient-to-r from-red-500 to-orange-500 text-white",
    yellow: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800",
    blue: "bg-gradient-to-r from-blue-500 to-blue-400 text-white",
    white : ""
  };
  const { t } = useTranslation();
  const selectedBg = backgroundClasses[backgroundColor] || "bg-gray-800 text-white";

  return (
    <div
      id={id}
      className={`flex items-center justify-center h-full my-1 rounded-lg shadow-md hover:shadow-lg 
                  transition-all duration-300 font-semibold w-${lwidth} ${selectedBg}`}  
    >{t(name ? name : id)}
    </div>
  );
};


export const DTDLabel2: React.FC<LabelProps> = ({
  id,
  name,
  lwidth ="40",
  backgroundColor = "gray",
}) => {
  const borderClasses= {
    gray: " rounded-lg shadow-md border-double border-4 border-gray-800 text-gray-800",
    red: " rounded-lg shadow-md border-double border-4 border-red-500 text-red-500",
    yellow: " rounded-lg shadow-md border-double border-4 border-yellow-500 text-yellow-500",
    blue: " rounded-lg shadow-md border-double border-4 border-blue-500 text-blue-500",
    white : ""
};
const selectedBorder = borderClasses[backgroundColor];
  return (
    <div
      id={id}
      className={`flex items-center justify-center h-8 m-1 hover:shadow-lg 
                  transition-all duration-300 text-base font-semibold w-${lwidth}  ${selectedBorder}`}  
    >      {name}
    </div>
  );
};





