'use client';

import LoadingComponent from "components/loading/loading"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Suspense } from "react";

const Loading = () => {
    return (
        <div className="absolute z-50 w-full h-screen">
          {/* <LoadingComponent /> */}
          <Suspense>
            <ProgressBar height="6px" color="#FF5500" shallowRouting />
          </Suspense>
        </div>
    )
}

export default Loading;