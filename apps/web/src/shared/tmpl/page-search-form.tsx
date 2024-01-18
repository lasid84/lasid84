//  TODO:: react-hook-form하고 결합된 처리를 할 수 있는 기능을 추가할 것 
export type PageSearchProps = {
    title: React.ReactNode;
    children: React.ReactNode;
    right?: React.ReactNode;
    addition?: React.ReactNode;
  };
  
  const PageSearch: React.FC<PageSearchProps> = ({title, right, children, addition}) => {
    return (
      <div className="w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <div className="text-xs font-light text-gray-500 uppercase">
              {title}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col">{children}</div>
          { right &&
          <div className="flex flex-row space-x-1 mb-4">{right}</div>
          }
        </div>
        { addition && 
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col">{addition}</div>
        </div>
        }
      </div>
    );
  };
  
  export default PageSearch;
  