//  TODO:: react-hook-form하고 결합된 처리를 할 수 있는 기능을 추가할 것 
export type PageSearchProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  bottom?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  addition?: React.ReactNode;
};

//2분할(왼쪽: 검색조건| 오른쪽: icon, -Tab)
export const PageTabContent: React.FC<PageSearchProps> = ({ title, bottom, right, children, addition }) => {
  return (
    <>
      <div className="flex w-full bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        <div className="w-full rounded-[5px] mb-1 ">
          {title}
          <div className="flex w-full px-4 py-1 space-y-1">
            <div className="flex w-10/12 gap-1 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {children}
            </div>
            <div className="flex w-2/12 grid-flow-row-dense gap-2 md:flex-row md:grid md:grid-rows-2 md:grid-cols-2 place-items-end">
              {/* <span className="ml-auto"></span>  */}
              {right}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2] dark:border-gray-800">
            {bottom}

          </div>
        </div>
      </div>
    </>
  );
};

//1분할, Search
const PageSearch: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-full flex rounded-[5px] border m-1 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
          <div className="flex w-10/12 gap-1 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
            {children}
          </div>
          <div className="flex flex-row-reverse w-2/12 gap-2 md:flex-row-reverse md:grid md:grid-cols-2 ">
            {right}
          </div>
        </div>
      </div>
    </>
  );
};


// 1분할, PageContent
export const PageContent: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-full rounded-[5px] bg-white border mb-2 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
          {title}
          {/*contents*/}
          <div className="flex w-full px-4 py-1 space-y-2">
            <div className="flex w-full gap-3 sm:grid sm:grid-cols-3 md:flex-row md:grid md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {children}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2] dark:border-gray-800">
            <div className="grid w-full grid-cols-2">
              <div className="flex flex-row gap-2">
                {left}
                <span className="ml-auto"></span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="ml-auto"></span>
                {right}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

//검색조건 2분할(왼쪽:검색조건 오른쪽:버튼)
export const PageSearchButton: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-full rounded-[5px] bg-white border mb-2 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
          {title}
          {/*contents*/}
          <div className="flex w-full px-4 py-1 space-y-2">
            <div className="flex w-10/12 gap-3 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {children}
            </div>
            <div className="flex flex-row w-2/12 gap-2 place-items-end">
              <span className="ml-auto"></span>
              {right}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2] dark:border-gray-700">
            <div className="grid w-full grid-cols-2">
              <div className="flex flex-row gap-2">
                {left}
                <span className="ml-auto"></span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="ml-auto"></span>
                {/* {right} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageSearch;
