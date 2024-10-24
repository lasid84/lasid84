//  TODO:: react-hook-form하고 결합된 처리를 할 수 있는 기능을 추가할 것
export type PageSearchProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  bottom?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  addition?: React.ReactNode;
};

export const PageBKTabContent: React.FC<PageSearchProps> = ({
  title,
  bottom,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex w-full bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        <div className="w-full rounded-[5px] mb-1 ">
          <div className="flex px-4 py-1 space-y-1 w-full">
            {addition}
            <div className="flex gap-1 w-4/5">{children}</div>
            <div className="flex grid-flow-row-dense gap-2 place-items-end w-1/5 md:flex-row md:grid md:grid-rows-2 md:grid-cols-2">
              {/* <span className="ml-auto"></span>  */}
              {right}
            </div>
          </div>
          {/*button*/}
          <div className="px-1 py-1 w-full border-b border-[#f2f2f2] dark:border-gray-800">
            {bottom}
          </div>
        </div>
      </div>
    </>
  );
};

//2분할(왼쪽: 검색조건| 오른쪽: icon, -Tab)
export const PageTabContent: React.FC<PageSearchProps> = ({
  title,
  bottom,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex w-full bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        <div className="w-full rounded-[5px] mb-1 ">
          {title}
          <div className="flex px-4 py-1 space-y-1 w-full">
            <div className="flex gap-1 w-10/12 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {children}
            </div>
            <div className="flex grid-flow-row-dense gap-2 place-items-end w-2/12 md:flex-row md:grid md:grid-rows-2 md:grid-cols-2">
              {/* <span className="ml-auto"></span>  */}
              {right}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-b border-[#f2f2f2] dark:border-gray-800">
            {bottom}
          </div>
        </div>
      </div>
    </>
  );
};

//1분할, Search
const PageSearch: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex w-full">
        <div
          className={`flex pr-1 w-full rounded-[5px] ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white`}
        >
          {title}
          <div className="flex gap-1 justify-self-start items-end w-10/12 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
            {children}
          </div>
          <div className="flex flex-row-reverse gap-2 w-2/12">
            {right}
          </div>
        </div>
      </div>
    </>
  );
};

//1분할, Search
export const PageBKCargo: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex w-full">
        <div
          className={`flex pr-1 w-full rounded-[5px] ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white`}
        >
          {title}
          <div className="flex gap-1 justify-self-start items-end w-full md:flex-row md:grid">
            {/* <div className="flex-grow gap-2">
              {left}
            </div> 
            <div className="flex flex-row-reverse gap-2">
              {right}
            </div> */}
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-1 items-center">{left}</div>
              <div className="flex flex-1 justify-end items-center">{right}</div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

//1분할, Search(검색조건없음, only Button)
export const PageSearch2: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex-col w-full h-full">
        <div className="grid flex-col content-end w-full h-1/6">
          <div
            className={`flex justify-between pr-1 w-full rounded-[5px] ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white`}
          >
            <div className="inline flex gap-2 justify-self-start">{title}</div>
            <div className="inline flex gap-2 justify-self-end">{right}</div>
          </div>
        </div>
      </div>
    </>
  );
};

// 1분할, PageContent
export const PageContent: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-full rounded-[5px] bg-white border mb-2 mt-1 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
          {title}
          {/*contents*/}
          <div className="flex px-4 py-1 space-y-2 w-full">
            <div className="flex gap-3 w-full sm:grid sm:grid-cols-3 md:flex-row md:grid md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {children}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2] dark:border-gray-800">
            <div className="grid grid-cols-2 w-full">
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

// 2분할, PageContentDivided into two layouts
export const PageContentDivided: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-full rounded-[5px] bg-white border mb-2 mt-1 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
          {title}
          {/*contents*/}
          <div className="flex px-4 py-1 space-y-2 w-full">
            <div className="flex flex-wrap gap-3 w-full md:grid-cols-3 md:grid-rows-3">
              {children}
            </div>
            <div className="flex gap-3 w-full sm:grid sm:grid-cols-3 md:flex-row md:grid md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {addition}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2] dark:border-gray-800">
            <div className="grid grid-cols-2 w-full">
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
export const PageSearchButton: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-full rounded-[5px] bg-white border mb-2 mt-1 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
          {title}
          {/*contents*/}
          <div className="flex px-4 py-1 space-y-2 w-full">
            <div className="flex gap-3 w-10/12 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {children}
            </div>
            <div className="flex flex-row gap-2 place-items-end w-2/12">
              <span className="ml-auto"></span>
              {right}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2] dark:border-gray-700">
            <div className="grid grid-cols-2 w-full">
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
