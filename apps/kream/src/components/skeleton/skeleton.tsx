
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';
  
export function Skeleton() {
    return (
      <div
        className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
      >
        <div className="h-8 mb-4 bg-gray-100 rounded-md w-36" />
        <div className="flex flex-col justify-between p-4 bg-gray-100 grow rounded-xl">
          <div className="px-6 bg-white">
            <InvoiceSkeleton />
            <InvoiceSkeleton />
            {/* <InvoiceSkeleton />
            <InvoiceSkeleton />
            <InvoiceSkeleton /> */}
            <div className="flex items-center pt-6 pb-2">
              <div className="w-5 h-5 bg-gray-200 rounded-full" />
              <div className="w-20 h-4 ml-2 bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  export function InvoiceSkeleton() {
    return (
      <div className="flex flex-row items-center justify-between py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 bg-gray-200 rounded-full" />
          <div className="min-w-0">
            <div className="w-40 h-5 bg-gray-200 rounded-md" />
            <div className="w-12 h-4 mt-2 bg-gray-200 rounded-md" />
          </div>
        </div>
        <div className="w-12 h-4 mt-2 bg-gray-200 rounded-md" />
      </div>
    );
  }