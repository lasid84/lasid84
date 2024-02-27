import {FiPlus} from "react-icons/fi";
// import Breadcrumb,{ BreadcrumbItemProps } from  "@repo/ui/src/breadcrumb/breadcrumb"; 

export type PageTitleProps = {
  title: string;
  desc?: string;
  // brcmp?: BreadcrumbItemProps[];
  brcmp?: any;
};
const PageTitle: React.FC<PageTitleProps> = ({title, desc, brcmp}) => {
  return (
    <div className="w-full mb-1">
      <div className="flex flex-row items-center justify-between mb-2">
        <div className="flex flex-col">
           <div className="text-lg font-bold">{title}</div>
           { desc && 
            <div className="text-xs font-light text-gray-500 uppercase">
                {desc}
            </div>
            }
        </div>
        { brcmp && 
        <div className="flex flex-row mb-1">
            <div className="w-full">
            {/* <Breadcrumb items={brcmp} home={true} icon="chevrons" /> */}
            </div>
        </div>
        }       
      </div>
    </div>
  );
};

export default PageTitle;
