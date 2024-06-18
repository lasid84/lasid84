//  TODO:: react-hook-form하고 결합된 처리를 할 수 있는 기능을 추가할 것 
export type PageSearchProps = {
    title?: React.ReactNode;
    children: React.ReactNode;
    bottom?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    addition?: React.ReactNode;
}
//Grid (label, button, grid)-- right:md:grid md:grid-cols-2 
export const PageGrid: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
    return (
        <>
            <div className="flex-col w-full h-full">
                <div className='grid flex-col content-end w-full h-1/6'>
                    <div className={`h-10 flex w-full rounded-[5px] justify-between ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white pr-1 `}>
                        <div className="flex inline gap-2 justify-self-start">
                            {title}
                        </div>
                        <div className="flex inline gap-2 justify-self-end">
                            {right}
                        </div>
                    </div>
                </div>
                <div className='flex w-full h-5/6'>
                    <div className="flex w-full h-full gap-1 justify-self-start md:flex-col ">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};



//Grid (label, button, grid)-- right:md:grid md:grid-cols-2 
export const PageMGrid: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
    return (
        <>
            <div className="flex-col w-full h-full">
                <div className='grid flex-col content-end w-full h-full'>
                    <div className={`h-10 flex w-full rounded-[5px] justify-between ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white pr-1 `}>
                        <div className="flex inline gap-2 justify-self-start">
                            {title}
                        </div>
                        <div className="flex inline gap-2 justify-self-end">
                            {right}
                        </div>
                    </div>
                    <div className="flex w-full h-[calc(100vh-140px)] gap-1 justify-self-start md:flex-col ">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

//Grid (label, button, grid)-- right:md:grid md:grid-cols-2 
export const PageMGrid2: React.FC<PageSearchProps> = ({ title, left, right, children, addition }) => {
    return (
        <>
            <div className={`flex-col w-full h-full`}>
                <div className={`grid flex-col content-end w-full h-full`}>
                    <div className={`h-10 flex w-full rounded-[5px] justify-between ${addition} dark:bg-gray-900 dark:border-gray-800 dark:text-white pr-1 `}>
                        <div className="flex inline gap-2 justify-self-start">
                            {title}
                        </div>
                        <div className="flex inline gap-2 justify-self-end">
                            {right}
                        </div>
                    </div>
                    <div className="flex grid w-full h-[calc(100vh-250px)] gap-1 justify-self-start md:flex-col ">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};