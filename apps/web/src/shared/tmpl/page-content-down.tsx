import { AgGridReact } from "ag-grid-react";

export type PageContentProps = {
  children: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

const PageContentDown: React.FC<PageContentProps> = ({ children, left, right }) => {
  return (
    <div className="w-full rounded-[5px] bg-white border">
      {/* Header && Buttons */}
      <div className=" px-4 pt-4 pb-3 w-full border-b border-[#f2f2f2]">
          <div className="w-full">{children}</div>
      </div>
      {/* Contents */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-3 w-full">
          <div className="flex flex-row gap-2 justify-between">{left}</div>
          <div className="flex flex-row gap-2 justify-between">{right}</div>
      </div>
    </div>
  );
};

export default PageContentDown;
