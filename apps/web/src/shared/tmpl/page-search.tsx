//  TODO:: react-hook-form하고 결합된 처리를 할 수 있는 기능을 추가할 것 
export type PageSearchProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  addition?: React.ReactNode;
};


const PageSearch: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
  return (
    <>
      <div className="flex">
        <div className="w-full rounded-[5px] bg-white border mb-2">
          {/*contents*/}
          <div className=" px-4 pt-4 pb-3 w-full border-b border-[#f2f2f2]">
            <div
              className={`w-full gap-2 
                          sm:grid sm:grid-cols-3 
                          md:grid md:grid-cols-5 
                          lg:grid lg:grid-cols-7 
                          xl:grid xl:grid-cols-9
                          2xl:grid 2xl:grid-cols-10`}>
              {children}
            </div>
          </div>
          {/*button*/}
          <div className="px-1 py-1 w-full border-t border-[#f2f2f2]">
            <div className="w-full grid grid-cols-2">
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
