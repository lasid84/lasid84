export type PageContentProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
};

const PageContent: React.FC<PageContentProps> = ({
  title,
  children,
  left,
  middle,
  right,
}) => { // justify-content:center align-item:center 
  return (
    <div className="w-full rounded-[5px] bg-white border">
      <div className="w-full rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <div className="text-xs font-light text-gray-500 uppercase">
              {title}
            </div>
          </div>
        </div>
        {(left || middle || right) &&
          <div className="flex flex-row items-start justify-between content-center">
            {left
              ? <div className="flex flex-row space-x-1 mb-1 mt-1 ml-1">{left}</div>
              : <div></div>
            }
            {middle
              ? <div className="flex flex-row space-x-1 mb-1 mt-1">{middle}</div>
              : <div></div>
            }
            {right
              ? <div className="flex flex-row space-x-1  mb-1 mt-1 mr-1">{right}</div>
              : <div></div>
            }
          </div>
        }
        <div className="flex flex-row items-start justify-between">
          {children}
        </div>
      </div>

    </div>
  )
};

export default PageContent;
