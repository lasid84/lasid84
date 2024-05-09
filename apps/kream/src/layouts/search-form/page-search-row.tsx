//  TODO:: react-hook-form하고 결합된 처리를 할 수 있는 기능을 추가할 것 
export type PageSearchProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  addition?: React.ReactNode;
};

//검색조건 1분할
export const PageContent: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
  return (
    <>
      <div className="w-full flex">
        <div className="w-full rounded-[5px] bg-white mb-2">
          {title}
          <div className="w-full flex px-4 py-1 space-y-1">
            <div className="w-10/12 flex gap-1 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {children}
            </div>
            <div className="w-2/12 flex flex-row gap-2 place-items-end">
              <span className="ml-auto"></span>
              {right}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2]">
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

//검색조건 1분할
const PageSearch: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
  return (
    <>
      <div className="w-full flex">
        <div className="w-full rounded-[5px] bg-white border mb-2">
          {title}
          {/*contents*/}
          <div className="w-full flex px-4 py-1 space-y-2">
            <div className="w-full flex gap-3 md:flex-row md:grid md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {children}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2]">
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

//검색조건 2분할(왼: 검색조건 오른: 버튼)
export const PageSearchButton: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
  return (
    <>
      <div className="w-full flex">
        <div className="w-full rounded-[5px] bg-white border mb-2">
          {title}
          {/*contents*/}
          <div className="w-full flex px-4 py-1 space-y-2">
            <div className="w-10/12 flex gap-3 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {children}
            </div>
            <div className="w-2/12 flex flex-row gap-2 place-items-end">
              <span className="ml-auto"></span>
              {right}
            </div>
          </div>

          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2]">
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
