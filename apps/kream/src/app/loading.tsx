'use client';

import LoadingComponent from "page-parts/com/loading/loading"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Loading = () => {
    return (
        // <div className="absolute z-50 w-full h-screen">
        //   <LoadingComponent />
        // </div>
        <ProgressBar height="4px" color="#FF5500" shallowRouting />
    )
}

export default Loading;