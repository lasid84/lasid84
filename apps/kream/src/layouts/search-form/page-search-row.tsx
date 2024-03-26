//  TODO:: react-hook-form하고 결합된 처리를 할 수 있는 기능을 추가할 것 
export type PageSearchProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  addition?: React.ReactNode;
};

//검색조건 1분할
const PageSearch: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
  return (
    <>
      <div className="flex">
        <div className="w-full rounded-[5px] bg-white border mb-2">
          {/*contents*/}
          <div className="w-full px-4 py-1 space-y-2">
            <div className="flex flex-row w-full gap-3 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6">
              {children}
            </div>
            <div
              className="flex flex-row w-full gap-2 md:flex-row md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6">
              {addition && addition}
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

export default PageSearch;
