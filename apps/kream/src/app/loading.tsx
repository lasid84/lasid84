'use client';

import LoadingComponent from "page-parts/com/loading/loading"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Suspense } from "react";

const Loading = () => {
    return (
        <div className="absolute z-50 w-full h-screen">
          {/* <LoadingComponent /> */}
          <Suspense>
            <ProgressBar height="4px" color="#FF5500" shallowRouting />
          </Suspense>
        </div>
    )
}

export default Loading;