//  TODO:: react-hook-form하고 결합된 처리를 할 수 있는 기능을 추가할 것
export type PageSearchProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  bottom?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  addition?: React.ReactNode;
  rightchildren?: React.ReactNode;
};
//Grid (label, button, grid)-- right:md:grid md:grid-cols-2
export const PageGrid: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      {/* <div className="flex-col w-full h-full">
        <div className="grid flex-col content-end w-full h-1/6"> */}
        <div className="flex flex-col w-full h-full">
          <div className="w-full"> 
          <div
            className={`h-10 flex w-full rounded-[5px] justify-between ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white pr-1 `}
          >
            <div className="flex items-end inline gap-2 justify-self-start">{title}</div>
            <div className="flex inline gap-2 justify-self-end">{right}</div>
          </div>
        </div>
        {/* <div className="flex w-full h-5/6"> */}
        <div className="flex flex-1 w-full">
          {/* <div className="flex w-full h-full gap-1 justify-self-start md:flex-col "> */}
          <div className="flex w-full h-full gap-1 justify-self-start ">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

//Popup Gird layout테스트
export const PagePopupGrid: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex flex-col w-full h-full">
        {/* 상단 영역: 콘텐츠에 맞춰 높이 유동적으로 조정 */}
        <div className="grid flex-col content-end w-full">
          <div
            className={`h-10 flex w-full rounded-[5px] justify-between ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white pr-1`}
          >
            <div className="flex inline gap-2 justify-self-start">{title}</div>
            <div className="flex inline gap-2 justify-self-end">{right}</div>
          </div>
        </div>

        {/* 하단 영역: 상단 영역을 제외한 나머지 영역을 채움 */}
        <div className="flex flex-grow w-full">
          <div className="flex w-full h-full gap-1 justify-self-start md:flex-col">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

//Grid (label, button, grid)-- right:md:grid md:grid-cols-2 OCEAN기준정보관리
export const PageMGrid: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className="flex-col w-full h-full">
        <div className="grid flex-col content-end w-full h-full">
          {/* <div className={`h-10 flex w-full rounded-[5px] justify-between ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white pr-1 `}>
                        <div className="flex inline gap-2 justify-self-start">
                            {title}
                        </div>
                        <div className="flex inline gap-2 justify-self-end">
                            {right}
                        </div>
                    </div> */}
          <div className="flex w-full h-[calc(100vh-100px)] gap-1 justify-self-start md:flex-col ">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

//Grid (label, button, grid)-- right:md:grid md:grid-cols-2 , OCEN0005(부킹노트)
export const PageMGrid2: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className={`flex-col w-full h-full`}>
        <div className={`grid flex-col content-end w-full h-full`}>
          <div
            className={`h-10 flex w-full rounded-[5px] justify-between ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white pr-1 `}
          >
            <div className="flex inline gap-2 justify-self-start">{title}</div>
            <div className="flex inline gap-2 justify-self-end">{right}</div>
          </div>
          <div className="flex grid w-full h-[calc(100vh-250px)] gap-1 justify-self-start md:flex-col ">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

//Grid (label, button, Mgrid) , AIRI3001
export const PageMGrid3: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  addition,
}) => {
  return (
    <>
      <div className={`w-full h-full`}>
        <div className={`flex flex-col w-full h-full`}>
          <div className={`flex-row h-10 flex w-full rounded-[5px] justify-between ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white pr-1`}>
            <div className="flex gap-2 justify-self-start">{title}</div>
            <div className="flex content-end gap-2 justify-self-end">{right}</div>
          </div>
          <div className="flex flex-1 w-full gap-2 P-2 justify-self-start">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

//Grid (label, button, Mgrid) , AIRI4001
export const PageMGrid4: React.FC<PageSearchProps> = ({
  title,
  left,
  right,
  children,
  rightchildren,  
  addition,
}) => {
  return (
    <>
      <div className={`flex-col w-full h-full`}>
        <div className={`w-full h-full`}> 
           {/* 부모 flex container 추가 */}
          <div className="flex w-full h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] gap-2">
            {/* 좌측 children */}
            <div className="flex-row w-full h-full P-2">
              {children}
            </div>
            {/* 우측 rightchildren */}
            {/* <div className="flex-row w-1/5 h-full P-2">
            <div className="flex content-end gap-2 justify-self-end">
              {right}
              </div>
              {rightchildren}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};
