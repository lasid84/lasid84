export type TabProps = {
    index: number;
    title: React.ReactNode;
    active?: boolean;
  };
  
  export type TabsProps = {
    tabIndex: number;
    setTabIndex: any;
  };
  
  const tabs: TabProps[] = [
    { index: 0, title: "1.Shipper", active: false },
    { index: 1, title: "2.Consignee", active: false },
    { index: 2, title: "3.SKD", active: false },
    { index: 3, title: "4.청구", active: false },
  ]
  
  export const Tab: React.FC<TabsProps> = ({tabIndex, setTabIndex }) => {
  
    return (
      <div className="flex mb-[-14px] mt-[-12px]">
        <div className="flex flex-row space-x-1">
          {tabs.map((tab) => (
            <div key={tab.index} className="flex-none  bg-transparent">
              <button
                //setOpenTab(tab.index)
                onClick={() => {
                  setTabIndex(tab.index);
                }}
                className={
                  tabIndex === tab.index
                    ? "font-bold text-md px-4 py-3 leading-8 border-b-2 border-blue-500 hover:border-blue-500 text-blue-500"
                    : "font-bold text-md px-4 py-3 leading-8 border-b-1 border-[#f2f2f2] hover:border-blue-500 hover:text-blue-500"
                }
                type="button">
                {tab.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  