import { FaSpinner } from "react-icons/fa";
import { ImSpinner4 } from "react-icons/im";
import { GrInProgress } from "react-icons/gr";

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function Skeleton() {
  return (
    <div
      className={`${shimmer} flex w-full h-full flex-col md:col-span-4`}    >
      <div className="flex flex-col items-center justify-center w-full h-full p-4 rounded-lg bg-gray-200/80 dark:bg-gray-800/80">
        <HourglassLoading />
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
// className="animate-bounce"
export function HourglassLoading() {
  return (
    <div className="items-center justify-center h-24 max-w-sm p-4 mx-auto rounded-md w-44">
      <div className="flex space-x-4 animate-pulse">
        {/* <div className="flex-1 py-1 space-y-12"> */}
          <div className="flex items-center justify-center w-full h-full bg-opacity-50">
            <div className="flex items-center">
              <GrInProgress className="animate-bounce dark:text-white-500" size={30} color="#5d5d5d" />
              <span className="ml-2 text-gray-700 dark:text-white">Loading...</span>
            </div>
          </div>
        {/* </div> */}
      </div>
    </div>
  )
}