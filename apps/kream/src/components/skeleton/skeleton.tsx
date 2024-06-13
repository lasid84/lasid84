
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function Skeleton() {
  return (
    <div
      className={`${shimmer} flex w-full h-full flex-col md:col-span-4`}
    >
      {/* <div className="h-8 mb-4 bg-gray-100 rounded-md w-36" /> */}

      <div className="flex flex-col justify-between h-full p-4 bg-gray-400 rounded-xl ">
        <div className="px-6 bg-white">
          <Sample />            {/* 
            <div className="flex items-center pt-6 pb-2">
              <div className="w-5 h-5 bg-gray-200 rounded-full" />
              <div className="w-20 h-4 ml-2 bg-gray-200 rounded-md" />
            </div> */}
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between py-4 border-b border-gray-100">
      <div className="flex items-center">
        {/* <div className="w-8 h-8 mr-2 bg-gray-200 rounded-full" /> */}
        <div className="min-w-0">
          <div className="w-40 h-5 bg-gray-200 rounded-md" />
          <div className="w-12 h-4 mt-2 bg-gray-200 rounded-md" />
        </div>
      </div>
      {/* <div className="w-12 h-4 mt-2 bg-gray-200 rounded-md" /> */}
    </div>
  );
}

export function Sample() {
  return (
    <div className="w-full max-w-sm p-4 mx-auto border border-blue-300 rounded-md shadow">
      <div className="flex space-x-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-200"></div>
        <div className="flex-1 py-1 space-y-6">
          <div className="h-2 rounded bg-slate-200"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 col-span-2 rounded bg-slate-200"></div>
              <div className="h-2 col-span-1 rounded bg-slate-200"></div>
            </div>
            <div className="h-2 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  )
}